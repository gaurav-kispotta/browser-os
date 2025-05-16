const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Function to parse iwlist scan output
function parseIwlistOutput(output) {
    const networks = [];
    const cells = output.split('Cell ').slice(1);
    
    cells.forEach(cell => {
        const essid = cell.match(/ESSID:"(.+?)"/);
        const quality = cell.match(/Quality=(\d+\/\d+)/);
        const encryption = cell.includes('Encryption key:on');
        
        if (essid && essid[1]) {
            networks.push({
                ssid: essid[1],
                quality: quality ? quality[1] : 'unknown',
                encrypted: encryption
            });
        }
    });
    
    return networks;
}

app.get('/scan', (req, res) => {
    exec('sudo iwlist wlan0 scan', (error, stdout, stderr) => {
        if (error) {
            console.error('Error scanning networks:', error);
            res.status(500).json({ error: 'Failed to scan networks' });
            return;
        }
        
        const networks = parseIwlistOutput(stdout);
        res.json({ networks });
    });
});

// Serve static files from public directory
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Wireless scanner app listening at http://localhost:${port}`);
});