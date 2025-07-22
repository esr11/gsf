#!/usr/bin/env python3
"""
Script to create a simple favicon.ico file.
"""

from PIL import Image, ImageDraw
import os

def create_favicon():
    """Create a simple favicon."""
    
    # Create a 32x32 image with a blue background
    img = Image.new('RGB', (32, 32), color='#007bff')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple "G" for Government
    # Draw a circle
    draw.ellipse([4, 4, 28, 28], fill='#ffffff', outline='#0056b3', width=2)
    
    # Draw a simple "G" shape
    draw.arc([8, 8, 24, 24], 0, 270, fill='#0056b3', width=3)
    draw.line([20, 16, 24, 16], fill='#0056b3', width=3)
    
    # Save as ICO
    output_path = 'favicon.ico'
    img.save(output_path, format='ICO')
    print(f"Favicon created successfully at: {output_path}")
    
    return output_path

if __name__ == "__main__":
    try:
        create_favicon()
        print("Favicon generation completed successfully!")
    except Exception as e:
        print(f"Error creating favicon: {str(e)}") 