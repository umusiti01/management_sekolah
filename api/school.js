module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method tidak diizinkan.' });
    return;
  }

  const frontendToken = process.env.FRONTEND_ACCESS_TOKEN || '';
  const requestFrontendToken = req.headers['x-frontend-token'] || '';

  if (frontendToken && requestFrontendToken !== frontendToken) {
    res.status(401).json({ success: false, error: 'Frontend access token tidak valid.' });
    return;
  }

  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  const appsScriptApiToken = process.env.APPS_SCRIPT_API_TOKEN;

  if (!appsScriptUrl || !appsScriptApiToken) {
    res.status(500).json({ success: false, error: 'Environment Vercel untuk Apps Script belum lengkap.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const upstreamResponse = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: appsScriptApiToken,
        action: body.action,
        payload: body.payload || {}
      })
    });

    const upstreamData = await upstreamResponse.json();
    if (!upstreamData.success) {
      res.status(400).json({
        success: false,
        error: upstreamData.error || 'Apps Script mengembalikan error.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: upstreamData.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal terhubung ke Apps Script.'
    });
  }
};
