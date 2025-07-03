import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
	Users,
	Dumbbell,
	Apple,
	Target,
	Cloud,
	Briefcase,
	GitGraph,
	ArrowRight,
	Activity
} from "lucide-react";

// Define route configurations with icons and descriptions
const routes = [
	{
		name: "Users",
		path: "/users",
		icon: <Users className="h-5 w-5" />,
		description: "Manage user profiles and accounts",
		color: "bg-blue-100 text-blue-700",
		category: "management"
	},
	{
		name: "Trainers",
		path: "/trainers",
		icon: <Briefcase className="h-5 w-5" />,
		description: "View and assign personal trainers",
		color: "bg-purple-100 text-purple-700",
		category: "management"
	},
	{
		name: "Workouts",
		path: "/workouts",
		icon: <Dumbbell className="h-5 w-5" />,
		description: "Browse and customize workout plans",
		color: "bg-red-100 text-red-700",
		category: "fitness"
	},
	{
		name: "Meals",
		path: "/meals",
		icon: <Apple className="h-5 w-5" />,
		description: "Explore nutrition plans and recipes",
		color: "bg-green-100 text-green-700",
		category: "fitness"
	},
	{
		name: "Goals",
		path: "/goals",
		icon: <Target className="h-5 w-5" />,
		description: "Set and track fitness objectives",
		color: "bg-amber-100 text-amber-700",
		category: "fitness"
	},
	{
		name: "Weather",
		path: "/weather",
		icon: <Cloud className="h-5 w-5" />,
		description: "Check weather for outdoor activities",
		color: "bg-sky-100 text-sky-700",
		category: "tools"
	},
	{
		name: "GraphQL IDE",
		path: "http://localhost:3000/graphiql",
		icon: <GitGraph className="h-5 w-5" />,
		description: "Access GraphQL IDE",
		color: "bg-zinc-100 text-zinc-700",
		category: "tools"
	},
];

type Route = {
	name: string;
	path: string;
	icon: React.ReactNode;
	description: string;
	color: string;
	category: string;
};

const RouteCard = ({ route }: { route: Route }) => {
	return (
		<a href={route.path} className="block group">
			<Card className="h-full overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-primary/50">
				<CardHeader className="flex flex-row items-center gap-4 pb-2">
					<div className={`p-3 rounded-lg ${route.color}`}>
						{route.icon}
					</div>
					<div>
						<CardTitle className="text-lg font-medium">{route.name}</CardTitle>
						<CardDescription className="text-xs uppercase tracking-wide mt-1">
							{route.category}
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					<p className="text-muted-foreground text-sm">{route.description}</p>
				</CardContent>
				<CardFooter className="flex justify-between pt-4">
					<Badge variant="secondary" className="text-xs">
						{route.name.toLowerCase()}
					</Badge>
					<Button variant="ghost" size="sm" className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						Explore <ArrowRight className="h-3 w-3 ml-1" />
					</Button>
				</CardFooter>
			</Card>
		</a>
	);
};
const HomePage = () => {
	return (
		<div className="container mx-auto px-6 py-8 max-w-7xl">
			<div className="mb-12">
				<div className="flex items-center gap-3 mb-4">
					<div className="p-2 rounded-lg bg-primary/10">
						<Activity className="h-6 w-6 text-primary" />
					</div>
					<h1 className="text-4xl font-bold tracking-tight">Fitness Dashboard</h1>
				</div>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<p className="text-muted-foreground text-lg">Welcome back! Track and manage your fitness journey.</p>
				</div>
				<Separator className="my-6" />
			</div>
			
			<Tabs defaultValue="all" className="mb-8">
				<TabsList className="w-full md:w-auto h-[20%] cols-4 mb-8">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="fitness">Fitness</TabsTrigger>
					<TabsTrigger value="management">Management</TabsTrigger>
					<TabsTrigger value="tools">Tools</TabsTrigger>
				</TabsList>
				
				<TabsContent value="all" className="mt-0">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{routes.map((route) => (
							<RouteCard key={route.name} route={route} />
						))}
					</div>
				</TabsContent>

				<TabsContent value="fitness" className="mt-0">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{routes
							.filter((route) => route.category === "fitness")
							.map((route) => (
								<RouteCard key={route.name} route={route} />
							))}
					</div>
				</TabsContent>

				<TabsContent value="management" className="mt-0">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{routes
							.filter((route) => route.category === "management")
							.map((route) => (
								<RouteCard key={route.name} route={route} />
							))}
					</div>
				</TabsContent>

				<TabsContent value="tools" className="mt-0">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{routes
							.filter((route) => route.category === "tools")
							.map((route) => (
								<RouteCard key={route.name} route={route} />
							))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default HomePage;