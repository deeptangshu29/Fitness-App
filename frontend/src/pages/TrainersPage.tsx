import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTrainers, createTrainer, updateTrainer, deleteTrainer } from "@/api";
import { Plus, Pencil, Trash2, X, Check, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster, toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

type Trainer = {
	id: number;
	name: string;
	specialization: string;
};

const TrainersPage = () => {
	const [trainers, setTrainers] = useState<Trainer[]>([]);
	const [name, setName] = useState("");
	const [specialization, setSpecialization] = useState("");
	const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);

	const loadTrainers = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await fetchTrainers();
			setTrainers(res.data);
		} catch (err) {
			console.error("Error fetching trainers:", err);
			toast.error("Failed to load trainers. Please try again.");
		} finally {
			setIsLoading(false);
			setInitialLoadComplete(true);
		}
	}, []);

	useEffect(() => {
		loadTrainers();
	}, [loadTrainers]);

	const handleOpenDialog = (trainer?: Trainer) => {
		if (trainer) {
			setEditingTrainer(trainer);
			setName(trainer.name);
			setSpecialization(trainer.specialization);
		} else {
			setEditingTrainer(null);
			setName("");
			setSpecialization("");
		}
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setEditingTrainer(null);
		setName("");
		setSpecialization("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (editingTrainer) {
				await updateTrainer(editingTrainer.id, { name, specialization });
				toast.success(`${name} has been successfully updated.`);
			} else {
				await createTrainer({ name, specialization });
				toast.success(`${name} has been successfully added.`);
			}
			handleCloseDialog();
			await loadTrainers();
		} catch (err) {
			console.error("Error saving trainer:", err);
			toast.error(`Failed to ${editingTrainer ? "update" : "add"} trainer.`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (trainerId: number, trainerName: string) => {
		setIsLoading(true);
		try {
			await deleteTrainer(trainerId);
			toast.success(`${trainerName} has been removed.`);
			await loadTrainers();
		} catch (err) {
			console.error("Error deleting trainer:", err);
			toast.error("Failed to delete trainer.");
		} finally {
			setIsLoading(false);
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	return (
		<div className="container py-8 max-w-4xl mx-auto">
			<Toaster />

			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Trainers</h2>
					<p className="text-muted-foreground mt-1">
						Manage your fitness trainers and their specializations
					</p>
				</div>
				<Button onClick={() => handleOpenDialog()} className="gap-2">
					<Plus size={16} />
					Add Trainer
				</Button>
			</div>

			<Separator className="my-6" />

			{!initialLoadComplete ? (
				<Card>
					<CardContent className="flex justify-center py-8">
						<div className="text-center">
							<div className="text-muted-foreground">Loading trainers...</div>
						</div>
					</CardContent>
					<CardFooter className="flex justify-center pb-6">
						<Button variant="outline" disabled className="gap-2">
							<RefreshCw className="h-4 w-4 animate-spin" />
							Loading...
						</Button>
					</CardFooter>
				</Card>
			) : trainers.length === 0 ? (
				<Card className="border-dashed">
					<CardContent className="pt-6 text-center">
						<div className="text-muted-foreground">
							No trainers found. Add your first trainer to get started.
						</div>
					</CardContent>
					<CardFooter className="flex justify-center pb-6">
						<Button
							variant="outline"
							onClick={() => handleOpenDialog()}
							className="gap-2"
						>
							<Plus size={16} />
							Add Trainer
						</Button>
					</CardFooter>
				</Card>
			) : (
				<ScrollArea className="h-[calc(100vh-240px)]">
					<div className="grid gap-4">
						{trainers.map((trainer) => (
							<Card key={trainer.id} className="overflow-hidden">
								<CardHeader className="py-4 px-6 flex flex-row items-center gap-4">
									<Avatar className="h-12 w-12">
										<AvatarFallback className="bg-primary/10 text-primary">
											{getInitials(trainer.name)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<CardTitle className="text-lg">{trainer.name}</CardTitle>
										<div className="flex items-center gap-2 mt-1">
											<Badge variant="outline">{trainer.specialization}</Badge>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleOpenDialog(trainer)}
										>
											<Pencil size={16} />
											<span className="sr-only">Edit</span>
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(trainer.id, trainer.name)}
											className="text-destructive hover:text-destructive"
										>
											<Trash2 size={16} />
											<span className="sr-only">Delete</span>
										</Button>
									</div>
								</CardHeader>
							</Card>
						))}
					</div>
				</ScrollArea>
			)}

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingTrainer ? "Edit Trainer" : "Add New Trainer"}
						</DialogTitle>
						<DialogDescription>
							{editingTrainer
								? "Update the trainer details below."
								: "Fill in the information to add a new trainer."}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="specialization">Specialization</Label>
							<Input
								id="specialization"
								placeholder="Strength Training"
								value={specialization}
								onChange={(e) => setSpecialization(e.target.value)}
								required
							/>
						</div>

						<DialogFooter className="gap-2 sm:gap-0 mt-4">
							<Button
								type="button"
								variant="outline"
								onClick={handleCloseDialog}
								className="gap-2"
								disabled={isLoading}
							>
								<X size={16} />
								Cancel
							</Button>
							<Button type="submit" className="gap-2" disabled={isLoading}>
								<Check size={16} />
								{editingTrainer ? "Update Trainer" : "Add Trainer"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default TrainersPage;