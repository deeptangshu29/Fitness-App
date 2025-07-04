import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Dumbbell,
	Utensils,
	Users,
	Target,
	CloudSun,
	LogOut,
	ChevronLeft,
	ActivitySquare,
	User,
} from "lucide-react";
import { useAuth } from "@/components/useAuth";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Navigation data
const navLinks = [
	{ name: "Dashboard", path: "/", icon: LayoutDashboard },
	{ name: "Users", path: "/users", icon: Users },
	{ name: "Workouts", path: "/workouts", icon: Dumbbell },
	{ name: "Meals", path: "/meals", icon: Utensils },
	{ name: "Goals", path: "/goals", icon: Target },
	{ name: "Weather", path: "/weather", icon: CloudSun },
];

export default function RootLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const location = useLocation();
	const { logout } = useAuth();

	const getCurrentPageName = () => {
		const currentPath = location.pathname;
		if (currentPath === "/") return "Dashboard";
		const currentNav = navLinks.find((link) => link.path === currentPath);
		return currentNav ? currentNav.name : "";
	};

	const handleLogout = () => {
		logout();
	};

	// Fitt.FF Logo Component
	const FittFFLogo = ({ collapsed = false }) => {
		return collapsed ? (
			<img
				src="/favicon.svg"
				alt="Fitt.FF"
				className="w-10 h-10 rounded-md shadow-sm mx-auto"
			/>
		) : (
			<div className="flex items-center gap-2">
				<img
					src="/favicon.svg"
					alt="Fitt.FF"
					className="w-8 h-8 rounded-md shadow-sm"
				/>
				<span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
					Fitt.FF
				</span>
			</div>
		);
	};

// Mobile Navigation Item Component
type MobileNavItemProps = {
	name: string;
	path: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
const MobileNavItem = ({ name, path, icon: Icon }: MobileNavItemProps) => {
	const handleClick = () => {
		setMobileMenuOpen(false); // Close mobile menu when item is clicked
	};

	const isActive = location.pathname === path;
	return (
		<Link to={path} className="block" onClick={handleClick}>
			<div
				className={cn(
					"flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
					"hover:bg-primary/5",
					isActive
						? "bg-primary/10 text-primary font-medium shadow-sm"
						: "text-slate-500 hover:text-primary"
				)}
			>
				<Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
				<span className="text-sm">{name}</span>
				{isActive && (
					<div className="ml-auto h-5 w-5 flex items-center justify-center rounded-full bg-primary/10">
						<ActivitySquare className="h-3 w-3 text-primary" />
					</div>
				)}
			</div>
		</Link>
	);
};

// Navigation Item Component
type NavItemProps = {
	name: string;
	path: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
const NavItem = ({ name, path, icon: Icon }: NavItemProps) => {
	const isActive = location.pathname === path;

	return (
		<Link to={path} className="block">
			<div
				className={cn(
					"flex items-center gap-3 rounded-lg transition-all",
					"hover:bg-primary/5 group",
					isActive
						? "bg-primary/10 text-primary font-medium shadow-sm"
						: "text-gray-500 hover:text-primary",
					sidebarOpen ? "px-3 py-2.5" : "p-3 justify-center"
				)}
			>
				<Icon className={cn(
					"h-5 w-5 flex-shrink-0",
					isActive ? "text-primary" : "text-gray-400 group-hover:text-primary"
				)} />

				{sidebarOpen && <span className="text-sm">{name}</span>}

				{!sidebarOpen && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="sr-only">{name}</span>
							</TooltipTrigger>
							<TooltipContent side="right" className="ml-1 bg-white shadow-md">
								{name}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}

				{isActive && sidebarOpen && (
					<div className="ml-auto h-5 w-5 flex items-center justify-center rounded-full bg-primary/10">
						<ActivitySquare className="h-3 w-3 text-primary" />
					</div>
				)}
			</div>
		</Link>
	);
};

return (
	<div className="flex h-screen w-screen bg-slate-50/50">
		{/* Desktop sidebar */}
		<aside
			className={cn(
				"hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out",
				sidebarOpen ? "w-64" : "w-20"
			)}
		>
			{/* Logo */}
			<div className={cn(
				"flex h-16 items-center border-b border-slate-100 relative",
				sidebarOpen ? "px-4 justify-between" : "px-2 justify-center"
			)}>
				{sidebarOpen ? (
					<>
						<FittFFLogo collapsed={false} />
						<Button
							variant="ghost"
							size="icon"
							className="text-slate-400 hover:text-primary hover:bg-primary/5"
							onClick={() => setSidebarOpen(false)}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
					</>
				) : (
					<Button
						variant="ghost"
						size="icon"
						className="w-full h-full flex items-center justify-center"
						onClick={() => setSidebarOpen(true)}
					>
						<FittFFLogo collapsed={true} />
					</Button>
				)}
			</div>

			{/* Navigation links */}
			<div className="flex-1 overflow-y-auto py-6 px-2">
				<nav className="space-y-1">
					{navLinks.map((link) => (
						<NavItem key={link.name} {...link} />
					))}
				</nav>
			</div>

			{/* User section at bottom */}
			<div className={cn(
				"border-t border-slate-100",
				sidebarOpen ? "p-4" : "p-2 flex justify-center"
			)}>
				{sidebarOpen ? (
					<Button
						variant="outline"
						size="sm"
						className="w-full justify-start text-slate-600 border-slate-200 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
						onClick={handleLogout}
					>
						<LogOut className="h-4 w-4 mr-2" />
						Logout
					</Button>
				) : (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-slate-500 hover:bg-primary/5 hover:text-primary"
									onClick={handleLogout}
								>
									<LogOut className="h-5 w-5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right" className="ml-1 bg-white">
								Logout
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		</aside>

		{/* Main Content */}
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Header */}
			<header className="border-b border-slate-200 bg-white">
				<div className="flex h-16 items-center px-4 md:px-6">
					{/* Mobile menu button */}
					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="lg:hidden mr-4"
							>
								<img
									src="/favicon.svg"
									alt="Menu"
									className="h-5 w-5"
								/>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0 w-64">
							{/* Mobile sidebar header */}
							<div className="flex h-16 items-center border-b border-slate-100 px-4">
								<FittFFLogo />
							</div>
							{/* Mobile sidebar navigation */}
							<div className="flex-1 overflow-y-auto py-6 px-3">
								<nav className="space-y-1">
									{navLinks.map((link) => (
										<MobileNavItem key={link.name} {...link} />
									))}
								</nav>
							</div>
							{/* Mobile sidebar logout */}
							<div className="p-4 border-t border-slate-100 mt-auto">
								<Button
									variant="outline"
									size="sm"
									className="w-full justify-start text-slate-600 border-slate-200 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
									onClick={() => {
										handleLogout();
										setMobileMenuOpen(false);
									}}
								>
									<LogOut className="h-4 w-4 mr-2" />
									Logout
								</Button>
							</div>
						</SheetContent>
					</Sheet>

					{/* Page title */}
					<div className="flex items-center gap-2">
						<h2 className="text-lg font-medium text-slate-800">{getCurrentPageName()}</h2>
					</div>

					{/* User menu */}
					<div className="ml-auto flex items-center gap-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="text-slate-500 hover:bg-primary/5 hover:text-primary">
									<User className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56 mt-1">
								<DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
									<LogOut className="mr-2 h-4 w-4" />
									<span>Logout</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			{/* Page Content */}
			<main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
				<div className="mx-auto max-w-7xl">
					<div className="p-6">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	</div>
);
}