const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const wifi = require('node-wifi');



const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

wifi.init({
    iface: null // network interface, choose a random wifi interface if set to null
});

app.get('/scan', (req, res) => {

    
    wifi.scan((error, networks) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Networks found:');
            console.log(networks);
            res.json(networks);
        }
    });
});

// Serve static files from public directory
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Wireless scanner app listening at http://localhost:${port}`);
});