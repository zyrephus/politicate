import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full border-b">
      <div className="container mx-auto my-2 flex h-16 items-center justify-between px-4">
        <div className="flex items-center relative group">
          <div className="absolute -inset-0.5 bg-red-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Link href="/" className="relative">
            <Image
              src="/politicate.svg"
              alt="Politicate Logo"
              width={60}
              height={60}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost">Sign up</Button>
          <Button>
            Login
            <LogIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
