# Weather Dashboard Setup Guide

## Overview
A modern, responsive weather dashboard that fetches real-time weather data from the OpenWeatherMap API with features like hourly forecasts, 5-day predictions, and saved cities.

## Features
- 🌍 Real-time weather data for any city
- 📍 Geolocation support to get weather for current location
- 📊 Hourly forecast for the next 12 hours
- 📅 5-day weather forecast
- 💾 Save favorite cities
- 🎨 Beautiful, responsive UI
- 📱 Mobile-friendly design
- 🔄 Auto-refresh capabilities
- ⚠️ Error handling with user-friendly messages

## Getting Started

### Prerequisites
- OpenWeatherMap API key (free tier available)
- Modern web browser with JavaScript enabled

### Installation

1. **Get OpenWeatherMap API Key:**
   - Go to https://openweathermap.org/api
   - Sign up for a free account
   - Get your free API key from the dashboard

2. **Update API Key:**
   - Open `weather-dashboard/app.js`
   - Replace `const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'` with your actual API key

3. **Open in Browser:**
   - Navigate to `weather-dashboard.html`

## Features Explained

### Current Weather Display
- Temperature in Celsius
- "Feels like" temperature
- Weather condition with emoji icon
- Humidity percentage
- Wind speed
- Pressure
- Min/Max temperature
- Cloud coverage
- Visibility
- Location information

### Hourly Forecast
- Next 12 hours at 3-hour intervals
- Temperature for each period
- Weather condition
- Visual weather icon

### 5-Day Forecast
- Daily max/min temperatures
- Weather condition
- Humidity
- Wind speed
- Date information

### Saved Cities
- Save favorite cities for quick access
- Display current conditions
- One-click loading
- Easy removal

## Customization

### Change Temperature Unit
In `app.js`, change `units=metric` to:
- `units=imperial` for Fahrenheit
- `units=standard` for Kelvin

### Add More Weather Icons
Edit the `getWeatherIcon()` function in `app.js` to add more weather conditions.

### Modify Forecast Days
In `displayForecast()`, change `.slice(0, 5)` to display more or fewer days.

### Change Colors
Edit CSS variables in `weather-dashboard/styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    /* ... other variables ... */
}
```

## Troubleshooting

### API Key Issues
- Ensure API key is valid and not expired
- Check that you have enabled the correct APIs in OpenWeatherMap dashboard
- Allow a few minutes for the key to become active

### City Not Found
- Check spelling
- Use full city names
- Try with country code (e.g., "London, UK")

### Geolocation Not Working
- Ensure HTTPS is used (required for geolocation)
- Check browser permissions
- Allow location access when prompted

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## API Rate Limits
- Free tier: 60 calls/minute, 1,000,000 calls/month
- Pro tier: Higher limits available

## Future Enhancements
- Weather alerts and warnings
- Historical weather data
- Weather maps integration
- Multiple language support
- Dark mode toggle
- Weather notifications
- Share weather information
- Integration with calendar

## Resources
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Weather API Documentation](https://openweathermap.org/current)
- [Forecast API Documentation](https://openweathermap.org/forecast5)

## License
MIT
