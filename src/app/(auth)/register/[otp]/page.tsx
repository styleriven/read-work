"use client";

import Loading from "@/components/ui/loading";
import { notify } from "@/components/ui/notify";
import { AuthQuery } from "@/lib/server/queries/auth-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  otp: z.string().length(6, "OTP phải có đúng 6 số"),
});

type OtpFormSchemaType = z.infer<typeof formSchema>;

export default function RegisterOtp() {
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [token, setToken] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<OtpFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("REGISTER_TOKEN");
      if (!stored) {
        router.replace("/register");
        return;
      }
      setToken(JSON.parse(stored));
    } catch {
      router.replace("/register");
    }
  }, [router]);

  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    const otpString = newOtp.join("");
    setValue("otp", otpString);
    trigger("otp");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.replace(/\D/g, "").slice(0, 6);

    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));
    trigger("otp");

    const lastIndex = Math.min(digits.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  async function onSubmit(values: OtpFormSchemaType) {
    if (loading) return;
    setLoading(true);
    try {
      await AuthQuery.verifyEmail(values.otp, token);
      router.push("/login");
    } catch (error) {
      notify({
        type: "error",
        title: "Xác thực thất bại",
        description: "Vui lòng kiểm tra lại mã OTP",
      });
    } finally {
      setLoading(false);
    }
  }

  async function resendVerifyEmail() {
    if (loadingResend || countdown > 0) return;
    setLoadingResend(true);
    try {
      await AuthQuery.resendVerifyEmail(token);
      setCountdown(60);
    } catch (error) {
      console.error("Error resending verification email:", error);
      notify({
        type: "error",
        title: "Gửi lại mã OTP thất bại",
        description: "Vui lòng thử lại sau",
      });
    } finally {
      setLoadingResend(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Xác thực email
          </h2>
          <p className="text-gray-600">
            Chúng tôi đã gửi mã xác thực 6 số đến email của bạn. Vui lòng nhập
            mã để tiếp tục.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="flex justify-center space-x-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.otp
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  disabled={loading}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-red-500 text-sm text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loading styleIcon={{ fontSize: 9 }} />
                Đang xác thực...
              </>
            ) : (
              "Xác thực"
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600 mb-2">Không nhận được mã?</p>
            <button
              type="button"
              onClick={resendVerifyEmail}
              disabled={loadingResend || countdown > 0}
              className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {countdown > 0
                ? `Gửi lại sau ${countdown}s`
                : "Gửi lại mã xác thực"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
