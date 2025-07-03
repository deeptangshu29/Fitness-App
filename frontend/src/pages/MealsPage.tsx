import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, PencilIcon, Trash2Icon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	fetchMeals,
	createMeal,
	updateMeal,
	deleteMeal,
} from "@/api";

type Meal = {
	id: number;
	name: string;
	calories: number;
	time: string;
};

const MealsPage = () => {
	const [meals, setMeals] = useState<Meal[]>([]);
	const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
	const [name, setName] = useState("");
	const [calories, setCalories] = useState("");
	const [time, setTime] = useState(new Date().toISOString());
	const [date, setDate] = useState<Date>(new Date());
	const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("all");

	const loadMeals = async () => {
		try {
			const res = await fetchMeals();
			setMeals(res.data);
			setFilteredMeals(res.data);
		} catch (err) {
			console.error("Error fetching meals:", err);
			toast.error("Failed to load meals");
		}
	};

	useEffect(() => {
		loadMeals();
	}, []);

	useEffect(() => {
		let result = [...meals];

		// Apply search filter
		if (searchQuery) {
			result = result.filter(meal =>
				meal.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Apply tab filter
		if (activeTab === "today") {
			const today = new Date().setHours(0, 0, 0, 0);
			result = result.filter(meal => {
				const mealDate = new Date(meal.time).setHours(0, 0, 0, 0);
				return mealDate === today;
			});
		}

		setFilteredMeals(result);
	}, [meals, searchQuery, activeTab]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !calories.trim()) {
			toast.error("Please fill in all required fields");
			return;
		}

		const payload = {
			name,
			calories: Number(calories),
			time: new Date(time).toISOString(),
		};

		try {
			if (editingMeal) {
				await updateMeal(editingMeal.id.toString(), payload);
				toast.success("Meal updated successfully");
				setEditingMeal(null);
			} else {
				await createMeal(payload);
				toast.success("Meal added successfully");
			}

			setName("");
			setCalories("");
			setTime(new Date().toISOString());
			setIsFormOpen(false);
			loadMeals();
		} catch (err) {
			console.error("Error saving meal:", err);
			toast.error(editingMeal ? "Failed to update meal" : "Failed to add meal");
		}
	};

	const handleEdit = (meal: Meal) => {
		setEditingMeal(meal);
		setName(meal.name);
		setCalories(String(meal.calories));
		setTime(meal.time);
		setDate(new Date(meal.time));
		setIsFormOpen(true);
	};

	const handleDelete = async (id: number) => {
		try {
			await deleteMeal(id.toString());
			toast.success("Meal deleted successfully");
			loadMeals();
		} catch (err) {
			console.error("Error deleting meal:", err);
			toast.error("Failed to delete meal");
		}
	};

	const openNewMealForm = () => {
		setEditingMeal(null);
		setName("");
		setCalories("");
		setTime(new Date().toISOString());
		setDate(new Date());
		setIsFormOpen(true);
	};

	const getTotalCalories = () => {
		return filteredMeals.reduce((total, meal) => total + meal.calories, 0);
	};

	const formatTimeDisplay = (timeString: string) => {
		return format(new Date(timeString), "h:mm a");
	};

	const formatDateDisplay = (timeString: string) => {
		return format(new Date(timeString), "MMM d, yyyy");
	};

	return (
		<div className="container py-8 max-w-4xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold tracking-tight">Meal Tracker</h1>
				<Button onClick={openNewMealForm} className="gap-2">
					<Plus size={16} /> Add Meal
				</Button>
			</div>

			<Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
				<div className="flex items-center justify-between mb-4">
					<TabsList>
						<TabsTrigger value="all">All Meals</TabsTrigger>
						<TabsTrigger value="today">Today</TabsTrigger>
					</TabsList>
					<div className="relative w-64">
						<Input
							placeholder="Search meals..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pr-8"
						/>
					</div>
				</div>

				<TabsContent value="all" className="mt-0">
					<Card>
						<CardHeader className="pb-3">
							<div className="flex justify-between items-center">
								<CardTitle>All Meals</CardTitle>
								<Badge variant="secondary" className="text-sm">
									{getTotalCalories()} total calories
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							{filteredMeals.length > 0 ? (
								<ScrollArea className="h-[60vh]">
									<div className="space-y-4">
										{filteredMeals.map((meal) => (
											<Card key={meal.id} className="overflow-hidden">
												<div className="flex items-start p-4">
													<div className="flex-1">
														<div className="flex justify-between items-start">
															<div>
																<h3 className="font-medium text-lg">{meal.name}</h3>
																<div className="flex gap-2 mt-1">
																	<Badge variant="outline">{meal.calories} kcal</Badge>
																	<span className="text-sm text-muted-foreground">
																		{formatTimeDisplay(meal.time)}
																	</span>
																</div>
																<p className="text-xs text-muted-foreground mt-1">
																	{formatDateDisplay(meal.time)}
																</p>
															</div>
															<div className="flex gap-2">
																<Button
																	variant="ghost"
																	size="icon"
																	onClick={() => handleEdit(meal)}
																>
																	<PencilIcon size={16} />
																</Button>
																<Button
																	variant="ghost"
																	size="icon"
																	className="text-destructive hover:text-destructive"
																	onClick={() => handleDelete(meal.id)}
																>
																	<Trash2Icon size={16} />
																</Button>
															</div>
														</div>
													</div>
												</div>
											</Card>
										))}
									</div>
								</ScrollArea>
							) : (
								<div className="text-center py-10 text-muted-foreground">
									{searchQuery ? "No meals found matching your search" : "No meals added yet"}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="today" className="mt-0">
					<Card>
						<CardHeader className="pb-3">
							<div className="flex justify-between items-center">
								<CardTitle>Today's Meals</CardTitle>
								<Badge variant="secondary" className="text-sm">
									{getTotalCalories()} total calories
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							{filteredMeals.length > 0 ? (
								<ScrollArea className="h-[60vh]">
									<div className="space-y-4">
										{filteredMeals.map((meal) => (
											<Card key={meal.id} className="overflow-hidden">
												<div className="flex items-start p-4">
													<div className="flex-1">
														<div className="flex justify-between items-start">
															<div>
																<h3 className="font-medium text-lg">{meal.name}</h3>
																<div className="flex gap-2 mt-1">
																	<Badge variant="outline">{meal.calories} kcal</Badge>
																	<span className="text-sm text-muted-foreground">
																		{formatTimeDisplay(meal.time)}
																	</span>
																</div>
															</div>
															<div className="flex gap-2">
																<Button
																	variant="ghost"
																	size="icon"
																	onClick={() => handleEdit(meal)}
																>
																	<PencilIcon size={16} />
																</Button>
																<Button
																	variant="ghost"
																	size="icon"
																	className="text-destructive hover:text-destructive"
																	onClick={() => handleDelete(meal.id)}
																>
																	<Trash2Icon size={16} />
																</Button>
															</div>
														</div>
													</div>
												</div>
											</Card>
										))}
									</div>
								</ScrollArea>
							) : (
								<div className="text-center py-10 text-muted-foreground">
									No meals added for today
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{editingMeal ? "Edit Meal" : "Add New Meal"}</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Meal Name</Label>
								<Input
									id="name"
									placeholder="Enter meal name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="calories">Calories</Label>
								<Input
									id="calories"
									placeholder="Enter calories"
									type="number"
									value={calories}
									onChange={(e) => setCalories(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label>Date & Time</Label>
								<div className="flex flex-col space-y-2">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"justify-start text-left font-normal",
													!date && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date ? format(date, "PPP") : "Pick a date"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={date}
												onSelect={(newDate) => {
													if (newDate) {
														const currentDate = new Date(time);
														newDate.setHours(
															currentDate.getHours(),
															currentDate.getMinutes()
														);
														setDate(newDate);
														setTime(newDate.toISOString());
													}
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>

									<Input
										type="time"
										value={format(new Date(time), "HH:mm")}
										onChange={(e) => {
											const [hours, minutes] = e.target.value.split(":");
											const newDate = new Date(date);
											newDate.setHours(parseInt(hours), parseInt(minutes));
											setTime(newDate.toISOString());
										}}
									/>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">
								{editingMeal ? "Update Meal" : "Add Meal"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default MealsPage;