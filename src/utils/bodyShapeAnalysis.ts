
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
    
    // The result could be an array or a single object with multiple predictions
    // We need to handle both cases
    let topPrediction: { label: string, score: number } | null = null;
    
    if (Array.isArray(result)) {
      // If result is an array, take the first item
      if (result.length > 0) {
        // Check if the first item is also an array
        if (Array.isArray(result[0])) {
          topPrediction = result[0][0] as any;
        } else {
          // First item is an object
          topPrediction = result[0] as any;
        }
      }
    } else {
      // Result is a single object with predictions
      topPrediction = result as any;
    }
    
    if (!topPrediction || !topPrediction.label) {
      console.warn('Could not determine body shape from image');
      return "rectangle"; // Default fallback
    }
    
    // Extract just the shape name without "body shape"
    return topPrediction.label.replace(" body shape", "");
  } catch (error) {
    console.error('Error analyzing body shape:', error);
    throw error;
  }
};
