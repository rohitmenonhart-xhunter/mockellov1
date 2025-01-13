import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Increase size limit for base64 images
    }
  }
};

const formalAttireStandards = {
  male: [
    "formal shirt",
    "business shirt",
    "dress shirt",
    "button-up shirt",
    "button-down shirt"
  ],
  female: [
    "churidar",
    "kurti",
    "chudithar",
    "formal suit",
    "business suit",
    "formal dress",
    "saree",
    "salwar"
  ]
};

const informalAttire = [
  "polo",
  "polo shirt",
  "t-shirt",
  "tshirt",
  "casual shirt",
  "casual wear",
  "casual dress",
  "jeans",
  "casual pants"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageUrl, dressCodeStandards } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    if (!dressCodeStandards) {
      return res.status(400).json({ message: 'Dress code standards are required' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a strict dress code verification system. Your task is to:
1. Identify the exact attire the person is wearing (be very specific)
2. Check if it matches the formal standards exactly
3. Be strict - any variation from formal standards should be marked as informal`
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Analyze this person's attire for an interview.

Formal attire standards:
For men: ${dressCodeStandards.male.join(', ')}
For women: ${dressCodeStandards.female.join(', ')}

Informal attire includes: ${dressCodeStandards.informal.join(', ')}

Provide:
1. Exact description of what they are wearing (be specific)
2. Whether it matches the formal standards EXACTLY
3. If informal, what changes they need to make

Format your response as:
Current Attire: [exact description]
Is Formal: [true/false]
Recommendations: [if informal, what they should wear instead]`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl.startsWith('data:') ? imageUrl : `data:image/jpeg;base64,${imageUrl}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const analysis = response.choices[0].message.content;
    if (!analysis) {
      throw new Error("No analysis received from OpenAI");
    }

    // Parse the response
    const currentAttire = analysis.match(/Current Attire: (.*)/i)?.[1] || '';
    const isFormalMatch = analysis.match(/Is Formal: (true|false)/i)?.[1] || 'false';
    const recommendations = analysis.match(/Recommendations: (.*)/i)?.[1] || '';

    // Check if the attire contains any informal keywords
    const hasInformalKeywords = dressCodeStandards.informal.some((item: string) => 
      currentAttire.toLowerCase().includes(item.toLowerCase())
    );

    // Check if the attire matches any formal standards
    const hasFormalKeywords = [...dressCodeStandards.male, ...dressCodeStandards.female].some((item: string) =>
      currentAttire.toLowerCase().includes(item.toLowerCase())
    );

    // Determine if formal based on both the AI's analysis and our keyword check
    const isFormal = isFormalMatch.toLowerCase() === 'true' && 
                    hasFormalKeywords && 
                    !hasInformalKeywords;

    return res.status(200).json({
      isFormal,
      currentAttire,
      recommendations: recommendations || isFormal ? '' : 
        `Please wear one of the following:\nFor men: ${dressCodeStandards.male.join(', ')}\nFor women: ${dressCodeStandards.female.join(', ')}`,
      analysis
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error processing image', error: String(error) });
  }
} 