import authAction from '@/lib/server/action/auth-action'
import tokenAction from '@/lib/server/action/token-action'
import { handleApiRequest } from '@/lib/uitls/handle-api-request'
import { HttpStatusCode } from 'axios'
import { ApiError } from 'next/dist/server/api-utils'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { token_facebook } = await req.json()
    if (!token_facebook) {
      throw new ApiError(HttpStatusCode.BadRequest, 'Missing token_facebook')
    }
    const user = await authAction.loginUserWithFacebookToken(token_facebook)

    const tokens = await tokenAction.generateAuthTokens(user)
    return NextResponse.json(
      { user, tokens },
      {
        status: HttpStatusCode.Ok,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  })
}
