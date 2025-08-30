"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusCircle,
  Settings,
  BarChart3,
  Wallet,
  Users,
  HelpCircle,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUserStore } from "@/app/state/user";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useUserStore();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const mainMenuItems =
    user.role === "Government"
      ? [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
          },
          {
            title: "Subsidies",
            url: "/dashboard/subsidies",
            icon: BarChart3,
          },
          {
            title: "Add Subsidy",
            url: "/dashboard/add-subsidy",
            icon: PlusCircle,
          },
          {
            title: "Producers",
            url: "/dashboard/producers",
            icon: Wallet,
          },
          {
            title: "Oracles",
            url: "/dashboard/oracles",
            icon: Users,
          },
        ]
      : user.role === "Applicant"
      ? [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
          },
          {
            title: "Subsidies",
            url: "/dashboard/subsidies",
            icon: BarChart3,
          },
        ]
      : user.role === "Oracle"
      ? [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
          },
          {
            title: "Subsidies",
            url: "/dashboard/subsidies",
            icon: BarChart3,
          },
        ]
      : [];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">HT</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">HydroTrust</span>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              {user.address && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    disconnect();
                    router.push("/dashboard");
                  }}
                >
                  <LogOut />
                  <span>Sign Out</span>
                </Button>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Connected to Ethereum</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
