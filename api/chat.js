export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ reply: "Njuumte: Caabi API bi nekkul ci Vercel!" });
    }

    const prompt = `Yaw ab tontukaay AI nga ci Wolof: ${message}`;

    try {
        const response = await fetch(`https://googleapis.com{apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // Bu fekké Google dafa joxé erreur, dina ñu ko woné ci saasay ci phone bi
        if (data.error) {
            return res.status(200).json({ reply: `Google Error: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const replyText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: replyText, AI: replyText });
        } else {
            return res.status(200).json({ reply: "Anammu tontu Google bi dafa wute walla cabi bi baaxul." });
        }

    } catch (error) {
        return res.status(200).json({ reply: `Recc-recc xarala: ${error.message}` });
    }
}
