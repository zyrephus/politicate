"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ChatInterfaceProps {
  onClose: () => void;
  articleTitle: string;
  articleUrl: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface({
  onClose,
  articleTitle,
  articleUrl,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize chat with article summary
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await fetch("http://localhost:8000/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ req: articleUrl }),
        });

        const data = await response.json();
        const summary = data.response[data.response.length - 1].content;

        setMessages([
          {
            role: "assistant",
            content: summary,
          },
        ]);
      } catch (error) {
        console.error("Error fetching summary:", error);
        setMessages([
          {
            role: "assistant",
            content: `Hello! I'm here to help you understand the article "${articleTitle}". What would you like to know?`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [articleUrl, articleTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Format context for the API
    const context = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/askChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: context,
          user_input: userMessage,
        }),
      });

      const data = await response.json();
      const aiResponse = data.response[data.response.length - 1].content;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg h-[600px] flex flex-col">
        <CardHeader className="flex flex-col p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">AI Chat Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about the article
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Link
            href={articleUrl}
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit"
          >
            <ExternalLink className="h-3 w-3" />
            {articleTitle}
          </Link>
        </CardHeader>

        <CardContent className="flex-1 p-4 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-300px)] max-h-[400px] pr-4">
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                      message.role === "user"
                        ? "bg-red-500 text-white"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
