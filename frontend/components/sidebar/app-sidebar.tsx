"use client";

import * as React from "react";
import Image from "next/image";
import { BookOpenCheck, Newspaper, Settings2 } from "lucide-react";
import Link from "next/link";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client";

const data = {
  user: {
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Policy Test",
      url: "",
      icon: BookOpenCheck,
      isActive: true,
      items: [
        {
          title: "Take The Test",
          url: "/home/test",
        },
        {
          title: "Past Tests",
          url: "#",
        },
      ],
    },
    {
      title: "Recent News",
      url: "#",
      icon: Newspaper,
      isActive: true,
      items: [
        {
          title: "Federal",
          url: "#",
        },
        {
          title: "Provincial",
          url: "#",
        },
        {
          title: "Municipal",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{ email: string } | null>(null);

  React.useEffect(() => {
    const client = createClient();

    const fetchUser = async () => {
      const { data, error } = await client.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (data?.user) {
        setUser({
          email: data.user.email || "",
        });
      }
    };

    fetchUser();
  }, []);

  const sidebarData = {
    user: {
      name: "",
      email: user?.email || "guest@example.com",
      avatar: "/default-icon.jpg",
    },
    navMain: [
      {
        title: "Policy Test",
        url: "",
        icon: BookOpenCheck,
        isActive: true,
        items: [
          {
            title: "Take The Test",
            url: "/home/test",
          },
          {
            title: "Past Tests",
            url: "#",
          },
        ],
      },
      {
        title: "Recent News",
        url: "#",
        icon: Newspaper,
        isActive: true,
        items: [
          {
            title: "Municipal",
            url: "/home/municipal",
          },
          {
            title: "Provincial",
            url: "/home/provincial",
          },
          {
            title: "Federal",
            url: "/home/federal",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center">
          <Link href="/home">
            <Image src="/politicate.svg" alt="Politicate Logo" width={40} height={40} priority />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
