import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API endpoint called with method:", req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { transcriptions, dressCode, responseTimes } = req.body;
    console.log("Received transcriptions:", transcriptions);
    console.log("Received dress code info:", dressCode);
    console.log("Received response times:", responseTimes);

    if (!transcriptions || !Array.isArray(transcriptions)) {
      console.error("Invalid transcriptions data received");
      return res.status(400).json({ message: 'Invalid transcriptions data' });
    }

    // Format transcriptions for GPT-4
    const transcriptText = transcriptions
      .map((t: any) => `${t.name}: ${t.message}`)
      .join('\n');
    
    // Calculate response time metrics
    let responseTimeAnalysis = "";
    if (responseTimes && responseTimes.length > 0) {
      const times = responseTimes.map((rt: { responseTime: number }) => rt.responseTime);
      const avgTime = times.reduce((a: number, b: number) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      
      responseTimeAnalysis = `
Response Time Analysis:
- Average response time: ${avgTime.toFixed(2)} seconds
- Longest response time: ${maxTime.toFixed(2)} seconds
- Shortest response time: ${minTime.toFixed(2)} seconds
- Response time samples: ${responseTimes.length}

Detailed response times:
${responseTimes.map((rt: { aiMessage: string, responseTime: number }) => 
  `- After AI said: "${rt.aiMessage.substring(0, 50)}..."
  User took: ${rt.responseTime.toFixed(2)} seconds to respond`).join('\n')}
`;
    }
    
    console.log("Formatted transcript text:", transcriptText);

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return res.status(500).json({ message: 'OpenAI API key is not configured' });
    }

    // Calculate dress code impact
    const dressCodeImpact = dressCode?.wasInformal ? 
      `Note: The candidate's attire was informal (${dressCode.note}). This affects ${dressCode.weightage.min}-${dressCode.weightage.max}% of the overall rating.` :
      "Note: The candidate was appropriately dressed in formal attire.";

    const prompt = `
      You are a highly strict and analytical HR evaluator for a prestigious tech company. Your evaluation will directly impact hiring decisions. Be extremely thorough and critical in your assessment.
      
      ${dressCodeImpact}
      
      Interview Transcription:
      ${transcriptText}

      ${responseTimeAnalysis}
      
      Evaluate with the following strict criteria and detailed metrics:
      
      1. Professional Presentation (${dressCode?.weightage?.min || 7}-${dressCode?.weightage?.max || 9}% of total)
         - Dress code compliance (Automatic -7% for informal attire)
         - Professional demeanor
         - First impression impact
         Score breakdown:
         - Perfect formal attire: 100%
         - Minor issues: 70-80%
         - Informal attire: Maximum 50%
      
      2. Communication Skills (25% of total)
         Metrics:
         - Response time (0-100%, deduct points for slow responses over 10 seconds)
         - Articulation clarity (0-100%)
         - Professional vocabulary usage (0-100%)
         - Response structure (0-100%)
         - Active listening indicators (0-100%)
         - Filler words frequency (-5% per excessive use)
         - Grammar and pronunciation (-2% per error)
      
      3. Technical Response Quality (25% of total)
         Metrics:
         - Technical accuracy (0-100%)
         - Problem-solving methodology (0-100%)
         - Solution efficiency (0-100%)
         - Code/system design understanding (0-100%)
         - Real-world application awareness (0-100%)
         - Technical terminology usage (0-100%)
      
      4. Professional Conduct (20% of total)
         Metrics:
         - Interview etiquette (0-100%)
         - Response timing (-5% for each response over 15 seconds)
         - Confidence vs. overconfidence (-10% for arrogance)
         - Question handling (0-100%)
         - Time management (0-100%)
         - Stress handling (0-100%)
         - Professional boundaries (0-100%)
      
      5. Critical Thinking (20% of total)
         Metrics:
         - Analytical depth (0-100%)
         - Problem decomposition (0-100%)
         - Solution creativity (0-100%)
         - Edge case consideration (0-100%)
         - Decision justification (0-100%)
      
      Response Time Guidelines:
      - Excellent: 0-5 seconds
      - Good: 5-10 seconds
      - Acceptable: 10-15 seconds
      - Poor: >15 seconds (deduct points)
      - Consider context - technical questions may warrant longer response times
      
      Scoring Guidelines:
      - Start at 0% and justify every point added
      - Deduct points for every mistake or shortcoming
      - Be extremely strict with technical accuracy
      - No rounding up of scores
      - Maximum achievable score should be 95% (perfection is near impossible)
      - Deduct points for consistently slow responses
      
      Rating Scale (Post all deductions):
      95%+: ★★★★★ (Exceptional - Extremely Rare)
      88-94%: ★★★★½ (Outstanding)
      82-87%: ★★★★ (Excellent)
      75-81%: ★★★½ (Very Good)
      70-74%: ★★★ (Good)
      65-69%: ★★½ (Above Average)
      60-64%: ★★ (Average)
      50-59%: ★½ (Below Average)
      Below 50%: ★ (Significant Improvement Needed)
      
      Format your response as:
      1. FINAL SCORE: [X.XX%] (Include up to 2 decimal places)
      2. STAR RATING: [★...]
      3. DETAILED METRICS BREAKDOWN:
         - List each category with its score and specific deductions
         - Include response time analysis and its impact
         - Show calculation methodology
         - Justify every point given or deducted
      4. CRITICAL ANALYSIS:
         - Major strengths (with evidence)
         - Critical weaknesses (with evidence)
         - Response time patterns and impact
         - Specific improvement areas
      5. HIRING RECOMMENDATION:
         > 85%: Strong Hire
         75-85%: Potential Hire with Specific Improvements
         65-75%: Consider for Junior Position
         < 65%: Do Not Proceed
      
      IMPORTANT REMINDERS:
      1. Be ruthlessly objective
      2. Every point must be justified with specific evidence
      3. Technical accuracy is non-negotiable
      4. Professional presentation impacts company image
      5. Response timing affects overall impression
      6. This evaluation directly impacts hiring decisions
      
      Gender-Specific Dress Code Standards:
      Men: ${dressCode?.standards?.male.join(', ')}
      Women: ${dressCode?.standards?.female.join(', ')}
    `;

    console.log("Sending request to OpenAI...");
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert HR interview evaluator. Provide detailed, constructive feedback with specific examples and clear improvement suggestions. Pay special attention to professional presentation and dress code compliance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 4000
    });

    const summary = completion.choices[0].message.content;
    console.log("Received summary from OpenAI:", summary);

    return res.status(200).json({ summary });
  } catch (error: any) {
    console.error('Error in summarize API:', error);
    return res.status(500).json({ 
      message: 'Error generating summary', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 