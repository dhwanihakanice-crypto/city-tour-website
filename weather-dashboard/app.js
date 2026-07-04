// Weather API Configuration
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Get free key from https://openweathermap.org/api
const BASE_URL = 'https://api.openweathermap.org';

// DOM Elements
const searchInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const currentWeatherContent = document.getElementById('currentWeatherContent');
const forecastContent = document.getElementById('forecastContent');
const hourlyForecast = document.getElementById('hourlyForecast');
const savedCitiesContainer = document.getElementById('savedCitiesContainer');
const noSavedCities = document.getElementById('noSavedCities');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const closeErrorBtn = document.querySelector('.close');

// State
let currentCity = null;
let currentWeatherData = null;
let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadDefaultCity();
    displaySavedCities();
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', searchCity);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchCity();
    });
    locationBtn.addEventListener('click', getUserLocation);
    closeErrorBtn.addEventListener('click', closeErrorModal);
    window.addEventListener('click', (e) => {
        if (e.target === errorModal) closeErrorModal();
    });
}

// Search City
function searchCity() {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
        searchInput.value = '';
    }
}

// Get User Location
function getUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    locationBtn.disabled = true;
    locationBtn.textContent = '📍 Getting location...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
            locationBtn.disabled = false;
            locationBtn.textContent = '📍 Use My Location';
        },
        (error) => {
            locationBtn.disabled = false;
            locationBtn.textContent = '📍 Use My Location';
            showError('Unable to get your location: ' + error.message);
        }
    );
}

// Fetch Weather by City
async function fetchWeatherByCity(city) {
    try {
        currentWeatherContent.innerHTML = '<div class="loading">Loading weather data...</div>';

        const response = await fetch(
            `${BASE_URL}/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found');
            }
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        currentCity = data;
        displayCurrentWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
        fetchHourlyForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        showError(error.message);
        currentWeatherContent.innerHTML = '<div class="loading">Failed to load weather data</div>';
    }
}

// Fetch Weather by Coordinates
async function fetchWeatherByCoordinates(latitude, longitude) {
    try {
        currentWeatherContent.innerHTML = '<div class="loading">Loading weather data...</div>';

        const response = await fetch(
            `${BASE_URL}/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        currentCity = data;
        displayCurrentWeather(data);
        fetchForecast(latitude, longitude);
        fetchHourlyForecast(latitude, longitude);
    } catch (error) {
        showError(error.message);
        currentWeatherContent.innerHTML = '<div class="loading">Failed to load weather data</div>';
    }
}

// Fetch 5-Day Forecast
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) throw new Error('Failed to fetch forecast');

        const data = await response.json();
        displayForecast(data.list);
    } catch (error) {
        console.error('Forecast error:', error);
    }
}

