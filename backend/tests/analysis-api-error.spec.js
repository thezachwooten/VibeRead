import { test, expect } from '@playwright/test';
import express from 'express';
import createAnalysisRouter from '../routes/analysis.js';

const fakeModel = {
    generateContent: async () => ({
        response: {
            text: () => 'This aint json! :('
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

test.describe('POST /analysis/vibe for errors', () => {

    // Test if data that is returned by the AI isn't in the proper JSON format is handled gracefully by endpoint
    test('returns a 500 status code for malformed AI response', async ({ request }) => {
        const response = await request.post(`${baseURL}/analysis/vibe`, {
            data: {
                topArtists: ['Artist One', 'Artist Two'],
                topTracks: ['Track One', 'Track Two'],
            }
        });

        expect(response.status()).toBe(500);

        const body = await response.json();

        expect(body).toHaveProperty('message');
    });

});