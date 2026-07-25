import { Request, Response } from 'express';
import OpenAI from 'openai';

// Initialize OpenAI client for NVIDIA NIM
const openai = new OpenAI({
  apiKey: process.env.NIM_API_KEY || "",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export const scanItemImage = async (req: Request, res: Response) => {
    try {
        const { imageUrl } = req.body; // Expecting base64 string

        if (!imageUrl) {
            return res.status(400).json({ error: "No image provided" });
        }

        if (!process.env.NIM_API_KEY) {
            return res.status(500).json({ error: "NIM_API_KEY is not configured on the server." });
        }

        // 1. Prepare the image
        // We assume the frontend sends a base64 string with potential data:image/xxxPrefix
        const base64Data = imageUrl.split(",")[1] || imageUrl;
        const mimeType = imageUrl.split(";")[0].split(":")[1] || "image/jpeg";
        const dataUrl = `data:${mimeType};base64,${base64Data}`;

        const prompt = `
            Analyze this clothing item image. Extract physical details and return them strictly in the following JSON format:
            {
                "name": "A concise, descriptive name (e.g., 'White Cotton T-Shirt')",
                "category": "Must be one of: 'Formals', 'Casuals', or 'Activewear'",
                "itemType": "Must be one of: 'Shirt', 'Pants', 'Dress', or 'Outerwear'",
                "color": "The dominant color as a HEX CODE (e.g., '#FFFFFF', '#000080', '#800020')",
                "size": "Best guess from context or tags, otherwise 'M'"
            }
        `;

        // 2. Generate content
        console.log("AI Scan: Sending request to NVIDIA NIM...");
        const response = await openai.chat.completions.create({
            model: "meta/llama-3.2-90b-vision-instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: dataUrl } }
                    ]
                }
            ],
            max_tokens: 1024,
            temperature: 0.1,
        });

        let text = response.choices[0]?.message?.content || "{}";
        console.log("AI Scan: Received response from NIM:", text);

        // Strip markdown blocks if present (some models return ```json ... ```)
        text = text.trim();
        if (text.startsWith("\`\`\`json")) {
            text = text.substring(7);
        } else if (text.startsWith("\`\`\`")) {
            text = text.substring(3);
        }
        if (text.endsWith("\`\`\`")) {
            text = text.substring(0, text.length - 3);
        }
        text = text.trim();

        // 3. Parse and return JSON
        const aiData = JSON.parse(text);
        
        return res.status(200).json(aiData);

    } catch (error: any) {
        console.error("AI Scan Error Details:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
            status: error.status
        });
        
        let errorMessage = "Failed to scan image with AI";
        if (error.message?.includes("API key") || error.status === 401 || error.status === 403) {
            errorMessage = "Invalid NIM API Key. Please check your environment variables.";
        }

        return res.status(500).json({ 
            error: errorMessage, 
            details: error.message || String(error) 
        });
    }
};
