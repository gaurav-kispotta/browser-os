const express = require('express');
const  { exec } = require('child_process');
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

app.get('/connect', (req, res) => {
    const { ssid, password } = req.query;

    wifi.connect({ ssid, password }, (error) => {
        if (error) {
            console.log(error);
            res.status(500).send('Failed to connect to the network');
        } else {
            console.log(`Connected to ${ssid}`);
            res.send(`Connected to ${ssid}`);
        }
    });
}
);
app.get('/disconnect', (req, res) => {
    wifi.disconnect((error) => {
        if (error) {
            console.log(error);
            res.status(500).send('Failed to disconnect from the network');
        } else {
            console.log('Disconnected from the network');
            res.send('Disconnected from the network');
        }
    });
}
);
app.get('/status', (req, res) => {
    wifi.getCurrentConnections((error, currentConnections) => {
        if (error) {
            console.log(error);
            res.status(500).send('Failed to get current connections');
        } else {
            console.log('Current connections:');
            console.log(currentConnections);
            res.json(currentConnections);
        }
    });
}
);

app.get('/browser/open/:link', (req, res) => {
    const link = req.params.link;
    exec(`firefox ${link}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error opening browser: ${error}`);
            res.status(500).send('Failed to open browser');
            return;
        }
        console.log(`Browser opened with link: ${link}`);
        res.send(`Browser opened with link: ${link}`);
    }); 
}
);

app.get('/ip', (req, res) => {
    const ipAddress = req.ip;
    res.send(`Your IP address is: ${ipAddress}`);
  });

// Serve static files from public directory
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Wireless scanner app listening at http://localhost:${port}`);
});