from PIL import Image
import sys

def get_dominant_colors(image_path, num_colors=5):
    img = Image.open(image_path)
    img = img.convert('RGB')
    
    # Resize to speed up calculation
    img.thumbnail((150, 150))
    
    # Get colors
    pixels = list(img.getdata())
    
    color_counts = {}
    for pixel in pixels:
        # Ignore black, white, and very dark/light grays
        if pixel[0] > 240 and pixel[1] > 240 and pixel[2] > 240:
            continue
        if pixel[0] < 15 and pixel[1] < 15 and pixel[2] < 15:
            continue
        
        # Check saturation/difference between max and min rgb to avoid grays
        if max(pixel) - min(pixel) < 20:
            continue
            
        # Group similar colors slightly
        r = pixel[0] - (pixel[0] % 10)
        g = pixel[1] - (pixel[1] % 10)
        b = pixel[2] - (pixel[2] % 10)
        color = (r, g, b)
        
        color_counts[color] = color_counts.get(color, 0) + 1

    sorted_colors = sorted(color_counts.items(), key=lambda x: x[1], reverse=True)
    
    for color, count in sorted_colors[:num_colors]:
        print(f"#{color[0]:02x}{color[1]:02x}{color[2]:02x} ({count} pixels)")

if __name__ == '__main__':
    get_dominant_colors('logo.jpg')
