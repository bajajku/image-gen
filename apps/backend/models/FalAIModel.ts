import { fal } from "@fal-ai/client";
import { BaseModel } from "./BaseModel";

export class FalAIModel {
  constructor() {}

  public async generateImage(prompt: string, tensorPath: string, numImages: number) {
    console.log("Generating image with prompt:", prompt);
    console.log("Tensor path:", tensorPath);
    console.log("Number of images:", numImages);

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

    // Poll for result with exponential backoff
    const maxAttempts = 10;
    const initialDelay = 2000; // 2 seconds
    let currentDelay = initialDelay;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await fal.queue.status("fal-ai/flux-lora", {
        requestId: request_id,
        logs: true,
      });

      if (status.status === "COMPLETED") {
        const result = await fal.queue.result("fal-ai/flux-lora", {
          requestId: request_id
        });
        
        const imageUrls = result?.data?.images?.map(img => img.url) || [];
        if (imageUrls.length === 0) {
          throw new Error("No image URLs in result");
        }
        
        return { request_id, response_url, imageUrls };
      }

      // if (status.status === "FAILED") {
      //   throw new Error(`Image generation failed: ${status.error || "Unknown error"}`);
      // }

      // Wait with exponential backoff
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay = Math.min(currentDelay * 1.5, 10000); // Max 10 seconds between attempts
    }

    throw new Error("Timeout waiting for image generation");
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