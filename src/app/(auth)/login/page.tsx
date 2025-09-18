import UserAuthForm from "@/components/auth/user-auth-form";
import type { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Authentication forms built using the components.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserAuthForm type={"login"} />
    </Suspense>
  );
}
