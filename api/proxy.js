export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({status:'Proxy OK - usa POST'});

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({error:'Manca REPLICATE_API_TOKEN su Vercel'});

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    // Pulisci campi che Replicate non vuole
    const { model, predictionId, predictionid, ...rest } = body;
    
    let url = 'https://api.replicate.com/v1/predictions';
    let payload = body;

    // Se arriva "model": "kwaivgi/kling-v2.1" -> usa endpoint nuovo giusto
    if (model && model.includes('/')) {
      url = `https://api.replicate.com/v1/models/${model}/predictions`;
      payload = { input: body.input || rest.input || rest };
      // mantieni anche altri campi validi come input
      if (rest.input) payload = rest;
    }

    const r = await fetch(url, {
      method:'POST',
      headers:{'Authorization':`Token ${token}`,'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch(e){
    return res.status(500).json({error:e.message});
  }
}
