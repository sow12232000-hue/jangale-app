export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Clé API manke na ci Vercel' });
    }

    const prompt = `Yaw ab tontukaay AI nga ngir application 'Jàngale'. Lépp lu ñu la laaj, danga koy tontu ci Wolof bu am kersa te yomb a jàng. Laaj bi mooy: ${message}`;

    try {
        // Lëkkalekaay bu dëgg bu Gemini 1.5 Flash
        const response = await fetch(`https://googleapis.com{apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // Fii lañuy firi xibaar bi dëgg dëgg ci anam bu dagg
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: reply });
        } else {
            return res.status(500).json({ error: 'Anammu tontu bi dafa wute', details: data });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Recc-recc am na ci wooté bi...' });
    }
}
