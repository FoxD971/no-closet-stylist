const axios = require('axios');

(async function(){
  try{
    const imageUrl = 'https://images.unsplash.com/photo-1765009433753-c7462637d21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NTkzMDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080';
    console.log('Fetching sample image...');
    const resp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(resp.data, 'binary').toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    console.log('Posting to /api/scan');
    const r = await axios.post('http://localhost:3001/api/scan', { imageData: dataUrl }, { timeout: 120000 });
    console.log('Scan response keys:', Object.keys(r.data));
    console.log('Query:', r.data.query);
    console.log('Products count:', (r.data.products||[]).length);
    console.log('Cheapest offer:', r.data.cheapestOffer ? `${r.data.cheapestOffer.title} @ ${r.data.cheapestOffer.price}` : 'none');
  } catch (err) {
    if (err.response) {
      console.error('Scan test HTTP error:', err.response.status);
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Scan test error:', err.message || err);
    }
  }
})();
