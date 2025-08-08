"""
Image processing utilities for ingredient recognition
"""
import cv2
import numpy as np
from PIL import Image
from typing import List, Dict, Any
import io

def process_ingredient_image(image_data: bytes) -> Dict[str, Any]:
    """
    Process uploaded image for better ingredient recognition
    """
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert PIL to OpenCV format
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Enhance image for better recognition
        enhanced_image = enhance_image(cv_image)
        
        # Convert back to PIL
        enhanced_pil = Image.fromarray(cv2.cvtColor(enhanced_image, cv2.COLOR_BGR2RGB))
        
        # Get image metadata
        width, height = enhanced_pil.size
        
        return {
            "processed_image": enhanced_pil,
            "original_size": (image.width, image.height),
            "processed_size": (width, height),
            "status": "success"
        }
    
    except Exception as e:
        return {
            "error": str(e),
            "status": "error"
        }

def enhance_image(image: np.ndarray) -> np.ndarray:
    """
    Enhance image quality for better AI recognition
    """
    # Convert to LAB color space for better contrast adjustment
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to L channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    l = clahe.apply(l)
    
    # Merge channels back
    enhanced_lab = cv2.merge([l, a, b])
    enhanced_image = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
    # Slight sharpening
    kernel = np.array([[-1,-1,-1],
                       [-1, 9,-1],
                       [-1,-1,-1]])
    sharpened = cv2.filter2D(enhanced_image, -1, kernel)
    
    # Blend original and sharpened (70% original, 30% sharpened)
    result = cv2.addWeighted(enhanced_image, 0.7, sharpened, 0.3, 0)
    
    return result

def resize_image_for_api(image: Image.Image, max_size: int = 1024) -> Image.Image:
    """
    Resize image to optimal size for API calls while maintaining aspect ratio
    """
    width, height = image.size
    
    # Calculate new dimensions
    if width > height:
        if width > max_size:
            new_width = max_size
            new_height = int(height * (max_size / width))
        else:
            return image
    else:
        if height > max_size:
            new_height = max_size
            new_width = int(width * (max_size / height))
        else:
            return image
    
    return image.resize((new_width, new_height), Image.Resampling.LANCZOS)

def detect_bottles_and_labels(image: np.ndarray) -> List[Dict[str, Any]]:
    """
    Detect bottle shapes and label regions in the image
    This is a simplified version - in production, you might use more sophisticated detection
    """
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Edge detection
    edges = cv2.Canny(blurred, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    bottles = []
    height, width = image.shape[:2]
    
    for contour in contours:
        # Calculate contour properties
        area = cv2.contourArea(contour)
        
        # Filter by area (bottles should be reasonably large)
        if area > (width * height * 0.01):  # At least 1% of image area
            x, y, w, h = cv2.boundingRect(contour)
            
            # Filter by aspect ratio (bottles are typically taller than wide)
            aspect_ratio = h / w
            if aspect_ratio > 1.2:  # Bottles are usually taller
                bottles.append({
                    "bbox": (x, y, w, h),
                    "area": area,
                    "aspect_ratio": aspect_ratio,
                    "confidence": min(1.0, area / (width * height * 0.1))
                })
    
    # Sort by area (larger bottles first)
    bottles.sort(key=lambda x: x["area"], reverse=True)
    
    return bottles[:5]  # Return top 5 detected bottles