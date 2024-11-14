import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonButton, IonIcon, IonProgressBar, IonText, IonRadioGroup, IonRadio, IonImg, IonTextarea, IonRippleEffect, IonSelect, IonSelectOption, IonLoading } from '@ionic/angular/standalone';
import { GeminiAiService } from '../services/gemini-ai.service';  // Import the GeminiAiService
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonButton, IonIcon, IonProgressBar, IonText, IonRadioGroup, IonRadio, IonImg, IonTextarea, IonRippleEffect, IonSelect, IonSelectOption, IonLoading
  ]
})
export class HomePage {
  prompt = 'Provide a recipe for these baked goods';
  output = '';
  isLoading = false;
  selectedImage = 'assets/images/baked_goods_1.jpg'; // Default image
  selectedModel = 'gemini-1.5-flash';  // Default model
  availableImages = [
    { url: 'assets/images/baked_goods_1.jpg', label: 'Baked Good 1' },
    { url: 'assets/images/baked_goods_2.jpg', label: 'Baked Good 2' },
    { url: 'assets/images/baked_goods_3.jpg', label: 'Baked Good 3' },
    { url: 'assets/images/baked_goods_4.jpg', label: 'Baked Good 4' },
    { url: 'assets/images/baked_goods_5.jpg', label: 'Baked Good 5' },
    { url: 'assets/images/baked_goods_6.jpg', label: 'Baked Good 6' }
  ];

  get formattedOutput() {
    return this.output.replace(/\n/g, '<br>');
  }

  constructor(private geminiService: GeminiAiService) {}

  // Handle image selection
  selectImage(url: string) {
    this.selectedImage = url;
  }

  // Handle AI Model selection
  selectModel(model: string) {
    this.selectedModel = model;
  }

  // Handle the form submission to generate the recipe
  async onSubmit() {
    if (this.isLoading) return;
    this.isLoading = true;
  
    try {
      // Fetch the selected image, convert to base64 using the service
      const base64Image = await this.geminiService.getImageAsBase64(this.selectedImage);
      
      // Use the service to generate a recipe with AI based on the model and prompt
      this.output = await this.geminiService.generateRecipe(base64Image, this.prompt, this.selectedModel);
    } catch (e) {
      this.output = `Error: ${e instanceof Error ? e.message : 'Something went wrong'}`;
    }
  
    this.isLoading = false;
  }

  // Handle copying the generated recipe to clipboard
  copyRecipe() {
    if (this.output) {
      navigator.clipboard.writeText(this.output)
        .then(() => alert('Recipe copied to clipboard!'))
        .catch((err) => alert('Failed to copy: ' + err));
    }
  }

  // Track images in the grid efficiently
  trackByFn(index: number, item: { url: string }) {
    return item.url;
  }
}
