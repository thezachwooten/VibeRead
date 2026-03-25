import { test, expect } from '@playwright/test';
import express from 'express';
import createAnalysisRouter from '../routes/analysis.js';

const fakeModel = {
    generateContent: async () => ({
        response: {
            text: () => JSON.stringify({
                headline: "Test Headline For A Music Lover",
                listenerType: "The Test Listener",
                summary: "Test summary sentence one. Test summary sentence two. Test summary sentence three.",
                traits: [
                    { label: "Trait 1", description: "Test trait one", score: 0.8 },
                    { label: "Trait 2", description: "Test trait two", score: 0.6 },
                    { label: "Trait 3", description: "Test trait three", score: 0.4 },
                    { label: "Trait 4", description: "Test trait four", score: 0.2 }
                ],
                deepDive: "Test deep dive sentence one. Test deep dive sentence two."
            })
        }
    })
};

let server;
let baseURL;

test.beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.use('/analysis', createAnalysisRouter(fakeModel));

    await new Promise((resolve) => {
        server = app.listen(0, () => {
            baseURL = `http://localhost:${server.address().port}`;
            resolve();
        });
    });
});

test.afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
});

test.describe('POST /analysis/vibe', () => {
    
    // SMOKE TEST: test if data returns when properly sent correct data
    // Ensures that data is handled correctly when model returns perfect data, also ensures endpoint is reachable
    test('returns a valid analysis shape for valid music data', async ({ request }) => {
        const response = await request.post(`${baseURL}/analysis/vibe`, {
            data: {
                topArtists: ['Artist One', 'Artist Two'],
                topTracks: ['Track One', 'Track Two'],
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('headline');
        expect(body).toHaveProperty('listenerType');
        expect(body).toHaveProperty('summary');
        expect(body).toHaveProperty('traits');
        expect(body).toHaveProperty('deepDive');
        expect(body.traits).toHaveLength(4);
    });
});