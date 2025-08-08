"""
Cocktail recipe database and matching logic
"""
from typing import List, Dict, Any
import re

# Comprehensive cocktail recipe database
COCKTAIL_RECIPES = [
    {
        "id": "old-fashioned",
        "name": "Old Fashioned",
        "description": "A classic whiskey cocktail with sugar and bitters",
        "ingredients": [
            {"name": "bourbon whiskey", "amount": "2 oz", "required": True},
            {"name": "simple syrup", "amount": "0.5 oz", "required": True},
            {"name": "angostura bitters", "amount": "2-3 dashes", "required": True},
            {"name": "orange peel", "amount": "1", "required": False}
        ],
        "instructions": [
            "Add bourbon, simple syrup, and bitters to a mixing glass with ice",
            "Stir until well chilled",
            "Strain into a rocks glass over a large ice cube",
            "Express orange peel oils over the drink and garnish"
        ],
        "category": "whiskey",
        "difficulty": "easy",
        "prep_time": "3 minutes"
    },
    {
        "id": "margarita",
        "name": "Margarita",
        "description": "Classic tequila cocktail with lime and triple sec",
        "ingredients": [
            {"name": "tequila", "amount": "2 oz", "required": True},
            {"name": "triple sec", "amount": "1 oz", "required": True},
            {"name": "lime juice", "amount": "1 oz", "required": True},
            {"name": "salt", "amount": "for rim", "required": False},
            {"name": "lime wheel", "amount": "1", "required": False}
        ],
        "instructions": [
            "Rim glass with salt if desired",
            "Add all ingredients to a shaker with ice",
            "Shake vigorously for 10-15 seconds",
            "Strain into a rocks glass over ice",
            "Garnish with lime wheel"
        ],
        "category": "tequila",
        "difficulty": "easy",
        "prep_time": "3 minutes"
    },
    {
        "id": "mojito",
        "name": "Mojito",
        "description": "Refreshing Cuban cocktail with rum, mint, and lime",
        "ingredients": [
            {"name": "white rum", "amount": "2 oz", "required": True},
            {"name": "fresh mint leaves", "amount": "10-12", "required": True},
            {"name": "lime juice", "amount": "1 oz", "required": True},
            {"name": "simple syrup", "amount": "0.75 oz", "required": True},
            {"name": "club soda", "amount": "2-3 oz", "required": True},
            {"name": "mint sprig", "amount": "1", "required": False}
        ],
        "instructions": [
            "Muddle mint leaves gently in the bottom of a highball glass",
            "Add lime juice and simple syrup",
            "Fill glass with ice and add rum",
            "Top with club soda and stir gently",
            "Garnish with fresh mint sprig"
        ],
        "category": "rum",
        "difficulty": "easy",
        "prep_time": "4 minutes"
    },
    {
        "id": "manhattan",
        "name": "Manhattan",
        "description": "Classic whiskey cocktail with sweet vermouth and bitters",
        "ingredients": [
            {"name": "rye whiskey", "amount": "2 oz", "required": True},
            {"name": "sweet vermouth", "amount": "1 oz", "required": True},
            {"name": "angostura bitters", "amount": "2 dashes", "required": True},
            {"name": "maraschino cherry", "amount": "1", "required": False}
        ],
        "instructions": [
            "Add whiskey, vermouth, and bitters to mixing glass with ice",
            "Stir until well chilled, about 30 seconds",
            "Strain into a chilled coupe glass",
            "Garnish with maraschino cherry"
        ],
        "category": "whiskey",
        "difficulty": "easy",
        "prep_time": "3 minutes"
    },
    {
        "id": "negroni",
        "name": "Negroni",
        "description": "Bitter Italian cocktail with gin, Campari, and sweet vermouth",
        "ingredients": [
            {"name": "gin", "amount": "1 oz", "required": True},
            {"name": "campari", "amount": "1 oz", "required": True},
            {"name": "sweet vermouth", "amount": "1 oz", "required": True},
            {"name": "orange peel", "amount": "1", "required": False}
        ],
        "instructions": [
            "Add gin, Campari, and sweet vermouth to a mixing glass with ice",
            "Stir until well chilled",
            "Strain into a rocks glass over a large ice cube",
            "Express orange peel oils and garnish"
        ],
        "category": "gin",
        "difficulty": "easy",
        "prep_time": "3 minutes"
    },
    {
        "id": "daiquiri",
        "name": "Daiquiri",
        "description": "Simple and elegant rum cocktail with lime and sugar",
        "ingredients": [
            {"name": "white rum", "amount": "2 oz", "required": True},
            {"name": "lime juice", "amount": "1 oz", "required": True},
            {"name": "simple syrup", "amount": "0.75 oz", "required": True},
            {"name": "lime wheel", "amount": "1", "required": False}
        ],
        "instructions": [
            "Add rum, lime juice, and simple syrup to a shaker with ice",
            "Shake vigorously for 10-15 seconds",
            "Double strain into a chilled coupe glass",
            "Garnish with lime wheel"
        ],
        "category": "rum",
        "difficulty": "easy",
        "prep_time": "3 minutes"
    },
    {
        "id": "whiskey-sour",
        "name": "Whiskey Sour",
        "description": "Classic sour cocktail with whiskey, lemon, and egg white",
        "ingredients": [
            {"name": "bourbon whiskey", "amount": "2 oz", "required": True},
            {"name": "lemon juice", "amount": "0.75 oz", "required": True},
            {"name": "simple syrup", "amount": "0.75 oz", "required": True},
            {"name": "egg white", "amount": "1", "required": False},
            {"name": "angostura bitters", "amount": "3 drops", "required": False},
            {"name": "lemon wheel", "amount": "1", "required": False}
        ],
        "instructions": [
            "Add whiskey, lemon juice, simple syrup, and egg white to shaker",
            "Dry shake (without ice) for 10 seconds",
            "Add ice and shake vigorously for 15 seconds",
            "Double strain into a coupe glass",
            "Garnish with lemon wheel and bitters dots"
        ],
        "category": "whiskey",
        "difficulty": "medium",
        "prep_time": "4 minutes"
    },
    {
        "id": "cosmopolitan",
        "name": "Cosmopolitan",
        "description": "Pink vodka cocktail with cranberry and lime",
        "ingredients": [
            {"name": "vodka", "amount": "1.5 oz", "required": True},
            {"name": "triple sec", "amount": "0.5 oz", "required": True},
            {"name": "cranberry juice", "amount": "0.75 oz", "required": True},
            {"name": "lime juice", "amount": "0.5 oz", "required": True},
            {"name": "lime wheel", "amount": "1", "required": False}
        ],
        "instructions": [
            "Add all ingredients to a shaker with ice",
            "Shake vigorously for 10-15 seconds",
            "Double strain into a chilled martini glass",
            "Garnish with lime wheel"
        ],
        "category": "vodka",
        "difficulty": "easy",
        "prep_time": "3 minutes"
    },
    {
        "id": "espresso-martini",
        "name": "Espresso Martini",
        "description": "Coffee cocktail with vodka and coffee liqueur",
        "ingredients": [
            {"name": "vodka", "amount": "2 oz", "required": True},
            {"name": "coffee liqueur", "amount": "0.5 oz", "required": True},
            {"name": "fresh espresso", "amount": "1 oz", "required": True},
            {"name": "simple syrup", "amount": "0.25 oz", "required": True},
            {"name": "coffee beans", "amount": "3", "required": False}
        ],
        "instructions": [
            "Add vodka, coffee liqueur, espresso, and simple syrup to shaker with ice",
            "Shake vigorously for 15 seconds",
            "Double strain into a chilled coupe glass",
            "Garnish with 3 coffee beans"
        ],
        "category": "vodka",
        "difficulty": "medium",
        "prep_time": "4 minutes"
    },
    {
        "id": "gin-tonic",
        "name": "Gin & Tonic",
        "description": "Simple and refreshing gin cocktail with tonic water",
        "ingredients": [
            {"name": "gin", "amount": "2 oz", "required": True},
            {"name": "tonic water", "amount": "4-6 oz", "required": True},
            {"name": "lime wedge", "amount": "1", "required": False}
        ],
        "instructions": [
            "Fill a highball glass with ice",
            "Add gin",
            "Top with tonic water",
            "Stir gently and garnish with lime wedge"
        ],
        "category": "gin",
        "difficulty": "easy",
        "prep_time": "2 minutes"
    }
]

