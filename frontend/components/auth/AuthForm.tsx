import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { login, signup } from "@/app/auth/actions";
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderBox } from "@/components/common/BorderBox";

interface AuthFormProps {
  title: string;
  onSubmit: (email: string, password: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit }) => {
  const [email, setEmail] = useState(");
  const [password, setPassword] = useState(");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = title;
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <BorderBox as="form" onSubmit={handleSubmit} className="flex flex-col gap-4 p-8">
      <Label htmlFor="email">{title}</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Label htmlFor="password">Password</label>
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <div className="flex justify-between gap-2 items-center">
        <Button type="button" onClick={togglePasswordVisibility}>
          {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
        </Button>
        <Link href="/forgot-password">
          <a className="text-xs text-gray-400 hover:underline">Forgot password?</a>
        </Link>
      </div>
      <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
        {title}
      </Button>
    </BorderBox>
  );
};

export default AuthForm;