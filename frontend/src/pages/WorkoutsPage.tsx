import { useEffect, useState } from "react";
import { Toaster } from "sonner"; // Using Sonner instead of deprecated Toast
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, Clock, Activity, MoreVertical, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	fetchWorkouts,
	createWorkout,
	updateWorkout,
	deleteWorkout,
} from "@/api";

type Workout = {
	id: string;
	type: string;
	duration: number;
};

const WorkoutsPage = () => {
	const [workouts, setWorkouts] = useState<Workout[]>([]);
	const [type, setType] = useState("");
	const [duration, setDuration] = useState<number>(0);
	const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const loadWorkouts = async () => {
		setIsLoading(true);
		try {
			const res = await fetchWorkouts();
			setWorkouts(res.data);
			toast.success("Workouts loaded successfully");
		} catch (err) {
			console.error("Error fetching workouts:", err);
			toast.error("Failed to load workouts");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadWorkouts();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (editingWorkout) {
				await updateWorkout(editingWorkout.id, { type, duration });
				toast.success("Workout updated successfully!");
				setEditingWorkout(null);
			} else {
				await createWorkout({ type, duration });
				toast.success("Workout added successfully!");
			}

			setType("");
			setDuration(0);
			setIsDialogOpen(false);
			loadWorkouts();
		} catch (err) {
			console.error("Error saving workout:", err);
			toast.error("Failed to save workout");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (workout: Workout) => {
		setEditingWorkout(workout);
		setType(workout.type);
		setDuration(workout.duration);
		setIsDialogOpen(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteWorkout(id);
			toast.success("Workout deleted successfully");
			loadWorkouts();
		} catch (err) {
			console.error("Error deleting workout:", err);
			toast.error("Failed to delete workout");
		}
	};

	// Get total workout minutes
	const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);

	// Group workouts by type for stats
	const workoutsByType = workouts.reduce((acc, workout) => {
		acc[workout.type] = (acc[workout.type] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	return (
		<div className="container py-8 max-w-4xl mx-auto">
			<Toaster position="top-right" />

			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Workout Tracker</h1>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => {
							setEditingWorkout(null);
							setType("");
							setDuration(0);
						}}>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add Workout
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>{editingWorkout ? "Edit Workout" : "Add New Workout"}</DialogTitle>
							<DialogDescription>
								{editingWorkout
									? "Make changes to your workout here."
									: "Enter your workout details below."}
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit}>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="type">Workout Type</Label>
									<Input
										id="type"
										placeholder="e.g., Running, Cycling, Yoga"
										value={type}
										onChange={(e) => setType(e.target.value)}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="duration">Duration (minutes)</Label>
									<Input
										id="duration"
										type="number"
										placeholder="Duration in minutes"
										value={duration}
										onChange={(e) => setDuration(Number(e.target.value))}
										min={1}
										required
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									{editingWorkout ? "Update Workout" : "Save Workout"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Tabs defaultValue="workouts">
				<TabsList className="grid w-full grid-cols-2 mb-6">
					<TabsTrigger value="workouts">My Workouts</TabsTrigger>
					<TabsTrigger value="stats">Summary</TabsTrigger>
				</TabsList>

				<TabsContent value="workouts" className="mt-0">
					{isLoading ? (
						<div className="flex justify-center items-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : workouts.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center p-12 text-center">
								<Activity className="h-12 w-12 text-muted-foreground mb-4" />
								<h3 className="text-xl font-medium">No workouts found</h3>
								<p className="text-muted-foreground mt-2">
									Add your first workout to get started.
								</p>
								<Button
									className="mt-6"
									onClick={() => setIsDialogOpen(true)}
								>
									<PlusCircle className="mr-2 h-4 w-4" />
									Add Your First Workout
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4 sm:grid-cols-2">
							{workouts.map((workout) => (
								<Card key={workout.id} className="p-0  overflow-hidden">
									<CardHeader className="bg-muted/50 p-6">
										<div className="flex justify-between items-start">
											<div>
												<Badge variant="outline" className="mb-2">
													{workout.type}
												</Badge>
												<CardTitle className="text-lg ml-1">
													{workout.duration} minutes
												</CardTitle>
											</div>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="h-8 w-8">
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem onClick={() => handleEdit(workout)}>
														<Edit className="mr-2 h-4 w-4" />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-destructive focus:text-destructive"
														onClick={() => handleDelete(workout.id)}
													>
														<Trash2 className="mr-2 h-4 w-4" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</CardHeader>
									<CardContent className="p-4">
										<div className="flex items-center text-muted-foreground">
											<Clock className="mr-2 h-4 w-4" />
											<span>{workout.duration} minutes of exercise</span>
										</div>
									</CardContent>
									<CardFooter className="bg-card p-4 pt-0 border-t">
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												className="w-full"
												onClick={() => handleEdit(workout)}
											>
												<Edit className="mr-2 h-4 w-4" />
												Edit
											</Button>
											<Button
												variant="destructive"
												size="sm"
												className="w-full"
												onClick={() => handleDelete(workout.id)}
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</Button>
										</div>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value="stats">
					<div className="grid gap-4 sm:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Total Exercise Time</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-center py-8 text-4xl font-bold">
									{totalDuration} <span className="ml-2 text-muted-foreground text-lg">minutes</span>
								</div>
								<div className="text-center text-muted-foreground">
									Across {workouts.length} workout sessions
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Workout Types</CardTitle>
							</CardHeader>
							<CardContent>
								{Object.keys(workoutsByType).length > 0 ? (
									<div className="space-y-4">
										{Object.entries(workoutsByType).map(([type, count]) => (
											<div key={type} className="flex items-center justify-between">
												<div className="flex items-center">
													<Activity className="h-4 w-4 mr-2 text-primary" />
													<span>{type}</span>
												</div>
												<Badge variant="secondary">{count} workouts</Badge>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-8 text-muted-foreground">
										No workout data to display
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default WorkoutsPage;