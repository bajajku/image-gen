import { fal } from "@fal-ai/client";
import { BaseModel } from "./BaseModel";

export class FalAIModel {
  constructor() {}

  public async generateImage(prompt: string, tensorPath: string, numImages: number) {
    console.log("Generating image with prompt:", prompt);
    console.log("Tensor path:", tensorPath);
    console.log("Number of images:", numImages);

    console.log("process.env.WEBHOOK_BASE_URL", process.env.WEBHOOK_BASE_URL);
    const { request_id, response_url } = await fal.queue.submit(
      "fal-ai/flux-lora",
      {
        input: {
          prompt: prompt,
          num_images: numImages,
          loras: [{ path: tensorPath, scale: 1 }],
        },
        webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/image`,
      }
    );

    await new Promise(resolve => setTimeout(resolve, 10000));
    const status = await fal.queue.status("fal-ai/flux-lora", {
      requestId: request_id,
      logs: true,
    });
    console.log("status", status);

    const result = await fal.queue.result("fal-ai/flux-lora", {
      requestId: request_id
    });
    console.log("result", result);

    const imageUrls = result?.data?.images?.map(img => img.url) || [];
    if (imageUrls.length === 0) {
        throw new Error("No image URLs in result");
    }

    return { request_id, response_url, imageUrls };
  }

  public async trainModel(zipUrl: string, triggerWord: string) {
    console.log("Training model with URL:", zipUrl);

    try {
      const response = await fetch(zipUrl, { method: "HEAD" });
      if (!response.ok) {
        console.error(
          `ZIP URL not accessible: ${zipUrl}, status: ${response.status}`
        );
        throw new Error(`ZIP URL not accessible: ${response.status}`);
      }
    } catch (error) {
      console.error("Error checking ZIP URL:", error);
      throw new Error(`ZIP URL validation failed: ${error as any}.message}`);
    }

    const { request_id, response_url } = await fal.queue.submit(
      "fal-ai/flux-lora-fast-training",
      {
        input: {
          images_data_url: zipUrl,
          trigger_word: triggerWord,
        },
        webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/train`,
      }
    );

    console.log("Model training submitted:", request_id);
    return { request_id, response_url };
  }

  public async generateImageSync(tensorPath: string) {
    const response = await fal.subscribe("fal-ai/flux-lora", {
      input: {
        prompt:
          "Generate a head shot for this user in front of a white background",
        loras: [{ path: tensorPath, scale: 1 }],
      },
    });
    return {
      imageUrl: response.data?.images?.[0]?.url,
    };
  }
}