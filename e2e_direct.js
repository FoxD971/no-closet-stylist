const axios = require('axios');
const fs = require('fs');

function readEnv() {
  const envRaw = fs.readFileSync('.env', 'utf8');
  const env = {};
  for (const line of envRaw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

async function run() {
  try {
    const env = readEnv();
    const VISION_KEY = env.GOOGLE_CLOUD_VISION_API_KEY;
    const SCRAPELESS_KEY = env.SCRAPELESS_API_KEY;

    if (!VISION_KEY) throw new Error('Missing GOOGLE_CLOUD_VISION_API_KEY in .env');
    if (!SCRAPELESS_KEY) throw new Error('Missing SCRAPELESS_API_KEY in .env');

    const imageUrl = 'https://images.unsplash.com/photo-1765009433753-c7462637d21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NTkzMDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080';

    console.log('Fetching image...');
    const imgResp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(imgResp.data, 'binary').toString('base64');
    const content = base64;

    console.log('Calling Google Vision API...');
    const visResp = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${VISION_KEY}`,
      {
        requests: [
          {
            image: { content },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
              { type: 'IMAGE_PROPERTIES' },
              { type: 'WEB_DETECTION' }
            ]
          }
        ]
      },
      { timeout: 60000 }
    );

    const annotations = visResp.data.responses[0];
    console.log('Vision annotations keys:', Object.keys(annotations || {}));
    console.log(JSON.stringify(annotations, null, 2));

    // Build a simple query from label/object and color
    const labels = annotations.labelAnnotations || [];
    const objects = annotations.localizedObjectAnnotations || [];
    const colors = (annotations.imagePropertiesAnnotation?.dominantColors?.colors || []).map(c => {
      const rgb = c.color || {};
      return `${Math.round(rgb.red||0)},${Math.round(rgb.green||0)},${Math.round(rgb.blue||0)}`;
    });

    const chosen = objects[0] || labels[0] || null;
    if (!chosen) {
      console.log('No visual detections to build query');
      return;
    }

    const title = chosen.name || chosen.description || 'clothing';
    const color = colors[0] ? `rgb(${colors[0]})` : undefined;
    const query = [title, color].filter(Boolean).join(' ');

    console.log('Searching Scrapeless with query:', query);

    const scrapResp = await axios.post(
      'https://api.scrapeless.com/api/v1/scraper/request',
      {
        actor: 'scraper.google',
        input: {
          action: 'shopping',
          query,
          country: 'us',
          language: 'en',
          maxResults: 20
        }
      },
      {
        headers: {
          Authorization: `Bearer ${SCRAPELESS_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const shoppingResults = scrapResp.data?.result?.shopping_results || scrapResp.data?.shopping_results || [];

    console.log('Found', shoppingResults.length, 'shopping results. Sample:');
    console.log(JSON.stringify(shoppingResults.slice(0, 5), null, 2));

  } catch (err) {
    console.error('Direct E2E error:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.stack || err.message || err);
    }
  }
}

run();
