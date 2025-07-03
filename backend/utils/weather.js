// File: utils/weather.js
import axios from "axios";
import logger from "./logger.js"; // ✅ Add logger

const API_KEY = 'b27e3709aae1737cc7f53a360afd9fc4'; // Replace with your actual API key

export const fetchWeatherByCity = async (city) => {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
	try {
		logger.info(`Calling OpenWeatherMap API for city: ${city}`);
		const response = await axios.get(url);
		logger.info(`API call success for city: ${city}`);
		return response.data;
	} catch (error) {
		logger.error(`API call failed for ${city}: ${error.message}`);
		throw error;
	}
};