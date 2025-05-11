// server/index.js
const express = require('express');
const axios = require('axios');
const md5 = require('md5');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-wizground', async (req, res) => {
    const moduleData = [{ "ItemKey": "7101"}];
    const secretKey = '854826E559D793F0EE35958B74CA6A17';

    const signature = md5(`${JSON.stringify(moduleData)}${secretKey}`);

    const body = { 
        "station": "a8361de2-9f06-4c35-9dd7-45d292eacad1",
        "plugin": "itemin",
        "company": "demo",
        "message": {
            "netPassportID": "250174",
            "pluginData":[
                {
                    "ItemKey": "A3000"
                }
            ]
        },
        "signature": signature
    };

    try {
        console.log("!!!!!!!?", body);
        const response = await axios.post('https://ws.wizground.com/api', body, {
            headers: { 'Content-Type': 'application/json' }
        });
        res.json(response.data);
        console.log("*******", res);
    } catch (error) {
        console.error('Error from Wizground:', error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: 'Unknown error' });
    }
    
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
