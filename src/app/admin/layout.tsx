"use client";

import React from "react";
import dynamic from "next/dynamic";

const AuthProvider = dynamic(
  () =>
    import("@/lib/supabase/auth-context").then((mod) => mod.AuthProvider),
  { ssr: false }
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
