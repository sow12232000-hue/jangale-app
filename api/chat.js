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

        const model = 'gemini-2.5-flash';
        const url = `https://googleapis.com{model}:generateContent?key=${apiKey}`;

        const fullPrompt = `Yaw ab tontukaay AI nga bu tudd Gemini Wolof. Tontu ko ci Wolof bu leer te gaaw.\n\nLaaj: ${message}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: fullPrompt }] 
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ reply: 'Google Error: ' + data.error.message });
        }

        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            const replyText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: replyText });
        } else {
            return res.status(200).json({ reply: 'Njuumte ci anamu tontu bi.' });
        }

    } catch (error) {
        return res.status(200).json({ reply: 'Recc-recc: ' + error.message });
    }
}
