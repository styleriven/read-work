import authAction from '@/lib/server/action/auth-action'
import tokenAction from '@/lib/server/action/token-action'
import { handleApiRequest } from '@/lib/uitls/handle-api-request'
import { HttpStatusCode } from 'axios'
import { ApiError } from 'next/dist/server/api-utils'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { token_email } = await req.json()
    console.log('Received token_email:', token_email)
    if (!token_email) {
      throw new ApiError(HttpStatusCode.BadRequest, 'Missing token_email')
    }
    const user = await authAction.loginUserWithEmailToken(token_email)

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