// Fetch Hourly Forecast
async function fetchHourlyForecast(lat, lon) {
    try {
        const response = await fetch(
            `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) throw new Error('Failed to fetch hourly forecast');

        const data = await response.json();
        displayHourlyForecast(data.list.slice(0, 12)); // Next 12 hours
    } catch (error) {
        console.error('Hourly forecast error:', error);
    }
}

// Display Current Weather
function displayCurrentWeather(data) {
    const {
        name,
        sys: { country },
        main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
        weather,
        wind: { speed },
        clouds: { all: cloudiness },
        visibility,
    } = data;

    const weatherIcon = getWeatherIcon(weather[0].main);
    const isSaved = savedCities.some(city => city.name === name);

    currentWeatherContent.innerHTML = `
        <div class="weather-main">
            <div class="weather-icon">${weatherIcon}</div>
            <div class="temperature">${Math.round(temp)}°C</div>
            <div class="weather-description">${weather[0].description}</div>
            <div class="location-info">📍 ${name}, ${country}</div>
            <button class="save-city-btn ${isSaved ? 'saved' : ''}" 
                    onclick="toggleSaveCity('${name}', ${data.main.temp}, '${weather[0].description}')">
                ${isSaved ? '⭐ Saved' : '☆ Save City'}
            </button>
        </div>
        <div class="weather-details">
            <div class="detail-card">
                <div class="detail-label">Feels Like</div>
                <div class="detail-value">${Math.round(feels_like)}°C</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Humidity</div>
                <div class="detail-value">${humidity}%</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Wind Speed</div>
                <div class="detail-value">${speed.toFixed(1)} m/s</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Pressure</div>
                <div class="detail-value">${pressure} mb</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Min/Max Temp</div>
                <div class="detail-value">${Math.round(temp_min)}°/${Math.round(temp_max)}°</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Cloudiness</div>
                <div class="detail-value">${cloudiness}%</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Visibility</div>
                <div class="detail-value">${(visibility / 1000).toFixed(1)} km</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">UV Index</div>
                <div class="detail-value">N/A</div>
            </div>
        </div>
    `;
}

// Display Hourly Forecast
function displayHourlyForecast(forecastData) {
    const hourlyHTML = forecastData
        .filter((_, index) => index % 1 === 0) // Show every forecast (3 hourly intervals)
        .map(item => {
            const time = new Date(item.dt * 1000);
            const hour = time.getHours().toString().padStart(2, '0');
            const icon = getWeatherIcon(item.weather[0].main);
            const temp = Math.round(item.main.temp);

            return `
                <div class="hourly-item">
                    <div class="hourly-time">${hour}:00</div>
                    <div class="hourly-icon">${icon}</div>
                    <div class="hourly-temp">${temp}°C</div>
                    <div class="hourly-condition">${item.weather[0].main}</div>
                </div>
            `;
        })
        .join('');

    hourlyForecast.innerHTML = hourlyHTML;
}

// Display 5-Day Forecast
function displayForecast(forecastData) {
    const dailyForecasts = {};

    // Group by day
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
    });

    // Get max, min, and condition for each day
    const forecastCards = Object.entries(dailyForecasts)
        .slice(0, 5)
        .map(([date, items]) => {
            const temps = items.map(item => item.main.temp);
            const maxTemp = Math.max(...temps);
            const minTemp = Math.min(...temps);
            const midIndex = Math.floor(items.length / 2);
            const midItem = items[midIndex];
            const icon = getWeatherIcon(midItem.weather[0].main);
            const condition = midItem.weather[0].main;
            const humidity = Math.round(items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length);
            const windSpeed = (items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length).toFixed(1);

            return `
                <div class="forecast-card">
                    <div class="forecast-date">${date}</div>
                    <div class="forecast-icon">${icon}</div>
                    <div class="forecast-temp">
                        <span class="temp-max">${Math.round(maxTemp)}°</span>
                        <span class="temp-min">${Math.round(minTemp)}°</span>
                    </div>
                    <div class="forecast-condition">${condition}</div>
                    <div class="forecast-details">
                        <div>💧 ${humidity}%</div>
                        <div>💨 ${windSpeed} m/s</div>
                    </div>
                </div>
            `;
        })
        .join('');

    forecastContent.innerHTML = forecastCards;
}

// Weather Icon Mapping
function getWeatherIcon(weatherMain) {
    const iconMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Drizzle': '🌧️',
        'Rain': '🌧️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '🌫️',
        'Haze': '🌫️',
        'Dust': '🌫️',
        'Fog': '🌫️',
        'Sand': '🌫️',
        'Ash': '🌫️',
        'Squall': '🌪️',
        'Tornado': '🌪️',
        'Extreme': '⚠️'
    };
    return iconMap[weatherMain] || '🌤️';
}

// Toggle Save City
function toggleSaveCity(name, temp, condition) {
    const index = savedCities.findIndex(city => city.name === name);

    if (index > -1) {
        savedCities.splice(index, 1);
    } else {
        savedCities.push({ name, temp, condition, timestamp: new Date().getTime() });
    }

    localStorage.setItem('savedCities', JSON.stringify(savedCities));
    displaySavedCities();

    // Update button state
    if (currentCity && currentCity.name === name) {
        displayCurrentWeather(currentCity);
    }
}

// Display Saved Cities
function displaySavedCities() {
    if (savedCities.length === 0) {
        savedCitiesContainer.innerHTML = '';
        noSavedCities.style.display = 'block';
        return;
    }

    noSavedCities.style.display = 'none';

    const savedCitiesHTML = savedCities
        .map(city => `
            <div class="saved-city-card" onclick="fetchWeatherByCity('${city.name}')">
                <div class="saved-city-name">${city.name}</div>
                <div class="saved-city-temp">${Math.round(city.temp)}°C</div>
                <div class="saved-city-condition">${city.condition}</div>
                <button class="remove-btn" onclick="event.stopPropagation(); removeSavedCity('${city.name}')">
                    ✕ Remove
                </button>
            </div>
        `)
        .join('');

    savedCitiesContainer.innerHTML = savedCitiesHTML;
}

// Remove Saved City
function removeSavedCity(name) {
    savedCities = savedCities.filter(city => city.name !== name);
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
    displaySavedCities();
}

// Load Default City
function loadDefaultCity() {
    if (savedCities.length > 0) {
        fetchWeatherByCity(savedCities[0].name);
    } else {
        fetchWeatherByCity('London');
    }
}

// Error Handling
function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
}

function closeErrorModal() {
    errorModal.style.display = 'none';
}

// Utility Functions
function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}
