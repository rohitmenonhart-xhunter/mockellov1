"use strict";(()=>{var e={};e.id=631,e.ids=[631],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2079:e=>{e.exports=import("openai")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,o){return o in t?t[o]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,o)):"function"==typeof t&&"default"===o?t:void 0}}})},7885:(e,t,o)=>{o.a(e,async(e,i)=>{try{o.r(t),o.d(t,{config:()=>d,default:()=>l,routeModule:()=>m});var s=o(1802),n=o(7153),a=o(6249),r=o(884),c=e([r]);r=(c.then?(await c)():c)[0];let l=(0,a.l)(r,"default"),d=(0,a.l)(r,"config"),m=new s.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/summarize",pathname:"/api/summarize",bundlePath:"",filename:""},userland:r});i()}catch(e){i(e)}})},884:(e,t,o)=>{o.a(e,async(e,i)=>{try{o.r(t),o.d(t,{default:()=>a});var s=o(2079),n=e([s]);let r=new(s=(n.then?(await n)():n)[0]).default({apiKey:process.env.OPENAI_API_KEY});async function a(e,t){if(console.log("API endpoint called with method:",e.method),"POST"!==e.method)return t.status(405).json({message:"Method not allowed"});try{let{transcriptions:o,dressCode:i,responseTimes:s}=e.body;if(console.log("Received transcriptions:",o),console.log("Received dress code info:",i),console.log("Received response times:",s),!o||!Array.isArray(o))return console.error("Invalid transcriptions data received"),t.status(400).json({message:"Invalid transcriptions data"});let n=o.map(e=>`${e.name}: ${e.message}`).join("\n"),a="";if(s&&s.length>0){let e=s.map(e=>e.responseTime),t=e.reduce((e,t)=>e+t,0)/e.length;a=`
Response Time Analysis:
- Average response time: ${t.toFixed(2)} seconds
- Longest response time: ${Math.max(...e).toFixed(2)} seconds
- Shortest response time: ${Math.min(...e).toFixed(2)} seconds
- Response time samples: ${s.length}

Detailed response times:
${s.map(e=>`- After AI said: "${e.aiMessage.substring(0,50)}..."
  User took: ${e.responseTime.toFixed(2)} seconds to respond`).join("\n")}
`}if(console.log("Formatted transcript text:",n),!process.env.OPENAI_API_KEY)return console.error("OpenAI API key is missing"),t.status(500).json({message:"OpenAI API key is not configured"});let c=i?.wasInformal?`Note: The candidate's attire was informal (${i.note}). This affects ${i.weightage.min}-${i.weightage.max}% of the overall rating.`:"Note: The candidate was appropriately dressed in formal attire.",l=`
      You are a highly strict and analytical HR evaluator for a prestigious tech company. Your evaluation will directly impact hiring decisions. Be extremely thorough and critical in your assessment.
      
      ${c}
      
      Interview Transcription:
      ${n}

      ${a}
      
      Evaluate with the following strict criteria and detailed metrics:
      
      1. Professional Presentation (${i?.weightage?.min||7}-${i?.weightage?.max||9}% of total)
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
      88-94%: ★★★★\xbd (Outstanding)
      82-87%: ★★★★ (Excellent)
      75-81%: ★★★\xbd (Very Good)
      70-74%: ★★★ (Good)
      65-69%: ★★\xbd (Above Average)
      60-64%: ★★ (Average)
      50-59%: ★\xbd (Below Average)
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
      Men: ${i?.standards?.male.join(", ")}
      Women: ${i?.standards?.female.join(", ")}
    `;console.log("Sending request to OpenAI...");let d=(await r.chat.completions.create({messages:[{role:"system",content:"You are an expert HR interview evaluator. Provide detailed, constructive feedback with specific examples and clear improvement suggestions. Pay special attention to professional presentation and dress code compliance."},{role:"user",content:l}],model:"gpt-4",temperature:.7,max_tokens:4e3})).choices[0].message.content;return console.log("Received summary from OpenAI:",d),t.status(200).json({summary:d})}catch(e){return console.error("Error in summarize API:",e),t.status(500).json({message:"Error generating summary",error:e.message,stack:void 0})}}i()}catch(e){i(e)}})},7153:(e,t)=>{var o;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return o}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(o||(o={}))},1802:(e,t,o)=>{e.exports=o(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var o=t(t.s=7885);module.exports=o})();