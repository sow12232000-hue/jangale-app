import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ reply: 'Caabi API manke na!' });
    }

    if (!message) {
      return res.status(200).json({ reply: 'Mbind mi nga laaj manke na!' });
    }

    const url = `https://googleapis.com{apiKey}`;


    const response = await axios.post(url, {
      contents: [
        {
          role: 'user',
          parts: [{ text: `Yaw ab tontukaay AI nga bu tudd Gemini Wolof. Tontu ko ci Wolof bu leer te gaaw. Laaj bi mooy: ${message}` }]
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;

    if (data.error) {
      return res.status(200).json({ reply: 'Google Error: ' + data.error.message });
    }

    if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const replyText = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: replyText });
    } else {
      return res.status(200).json({ reply: 'Njuumte ci anam bu tontu bi.' });
    }

  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    return res.status(200).json({ reply: 'Recc-recc: ' + errorMsg });
  }
}
