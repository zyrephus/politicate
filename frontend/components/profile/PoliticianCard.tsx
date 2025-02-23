import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PoliticianCardProps {
  name: string;
  role: string;
  image: string;
}

export function PoliticianCard({ name, role, image }: PoliticianCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="flex justify-center pt-6">
        <div className="relative w-48 h-64 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform hover:scale-105 rounded-lg"
            priority
          />
        </div>
      </div>
      <CardHeader className="text-center">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </CardHeader>
    </Card>
  );
}
