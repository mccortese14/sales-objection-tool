'use client'

import { useState } from 'react'
import { 
  ClockIcon, 
  AcademicCapIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

interface CocktailMatch {
  recipe: {
    id: string
    name: string
    description: string
    ingredients: Array<{
      name: string
      amount: string
      required: boolean
    }>
    instructions: string[]
    category: string
    difficulty: string
    prep_time: string
  }
  can_make: boolean
  required_match_percentage: number
  matched_required: number
  total_required: number
  matched_optional: number
  missing_required: string[]
  match_score: number
}

interface CocktailSuggestionsProps {
  suggestions: CocktailMatch[]
}

export default function CocktailSuggestions({ suggestions }: CocktailSuggestionsProps) {
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'hard':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      whiskey: 'bg-amber-100 text-amber-800',
      vodka: 'bg-blue-100 text-blue-800',
      gin: 'bg-green-100 text-green-800',
      rum: 'bg-yellow-100 text-yellow-800',
      tequila: 'bg-orange-100 text-orange-800',
      default: 'bg-gray-100 text-gray-800'
    }
    return colors[category.toLowerCase() as keyof typeof colors] || colors.default
  }

  const toggleRecipeExpansion = (recipeId: string) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId)
  }

  if (suggestions.length === 0) {
    return (
      <div className="cocktail-card text-center py-12">
        <div className="text-cocktail-dark/60 mb-4">
          <XCircleIcon className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Matching Cocktails</h3>
          <p>We couldn't find any cocktail recipes that match your available ingredients.</p>
          <p className="text-sm mt-2">Try taking a photo with more ingredients or different angles.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cocktail-dark">
          Suggested Cocktails
        </h2>
        <span className="text-sm text-cocktail-dark/60">
          {suggestions.length} recipes found
        </span>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.recipe.id} className="cocktail-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-cocktail-dark">
                    {suggestion.recipe.name}
                  </h3>
                  {suggestion.can_make ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-500" />
                  )}
                </div>
                
                <p className="text-cocktail-dark/70 mb-4">
                  {suggestion.recipe.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(suggestion.recipe.category)}`}>
                    {suggestion.recipe.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(suggestion.recipe.difficulty)}`}>
                    {suggestion.recipe.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center space-x-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{suggestion.recipe.prep_time}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Match Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-cocktail-dark">
                  Ingredient Match
                </span>
                <span className="text-sm font-bold text-cocktail-primary">
                  {Math.round(suggestion.required_match_percentage * 100)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-cocktail-primary to-cocktail-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${suggestion.required_match_percentage * 100}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-cocktail-dark/60">
                {suggestion.matched_required} of {suggestion.total_required} required ingredients available
                {suggestion.matched_optional > 0 && (
                  <span className="ml-2">
                    (+{suggestion.matched_optional} optional)
                  </span>
                )}
              </div>

              {suggestion.missing_required.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-red-600 mb-1">Missing ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.missing_required.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Recipe Details */}
            <button
              onClick={() => toggleRecipeExpansion(suggestion.recipe.id)}
              className="w-full flex items-center justify-center space-x-2 py-2 text-cocktail-primary hover:text-cocktail-primary/80 font-medium transition-colors"
            >
              <span>
                {expandedRecipe === suggestion.recipe.id ? 'Hide Recipe' : 'Show Recipe'}
              </span>
              {expandedRecipe === suggestion.recipe.id ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>

            {/* Expanded Recipe Details */}
            {expandedRecipe === suggestion.recipe.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-semibold text-cocktail-dark mb-3 flex items-center space-x-2">
                      <AcademicCapIcon className="h-4 w-4" />
                      <span>Ingredients</span>
                    </h4>
                    <ul className="space-y-2">
                      {suggestion.recipe.ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className={`flex justify-between items-center text-sm p-2 rounded ${
                            ingredient.required
                              ? 'bg-cocktail-primary/10 text-cocktail-dark'
                              : 'bg-gray-100 text-cocktail-dark/70'
                          }`}
                        >
                          <span className="capitalize">{ingredient.name}</span>
                          <span className="font-medium">{ingredient.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-semibold text-cocktail-dark mb-3">
                      Instructions
                    </h4>
                    <ol className="space-y-3">
                      {suggestion.recipe.instructions.map((step, index) => (
                        <li key={index} className="flex text-sm">
                          <span className="flex-shrink-0 w-6 h-6 bg-cocktail-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-cocktail-dark/80">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}