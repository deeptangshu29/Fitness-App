import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster, toast } from "sonner";
import { AlertCircle, CloudRain, Thermometer, Wind, Droplets } from "lucide-react";

const GET_WEATHER = gql`
  query GetWeather($city: String!) {
    weather(city: $city) {
      city
      temperature
      description
      humidity
      windSpeed
    }
  }
`;

const WeatherPage = () => {
	const [city, setCity] = useState("");
	const [getWeather, { data, loading, error }] = useLazyQuery(GET_WEATHER, {
		onError: () => {
			toast.error("Could not fetch weather data. Please try again.");
		}
	});

	interface WeatherFormEvent extends React.FormEvent<HTMLFormElement> {
		preventDefault: () => void;
	}

	const handleSubmit = (e: WeatherFormEvent): void => {
		e.preventDefault();
		if (city.trim()) {
			getWeather({ variables: { city: city.trim() } });
		} else {
			toast.warning("Please enter a city name");
		}
	};

	return (
		<div className="flex flex-col items-center p-6">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">Weather Forecast</h1>
					<p className="text-gray-500 mt-2">Get real-time weather information for any city</p>
				</div>

				<Card className="shadow-md border border-gray-100 rounded-xl">
					<CardHeader className="pb-2">
						<CardTitle className="text-xl font-medium">Search Location</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="flex space-x-2">
							<Input
								placeholder="Enter city name..."
								value={city}
								onChange={(e) => setCity(e.target.value)}
								className="flex-1 focus-visible:ring-indigo-500 rounded-md"
							/>
							<Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
								{loading ? "Searching..." : "Search"}
							</Button>
						</form>
					</CardContent>
				</Card>

				{loading && (
					<Card className="shadow-md border border-gray-100 rounded-xl">
						<CardContent className="pt-6">
							<div className="space-y-3">
								<Skeleton className="h-8 w-1/2 bg-gray-200" />
								<Skeleton className="h-6 w-full bg-gray-200" />
								<Skeleton className="h-6 w-3/4 bg-gray-200" />
							</div>
						</CardContent>
					</Card>
				)}

				{error && (
					<Card className="shadow-md border border-gray-100 rounded-xl overflow-hidden">
						<div className="border-l-4 border-l-red-500 h-full">
							<CardContent className="flex items-center gap-3 p-4">
								<AlertCircle className="h-5 w-5 text-red-500" />
								<p className="text-red-600">Could not fetch weather data. Please try again.</p>
							</CardContent>
						</div>
					</Card>
				)}

				{data?.weather && (
					<Card className="shadow-md border border-gray-100 rounded-xl overflow-hidden p-0">
						<div className="relative overflow-hidden">
							<CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white pb-4 m-0">
								<CardTitle className="text-2xl font-bold pt-6">{data.weather.city}</CardTitle>
								<CardDescription className="text-white/90">
									{data.weather.description}
								</CardDescription>
							</CardHeader>
							<div className="absolute -bottom-6 -right-6 opacity-10">
								<CloudRain className="h-24 w-24 text-white" />
							</div>
						</div>

						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Thermometer className="h-6 w-6 text-amber-500" />
									<span className="text-3xl font-bold">{data.weather.temperature}°C</span>
								</div>
								<CloudRain className="h-12 w-12 text-indigo-500" />
							</div>

							<div className="grid grid-cols-2 gap-4 mt-6">
								<div className="flex items-center gap-3">
									<div className="bg-blue-50 p-2 rounded-full">
										<Droplets className="h-5 w-5 text-blue-500" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Humidity</p>
										<p className="font-medium">{data.weather.humidity}%</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="bg-blue-50 p-2 rounded-full">
										<Wind className="h-5 w-5 text-blue-500" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Wind Speed</p>
										<p className="font-medium">{data.weather.windSpeed} m/s</p>
									</div>
								</div>
							</div>
						</CardContent>

						<CardFooter className="border-t border-gray-100 text-sm text-gray-500 px-6 py-3">
							Last updated: {new Date().toLocaleTimeString()}
						</CardFooter>
					</Card>
				)}
			</div>
			<Toaster position="bottom-center" closeButton={true} />
		</div>
	);
};

export default WeatherPage;