import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack } from "common/types";
import prisma from "db";
import { FalAIModel } from "./models/FalAIModel";
import { fal } from "@fal-ai/client";
import { S3 } from "aws-sdk";
import { s3, S3Client } from "bun";
import cors from "cors";

// TODO: add auth middleware, might implement it later
// import { authMiddleware } from "./middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const USER_ID = "random-user-id";
app.use(express.json() );
app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
const PORT = 8080;

const falAiModel = new FalAIModel();

app.get("/pre-signed-url", async (req, res) => {
    const key = `models/${Date.now()}_${Math.random()}.zip`;
    const url = s3.presign(key, {
      method: "PUT",
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      endpoint: process.env.ENDPOINT,
      bucket: process.env.BUCKET_NAME,
      expiresIn: 60 * 5,
      type: "application/zip",
    });
  
    res.json({
      url,
      key,
    });
  });

app.post("/ai/train", async (req, res) => {

    const parsedBody = TrainModel.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(411).json({
            message: "Input incorrect",
            error: parsedBody.error,
        });
        return;
    }
    const { request_id, response_url } = await falAiModel.trainModel(
        parsedBody.data.zipUrl,
        parsedBody.data.name
    );

    const data = await prisma.model.create({
        data: {
            name: parsedBody.data.name,
            category: parsedBody.data.category,
            theme: parsedBody.data.theme,
            focalPoint: parsedBody.data.focalPoint,
            mood: parsedBody.data.mood,
            primaryColor: parsedBody.data.primaryColor,
            userId: USER_ID,
            zipUrl: parsedBody.data.zipUrl,
            falAiRequestId: request_id
        }
    })

    res.json({
        modelId: data.id
    });
});

app.post("/ai/generate", async (req, res) => {
    const parsedBody = GenerateImage.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(411).json({});
        return;
    }

    const model = await prisma.model.findUnique({
        where: {
            id: parsedBody.data.modelId,
        },
    });

    if (!model || !model.tensorPath) {
        res.status(411).json({
            message: "Model not found",
        });
        return;
    }

    const { request_id, response_url } = await falAiModel.generateImage(
        parsedBody.data.prompt,
        model.tensorPath
    );

    const data = await prisma.outputImages.create({
        data: {
            prompt: parsedBody.data.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageUrl: "",
            falAiRequestId: request_id,
        },
    });

    res.json({
        imageId: data.id,
    });
});

app.post("/pack/generate", async (req, res) => {

    const parsedBody = GenerateImagesFromPack.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(411).json({
            message: "Input incorrect",
        });
        return;
    }

    const prompts = await prisma.packPrompts.findMany({
        where: {
            packId: parsedBody.data.packId,
        },
    });

    const model = await prisma.model.findFirst({
        where: {
            id: parsedBody.data.modelId,
        },
    });

    if (!model) {
        res.status(411).json({
            message: "Model not found",
        });
        return;
    }

    let requestIds: { request_id: string }[] = await Promise.all(
        prompts.map((prompt) =>
            falAiModel.generateImage(prompt.prompt, model.tensorPath!)
        )
    );

    const images = await prisma.outputImages.createManyAndReturn({
        data: prompts.map((prompt, index) => ({
            prompt: prompt.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageUrl: "",
            falAiRequestId: requestIds[index]?.request_id ?? "",
        })),
    });


    res.json({
        images: images.map((image) => image.id),
    });
});

app.get("/pack/bulk", async (req, res) => {
    const packs = await prisma.packs.findMany({});

    res.json({
        packs,
    });
});

