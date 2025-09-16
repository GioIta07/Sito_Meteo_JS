const btn = document.getElementById('getWeather');
const resultDiv = document.getElementById('result');

btn.addEventListener('click', async () => {
  const city = document.getElementById('city').value.trim();
  if (!city) {
    alert('Inserisci una città');
    return;
  }

  resultDiv.innerHTML = '<p>Caricamento...</p>';

  try {
    // 1. Geocoding per lat/lon
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=it&format=json`;
    const geoResp = await fetch(geoUrl);
    const geoData = await geoResp.json();

    if (!geoData.results || geoData.results.length === 0) {
      resultDiv.innerHTML = '<p>Città non trovata.</p>';
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Meteo orario
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto`;
    const weatherResp = await fetch(weatherUrl);
    const weatherData = await weatherResp.json();

    const times = weatherData.hourly.time;
    const temps = weatherData.hourly.temperature_2m;

    // 3. Aggiorna la pagina
    let html = `<h2>Temperature orarie per ${name} (${country})</h2>`;
    html += '<div>';
    for (let i = 0; i < times.length; i++) {
      html += `
        <div class="hour-row">
          <span>${new Date(times[i]).toLocaleString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short'
          })}</span>
          <span>${temps[i]} °C</span>
        </div>`;
    }
    html += '</div>';
    resultDiv.innerHTML = html;

  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = '<p>Errore nel recupero dei dati.</p>';
  }
});
