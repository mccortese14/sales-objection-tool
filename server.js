const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default user profiles with comprehensive details
const defaultProfiles = {
  solar: {
    name: "Solar Energy Sales Professional",
    experience: "8 years in renewable energy sales",
    industry: "Solar Energy",
    valueProposition: "Helping homeowners reduce energy costs by 70-90% while increasing property value and contributing to environmental sustainability",
    personalityTraits: ["analytical", "environmentally conscious", "results-driven", "educational"],
    salesStyle: "consultative",
    expertise: [
      "Solar panel technology and efficiency ratings",
      "Federal and state tax incentives (30% ITC)",
      "Financing options (solar loans, leases, PPAs)",
      "ROI calculations and payback periods",
      "Net metering and energy storage solutions"
    ],
    commonObjections: [
      "Too expensive upfront",
      "Not sure if my roof is suitable",
      "Worried about maintenance",
      "Don't trust solar companies",
      "Want to wait for better technology"
    ]
  },
  realEstate: {
    name: "Real Estate Sales Expert",
    experience: "12 years in residential real estate",
    industry: "Real Estate",
    valueProposition: "Maximizing property value and ensuring smooth transactions through market expertise and personalized service",
    personalityTraits: ["relationship-focused", "market-savvy", "negotiation-skilled", "detail-oriented"],
    salesStyle: "relationship-driven",
    expertise: [
      "Local market trends and pricing strategies",
      "Property valuation and CMA analysis",
      "Staging and marketing techniques",
      "Mortgage and financing guidance",
      "Contract negotiation and closing process"
    ],
    commonObjections: [
      "Your commission is too high",
      "I want to try selling myself first",
      "Market timing concerns",
      "Not ready to move yet",
      "Working with another agent"
    ]
  },
  saas: {
    name: "SaaS Solutions Consultant",
    experience: "6 years in B2B software sales",
    industry: "Software as a Service",
    valueProposition: "Streamlining business operations and increasing productivity through scalable cloud-based solutions",
    personalityTraits: ["tech-savvy", "problem-solver", "data-driven", "consultative"],
    salesStyle: "consultative",
    expertise: [
      "Software integration and implementation",
      "ROI analysis and productivity metrics",
      "Security and compliance standards",
      "Scalability and customization options",
      "Training and ongoing support services"
    ],
    commonObjections: [
      "Too expensive for our budget",
      "Our current system works fine",
      "Security and data privacy concerns",
      "Implementation seems complex",
      "Need to discuss with the team"
    ]
  }
};

// Store user profiles (in production, use a database)
let userProfiles = { ...defaultProfiles };

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Get all profiles
app.get('/api/profiles', (req, res) => {
  res.json(userProfiles);
});

// Get specific profile
app.get('/api/profiles/:industry', (req, res) => {
  const profile = userProfiles[req.params.industry];
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json(profile);
});

// Update profile
app.put('/api/profiles/:industry', (req, res) => {
  const industry = req.params.industry;
  if (!userProfiles[industry]) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  
  userProfiles[industry] = { ...userProfiles[industry], ...req.body };
  res.json(userProfiles[industry]);
});

// Generate objection response using ChatGPT
app.post('/api/generate-response', async (req, res) => {
  try {
    const { industry, objection, customerPersonality, customProfile } = req.body;
    
    if (!objection || !industry) {
      return res.status(400).json({ error: 'Objection and industry are required' });
    }

    // Use custom profile if provided, otherwise use default
    const profile = customProfile || userProfiles[industry];
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Construct the prompt for ChatGPT
    const prompt = `You are an experienced sales coach helping a ${profile.name} handle customer objections. 

SALES PROFESSIONAL PROFILE:
- Experience: ${profile.experience}
- Industry: ${profile.industry}
- Value Proposition: ${profile.valueProposition}
- Personality Traits: ${profile.personalityTraits.join(', ')}
- Sales Style: ${profile.salesStyle}
- Key Expertise: ${profile.expertise.join(', ')}

CUSTOMER CONTEXT:
- Customer Personality: ${customerPersonality || 'mixed'}
- Objection: "${objection}"

Please provide a comprehensive objection handling response that includes:

1. **IMMEDIATE RESPONSE** (2-3 sentences): A direct, empathetic response that acknowledges the concern
2. **VALUE REFRAME** (2-3 sentences): Reframe the objection to highlight value and benefits specific to your industry
3. **PROOF/STORY** (2-3 sentences): Share a brief, relevant story or provide social proof
4. **CLOSING QUESTION** (1 sentence): Ask a question that moves the conversation forward

Make sure the response:
- Matches the sales professional's style (${profile.salesStyle})
- Addresses the customer's personality type (${customerPersonality || 'general'})
- Uses industry-specific language and benefits
- Feels authentic and conversational
- Includes specific details relevant to ${profile.industry}

Format your response clearly with headers for each section.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert sales coach with deep knowledge of objection handling across various industries. Provide practical, actionable advice that sales professionals can use immediately."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    res.json({
      response,
      profile: {
        name: profile.name,
        industry: profile.industry,
        salesStyle: profile.salesStyle
      }
    });

  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    profiles: Object.keys(userProfiles).length
  });
});

app.listen(port, () => {
  console.log(`Sales Objection Tool server running at http://localhost:${port}`);
  console.log(`Available profiles: ${Object.keys(userProfiles).join(', ')}`);
});