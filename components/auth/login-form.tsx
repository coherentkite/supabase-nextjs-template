"use client";

import { FormEvent, useMemo, useState } from "react";
import {
	AlertCircle,
	ArrowRight,
	CircleCheck,
	LockKeyhole,
	Mail,
	ShieldCheck,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type NoticeState = {
	type: "error" | "success";
	message: string;
};

export function LoginForm() {
	const supabase = useMemo(() => createClient(), []);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notice, setNotice] = useState<NoticeState | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);
		setIsSubmitting(true);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setNotice({
				type: "error",
				message: error.message,
			});
			setIsSubmitting(false);
			return;
		}

		setNotice({
			type: "success",
			message: "Signed in successfully. Redirecting...",
		});
		window.location.href = "/";
	};

	return (
		<section className="w-full max-w-md rounded-3xl border border-border-secondary bg-background-elevated p-8 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.95)]">
			<div className="space-y-7">
				<header className="space-y-3">
					<div className="inline-flex items-center gap-2 rounded-full border border-border-secondary bg-background-secondary px-3 py-1.5">
						<ShieldCheck
							aria-hidden="true"
							className="size-3.5 text-text-secondary"
						/>
						<p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">
							Admin Access
						</p>
					</div>
					<h1 className="text-3xl font-semibold tracking-tight text-text-primary">
						Welcome back
					</h1>
					<p className="text-sm leading-relaxed text-text-secondary">
						Sign in to access your Supabase-powered workspace.
					</p>
				</header>

				<form className="space-y-5" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<label
							className="text-xs font-medium uppercase tracking-[0.16em] text-text-tertiary"
							htmlFor="email"
						>
							Email
						</label>
						<div className="flex items-center gap-3 rounded-xl border border-border-secondary bg-background-secondary px-4 py-3 transition-colors duration-200 hover:border-border-hover focus-within:border-border-focus">
							<Mail aria-hidden="true" className="size-4 text-text-tertiary" />
							<input
								autoComplete="email"
								className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
								id="email"
								onChange={(event) => setEmail(event.target.value)}
								placeholder="you@company.com"
								required
								type="email"
								value={email}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label
							className="text-xs font-medium uppercase tracking-[0.16em] text-text-tertiary"
							htmlFor="password"
						>
							Password
						</label>
						<div className="flex items-center gap-3 rounded-xl border border-border-secondary bg-background-secondary px-4 py-3 transition-colors duration-200 hover:border-border-hover focus-within:border-border-focus">
							<LockKeyhole
								aria-hidden="true"
								className="size-4 text-text-tertiary"
							/>
							<input
								autoComplete="current-password"
								className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
								id="password"
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Your password"
								required
								type="password"
								value={password}
							/>
						</div>
					</div>

					{notice ? (
						<p
							className={`rounded-xl border px-3 py-2 text-sm ${
								notice.type === "error"
									? "border-red-500/40 bg-red-500/10 text-red-200"
									: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
							}`}
						>
							<span className="inline-flex items-center gap-2">
								{notice.type === "error" ? (
									<AlertCircle aria-hidden="true" className="size-4 text-red-200" />
								) : (
									<CircleCheck
										aria-hidden="true"
										className="size-4 text-emerald-200"
									/>
								)}
								{notice.message}
							</span>
						</p>
					) : null}

					<button
						className="cursor-pointer flex w-full items-center justify-center rounded-xl border border-border-hover bg-background-secondary px-4 py-3 text-sm font-medium text-text-primary transition-colors duration-200 hover:bg-background-tertiary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
						disabled={isSubmitting}
						type="submit"
					>
						<span className="inline-flex items-center gap-2">
							{isSubmitting ? "Signing in..." : "Sign in"}
							<ArrowRight aria-hidden="true" className="size-4" />
						</span>
					</button>
				</form>
			</div>
		</section>
	);
}
