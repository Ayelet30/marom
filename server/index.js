// server/index.js
const express = require('express');
const axios = require('axios');
const md5 = require('md5');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-wizground', async (req, res) => {
    const moduleData = req.body.moduleData;
    const secretKey = process.env.SECRET_KEY;
    const plugin = req.body.plugin;

    console.log("11111111111", moduleData);
    console.log("22222222222", plugin);

    if (!moduleData || !Array.isArray(moduleData)) {
        return res.status(400).json({ error: 'Missing or invalid moduleData' });
    }

    if (!plugin || typeof plugin !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid plugin' });
}

    const signature = md5(`${JSON.stringify(moduleData)}${secretKey}`);

    const body = { 
        "station": "a8361de2-9f06-4c35-9dd7-45d292eacad1",
        "plugin": plugin,
        "company": "demo",
        "message": {
            "netPassportID": "250174",
            "pluginData":moduleData
        },
        "signature": signature
    };

    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&", body);

    try {
        const response = await axios.post('https://ws.wizground.com/api', body, {
            headers: { 'Content-Type': 'application/json' }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error from Wizground:', error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: 'Unknown error' });
    }
    
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
