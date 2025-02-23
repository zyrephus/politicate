"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PostalCodeFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPostalCode: string;
  onUpdate: (newCode: string) => void;
}

export function PostalCodeForm({
  isOpen,
  onOpenChange,
  currentPostalCode,
  onUpdate,
}: PostalCodeFormProps) {
  const [newPostalCode, setNewPostalCode] = useState(currentPostalCode);
  const [error, setError] = useState("");

  const validatePostalCode = (code: string) => {
    const formattedCode = code.replace(/\s+/g, "").toUpperCase();
    const postalCodeRegex =
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/;
    return postalCodeRegex.test(formattedCode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedCode = newPostalCode.replace(/\s+/g, "").toUpperCase();

    if (!validatePostalCode(formattedCode)) {
      setError("Please enter a valid Canadian postal code");
      return;
    }

    onUpdate(formattedCode);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Postal Code</DialogTitle>
          <DialogDescription>
            Enter your postal code to get localized political news.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              value={newPostalCode}
              onChange={(e) => {
                setNewPostalCode(e.target.value);
                setError("");
              }}
              maxLength={7}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button type="submit" className="w-full">
            Update Postal Code
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
