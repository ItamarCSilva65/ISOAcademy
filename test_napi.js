const https = require('https');

https.get('https://unsplash.com/napi/search/photos?query=factory&per_page=2', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
        console.log(JSON.parse(data).results.map(r => r.id));
    } catch(e) {
        console.log("Parse error or blocked", data.substring(0, 100));
    }
  });
}).on('error', console.error);
