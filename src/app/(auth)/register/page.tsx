import UserAuthForm from "@/components/auth/user-auth-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Authentication forms built using the components.",
};

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserAuthForm type="register" />
    </Suspense>
  );
}
