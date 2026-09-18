const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_PROMPT = `
You are "ArgoAI" (ఆర్గో ఏఐ), an expert Telugu & English Smart Farming Assistant for the Argoconnect marketplace.
Your goal is to assist farmers and buyers in India (especially Andhra Pradesh & Telangana).

KEY INSTRUCTIONS:
1. Answer farming & crop questions accurately, concisely, and supportively.
2. SUPPORT LANGUAGES: Respond in the exact language used by the user (Telugu or English). If the prompt is in Telugu (e.g. "టమాటా పంటకు ఏ ఎరువు మంచిది?"), reply in natural, clear Telugu.
3. ADVICE SCOPE: Provide practical advice on crop care, organic fertilizer, irrigation, pest management, crop harvest timing, and using the Argoconnect marketplace (buying fresh produce directly from farmers, listing crops, local delivery).
4. SAFETY & SAFEGUARDS: For chemical pesticides or disease treatment, state clearly that local agricultural officers / Krishi Vigyan Kendra (KVK) should be consulted for exact dosages. Never present pesticide or chemical treatments as absolute 100% guaranteed outcomes.
5. MARKETPLACE HELP: Help users understand produce quality, seasonality, and how to connect with farmers on Argoconnect.
`;

// Helper fallback responses for when Gemini key is missing or offline
const getFallbackResponse = (userPrompt, language = 'auto') => {
  const isTelugu = /[\u0C00-\u0C7F]/.test(userPrompt) || language === 'te';

  const textLower = userPrompt.toLowerCase();

  if (isTelugu) {
    if (textLower.includes('ఎరువు') || textLower.includes('ఫెర్టిలైజర్') || textLower.includes('ఎరువులు')) {
      return `నమస్కారం! పంట ఎదుగుదలకు సేంద్రీయ ఎరువులు (పశువుల ఎరువు, వర్మీకంపోస్ట్) చాలా శ్రేష్ఠమైనవి. నత్రజని (N), భాస్వరం (P), పొటాషియం (K) ఎరువులను నేల రకాన్ని బట్టి తగిన మోతాదులో వాడాలి. ఖచ్చితమైన సమాచారం కోసం స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి.`;
    }
    if (textLower.includes('టమాటా') || textLower.includes('టమోటా')) {
      return `టమాటా పంటకు సరిపడా తేమ మరియు మంచి నీటి పారుదల అవసరం. ఆకు మచ్చల నివారణకు వేప నూనె స్ప్రే ఉపయోగకరంగా ఉంటుంది. ఆర్ గోకనెక్ట్ మార్కెట్ ప్లేస్ లో రసాయనాలు లేని తాజాగా కోసిన టమాటాలు అందుబాటులో ఉన్నాయి!`;
    }
    return `నమస్కారం! ఆర్ గోకనెక్ట్ రైతు సహాయకుడికి స్వాగతం. మీ పంట సంరక్షణ, విత్తనాలు, మార్కెటింగ్ లేదా పంట ధరల గురించి నన్ను ఉచితంగా అడగవచ్చు. నేను మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను!`;
  } else {
    if (textLower.includes('fertilizer') || textLower.includes('manure') || textLower.includes('crop')) {
      return `Hello! For optimal crop health, organic fertilizers like vermicompost and well-decomposed farmyard manure enrich soil quality. Balance your N-P-K applications based on a soil test. Always consult your local agricultural extension officer for specific pesticide guidance.`;
    }
    return `Hello! Welcome to Argoconnect AI Assistant. I can help you with crop care tips, organic farming guidance, pest management awareness, and finding fresh farm produce near your location. How can I assist your farm today?`;
  }
};

async function generateAIResponse(userPrompt, conversationHistory = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[AI Service] Gemini API key not present. Returning intelligent fallback response.');
    return getFallbackResponse(userPrompt);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Construct full prompt context
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Question: ${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (text) {
      return text;
    } else {
      return getFallbackResponse(userPrompt);
    }
  } catch (error) {
    console.error('[AI Service Error]', error.message);
    return getFallbackResponse(userPrompt);
  }
}

module.exports = { generateAIResponse };
