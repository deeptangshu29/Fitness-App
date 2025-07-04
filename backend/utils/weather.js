// File: utils/weather.js
import axios from "axios";
import logger from "./logger.js"; // ✅ Add logger

export const fetchWeatherByCity = async (city) => {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;
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