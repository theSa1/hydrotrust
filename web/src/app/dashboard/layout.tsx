"use client";

import React, { useEffect } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "../state/user";
import { useAccount } from "wagmi";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useUserStore();
  const { address } = useAccount();

  useEffect(() => {
    const fetchRole = async () => {
      if (!address) {
        user.resetUser();
        return;
      }
      user.setUser({ address, role: null, isLoading: true, error: null });
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
        if (!res.ok) {
          const data = await res.json();
          user.setUser({
            address,
            role: null,
            isLoading: false,
            error: data.error || "Unknown error",
          });
        } else {
          const data = await res.json();
          user.setUser({
            address,
            role: data.role,
            isLoading: false,
            error: null,
          });
        }
      } catch (e) {
        user.setUser({
          address,
          role: null,
          isLoading: false,
          error: "Failed to authenticate",
        });
      }
    };
    fetchRole();
  }, [address]);

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
