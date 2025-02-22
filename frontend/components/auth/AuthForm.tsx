"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { login, signup } from "@/app/auth/actions";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface AuthFormProps {
  initialFormType?: "login" | "signup";
}

export function AuthForm({ initialFormType = "login" }: AuthFormProps) {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") as "login" | "signup" | null;

  const [formType, setFormType] = useState<"login" | "signup">(
    urlType || initialFormType
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update form type when URL changes
  useEffect(() => {
    if (urlType) {
      setFormType(urlType);
    }
  }, [urlType]);

  const toggleForm = () => {
    const newType = formType === "login" ? "signup" : "login";
    setFormType(newType);
    setError(null);
    setMessage(null);
    // Update URL when toggling
    window.history.pushState({}, "", `/auth?type=${newType}`);
  };

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (formType === "signup") {
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        const { error } = await signup(formData);
        if (error) {
          setError(error);
        } else {
          setMessage("Account created successfully.");
        }
      } else {
        const { error } = await login(formData);
        if (error) {
          setError(error);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
      <div className="mb-8 flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {formType === "login" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {formType === "login"
            ? "Enter your credentials to access your account"
            : "Enter your details to create your account"}
        </p>
      </div>

      <div className="mb-8 flex items-center justify-center">
        <button
          type="button"
          onClick={toggleForm}
          className="relative rounded-full bg-muted p-1"
        >
          <div className="relative z-10 flex">
            <span
              className={cn(
                "inline-flex w-24 items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium",
                formType === "login" && "text-white"
              )}
            >
              Login
            </span>
            <span
              className={cn(
                "inline-flex w-24 items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium",
                formType === "signup" && "text-white"
              )}
            >
              Sign up
            </span>
          </div>
          <div
            className="absolute inset-0 z-0 h-full rounded-full bg-primary transition-transform duration-200"
            style={{
              width: "50%",
              transform: `translateX(${formType === "login" ? "0%" : "100%"})`,
            }}
          />
        </button>
      </div>

      <form action={onSubmit} className="space-y-6">
        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}
        {message && (
          <div className="text-sm text-green-500 text-center">{message}</div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        {formType === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}

                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : formType === "login"
              ? "Sign in"
              : "Create account"}
          </Button>
          <Link
            href="/"
            className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Link>
        </div>
      </form>
    </div>
  );
}
