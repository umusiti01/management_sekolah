window.getFrontendToken = function () {
  return window.sessionStorage.getItem('school_frontend_token') || '';
};

window.setFrontendToken = function (token) {
  window.sessionStorage.setItem('school_frontend_token', token);
};

window.clearFrontendToken = function () {
  window.sessionStorage.removeItem('school_frontend_token');
};

window.runServerAction = async function (action, payload) {
  const response = await fetch('/api/school', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-frontend-token': window.getFrontendToken()
    },
    body: JSON.stringify({
      action: action,
      payload: payload
    })
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Request ke Vercel API gagal.');
  }

  return data.data;
};
