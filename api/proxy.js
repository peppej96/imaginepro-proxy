export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({status:'Proxy OK - usa POST'});
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({error:'Manca token'});
  try {
    const r = await fetch('https://api.replicate.com/v1/predictions', {
      method:'POST',
      headers:{'Authorization':`Token ${token}`,'Content-Type':'application/json'},
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch(e){ return res.status(500).json({error:e.message}); }
}
