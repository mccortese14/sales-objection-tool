'use client'

import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Ingredient {
  name: string
  confidence: number
  category: string
}

interface IngredientsListProps {
  ingredients: Ingredient[]
}

export default function IngredientsList({ ingredients }: IngredientsListProps) {
  const getCategoryIcon = (category: string) => {
    const iconClass = "h-5 w-5"
    switch (category.toLowerCase()) {
      case 'spirit':
        return <div className={`${iconClass} bg-cocktail-primary rounded-full`}></div>
      case 'liqueur':
        return <div className={`${iconClass} bg-cocktail-secondary rounded-full`}></div>
      case 'mixer':
        return <div className={`${iconClass} bg-blue-500 rounded-full`}></div>
      case 'garnish':
        return <div className={`${iconClass} bg-green-500 rounded-full`}></div>
      case 'tool':
        return <div className={`${iconClass} bg-gray-500 rounded-full`}></div>
      default:
        return <div className={`${iconClass} bg-gray-400 rounded-full`}></div>
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.7) {
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />
    }
    return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
  }

  return (
    <div className="cocktail-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cocktail-dark">
          Detected Ingredients
        </h2>
        <span className="text-sm text-cocktail-dark/60">
          {ingredients.length} items found
        </span>
      </div>

      <div className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getCategoryIcon(ingredient.category)}
              <div>
                <h3 className="font-semibold text-cocktail-dark capitalize">
                  {ingredient.name}
                </h3>
                <p className="text-sm text-cocktail-dark/60 capitalize">
                  {ingredient.category}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getConfidenceIcon(ingredient.confidence)}
              <span className={`text-sm font-medium ${getConfidenceColor(ingredient.confidence)}`}>
                {Math.round(ingredient.confidence * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {ingredients.length === 0 && (
        <div className="text-center py-8 text-cocktail-dark/60">
          <p>No ingredients detected yet.</p>
          <p className="text-sm mt-2">Take a photo of your bar ingredients to get started.</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 p-4 bg-cocktail-light/50 rounded-lg">
        <h4 className="font-semibold text-cocktail-dark mb-3 text-sm">Category Legend:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-cocktail-primary rounded-full"></div>
            <span className="text-cocktail-dark/70">Spirits</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-cocktail-secondary rounded-full"></div>
            <span className="text-cocktail-dark/70">Liqueurs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
            <span className="text-cocktail-dark/70">Mixers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <span className="text-cocktail-dark/70">Garnishes</span>
          </div>
        </div>
      </div>
    </div>
  )
}