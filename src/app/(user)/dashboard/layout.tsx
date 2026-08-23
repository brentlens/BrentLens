import React from "react";

export const metadata = {
  title: "BrentLens — Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {children}
    </div>
  );
}