export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ reply: "Njuumte: Caabi API bi nekkul ci Vercel!" });
    }

    const prompt = `Yaw ab tontukaay AI nga ngir application 'Jàngale'. Lépp lu ñu la laaj, danga koy tontu ci Wolof bu am kersa te yomb a jàng. Laaj bi mooy: ${message}`;

    try {
        // Lëkkalekaay bu dëgg dëgg bu Gemini 1.5 Flash
        const response = await fetch(`https://googleapis.com{apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // Bu fekké Google dafa joxé error (cabi bu baaxul walla leneen)
        if (data.error) {
            return res.status(200).json({ reply: `Google Error: ${data.error.message}` });
        }

        // Firi xibaar bi ci anam bu dagg gu jël index [0] yu array yi
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const replyText = data.candidates[0].content.parts[0].text;
            
            // Tontu bi ci mbooleem anam yu sa frontend mën a laaj
            return res.status(200).json({ 
                reply: replyText,
                AI: replyText,
                text: replyText
            });
        } else {
            return res.status(200).json({ reply: "Anammu tontu Google bi dafa wute walla cabi bi baaxul." });
        }

    } catch (error) {
        return res.status(200).json({ reply: `Recc-recc xarala: ${error.message}` });
    }
}
