# AI Sales Objection Tool 🚀

A comprehensive ChatGPT-powered sales objection handling tool that provides personalized responses based on your industry, experience, and sales style.

## Features ✨

- **ChatGPT-4 Integration**: Real-time AI-generated objection responses
- **Comprehensive User Profiles**: Pre-built profiles for Solar, Real Estate, and SaaS industries
- **Personality-Based Responses**: Tailored responses based on customer personality types
- **Professional Interface**: Modern, responsive UI with real-time loading states
- **Structured Responses**: AI responses formatted with immediate response, value reframe, proof/story, and closing questions

## User Profiles 👤

### Solar Energy Sales Professional
- **Experience**: 8 years in renewable energy sales
- **Sales Style**: Consultative
- **Expertise**: Solar technology, tax incentives, financing, ROI calculations, energy storage
- **Personality Traits**: Analytical, environmentally conscious, results-driven, educational

### Real Estate Sales Expert  
- **Experience**: 12 years in residential real estate
- **Sales Style**: Relationship-driven
- **Expertise**: Market trends, property valuation, staging, mortgage guidance, negotiation
- **Personality Traits**: Relationship-focused, market-savvy, negotiation-skilled, detail-oriented

### SaaS Solutions Consultant
- **Experience**: 6 years in B2B software sales
- **Sales Style**: Consultative
- **Expertise**: Software integration, ROI analysis, security, scalability, support services
- **Personality Traits**: Tech-savvy, problem-solver, data-driven, consultative

## Setup Instructions 🛠️

### Prerequisites
- Node.js (v14 or higher)
- OpenAI API key

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd /path/to/sales-objection-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage 📖

1. **Select Your Industry**: Choose from Solar Energy, Real Estate, or SaaS Technology
2. **View Your Profile**: See your automatically loaded sales professional profile
3. **Choose Customer Type**: Select the customer's personality (Analytical, Emotional, Skeptical, Dominant, Mixed)
4. **Enter the Objection**: Type the exact objection or concern the customer raised
5. **Generate Response**: Click "Generate AI Response" or use Ctrl+Enter
6. **Use the Response**: ChatGPT will provide a structured response with:
   - Immediate empathetic acknowledgment
   - Value reframe specific to your industry
   - Relevant story or social proof
   - Closing question to move forward

## API Endpoints 🔌

- `GET /api/profiles` - Get all user profiles
- `GET /api/profiles/:industry` - Get specific industry profile  
- `PUT /api/profiles/:industry` - Update industry profile
- `POST /api/generate-response` - Generate ChatGPT objection response
- `GET /api/health` - Health check endpoint

## Example Objections to Try 💬

### Solar Energy
- "It's too expensive upfront"
- "I'm not sure if my roof is suitable"
- "What if the technology gets better in a few years?"

### Real Estate
- "Your commission seems high"
- "I want to try selling it myself first"
- "The market might crash soon"

### SaaS
- "We're happy with our current system"
- "The implementation looks too complex"
- "We need to discuss this with the team"

## Customization 🎨

You can customize the user profiles by sending a PUT request to `/api/profiles/:industry` with updated profile data, or modify the `defaultProfiles` object in `server.js`.

## Troubleshooting 🔧

### Common Issues:

1. **"Failed to generate response"**
   - Check that your OpenAI API key is correctly set in `.env`
   - Verify you have sufficient OpenAI credits
   - Ensure internet connection is stable

2. **Server won't start**
   - Make sure port 3000 is available
   - Check that all dependencies are installed (`npm install`)
   - Verify Node.js version (v14+)

3. **Profile not loading**
   - Refresh the page
   - Check browser console for errors
   - Verify server is running

## Tech Stack 💻

- **Frontend**: Vanilla JavaScript, Modern CSS Grid, Responsive Design
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT-4 API
- **Styling**: Custom CSS with gradient backgrounds and animations

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

MIT License - feel free to use this tool for your sales team!

---

**Built for sales professionals who want to handle objections with confidence and AI-powered precision.** 🎯
