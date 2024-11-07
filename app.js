document.getElementById('search-btn').addEventListener('click', getWeatherByCity);

function getWeatherByCity() {
    const city = document.getElementById('location-input').value;
    if (city) {
        getWeatherDataByCity(city);
    } else {
        alert("Please enter a city name.");
    }
}

function getWeatherDataByCity(city) {
    const apiKey = '63c278f1bae9cb5809aff394c6c305bc'; // Replace with your own OpenWeather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            // Update UI with current weather data
            document.getElementById('city').textContent = data.name;
            document.getElementById('weather-description').textContent = data.weather[0].description;
            document.getElementById('temperature').textContent = `${data.main.temp}°C`;
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            // Get forecast data
            getForecastData(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert(error.message);
        });
}

function getForecastData(latitude, longitude) {
    const apiKey = '63c278f1bae9cb5809aff394c6c305bc'; // Replace with your own OpenWeather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.querySelector('.forecast');

            // Clear any previous forecast data
            forecastContainer.innerHTML = '<h2>Forecast</h2>';

            // Display forecast for the next 5 days (3-hour intervals)
            for (let i = 0; i < data.list.length; i += 8) { // Increment by 8 to get roughly one entry per day
                const forecastDay = data.list[i];
                const date = new Date(forecastDay.dt * 1000).toDateString();
                const temp = forecastDay.main.temp;
                const description = forecastDay.weather[0].description;
                const icon = forecastDay.weather[0].icon;

                const forecastHTML = `
                    <div class="forecast-day">
                        <h3>${date}</h3>
                        <p>${temp}°C</p>
                        <p>${description}</p>
                        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
                    </div>
                `;

                forecastContainer.innerHTML += forecastHTML;
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}
