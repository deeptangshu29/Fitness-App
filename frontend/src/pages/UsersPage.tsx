import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Pencil, Trash2, Users, UserPlus, RefreshCw, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster, toast } from "sonner";
import {
	fetchUsers,
	createUser,
	updateUser,
	deleteUser,
} from "@/api/index";

type User = {
	id: string;
	name: string;
	email: string;
};

type CreateUserPayload = {
	name: string;
	email: string;
	password: string;
};

const UsersPage = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("list");

	const loadUsers = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await fetchUsers();
			setUsers(res.data);
			toast.success("Users refreshed successfully");
		} catch (err) {
			console.error("Error fetching users:", err);
			setError("Failed to load users. Please try again.");
			toast.error("Failed to refresh users");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (editingUser) {
				await updateUser(editingUser.id, { name, email, ...(password && { password }) });
				toast.success(`${name} has been successfully updated`);
				setEditingUser(null);
				setIsEditDialogOpen(false);
			} else {
				const payload: CreateUserPayload = { name, email, password };
				await createUser(payload);
				toast.success(`${name} has been successfully added`);
			}
			resetForm();
			loadUsers();
		} catch (err) {
			console.error("Error saving user:", err);
			toast.error("Failed to save user. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const confirmDelete = (id: string) => {
		setUserToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!userToDelete) return;

		setIsLoading(true);
		try {
			await deleteUser(userToDelete);
			toast.success("User has been successfully removed");
			loadUsers();
		} catch (err) {
			console.error("Error deleting user:", err);
			toast.error("Failed to delete user");
		} finally {
			setIsDeleteDialogOpen(false);
			setUserToDelete(null);
			setIsLoading(false);
		}
	};

	const handleEdit = (user: User) => {
		setName(user.name);
		setEmail(user.email);
		setPassword("");
		setEditingUser(user);
		setIsEditDialogOpen(true);
	};

	const resetForm = () => {
		setName("");
		setEmail("");
		setPassword("");
		setEditingUser(null);
		setActiveTab("list");
	};

	return (
		<div className="container py-8 mx-auto">
			<Toaster />

			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">User Management</h1>
					<p className="text-muted-foreground mt-1">Add, edit and manage your users</p>
				</div>
				<Button
					onClick={loadUsers}
					variant="outline"
					className="gap-1"
					disabled={isLoading}
				>
					{isLoading ? (
						<RefreshCw className="h-4 w-4 animate-spin" />
					) : (
						<>
							<RefreshCw className="h-4 w-4" />
							Refresh
						</>
					)}
				</Button>
			</div>

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="mb-8"
			>
				<TabsList className="grid w-full md:w-80 grid-cols-2">
					<TabsTrigger value="list" className="flex items-center gap-2">
						<Users className="h-4 w-4" />
						User List
					</TabsTrigger>
					<TabsTrigger
						value="add"
						className="flex items-center gap-2"
						onClick={() => {
							resetForm();
							setActiveTab("add");
						}}
					>
						<UserPlus className="h-4 w-4" />
						Add User
					</TabsTrigger>
				</TabsList>

				<TabsContent value="list" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span>Users</span>
								<Badge variant="outline">{users.length} total</Badge>
							</CardTitle>
							<CardDescription>
								View and manage all users in your system
							</CardDescription>
						</CardHeader>
						<CardContent>
							{users.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Email</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{users.map((user) => (
											<TableRow key={user.id}>
												<TableCell className="font-medium">{user.name}</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<Button
															size="icon"
															variant="ghost"
															onClick={() => handleEdit(user)}
														>
															<Pencil className="h-4 w-4" />
														</Button>
														<Button
															size="icon"
															variant="ghost"
															className="text-destructive hover:text-destructive"
															onClick={() => confirmDelete(user.id)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<Users className="h-12 w-12 text-muted-foreground mb-4" />
									<h3 className="font-semibold text-lg mb-1">No users found</h3>
									<p className="text-muted-foreground mb-4">
										There are no users in the system yet.
									</p>
									<Button onClick={() => setActiveTab("add")}>
										<PlusCircle className="h-4 w-4 mr-2" />
										Add your first user
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="add" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Add New User</CardTitle>
							<CardDescription>
								Fill in the information below to create a new user
							</CardDescription>
						</CardHeader>
						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								<div className="grid gap-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										placeholder="John Doe"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="john@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</div>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									type="button"
									variant="outline"
									onClick={resetForm}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? (
										<>
											<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
											Creating...
										</>
									) : (
										"Create User"
									)}
								</Button>
							</CardFooter>
						</form>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Edit User Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit User</DialogTitle>
						<DialogDescription>
							Update the user's information below
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-name">Name</Label>
								<Input
									id="edit-name"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-email">Email</Label>
								<Input
									id="edit-email"
									type="email"
									placeholder="john@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-password">
									Password <span className="text-sm text-muted-foreground">(leave blank to keep current)</span>
								</Label>
								<Input
									id="edit-password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsEditDialogOpen(false);
									resetForm();
								}}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<>
										<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
										Updating...
									</>
								) : (
									"Update User"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this user? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default UsersPage;