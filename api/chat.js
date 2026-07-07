import https from 'https';

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

    const postData = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `Yaw ab tontukaay AI nga bu tudd Gemini Wolof. Tontu ko ci Wolof bu leer te gaaw. Laaj bi mooy: ${message}` }]
        }
      ]
    });

    const options = {
      hostname: '://googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      let dataChunks = '';

      apiRes.on('data', (chunk) => {
        dataChunks += chunk;
      });

      apiRes.on('end', () => {
        try {
          const data = JSON.parse(dataChunks);

          if (data.error) {
            return res.status(200).json({ reply: 'Google Error: ' + data.error.message });
          }

          if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const replyText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: replyText });
          } else {
            return res.status(200).json({ reply: 'Njuumte ci anam bu tontu bi.' });
          }
        } catch (e) {
          return res.status(200).json({ reply: 'Recc-recc mbind: ' + e.message });
        }
      });
    });

    apiReq.on('error', (error) => {
      return res.status(200).json({ reply: 'Recc-recc connection: ' + error.message });
    });

    apiReq.write(postData);
    apiReq.end();

  } catch (error) {
    return res.status(200).json({ reply: 'Recc-recc: ' + error.message });
  }
}
