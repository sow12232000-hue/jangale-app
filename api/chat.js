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
        const response = await fetch(`https://googleapis.com{apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // Sélal nañu xibaar bi ndax mu jël index [0] yu candidates ak parts dëgg dëgg
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: reply });
        } else {
            return res.status(500).json({ error: 'Anammu tontu bi dafa wute', details: data });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Recc-recc am na ci wooté bi...' });
    }
}
