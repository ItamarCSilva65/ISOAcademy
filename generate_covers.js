const fs = require('fs');
const https = require('https');
const path = require('path');

// coursesData.js exports the courses
const coursesMain = require('./data/coursesData.js');
const coursesFree = require('./data/cursos_gratuitosData.js');
const courses = [...coursesMain, ...coursesFree];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        };
        const req = https.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                reject(new Error(`Status Code: ${res.statusCode}`));
                return;
            }
            const stream = fs.createWriteStream(filepath);
            res.pipe(stream);
            stream.on('finish', () => {
                stream.close(resolve);
            });
        });
        req.on('error', reject);
    });
};

const generateAllCovers = async () => {
    const dir = path.join(__dirname, 'public', 'img', 'courses');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`Total courses to process: ${courses.length}`);

    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];

        const nome = typeof course.nome === 'string' ? course.nome : (course.nome.pt || course.nome);
        const prompt = `photo of real diverse corporate workers training for ${nome} in a modern clean realistic workplace office, 8k resolution, cinematic lighting`;
        // seed with index so each gets a unique result, just in case
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${100 + i}&model=flux`;

        const filepath = path.join(dir, `${course.id}.png`);

        console.log(`[${i + 1}/${courses.length}] Generating for ${course.id}...`);
        try {
            await downloadImage(url, filepath);
            console.log(`  -> Saved ${course.id}.png`);
        } catch (e) {
            console.error(`  -> Failed for ${course.id}: ${e.message}`);
        }
        await delay(1500);
    }
    console.log("All done!");
};

generateAllCovers();
