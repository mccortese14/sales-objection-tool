'use client'

import { useState, useRef } from 'react'
import { CameraIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline'
import CameraCapture from '../components/CameraCapture'
import IngredientsList from '../components/IngredientsList'
import CocktailSuggestions from '../components/CocktailSuggestions'
import LoadingSpinner from '../components/LoadingSpinner'

interface Ingredient {
  name: string
  confidence: number
  category: string
}

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

export default function Home() {
  const [showCamera, setShowCamera] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [cocktailSuggestions, setCocktailSuggestions] = useState<CocktailMatch[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageCapture = async (imageFile: File) => {
    setIsAnalyzing(true)
    
    try {
      // Analyze ingredients
      const formData = new FormData()
      formData.append('file', imageFile)
      
      const response = await fetch('/api/backend/analyze-ingredients', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      if (data.status === 'success') {
        setIngredients(data.ingredients)
        
        // Get cocktail suggestions
        const ingredientNames = data.ingredients.map((ing: Ingredient) => ing.name)
        
        const suggestionsResponse = await fetch('/api/backend/suggest-cocktails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ingredientNames),
        })
        
        const suggestionsData = await suggestionsResponse.json()
        
        if (suggestionsData.status === 'success') {
          setCocktailSuggestions(suggestionsData.suggested_recipes)
        }
      }
    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setIsAnalyzing(false)
      setShowCamera(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleImageCapture(file)
    }
  }

  const resetApp = () => {
    setIngredients([])
    setCocktailSuggestions([])
    setSelectedFile(null)
    setShowCamera(false)
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-cocktail-primary/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cocktail-primary to-cocktail-secondary p-2 rounded-lg">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cocktail-dark font-cocktail">
                  AI Cocktail Maker
                </h1>
                <p className="text-cocktail-dark/60 text-sm">
                  Snap, Analyze, Mix
                </p>
              </div>
            </div>
            
            {ingredients.length > 0 && (
              <button
                onClick={resetApp}
                className="btn-secondary text-sm"
              >
                New Photo
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <LoadingSpinner />
            <p className="text-cocktail-dark/70 mt-4 text-lg">
              Analyzing your ingredients...
            </p>
            <p className="text-cocktail-dark/50 text-sm">
              This may take a few moments
            </p>
          </div>
        ) : ingredients.length === 0 ? (
          /* Welcome Screen */
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-cocktail-primary to-cocktail-secondary p-4 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                <SparklesIcon className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-cocktail-dark mb-4 font-cocktail">
                Discover Perfect Cocktails
              </h2>
              
              <p className="text-xl text-cocktail-dark/70 mb-12 leading-relaxed">
                Take a photo of your ingredients and let AI suggest amazing cocktail recipes you can make right now.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
                <button
                  onClick={() => setShowCamera(true)}
                  className="camera-button flex items-center justify-center space-x-3"
                >
                  <CameraIcon className="h-6 w-6" />
                  <span>Take Photo</span>
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="camera-button flex items-center justify-center space-x-3"
                >
                  <PhotoIcon className="h-6 w-6" />
                  <span>Upload Photo</span>
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-cocktail-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CameraIcon className="h-8 w-8 text-cocktail-primary" />
                </div>
                <h3 className="text-lg font-semibold text-cocktail-dark mb-2">
                  Smart Recognition
                </h3>
                <p className="text-cocktail-dark/60">
                  AI identifies spirits, mixers, and garnishes from your photos
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-cocktail-secondary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <SparklesIcon className="h-8 w-8 text-cocktail-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-cocktail-dark mb-2">
                  Perfect Matches
                </h3>
                <p className="text-cocktail-dark/60">
                  Get cocktail recipes that match your available ingredients
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-cocktail-accent/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <PhotoIcon className="h-8 w-8 text-cocktail-primary" />
                </div>
                <h3 className="text-lg font-semibold text-cocktail-dark mb-2">
                  Step-by-Step
                </h3>
                <p className="text-cocktail-dark/60">
                  Detailed instructions to create perfect cocktails every time
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <IngredientsList ingredients={ingredients} />
            </div>
            
            <div className="lg:col-span-2">
              <CocktailSuggestions suggestions={cocktailSuggestions} />
            </div>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </main>
  )
}