export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  const prompt = "Yaw ab tontukaay AI nga ngir application 'Jàngale'. Lépp lu ñu la laaj, danga koy tontu ci Wolof bu leer, bu rafet, te sell. Laaj bi mu ngi nii: " + message;

  try {
    const response = await fetch(`https://googleapis.com{apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    const reply = data.candidates.content.parts.text;
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: 'Rëcc-rëcc am na...' });
  }
}
