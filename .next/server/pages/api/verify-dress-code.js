"use strict";(()=>{var e={};e.id=689,e.ids=[689],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2079:e=>{e.exports=import("openai")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},6585:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{config:()=>d,default:()=>c,routeModule:()=>l});var o=r(1802),s=r(7153),n=r(6249),i=r(706),m=e([i]);i=(m.then?(await m)():m)[0];let c=(0,n.l)(i,"default"),d=(0,n.l)(i,"config"),l=new o.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/verify-dress-code",pathname:"/api/verify-dress-code",bundlePath:"",filename:""},userland:i});a()}catch(e){a(e)}})},706:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{config:()=>m,default:()=>n});var o=r(2079),s=e([o]);let i=new(o=(s.then?(await s)():s)[0]).default({apiKey:process.env.OPENAI_API_KEY}),m={api:{bodyParser:{sizeLimit:"10mb"}}};async function n(e,t){if("POST"!==e.method)return t.status(405).json({message:"Method not allowed"});try{let{imageUrl:r,dressCodeStandards:a}=e.body;if(!r)return t.status(400).json({message:"Image URL is required"});if(!a)return t.status(400).json({message:"Dress code standards are required"});let o=(await i.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"system",content:`You are a strict dress code verification system. Your task is to:
1. Identify the exact attire the person is wearing (be very specific)
2. Check if it matches the formal standards exactly
3. Be strict - any variation from formal standards should be marked as informal`},{role:"user",content:[{type:"text",text:`Analyze this person's attire for an interview.

Formal attire standards:
For men: ${a.male.join(", ")}
For women: ${a.female.join(", ")}

Informal attire includes: ${a.informal.join(", ")}

Provide:
1. Exact description of what they are wearing (be specific)
2. Whether it matches the formal standards EXACTLY
3. If informal, what changes they need to make

Format your response as:
Current Attire: [exact description]
Is Formal: [true/false]
Recommendations: [if informal, what they should wear instead]`},{type:"image_url",image_url:{url:r.startsWith("data:")?r:`data:image/jpeg;base64,${r}`}}]}],max_tokens:500})).choices[0].message.content;if(!o)throw Error("No analysis received from OpenAI");let s=o.match(/Current Attire: (.*)/i)?.[1]||"",n=o.match(/Is Formal: (true|false)/i)?.[1]||"false",m=o.match(/Recommendations: (.*)/i)?.[1]||"",c=a.informal.some(e=>s.toLowerCase().includes(e.toLowerCase())),d=[...a.male,...a.female].some(e=>s.toLowerCase().includes(e.toLowerCase())),l="true"===n.toLowerCase()&&d&&!c;return t.status(200).json({isFormal:l,currentAttire:s,recommendations:m||l?"":`Please wear one of the following:
For men: ${a.male.join(", ")}
For women: ${a.female.join(", ")}`,analysis:o})}catch(e){return console.error("Error:",e),t.status(500).json({message:"Error processing image",error:String(e)})}}a()}catch(e){a(e)}})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=6585);module.exports=r})();