#!/usr/bin/env python3
"""
Script to create a default avatar image for the government admin dashboard.
This creates a simple placeholder image that can be used when no employee photo is uploaded.
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_default_avatar():
    """Create a default avatar image."""
    
    # Create images directory if it doesn't exist
    if not os.path.exists('images'):
        os.makedirs('images')
    
    # Create a 200x200 image with a light gray background
    img = Image.new('RGB', (200, 200), color='#f0f0f0')
    draw = ImageDraw.Draw(img)
    
    # Draw a circle for the avatar
    circle_bbox = (20, 20, 180, 180)
    draw.ellipse(circle_bbox, fill='#e0e0e0', outline='#cccccc', width=2)
    
    # Add a simple person icon
    # Head
    head_bbox = (80, 60, 120, 100)
    draw.ellipse(head_bbox, fill='#cccccc')
    
    # Body
    body_points = [(100, 100), (70, 140), (130, 140)]
    draw.polygon(body_points, fill='#cccccc')
    
    # Add text
    try:
        # Try to use a default font
        font = ImageFont.load_default()
    except:
        # Fallback if font loading fails
        font = None
    
    # Add "No Photo" text
    text = "No Photo"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    text_x = (200 - text_width) // 2
    text_y = 160
    
    draw.text((text_x, text_y), text, fill='#666666', font=font)
    
    # Save the image
    output_path = 'images/default-avatar.png'
    img.save(output_path, 'PNG')
    print(f"Default avatar created successfully at: {output_path}")
    
    return output_path

if __name__ == "__main__":
    try:
        create_default_avatar()
        print("Default avatar generation completed successfully!")
    except Exception as e:
        print(f"Error creating default avatar: {str(e)}")
        print("Make sure you have the Pillow library installed: pip install Pillow") 