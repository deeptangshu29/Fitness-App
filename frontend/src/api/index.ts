import axios from "axios";

// Define interfaces for each data type
export interface User {
	id?: string;
	name: string;
	email: string;
	password?: string;
	// add other user fields as needed
}

export interface Workout {
	id?: string;
	type: string;
	duration: number;
	// add other workout fields as needed
}

export interface Trainer {
	id?: string;
	name: string;
	specialization: string;
	// add other trainer fields as needed
}

export interface Goal {
	id: string;
	targetWeight: number;
	targetDate: string;
	// add other goal fields as needed
}

export interface GoalPayload {
	targetWeight: number;
	targetDate: string;
}

export interface Meal {
	id?: string;
	name: string;
	calories: number;
	time: string;
	// add other meal fields as needed
}

const API = axios.create({
	baseURL: "http://localhost:3000",
});

// Users
export const fetchUsers = () => API.get("/users");
export const createUser = (data: User) => API.post("/users", data);
export const updateUser = (id: string, data: Partial<User>) => API.put(`/users/${id}`, data);
export const deleteUser = (id: string) => API.delete(`/users/${id}`);

// Workouts
export const fetchWorkouts = () => API.get("/workouts");
export const createWorkout = (data: Workout) => API.post("/workouts", data);
export const updateWorkout = (id: string, data: Partial<Workout>) => API.put(`/workouts/${id}`, data);
export const deleteWorkout = (id: string) => API.delete(`/workouts/${id}`);

// Trainers
export const fetchTrainers = () => API.get("/trainers");
export const createTrainer = (data: Trainer) => API.post("/trainers", data);
export const updateTrainer = (id: number, payload: { name: string; specialization: string }) => API.put(`/trainers/${id}`, payload);
export const deleteTrainer = (id: number) =>API.delete(`/trainers/${id}`);

// Goals
export const fetchGoals = () => API.get("/goals");
export const createGoal = (data: GoalPayload) => API.post("/goals", data);
export const updateGoal = (id: string, data: GoalPayload) => API.put(`/goals/${id}`, data);
export const deleteGoal = (id: string) => API.delete(`/goals/${id}`);

// Meals
export const fetchMeals = () => API.get("/meals");
export const createMeal = (data: Meal) => API.post("/meals", data);
export const updateMeal = (id: string, data: Partial<Meal>) => API.put(`/meals/${id}`, data);
export const deleteMeal = (id: string) => API.delete(`/meals/${id}`);

// Weather (External)
export const fetchWeather = (city: string) =>
	API.get(`/weather?city=${encodeURIComponent(city)}`);



