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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validatePostalCode = (code: string) => {
    const formattedCode = code.replace(/\s+/g, "").toUpperCase();
    const postalCodeRegex =
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/;
    return postalCodeRegex.test(formattedCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formattedCode = newPostalCode.replace(/\s+/g, "").toUpperCase();

    if (!validatePostalCode(formattedCode)) {
      setError("Please enter a valid Canadian postal code");
      setIsSubmitting(false);
      return;
    }

    try {
      await onUpdate(formattedCode);
      onOpenChange(false);
      // Refresh the page
      router.refresh();
      // Force a hard reload to ensure fresh data
      window.location.reload();
    } catch (error) {
      setError("Failed to update postal code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              placeholder="A1A 1A1"
              value={newPostalCode}
              onChange={(e) => {
                setNewPostalCode(e.target.value);
                setError("");
              }}
              maxLength={7}
              disabled={isSubmitting}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Postal Code"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
