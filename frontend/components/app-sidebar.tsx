"use client"

import * as React from "react"
import Image from "next/image"
import {
    BookOpenCheck,
    Newspaper,
    Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Policy Test",
            url: "#",
            icon: BookOpenCheck,
            isActive: true,
            items: [
                {
                    title: "Take The Test",
                    url: "/test",
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
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center justify-center">
                    <Image
                        src="/politicate.svg"
                        alt="Politicate Logo"
                        width={40}
                        height={40}
                        priority
                    />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
