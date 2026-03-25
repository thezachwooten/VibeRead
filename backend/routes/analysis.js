import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many requests, please try again later' }
});

export default function createAnalysisRouter(model) {

    const router = express.Router();

    router.post('/vibe', limiter, async (req, res) => {

        const musicData = req.body;

        const prompt = `You are a music personality analyst. Analyze this Spotify data and return a JSON object with exactly these fields:
            {
            "headline": "A punchy 6-10 word headline capturing their vibe",
            "listenerType": "A 3-5 word archetype like 'The Nostalgic Night Owl'",
            "summary": "3-4 sentences describing their music personality, referencing specific artists",
            "traits": [
                { "label": "Trait name", "description": "One sentence about this trait", "score": 0.0 to 1.0 },
                { "label": "...", "description": "...", "score": 0.0 },
                { "label": "...", "description": "...", "score": 0.0 },
                { "label": "...", "description": "...", "score": 0.0 }
            ],
            "deepDive": "2-3 sentences about something subtle or surprising in their taste"
            }

            Return ONLY valid JSON, no markdown, no explanation.

            Music data:
            ${JSON.stringify(musicData, null, 2)}`;

        try {
            const result = await model.generateContent(prompt);
            const raw = result.response.text();
            res.json(JSON.parse(raw));
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Analysis failed, please try again' });
        }
    });

    return router;
}