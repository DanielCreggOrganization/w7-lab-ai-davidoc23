// src/app/services/gemini-ai.service.ts

import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  private readonly MODEL_NAME = 'gemini-1.5-flash';
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Initialize the Google Generative AI client
    this.genAI = new GoogleGenerativeAI(environment.apiKey);
  }

  // Method to fetch and convert image to base64
  async getImageAsBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const base64data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    return base64data.split(',')[1]; // Return only the base64 string (without the data URL prefix)
  }

  // Method to generate content with the Gemini AI model
  async generateRecipe(imageBase64: string, prompt: string): Promise<string> {
    try {
      // Use the Google Generative AI model to generate content
      const model = this.genAI.getGenerativeModel({ model: this.MODEL_NAME });
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { 
              inlineData: { 
                mimeType: 'image/jpeg', 
                data: imageBase64 
              } 
            },
            { text: prompt }
          ]
        }]
      });

      return result.response.text(); // Return the generated text response
    } catch (error) {
      throw new Error('Failed to generate recipe');
    }
  }
}
