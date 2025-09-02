import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="pt-5">
      <AppSidebar />
      <main>
        <SidebarTrigger className="h-8 w-8" />
        {children}
      </main>
    </SidebarProvider>
  );
}
