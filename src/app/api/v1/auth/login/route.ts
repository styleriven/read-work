import authAction from '@/lib/server/action/auth-action'
import tokenAction from '@/lib/server/action/token-action'
import { handleApiRequest } from '@/lib/uitls/handle-api-request'
import { HttpStatusCode } from 'axios'
import { NextResponse } from 'next/server'

export const POST = async (request: Request): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        {
          status: HttpStatusCode.BadRequest,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const user = await authAction.loginUserWithEmailAndPassword(email, password)
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        {
          status: HttpStatusCode.BadRequest,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

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
