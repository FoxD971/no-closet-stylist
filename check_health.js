const axios = require('axios');

(async function(){
  try{
    const res = await axios.get('http://localhost:3001/api/health', { timeout: 5000 });
    console.log('Health:', res.data);
  } catch (err) {
    console.error('Health check failed:', err.message || err);
  }
})();
