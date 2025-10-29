"use client";
import React from "react";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

const ProtectedRote = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
  } else if (user?.roles != "Admin") {
    router.push("/");
  }
  return <div>{children}</div>;
};

export default ProtectedRote;
