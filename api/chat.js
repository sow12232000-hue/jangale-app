export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Method not allowed' });
    }
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(200).json({ reply: 'Njuumte: Caabi API bi nekkul ci Vercel!' });
        }
        const url = 'https://googleapis.com' + apiKey;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Yaw ab tontukaay AI nga bu tudd Gemini Wolof ngir application Jangale. Lepp lu nu la laaj, danga koy tontu ci Wolof bu am teggin, bu leer, te gaaw. Laaj bi mooy: ' + message
                    }]
                }]
            })
        });
        const data = await response.json();
        if (data.error) {
            return res.status(200).json({ reply: 'Google Error: ' + data.error.message });
        }
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const replyText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({
                reply: replyText,
                text: replyText
            });
        } else {
            return res.status(200).json({ reply: 'Anammu tontu Google bi dafa wute walla caabi bi baaxul.' });
        }
    } catch (error) {
        return res.status(200).json({ reply: 'Recc-recc xarala: ' + error.message });
    }
}
