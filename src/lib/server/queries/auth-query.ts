import { notify } from "@/components/ui/notify";
import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { $globalFetch } from "@/lib/axios";

export class AuthQuery {
  static async register(email: string, password: string) {
    const response = await $globalFetch.post(REQUEST_URLS_V1.REGISTER, {
      email,
      password,
    });

    if (response.status === 200) {
      notify({
        type: "success",
        title: "Đã gửi OTP đến địa chỉ email đăng ký",
        description: "Vui lòng nhập mã OPT để xác thực tài khoản",
      });
    } else {
      notify({
        type: "error",
        title: "Đăng ký thất bại",
        description: "Vui lòng kiểm tra lại thông tin đăng ký",
      });
    }
    return response.data;
  }

  static async verifyEmail(otp: string, token: string) {
    const response = await $globalFetch.patch(
      REQUEST_URLS_V1.VERIFY_EMAIL,
      JSON.stringify({ code: otp }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      notify({
        type: "success",
        title: "Xác thực email thành công",
        description: "Bạn đã có thể đăng nhập vào hệ thống",
      });
      return response.data;
    }
  }

  static async resendVerifyEmail(token: string) {
    const response = await $globalFetch.post(
      REQUEST_URLS_V1.RESEND_VERIFY_EMAIL,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      notify({
        type: "success",
        title: "Đã gửi lại email xác thực",
        description: "Vui lòng kiểm tra hộp thư đến",
      });
    } else {
      notify({
        type: "error",
        title: "Gửi lại email xác thực thất bại",
        description: "Vui lòng thử lại sau",
      });
    }
  }
}
