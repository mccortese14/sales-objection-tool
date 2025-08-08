from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import base64
from io import BytesIO
from PIL import Image
import openai
from dotenv import load_dotenv
from typing import List, Optional
import json
from .cocktail_db import get_cocktail_recipes, find_matching_recipes
from .image_processor import process_ingredient_image

load_dotenv()

app = FastAPI(title="AI Cocktail Maker API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.get("/")
async def root():
    return {"message": "AI Cocktail Maker API is running!"}

@app.post("/analyze-ingredients")
async def analyze_ingredients(file: UploadFile = File(...)):
    """
    Analyze uploaded image to identify cocktail ingredients using OpenAI Vision API
    """
    try:
        # Read and validate image
        contents = await file.read()
        image = Image.open(BytesIO(contents))
        
        # Convert image to base64 for OpenAI API
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Call OpenAI Vision API
        response = openai.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Analyze this image and identify all cocktail ingredients you can see. 
                            Focus on spirits, liqueurs, mixers, garnishes, and bar tools.
                            Return a JSON array of ingredients with their names and confidence levels.
                            Format: [{"name": "ingredient_name", "confidence": 0.95, "category": "spirit|liqueur|mixer|garnish|tool"}]
                            Only include items you're confident are cocktail-related ingredients."""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{img_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        
        # Parse the response
        ingredients_text = response.choices[0].message.content
        try:
            ingredients = json.loads(ingredients_text)
        except json.JSONDecodeError:
            # Fallback parsing if JSON is malformed
            ingredients = parse_ingredients_fallback(ingredients_text)
        
        return {"ingredients": ingredients, "status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/suggest-cocktails")
async def suggest_cocktails(ingredients: List[str]):
    """
    Suggest cocktail recipes based on available ingredients
    """
    try:
        # Get all cocktail recipes
        all_recipes = get_cocktail_recipes()
        
        # Find matching recipes
        matching_recipes = find_matching_recipes(ingredients, all_recipes)
        
        return {
            "suggested_recipes": matching_recipes,
            "total_found": len(matching_recipes),
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding cocktail recipes: {str(e)}")

@app.get("/cocktails")
async def get_all_cocktails():
    """
    Get all available cocktail recipes
    """
    try:
        recipes = get_cocktail_recipes()
        return {"recipes": recipes, "total": len(recipes), "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cocktail recipes: {str(e)}")

@app.get("/cocktails/{cocktail_id}")
async def get_cocktail_by_id(cocktail_id: str):
    """
    Get a specific cocktail recipe by ID
    """
    try:
        recipes = get_cocktail_recipes()
        cocktail = next((r for r in recipes if r["id"] == cocktail_id), None)
        
        if not cocktail:
            raise HTTPException(status_code=404, detail="Cocktail not found")
            
        return {"recipe": cocktail, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cocktail: {str(e)}")

def parse_ingredients_fallback(text: str) -> List[dict]:
    """
    Fallback parsing for when OpenAI doesn't return valid JSON
    """
    ingredients = []
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if line and not line.startswith('[') and not line.startswith(']'):
            # Simple extraction - this would need refinement
            if ':' in line:
                name = line.split(':')[0].strip()
                ingredients.append({
                    "name": name,
                    "confidence": 0.8,
                    "category": "unknown"
                })
    return ingredients

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)