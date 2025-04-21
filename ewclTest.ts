import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/ewcl-infer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileUrl: "test-url",
      }),
    });

    const data = await res.json();
    console.log('API Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
})();