import { convertToWeekday, formatLocation } from './helpers.js';

// Current weather object
function CurrentWeather(weatherData) {
	// Main weather variables:
	// Location
	this.locationName = weatherData.location.name;
	this.locationRegion = weatherData.location.region;
	this.locationCountry = weatherData.location.country;
	// Date & time
	this.weekday = convertToWeekday(weatherData.location.localtime);
	this.date = weatherData.location.localtime.split(' ')[0];
	this.time = weatherData.location.localtime.split(' ')[1];
	this.formatedDate1 = this.weekday + ', ' + this.time;
	this.formatedDate2 = this.date;
	// Weather
	this.conditionText = weatherData.current.condition.text;
	this.conditionIcon = weatherData.current.condition.icon; //(url.png)
	// Temperature
	this.temperatureC = weatherData.current.temp_c;
	this.temperatureF = weatherData.current.temp_f;

	// Additional weather variables:
	// Feels like temp
	this.feelsLikeTemperatureC = weatherData.current.feelslike_c;
	this.feelsLikeTemperatureF = weatherData.current.feelslike_f;
	// Humidity
	this.humidity = weatherData.current.humidity;
	// Rain chance
	this.rainChance =
		weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
	// Wind speed
	this.windSpeed = weatherData.current.wind_kph;
}

// Forecast object
function ForecastDay(weatherData, dayIndex) {
	this.date = weatherData.forecast.forecastday[dayIndex].date;
	this.dayOfWeek = convertToWeekday(this.date); // (convert to day of the week)
	this.temperatureC =
		weatherData.forecast.forecastday[dayIndex].day.avgtemp_c;
	this.temperatureCMin =
		weatherData.forecast.forecastday[dayIndex].day.mintemp_c;
	this.temperatureF =
		weatherData.forecast.forecastday[dayIndex].day.avgtemp_f;
	this.temperatureFMin =
		weatherData.forecast.forecastday[dayIndex].day.mintemp_f;
	this.weatherIcon =
		weatherData.forecast.forecastday[dayIndex].day.condition.icon;
}

async function fetchWeather(location) {
	// Call WeatherAPI to get the data from the specific location
	// Request URL example:
	// http://api.weatherapi.com/v1/forecast.json?key={API_KEY}&q={location}&days=3
	const apiKey = '1f942dd367ca473d889171547241705';
	const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;

	// fetch and check response status
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Error in fetchWeather(${location}), response status: ${response.status}, ${response.statusText}`
			);
		} else {
			const weatherData = await response.json();
			return weatherData;
		}
	} catch (error) {
		console.log(error);
		return Promise.reject(error);
	}
}

function search(event) {
	// Prevent submit
	event.preventDefault();

	// Store input value and reset form
	const value = document.querySelector('.searchInput').value;
	event.target.reset();

	// Fetch weather with input location
	const weatherData = fetchWeather(value);
	weatherData
		.then((data) => {
			const weather = new CurrentWeather(data);
			const forecast = new Array(3);
			forecast[0] = new ForecastDay(data, 0);
			forecast[1] = new ForecastDay(data, 1);
			forecast[2] = new ForecastDay(data, 2);

			// Modify global variables
			w = weather;
			f = forecast;

			render(w, f);
		})
		.catch((error) => {
			console.log(error);
		});
}

function render(weather, forecast) {
	const city = document.querySelector('.city');
	const temp =
		weather.locationName +
		', ' +
		weather.locationRegion +
		', ' +
		weather.locationCountry;
    city.textContent = formatLocation(temp);

	const date1 = document.querySelector('.date1');
	date1.textContent = weather.formatedDate1;

	const date2 = document.querySelector('.date2');
	date2.textContent = weather.formatedDate2;

	const conditionIcon = document.querySelector('.conditionIcon img');
	conditionIcon.src = weather.conditionIcon;

	const condition = document.querySelector('.condition');
	condition.textContent = weather.conditionText;

	const temperature = document.querySelector('.temperature');
	if (celsius) temperature.textContent = weather.temperatureC + 'ºC';
	else temperature.textContent = weather.temperatureF + 'ºF';

	const feelsLikeTemperature = document.querySelector(
		'.feelsLike :nth-child(2)'
	);
	if (celsius)
		feelsLikeTemperature.textContent = weather.feelsLikeTemperatureC + 'ºC';
	else
		feelsLikeTemperature.textContent = weather.feelsLikeTemperatureF + 'ºF';

	const humidity = document.querySelector('.humidity :nth-child(2)');
	humidity.textContent = weather.humidity + '%';

	const rainChance = document.querySelector('.rainChance :nth-child(2)');
	rainChance.textContent = weather.rainChance + '%';

	const windSpeed = document.querySelector('.windSpeed :nth-child(2)');
	windSpeed.textContent = weather.windSpeed + 'km/h';

	// Forecast 3 days
	for (let i = 1; i <= 3; i++) {
		// Date
		const forecastDate = document.querySelector(`.day${i} .forecastDate`);
		forecastDate.textContent = forecast[i - 1].dayOfWeek;

		// Temperature
		const forecastTemperature = document.querySelector(
			`.day${i} .forecastTemperature`
		);
		if (celsius)
			forecastTemperature.textContent =
				forecast[i - 1].temperatureC + 'ºC';
		else
			forecastTemperature.textContent =
				forecast[i - 1].temperatureF + 'ºF';

		// Temperature Min
		const forecastTemperatureMin = document.querySelector(
			`.day${i} .forecastTemperatureMin`
		);
		if (celsius)
			forecastTemperatureMin.textContent =
				forecast[i - 1].temperatureCMin + 'ºC';
		else
			forecastTemperatureMin.textContent =
				forecast[i - 1].temperatureFMin + 'ºF';

		// Weather
		const forecastWeather = document.querySelector(
			`.day${i} .forecastWeather img`
		);
		forecastWeather.src = forecast[i - 1].weatherIcon;
	}
}

// Application start here:
let celsius = true;

// Initial city (Barcelona):
let w; //global weather object
let f; //global forecast object

// Fetch initial data
const initialWeatherData = fetchWeather('Barcelona');
initialWeatherData.then((data) => {
	w = new CurrentWeather(data);
	f = new Array(3);
	f[0] = new ForecastDay(data, 0);
	f[1] = new ForecastDay(data, 1);
	f[2] = new ForecastDay(data, 2);

	// Render initial data
	render(w, f);
});

const CtoFButton = document.querySelector('.CtoFButton');
CtoFButton.addEventListener('click', () => {
	celsius = !celsius;
	render(w, f);
});

const searchbar = document.getElementById('searchbar');
searchbar.addEventListener('submit', function (event) {
	search(event);
});
