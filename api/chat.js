export default async function handler(req, res) {
    const { message } = req.body;
   const url = "https://googleapis.com" + process.env.GEMINI_API_KEY;
 
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Tontu ko ci Wolof: " + message }] }] })
    });
    
    const data = await response.json();
    const replyText = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ reply: replyText });
}
