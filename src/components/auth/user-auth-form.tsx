"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { notify } from "../ui/notify";
import { signIn } from "next-auth/react";
import { AuthQuery } from "@/lib/server/queries/auth-query";
import { Spin } from "antd";

const loginSchema = z.object({
  email: z
    .string()
    .email("Vui lòng nhập email hợp lệ")
    .min(1, "Email là bắt buộc"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự"),
});

// Schema cho register
const registerSchema = z
  .object({
    email: z
      .string()
      .email("Vui lòng nhập email hợp lệ")
      .min(1, "Email là bắt buộc"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu không được quá 50 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function UserAuthForm({
  type = "login",
}: {
  type?: "login" | "register";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const isLogin = type === "login";
  const title = isLogin ? "Chào mừng trở lại" : "Tạo tài khoản mới";
  const subtitle = isLogin
    ? "Đăng nhập vào tài khoản của bạn"
    : "Tham gia cùng chúng tôi ngay hôm nay";
  const submitText = isLogin ? "Đăng nhập" : "Tạo tài khoản";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(isLogin ? {} : { confirmPassword: "" }),
    },
  });

  async function onSubmit(values: LoginFormData | RegisterFormData) {
    if (isLoadingSubmit) return;

    try {
      setIsLoadingSubmit(true);
      if (type === "login") {
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        })
          .then((res) => {
            if (res?.status === 200) {
              notify({
                title: "Đăng nhập thành công",
                description: "Chào mừng bạn đã trở lại",
                type: "success",
              });
              const callbackUrl = searchParams.get("callbackUrl") || "/";
              router.push(callbackUrl);
            } else {
              notify({
                title: "Đăng nhập thất bại",
                description: "email hoặc mật khẩu không đúng, vui lòng thử lại",
              });
            }
          })
          .catch((error) => {
            console.error("Login error:", error);
            let msg = "";
            switch (error?.response?.data?.message) {
              case "Incorrect email or password":
                msg = "email hoặc mật khẩu không đúng, vui lòng thử lại";
                break;
              default:
                msg = "Vui lòng kiểm tra lại thông tin đăng nhập";
                break;
            }
            notify({
              title: "Đăng nhập thất bại",
              description: msg,
              type: "error",
            });
          })
          .finally(() => {
            setIsLoadingSubmit(false);
          });
      } else {
        const result = await AuthQuery.register(values.email, values.password);
        localStorage.setItem(
          "REGISTER_TOKEN",
          JSON.stringify(result?.tokens?.access?.token)
        );
        router.push("/register/otp");
      }
    } catch (error) {
      if (!isLogin) {
        notify({
          title: "Email đã tồn tại",
          description: "Vui lòng kiểm tra lại thông tin đăng ký",
          type: "error",
        });
      } else {
        notify({
          title: "Có lỗi xảy ra",
          description: "Vui lòng thử lại sau",
          type: "error",
        });
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  }

  return (
    <div className="flex from-slate-900 to-slate-900 items-center justify-center p-4 w-full h-[90vh]">
      <div className="w-full max-w-md ">
        <div className="bg-white backdrop-blur-xl rounded-3xl p-8  border shadow-2xl">
          <div className="text-center mb-8 text-black">
            <h1 className="text-3xl font-bold  mb-2">{title}</h1>
            <p className="">{subtitle}</p>
          </div>

          <div className="space-y-6 text-black">
            <div className="space-y-2 ">
              <label htmlFor="email" className="text-sm font-medium block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailOutlined className="h-5 w-5 " />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Nhập tài khoản của bạn"
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl  placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200
                    ${
                      errors.email
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  {...register("email")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium ">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockOutlined className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-xl  placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200
                    ${
                      errors.password
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  {...register("password")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeInvisibleOutlined className="h-5 w-5" />
                  ) : (
                    <EyeOutlined className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium block"
                >
                  Nhật lại mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockOutlined className="h-5 w-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu của bạn"
                    className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-xl  placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200
                    ${
                      "confirmPassword" in errors && errors.confirmPassword
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/20 hover:border-white/40"
                    }`}
                    {...register("confirmPassword")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(onSubmit)();
                      }
                    }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeInvisibleOutlined className="h-5 w-5" />
                    ) : (
                      <EyeOutlined className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {"confirmPassword" in errors && errors.confirmPassword && (
                  <p className="text-red-400 text-sm flex items-center">
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm -400 hover:-300 transition-colors font-medium"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="w-full py-3 border border-white/20 px-4 hover:from-white-700 hover:to-pink-700 
                 font-semibold rounded-xl  transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed  shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-white-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Spin
                    className="px-4 py-2"
                    indicator={<LoadingOutlined spin />}
                  />
                  Đang xử lý...
                </div>
              ) : (
                submitText
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent ">
                  Hoặc {isLogin ? "đăng nhập" : "đăng ký"} với
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 
                  rounded-xl transition-all duration-200 hover:border-white/40 group"
                onClick={() => signIn("facebook")}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#1877F2"
                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 16.99 22 12z"
                  />
                </svg>
                <span data-v-7e956144="" className="text-base-16-19 -50 ml-2">
                  Facebook
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 
                  rounded-xl transition-all duration-200 hover:border-white/40 group"
                onClick={() => signIn("google")}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className=" text-sm font-medium">Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-black">
            <p className=" text-sm">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="-400 hover:text-purple-300 font-semibold transition-colors"
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
