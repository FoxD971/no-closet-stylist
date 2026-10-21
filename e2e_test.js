const axios = require('axios');

async function run() {
  try {
    // Sample image used in the web UI
    const imageUrl = 'https://images.unsplash.com/photo-1765009433753-c7462637d21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NTkzMDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080';

    console.log('Fetching sample image...');
    const imageResp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(imageResp.data, 'binary').toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    console.log('Posting image to /api/vision/detect');
    const visionResp = await axios.post('http://localhost:3001/api/vision/detect', {
      imageData: dataUrl
    }, { timeout: 60000 });

    console.log('Vision response:');
    console.log(JSON.stringify(visionResp.data, null, 2));

    const detections = visionResp.data?.detections || [];
    if (detections.length === 0) {
      console.log('No detections returned; aborting product search.');
      return;
    }

    const top = detections[0];
    const queryParts = [];
    if (top.subcategory) queryParts.push(top.subcategory);
    if (top.attributes?.brand) queryParts.push(top.attributes.brand);
    if (top.attributes?.colors && top.attributes.colors.length) queryParts.push(top.attributes.colors[0]);

    const query = queryParts.join(' ');

    console.log('Searching products with query:', query);

    const productsResp = await axios.post('http://localhost:3001/api/products/search', {
      query,
      category: top.category,
      color: top.attributes?.colors?.[0],
      brand: top.attributes?.brand,
      page: 1
    }, { timeout: 60000 });

    console.log('Products response:');
    console.log(JSON.stringify(productsResp.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('E2E test error: HTTP', err.response.status);
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('E2E test error:', err.stack || err.message || err);
    }
  }
}

run();
