const axios = require('axios');

(async function(){
  try{
    const key = process.env.SERPAPI_KEY || '';
    if (!key) {
      console.error('No SERPAPI_KEY in env');
      process.exit(1);
    }

    const q = 'women hoodie';
    const params = new URLSearchParams({ engine: 'google_shopping', q, api_key: key, hl: 'en' });
    console.log('Calling SerpAPI...');
    const res = await axios.get(`https://serpapi.com/search.json?${params.toString()}`, { timeout: 60000 });
    console.log('Status:', res.status);
    console.log('Shopping results count:', (res.data.shopping_results || []).length);
    console.log('Sample:', JSON.stringify((res.data.shopping_results || []).slice(0,3), null, 2));
  } catch (err) {
    if (err.response) {
      console.error('SerpAPI error status:', err.response.status);
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('SerpAPI request error:', err.message || err);
    }
  }
})();
