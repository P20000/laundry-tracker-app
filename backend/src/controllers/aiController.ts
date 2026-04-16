import { Request, Response } from 'express';
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const scanItemImage = async (req: Request, res: Response) => {
    try {
        const { imageUrl } = req.body; // Expecting base64 string

        if (!imageUrl) {
            return res.status(400).json({ error: "No image provided" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
        }

        // 1. Prepare the image for Gemini
        // We assume the frontend sends a base64 string with potential data:image/xxxPrefix
        const base64Data = imageUrl.split(",")[1] || imageUrl;
        const mimeType = imageUrl.split(";")[0].split(":")[1] || "image/jpeg";

        const imagePart: Part = {
            inlineData: {
                data: base64Data,
                mimeType,
            },
        };

        // 2. Setup the model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
            Analyze this clothing item image. Extract physical details and return them strictly in the following JSON format:
            {
                "name": "A concise, descriptive name (e.g., 'White Cotton T-Shirt')",
                "category": "Must be one of: 'Formals', 'Casuals', or 'Activewear'",
                "itemType": "Must be one of: 'Shirt', 'Pants', 'Dress', or 'Outerwear'",
                "color": "The dominant color name (e.g., 'White', 'Navy Blue', 'Burgundy')",
                "size": "Best guess from context or tags, otherwise 'M'"
            }
        `;

        // 3. Generate content
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // 4. Parse and return JSON
        const aiData = JSON.parse(text);
        
        return res.status(200).json(aiData);

    } catch (error: any) {
        console.error("AI Scan Error:", error);
        return res.status(500).json({ 
            error: "Failed to scan image with AI", 
            details: error.message || String(error) 
        });
    }
};