app.get("/image/bulk", async (req, res) => {
    const ids = req.query.ids as string[];
    const limit = (req.query.limit as string) ?? "100";
    const offset = (req.query.offset as string) ?? "0";

    const imagesData = await prisma.outputImages.findMany({
        where: {
            id: { in: ids },
            userId: USER_ID,
            status: {
                not: "Failed",
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: parseInt(offset),
        take: parseInt(limit),
    });

    res.json({
        images: imagesData,
    });
});

app.get("/models", async (req, res) => {
    const models = await prisma.model.findMany({
        where: {
            OR: [{ userId: USER_ID }, { open: true }],
        },
    });

    res.json({
        models,
    });
});

app.post("/fal-ai/webhook/train", async (req, res) => {
    console.log("====================Received training webhook====================");
    console.log("Received training webhook:", req.body);
    const requestId = req.body.request_id as string;

    // First find the model to get the userId
    const model = await prisma.model.findFirst({
        where: {
            falAiRequestId: requestId,
        },
    });

    console.log("Found model:", model);

    if (!model) {
        console.error("No model found for requestId:", requestId);
        res.status(404).json({ message: "Model not found" });
        return;
    }

    // Handle error case
    if (req.body.status === "ERROR") {
        console.error("Training error:", req.body.error);
        await prisma.model.updateMany({
            where: {
                falAiRequestId: requestId,
            },
            data: {
                trainingStatus: "Failed",
            },
        });

        res.json({
            message: "Error recorded",
        });
        return;
    }

    // Check for both "COMPLETED" and "OK" status
    if (req.body.status === "COMPLETED" || req.body.status === "OK") {
        try {
            // Check if we have payload data directly in the webhook
            let loraUrl;
            if (req.body.payload && req.body.payload.diffusers_lora_file && req.body.payload.diffusers_lora_file.url) {
                // Extract directly from webhook payload
                loraUrl = req.body.payload.diffusers_lora_file.url;
                console.log("Using lora URL from webhook payload:", loraUrl);
            } else {
                // Fetch result from fal.ai if not in payload
                console.log("Fetching result from fal.ai");
                const result = await fal.queue.result("fal-ai/flux-lora-fast-training", {
                    requestId,
                });
                console.log("Fal.ai result:", result);
                const resultData = result.data as any;
                loraUrl = resultData.diffusers_lora_file.url;
            }


            console.log("Generating preview image with lora URL:", loraUrl);
            const { imageUrl } = await falAiModel.generateImageSync(loraUrl);

            console.log("Generated preview image:", imageUrl);

            await prisma.model.updateMany({
                where: {
                    falAiRequestId: requestId,
                },
                data: {
                    trainingStatus: "Generated",
                    tensorPath: loraUrl,
                    thumbnail: imageUrl,
                },
            });
        } catch (error) {
            console.error("Error processing webhook:", error);
            await prisma.model.updateMany({
                where: {
                    falAiRequestId: requestId,
                },
                data: {
                    trainingStatus: "Failed",
                },
            });
        }
    } else {
        // For any other status, keep it as Pending
        console.log("Updating model status to: Pending");
        await prisma.model.updateMany({
            where: {
                falAiRequestId: requestId,
            },
            data: {
                trainingStatus: "Pending",
            },
        });
    }

    res.json({
        message: "Webhook processed successfully",
    });
});

app.post("/fal-ai/webhook/image", async (req, res) => {
    console.log("fal-ai/webhook/image");
    console.log(req.body);
    // update the status of the image in the DB
    const requestId = req.body.request_id;

    if (req.body.status === "ERROR") {
        res.status(411).json({});
        await prisma.outputImages.updateMany({
            where: {
                falAiRequestId: requestId,
            },
            data: {
                status: "Failed",
                imageUrl: req.body.payload.images[0].url,
            },
        });
        return;
    }

    await prisma.outputImages.updateMany({
        where: {
            falAiRequestId: requestId,
        },
        data: {
            status: "Generated",
            imageUrl: req.body.payload.images[0].url,
        },
    });

    res.json({
        message: "Webhook received",
    });
});

app.get("/model/status/:modelId", async (req, res) => {
    try {
        const modelId = req.params.modelId;

        const model = await prisma.model.findUnique({
            where: {
                id: modelId,
                userId: USER_ID,
            },
        });

        if (!model) {
            res.status(404).json({
                success: false,
                message: "Model not found",
            });
            return;
        }

        // Return basic model info with status
        res.json({
            success: true,
            model: {
                id: model.id,
                name: model.name,
                status: model.trainingStatus,
                thumbnail: model.thumbnail,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt,
            },
        });
        return;
    } catch (error) {
        console.error("Error checking model status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check model status",
        });
        return;
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});