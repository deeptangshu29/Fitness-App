// src/pages/SignupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon, PersonIcon, EnvelopeOpenIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { Toaster, toast } from 'sonner';

export default function SignupPage() {
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setIsLoading(true);

		try {
			const res = await fetch('http://localhost:3000/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Signup failed');
			}

			toast.success('Account created successfully!');
			navigate('/login');
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('An unexpected error occurred');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
			<Toaster position="top-right" closeButton />

			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<div className="flex justify-center">
						<div className="bg-primary/10 p-3 rounded-full">
							<PersonIcon className="w-8 h-8 text-primary" />
						</div>
					</div>
					<h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create account</h1>
					<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
						Join us to get started with your journey
					</p>
				</div>

				<Card className="border-none shadow-lg">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
						<CardDescription>Enter your information to create an account</CardDescription>
					</CardHeader>

					<CardContent>
						{error && (
							<Alert variant="destructive" className="mb-6">
								<ExclamationTriangleIcon className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-sm font-medium">
									Full Name
								</Label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<PersonIcon className="h-4 w-4 text-slate-400" />
									</div>
									<Input
										id="name"
										type="text"
										placeholder="John Doe"
										value={name}
										onChange={e => setName(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm font-medium">
									Email
								</Label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<EnvelopeOpenIcon className="h-4 w-4 text-slate-400" />
									</div>
									<Input
										id="email"
										type="email"
										placeholder="name@example.com"
										value={email}
										onChange={e => setEmail(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm font-medium">
									Password
								</Label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<LockClosedIcon className="h-4 w-4 text-slate-400" />
									</div>
									<Input
										id="password"
										type="password"
										placeholder="••••••••"
										value={password}
										onChange={e => setPassword(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
								<p className="text-xs text-slate-500">
									Password must be at least 8 characters
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword" className="text-sm font-medium">
									Confirm Password
								</Label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<LockClosedIcon className="h-4 w-4 text-slate-400" />
									</div>
									<Input
										id="confirmPassword"
										type="password"
										placeholder="••••••••"
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full py-6"
								disabled={isLoading}
							>
								{isLoading ? "Creating account..." : "Create account"}
							</Button>
						</form>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4 border-t pt-4">
						<div className="text-center text-sm">
							<span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
							<a href="/login" className="text-primary hover:text-primary/80 font-medium">
								Sign in
							</a>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}