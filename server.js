const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'img', 'courses');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/upload') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (data.id && data.image) {
                    const base64Data = data.image.replace(/^data:image\/png;base64,/, "");
                    const filepath = path.join(dir, `${data.id}.png`);
                    // Only save if it doesn't already exist from the first 17 to save time,
                    // or just overwrite. The user requested to generate all of them though.
                    fs.writeFileSync(filepath, base64Data, 'base64');
                    console.log(`Saved ${data.id}.png`);
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(400);
                    res.end("Bad Request");
                }
            } catch (e) {
                console.error(e);
                res.writeHead(500);
                res.end("Server Error");
            }
        });
    } else if (req.method === 'GET' && req.url === '/') {
        const htmlPath = path.join(__dirname, 'gerar_capas.html');
        if (fs.existsSync(htmlPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync(htmlPath));
        } else {
            res.writeHead(404);
            res.end("HTML file not found");
        }
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(3015, () => {
    console.log("Receiver server running on http://localhost:3015");
});
