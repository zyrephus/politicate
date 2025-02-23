"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";
import { NewsItem } from "./types";
import Link from "next/link";
import { useState } from "react";
import { ChatInterface } from "../chat/ChatInterface";

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = !imageError && news.image ? news.image : "/dummy-news.jpg";

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg h-[500px]">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={news.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            priority
            onError={() => setImageError(true)}
          />
        </div>
        <CardHeader>
          <div className="space-y-2">
            <h3 className="font-semibold leading-tight text-lg line-clamp-2">
              {news.title}
            </h3>
            <Badge variant="outline" className="w-fit">
              {news.displayLink}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {news.snippet}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href={news.link} target="_blank" className="w-full">
            <Button className="w-full" variant="outline">
              Read More
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            className="w-full bg-red-500 hover:bg-red-600"
            onClick={() => setIsChatOpen(true)}
          >
            Summarize with AI
            <Sparkles className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      {isChatOpen && (
        <ChatInterface
          onClose={() => setIsChatOpen(false)}
          articleTitle={news.title}
          articleUrl={news.link}
        />
      )}
    </>
  );
}
