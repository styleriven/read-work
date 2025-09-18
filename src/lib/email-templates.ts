export const templates = [
  {
    type: "emailVerification",
    contents: [
      {
        lang: "vi",
        subject: "Xác nhận địa chỉ email của bạn",
        html: ({ code }: { code: string }) => `
          <p>Xin chào,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã xác nhận dưới đây để hoàn tất đăng ký:</p>
          <h2>${code}</h2>
          <p>Mã này có hiệu lực trong 10 phút. Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
        `,
      },
      // Có thể thêm tiếng Anh
      {
        lang: "en",
        subject: "Verify your email address",
        html: ({ code }: { code: string }) => `
          <p>Hello,</p>
          <p>Thank you for signing up. Please use the following code to complete your registration:</p>
          <h2>${code}</h2>
          <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        `,
      },
    ],
  },
  {
    type: "resetPassword",
    contents: [
      {
        lang: "vi",
        subject: "Đặt lại mật khẩu của bạn",
        html: ({ code }: { code: string }) => `
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã dưới đây để tạo mật khẩu mới:</p>
          <h2>${code}</h2>
          <p>Mã này có hiệu lực trong 10 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email.</p>
        `,
      },
      {
        lang: "en",
        subject: "Reset your password",
        html: ({ code }: { code: string }) => `
          <p>Hello,</p>
          <p>You have requested a password reset. Please use the following code to create a new password:</p>
          <h2>${code}</h2>
          <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        `,
      },
    ],
  },
];

const getMailTemplate = (type: string, lang = "vi") => {
  const template = templates.find((t) => t.type === type);
  if (!template) throw new Error("Email template not found");
  const content = template.contents.find((c) => c.lang === lang);
  return content;
};

export default getMailTemplate;
