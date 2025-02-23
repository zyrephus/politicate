"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, LogOut, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { PostalCodeForm } from "@/components/postal-code-form";

export function NavUser({
  user,
}: {
  user: {
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const [isPostalCodeOpen, setIsPostalCodeOpen] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostalCode = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/getPostal/${user.email}`
        );

        const data = await response.json();
        console.log(data);
        if (data.postalCode) {
          console.log(data.postalCode);
          console.log("postal code found");
          setPostalCode(data.postalCode);
        }
      } catch (error) {
        console.error("Error fetching postal code:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.email) {
      fetchPostalCode();
    }
  }, [user.email]);

  const handlePostalCodeUpdate = async (newCode: string) => {
    try {
      const response = await fetch("http://localhost:8000/postPostal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          postalCode: newCode,
        }),
      });

      if (response.ok) {
        setPostalCode(newCode);
      } else {
        console.error("Failed to update postal code");
      }
    } catch (error) {
      console.error("Error updating postal code:", error);
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={"pfp"} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={"pfp"} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setIsPostalCodeOpen(true)}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Postal Code
                  <span className="ml-auto text-xs text-muted-foreground">
                    {isLoading ? "Loading..." : postalCode || "Not set"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <PostalCodeForm
        isOpen={isPostalCodeOpen}
        onOpenChange={setIsPostalCodeOpen}
        currentPostalCode={postalCode}
        onUpdate={handlePostalCodeUpdate}
      />
    </>
  );
}
