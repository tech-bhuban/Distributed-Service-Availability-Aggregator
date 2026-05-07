

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// List of services to monitor (can be any API)
const TARGETS = [
    { id: 'google', url: 'https://google.com' },
    { id: 'github_api', url: 'https://github.com' },
    { id: 'invalid_service', url: 'https://this-site-does-not-exist.xyz' }
];

app.get('/api/health', async (req, res) => {
    console.log(`[${new Date().toISOString()}] Starting health check...`);

    const checks = TARGETS.map(async (target) => {
        const start = Date.now();
        try {
            const response = await axios.get(target.url, { timeout: 5000 });
            return {
                id: target.id,
                status: 'ONLINE',
                latency: `${Date.now() - start}ms`,
                code: response.status
            };
        } catch (err) {
            return {
                id: target.id,
                status: 'OFFLINE',
                latency: 'N/A',
                error: err.code || 'TIMEOUT'
            };
        }
    });

    // Advanced: Using allSettled to ensure one failure doesn't stop the whole check
    const results = await Promise.allSettled(checks);
    const summary = results.map(r => r.value);

    res.json({
        timestamp: new Date(),
        summary,
        totalOnline: summary.filter(s => s.status === 'ONLINE').length
    });
});

app.get('/', (req, res) => {
    res.send(`
        <body style="font-family:monospace; background:#111; color:#0f0; padding:40px;">
            <h2>🛠 Microservice Health Aggregator</h2>
            <div id="out">Scanning...</div>
            <script>
                fetch('/api/health').then(r => r.json()).then(data => {
                    document.getElementById('out').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                });
            </script>
        </body>
    `);
});

app.listen(PORT, () => console.log(`Monitor running on port ${PORT}`));