def get_cocktail_recipes() -> List[Dict[str, Any]]:
    """Return all cocktail recipes"""
    return COCKTAIL_RECIPES

def normalize_ingredient_name(ingredient: str) -> str:
    """Normalize ingredient names for better matching"""
    # Convert to lowercase and remove extra whitespace
    normalized = ingredient.lower().strip()
    
    # Common substitutions and normalizations
    substitutions = {
        'whisky': 'whiskey',
        'bourbon': 'bourbon whiskey',
        'rye': 'rye whiskey',
        'cointreau': 'triple sec',
        'grand marnier': 'triple sec',
        'simple': 'simple syrup',
        'sugar syrup': 'simple syrup',
        'lime': 'lime juice',
        'lemon': 'lemon juice',
        'fresh lime juice': 'lime juice',
        'fresh lemon juice': 'lemon juice',
        'white rum': 'rum',
        'silver rum': 'rum',
        'light rum': 'rum',
        'club soda': 'soda water',
        'soda water': 'club soda',
        'tonic': 'tonic water'
    }
    
    for original, replacement in substitutions.items():
        if original in normalized:
            normalized = normalized.replace(original, replacement)
    
    return normalized

def calculate_recipe_match(available_ingredients: List[str], recipe: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate how well available ingredients match a recipe"""
    normalized_available = [normalize_ingredient_name(ing) for ing in available_ingredients]
    
    required_ingredients = [ing for ing in recipe["ingredients"] if ing["required"]]
    optional_ingredients = [ing for ing in recipe["ingredients"] if not ing["required"]]
    
    matched_required = 0
    matched_optional = 0
    missing_required = []
    
    # Check required ingredients
    for ingredient in required_ingredients:
        ingredient_name = normalize_ingredient_name(ingredient["name"])
        if any(ingredient_name in available or available in ingredient_name for available in normalized_available):
            matched_required += 1
        else:
            missing_required.append(ingredient["name"])
    
    # Check optional ingredients
    for ingredient in optional_ingredients:
        ingredient_name = normalize_ingredient_name(ingredient["name"])
        if any(ingredient_name in available or available in ingredient_name for available in normalized_available):
            matched_optional += 1
    
    # Calculate match percentage
    total_required = len(required_ingredients)
    required_match_percentage = (matched_required / total_required) if total_required > 0 else 1.0
    
    # Can make if all required ingredients are available
    can_make = matched_required == total_required
    
    return {
        "recipe": recipe,
        "can_make": can_make,
        "required_match_percentage": required_match_percentage,
        "matched_required": matched_required,
        "total_required": total_required,
        "matched_optional": matched_optional,
        "missing_required": missing_required,
        "match_score": required_match_percentage + (matched_optional * 0.1)  # Bonus for optional ingredients
    }

def find_matching_recipes(available_ingredients: List[str], recipes: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """Find cocktail recipes that can be made with available ingredients"""
    if recipes is None:
        recipes = get_cocktail_recipes()
    
    matches = []
    
    for recipe in recipes:
        match_info = calculate_recipe_match(available_ingredients, recipe)
        matches.append(match_info)
    
    # Sort by match score (best matches first)
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    
    # Filter to only include recipes that can actually be made or are close matches
    good_matches = [match for match in matches if match["required_match_percentage"] >= 0.7]
    
    return good_matches[:10]  # Return top 10 matches

def search_recipes_by_name(query: str) -> List[Dict[str, Any]]:
    """Search recipes by name or description"""
    query = query.lower()
    matching_recipes = []
    
    for recipe in COCKTAIL_RECIPES:
        if (query in recipe["name"].lower() or 
            query in recipe["description"].lower() or
            query in recipe["category"].lower()):
            matching_recipes.append(recipe)
    
    return matching_recipes