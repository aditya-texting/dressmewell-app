
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const BODY_SHAPES = [
  "hourglass body shape",
  "pear body shape",
  "apple body shape", 
  "rectangle body shape",
  "inverted triangle body shape"
];

export const analyzeBodyShape = async (imageUrl: string): Promise<string> => {
  try {
    const classifier = await pipeline("zero-shot-image-classification", "openai/clip-vit-base-patch32", {
      device: 'webgpu'
    });

    const result = await classifier(imageUrl, BODY_SHAPES);
    
    // Get the most confident prediction
    const topPrediction = result[0];
    
    // Extract just the shape name without "body shape"
    return topPrediction.label.replace(" body shape", "") as any;
  } catch (error) {
    console.error('Error analyzing body shape:', error);
    throw error;
  }
};
