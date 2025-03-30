import { z } from "zod";

// TODO: Add types
export const TrainModel = z.object({
    name: z.string(),
    category: z.enum(["Tech", "Fashion", "Food", "Fitness", "Finance", "Entertainment", "Gaming", "Education", "Travel", "Other"]),
    primaryColor: z.string(), // Hex code or color name
    theme: z.enum(["Minimalist", "Bold", "Vintage", "Modern", "Dark", "Light", "Neon", "Elegant", "Playful"]),
    focalPoint: z.enum(["Text", "Product", "Person", "Abstract", "Illustration"]),
    mood: z.enum(["Energetic", "Calm", "Luxury", "Casual", "Serious", "Playful"]),
    zipUrl: z.string()
});


export const GenerateImage = z.object({
    prompt: z.string(),
    modelId: z.string(),
    numImages: z.number()
});

export const GenerateImagesFromPack = z.object({
    modelId: z.string(),
    packId: z.string(),
    numImages: z.number()
})
