# AI Cocktail Maker 🍸

An AI-powered cocktail making app that identifies ingredients from photos and suggests perfect cocktail recipes you can make with what you have on hand.

## Features

- 📸 **Smart Photo Recognition**: Use your camera or upload photos of your bar ingredients
- 🤖 **AI-Powered Analysis**: OpenAI Vision API identifies spirits, mixers, garnishes, and tools
- 🍹 **Recipe Matching**: Intelligent algorithm matches your ingredients to cocktail recipes
- 📱 **Beautiful UI**: Modern, responsive design with smooth animations
- 📋 **Step-by-Step Instructions**: Detailed recipes with ingredients and preparation steps
- 🎯 **Match Scoring**: See how well your ingredients match each recipe

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI Vision API** - AI-powered image analysis
- **Pillow & OpenCV** - Image processing
- **Uvicorn** - ASGI server

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- OpenAI API key

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r requirements.txt
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
DEBUG=true
HOST=0.0.0.0
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Backend Server

```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

### 4. Start the Frontend

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

1. **Take a Photo**: Click "Take Photo" to use your camera or "Upload Photo" to select an image
2. **AI Analysis**: The app will identify all cocktail ingredients in your photo
3. **Get Recipes**: View suggested cocktail recipes ranked by ingredient match percentage
4. **Make Cocktails**: Follow the detailed step-by-step instructions

## API Endpoints

- `POST /analyze-ingredients` - Analyze uploaded image for ingredients
- `POST /suggest-cocktails` - Get cocktail suggestions based on ingredients
- `GET /cocktails` - Get all available cocktail recipes
- `GET /cocktails/{id}` - Get specific cocktail recipe

## Project Structure

```
ai-cocktail-maker/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── CameraCapture.tsx  # Camera functionality
│   ├── IngredientsList.tsx # Ingredients display
│   ├── CocktailSuggestions.tsx # Recipe suggestions
│   └── LoadingSpinner.tsx # Loading animation
├── backend/               # Python FastAPI backend
│   ├── main.py           # Main API server
│   ├── cocktail_db.py    # Recipe database & matching
│   └── image_processor.py # Image processing utilities
├── public/               # Static assets
└── package.json         # Frontend dependencies
```

## Cocktail Database

The app includes a comprehensive database of classic cocktails:

- **Whiskey**: Old Fashioned, Manhattan, Whiskey Sour
- **Gin**: Negroni, Gin & Tonic
- **Vodka**: Cosmopolitan, Espresso Martini
- **Rum**: Mojito, Daiquiri
- **Tequila**: Margarita

Each recipe includes:
- Required and optional ingredients with amounts
- Step-by-step instructions
- Difficulty level and prep time
- Category and description

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Open an issue on GitHub
3. Make sure your OpenAI API key is valid and has sufficient credits

---

**Cheers! 🥂 Enjoy making perfect cocktails with AI assistance!**
