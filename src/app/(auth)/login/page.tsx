import UserAuthForm from "@/components/auth/user-auth-form";
import Loading from "@/components/ui/loading";
import type { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Authentication forms built using the components.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <UserAuthForm type={"login"} />
    </Suspense>
  );
}
