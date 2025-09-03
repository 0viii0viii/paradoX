import { AppSidebar } from "@/components/AppSidebar";
import DragWindowRegion from "@/components/DragWindowRegion";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <DragWindowRegion />
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-background h-full w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
