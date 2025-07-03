import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { fetchGoals, createGoal, updateGoal, deleteGoal } from "@/api";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon, TrashIcon, PencilIcon, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Goal = {
	id: string;
	targetWeight: number;
	targetDate: string;
};

type GoalPayload = {
	targetWeight: number;
	targetDate: string;
};

const GoalsPage = () => {
	const [goals, setGoals] = useState<Goal[]>([]);
	const [targetWeight, setTargetWeight] = useState("");
	const [targetDate, setTargetDate] = useState("");
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const loadGoals = async () => {
		try {
			setIsLoading(true);
			const res = await fetchGoals();
			setGoals(res.data);
		} catch (err) {
			console.error("Error fetching goals:", err);
			toast.error("Failed to load your fitness goals");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadGoals();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const payload: GoalPayload = {
			targetWeight: Number(targetWeight),
			targetDate,
		};

		setIsLoading(true);
		try {
			if (editingGoal) {
				await updateGoal(editingGoal.id, payload);
				setEditingGoal(null);
				toast.success("Goal updated successfully");
			} else {
				await createGoal(payload);
				toast.success("New goal created");
			}
			setTargetWeight("");
			setTargetDate("");
			setIsFormOpen(false);
			loadGoals();
		} catch (err) {
			console.error("Error saving goal:", err);
			toast.error(editingGoal ? "Failed to update goal" : "Failed to create goal");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (goal: Goal) => {
		setEditingGoal(goal);
		setTargetWeight(goal.targetWeight.toString());
		setTargetDate(goal.targetDate);
		setIsFormOpen(true);
	};

	const handleDelete = async (id: string) => {
		try {
			setIsLoading(true);
			await deleteGoal(id);
			toast.success("Goal deleted");
			loadGoals();
		} catch (err) {
			console.error("Error deleting goal:", err);
			toast.error("Failed to delete goal");
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setTargetWeight("");
		setTargetDate("");
		setEditingGoal(null);
	};

	const openNewGoalForm = () => {
		resetForm();
		setIsFormOpen(true);
	};

	// Sort goals by date (soonest first)
	const sortedGoals = [...goals].sort((a, b) =>
		new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
	);

	// Split goals into active and achieved (for future implementation)
	const today = new Date();
	const activeGoals = sortedGoals.filter(goal => new Date(goal.targetDate) >= today);
	const pastGoals = sortedGoals.filter(goal => new Date(goal.targetDate) < today);

	return (
		<div className="container mx-auto py-8 px-4">
			<Toaster position="top-right" closeButton />

			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-2">
					<Target className="h-6 w-6 text-primary" />
					<h1 className="text-3xl font-bold tracking-tight">Fitness Goals</h1>
				</div>
				<Button onClick={openNewGoalForm} className="flex items-center gap-1">
					<PlusIcon className="h-4 w-4" /> New Goal
				</Button>
			</div>

			<Tabs defaultValue="active" className="w-full">
				<TabsList className="mb-6">
					<TabsTrigger value="active" className="flex items-center gap-2">
						Active
						{activeGoals.length > 0 && (
							<Badge variant="secondary" className="ml-1">{activeGoals.length}</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="past" className="flex items-center gap-2">
						Past
						{pastGoals.length > 0 && (
							<Badge variant="secondary" className="ml-1">{pastGoals.length}</Badge>
						)}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="active">
					{isLoading && activeGoals.length === 0 ? (
						<div className="text-center py-12">
							<div className="animate-pulse flex flex-col items-center">
								<div className="h-6 w-24 bg-muted rounded mb-2"></div>
								<div className="h-4 w-48 bg-muted rounded"></div>
							</div>
						</div>
					) : activeGoals.length === 0 ? (
						<div className="text-center py-12 bg-muted/30 rounded-lg">
							<h3 className="text-lg font-medium">No active goals</h3>
							<p className="text-muted-foreground">Create a new fitness goal to get started</p>
							<Button onClick={openNewGoalForm} variant="outline" className="mt-4">
								<PlusIcon className="h-4 w-4 mr-2" /> Add your first goal
							</Button>
						</div>
					) : (
						<ScrollArea className="h-[calc(100vh-280px)] pr-4">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{activeGoals.map((goal) => (
									<GoalCard
										key={goal.id}
										goal={goal}
										onEdit={handleEdit}
										onDelete={handleDelete}
									/>
								))}
							</div>
						</ScrollArea>
					)}
				</TabsContent>

				<TabsContent value="past">
					{isLoading && pastGoals.length === 0 ? (
						<div className="text-center py-12">
							<div className="animate-pulse flex flex-col items-center">
								<div className="h-6 w-24 bg-muted rounded mb-2"></div>
								<div className="h-4 w-48 bg-muted rounded"></div>
							</div>
						</div>
					) : pastGoals.length === 0 ? (
						<div className="text-center py-12 bg-muted/30 rounded-lg">
							<h3 className="text-lg font-medium">No past goals</h3>
							<p className="text-muted-foreground">Your completed goals will appear here</p>
						</div>
					) : (
						<ScrollArea className="h-[calc(100vh-280px)] pr-4">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{pastGoals.map((goal) => (
									<GoalCard
										key={goal.id}
										goal={goal}
										onEdit={handleEdit}
										onDelete={handleDelete}
										isPast
									/>
								))}
							</div>
						</ScrollArea>
					)}
				</TabsContent>
			</Tabs>

			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{editingGoal ? "Update Goal" : "Create New Goal"}</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4 pt-4">
						<div className="space-y-2">
							<label htmlFor="targetWeight" className="text-sm font-medium">
								Target Weight (kg)
							</label>
							<Input
								id="targetWeight"
								placeholder="e.g. 70"
								type="number"
								value={targetWeight}
								onChange={(e) => setTargetWeight(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="targetDate" className="text-sm font-medium">
								Target Date
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-start text-left font-normal",
											!targetDate && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{targetDate ? format(new Date(targetDate), "PPP") : "Select a date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={targetDate ? new Date(targetDate) : undefined}
										onSelect={(date) => date && setTargetDate(format(date, "yyyy-MM-dd"))}
										initialFocus
										disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
									/>
								</PopoverContent>
							</Popover>
						</div>

						<DialogFooter className="mt-6">
							<Button variant="outline" type="button" onClick={() => setIsFormOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : editingGoal ? "Update Goal" : "Create Goal"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

// Separate goal card component for cleaner code
const GoalCard = ({
	goal,
	onEdit,
	onDelete,
	isPast = false
}: {
	goal: Goal;
	onEdit: (goal: Goal) => void;
	onDelete: (id: string) => void;
	isPast?: boolean;
}) => {
	const targetDate = new Date(goal.targetDate);
	const today = new Date();

	// Calculate days remaining
	const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

	// Get status and color
	let statusText = "In Progress";
	let statusColor = "bg-blue-100 text-blue-800";

	if (isPast) {
		statusText = "Expired";
		statusColor = "bg-gray-100 text-gray-800";
	} else if (daysRemaining <= 7) {
		statusText = "Upcoming";
		statusColor = "bg-amber-100 text-amber-800";
	} else if (daysRemaining <= 30) {
		statusText = "Active";
		statusColor = "bg-green-100 text-green-800";
	}

	return (
		<Card className={cn("transition-all duration-300", isPast ? "opacity-75" : "hover:shadow-md")}>
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<CardTitle className="text-xl">{goal.targetWeight} kg</CardTitle>
					<span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
						{statusText}
					</span>
				</div>
			</CardHeader>
			<CardContent className="pb-2">
				<div className="flex items-center text-sm text-muted-foreground mb-2">
					<CalendarIcon className="h-4 w-4 mr-2" />
					<span>{format(targetDate, "PPP")}</span>
				</div>

				{!isPast && (
					<div className="mt-2">
						<span className="text-sm font-medium">
							{daysRemaining === 0 ? "Today" : daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
						</span>
						<div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
							<div
								className={cn(
									"h-full rounded-full",
									daysRemaining <= 7 ? "bg-amber-500" : "bg-primary"
								)}
								style={{ width: isPast ? "100%" : Math.min(100, Math.max(5, 100 - (daysRemaining / 90) * 100)) + "%" }}
							/>
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter className="pt-2">
				<div className="flex justify-end w-full gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-8 px-2 text-xs"
						onClick={() => onEdit(goal)}
					>
						<PencilIcon className="h-3.5 w-3.5 mr-1" /> Edit
					</Button>
					<Button
						variant="destructive"
						size="sm"
						className="h-8 px-2 text-xs"
						onClick={() => onDelete(goal.id)}
					>
						<TrashIcon className="h-3.5 w-3.5 mr-1" /> Delete
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

export default GoalsPage;