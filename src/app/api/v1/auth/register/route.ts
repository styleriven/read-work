import UserRoles from "@/enums/Role";
import AuthAction from "@/lib/server/action/auth-action";
import TokenAction from "@/lib/server/action/token-action";
import UserAction from "@/lib/server/action/user-action";
import userDetailAction from "@/lib/server/action/user-detail-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { hashPassword } from "@/lib/uitls/hash";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    const createBody = {
      email,
      password: await hashPassword(password),
      role: UserRoles.User,
    };

    const existUser = await UserAction.getUserByEmail(email, false);
    let user;
    if (existUser) {
      user = existUser;
    } else {
      user = await UserAction.createUser(createBody);
      const userDetail = {
        userId: user.id,
        referral: [],
        metallic: 0,
        ruby: 0,
        tickets: 0,
        svipPoints: 0,
      };
      await userDetailAction.createUser(userDetail);
    }
    if (existUser && existUser?.password !== createBody.password) {
      UserAction.update(existUser?.id, { password: createBody.password });
    }
    const tokens = await TokenAction.generateAuthTokens(user);
    await AuthAction.sendVerifyEmail(user);

    return NextResponse.json(
      { user, tokens },
      {
        status: HttpStatusCode.Ok,
        headers: { "Content-Type": "application/json" },
      }
    );
  });
};
