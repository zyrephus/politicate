import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import cn from '@/lib/utils';
import { login, signup } from '@/app/auth/actions';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthFormProps {
  title: string;
  onSubmit: (email: string, password: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: '-2rem' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '-2rem' }}
      className="flex flex-col gap-4"
    >
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required={true} />

      <Label htmlFor="password">Password</n      <Button type="submit" className="btn-primary">{title}</Button>
    </motion.form>
  );
};

export default AuthForm;