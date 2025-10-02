import userAction from '@/lib/server/action/user-action'
import tokenAction from '@/lib/server/action/token-action'
import { genCode, hashPassword, verifyPassword } from '@/lib/uitls/hash'
import { IUser } from '@models/interfaces/i-user'
import emailAction from './email-action'
import { ApiError } from 'next/dist/server/api-utils'
import { IToken } from '@/types/token'
import verifyCodeAction from './verify-code-action'
import axios, { HttpStatusCode } from 'axios'

class AuthAction {
  async sendVerifyEmail(user: IUser) {
    const { id, email, isVerified } = user
    if (isVerified) return
    const code = genCode()
    try {
      await verifyCodeAction.deleteCode({ userId: id, type: 'verifyEmail' })
      await verifyCodeAction.createCode({
        userId: id,
        code,
        type: 'verifyEmail',
        expiredAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      })
      emailAction.sendVerificationEmail(email, code)
    } catch (error) {
      console.error('Error in sendVerifyEmail:', error)
    }
  }

  async verifyEmail(userId: string, code: string): Promise<boolean> {
    try {
      const record = await verifyCodeAction.getCode({
        userId,
        code,
        type: 'verifyEmail',
      })
      if (!record || record.expiredAt < new Date()) {
        return false
      }
      await verifyCodeAction.deleteCode({ userId, type: 'verifyEmail' })
      return true
    } catch (error) {
      console.error('Error in verifyEmail:', error)
      return false
    }
  }

  async refreshAuth(refreshToken: string): Promise<{ access: IToken; refresh: IToken }> {
    try {
      const token = await tokenAction.verifyToken(refreshToken, 'refresh')
      const user = await userAction.getUserById(token?.userId)
      if (!user) {
        throw new ApiError(404, 'User not found')
      }
      await tokenAction.removeToken(token.id)

      const result = await tokenAction.generateAuthTokens(user)
      return result
    } catch (error) {
      throw error
    }
  }

  async verifyEmailCode(userId: string, code: string): Promise<boolean> {
    try {
      const storeCode = await verifyCodeAction.getCode({
        userId,
        code,
        type: 'verifyEmail',
      })
      if (!storeCode) {
        throw new Error()
      }
      await verifyCodeAction.deleteCode({ userId, type: 'verifyEmail', code })
      await userAction.update(userId, { isVerified: true })
      return true
    } catch (error) {
      console.error('Error in verifyEmailCode:', error)
      return false
    }
  }

  async loginUserWithEmailAndPassword(email: string, password: string) {
    try {
      const user = await userAction.getUserByEmail(email, true)
      if (!user || !user.password || !(await verifyPassword(password, user.password))) {
        throw new ApiError(HttpStatusCode.BadRequest, 'Incorrect email or password')
      }

      const date = new Date()
      await userAction.update(user.id, { lastLoginAt: date })
      user.lastLoginAt = date
      return user
    } catch (error) {
      console.error('Error in loginUserWithEmailAndPassword:', error)
      throw error
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const token = await tokenAction.verifyToken(refreshToken, 'refresh')
      if (!token) {
        throw new ApiError(401, 'Invalid refresh token')
      }
      await tokenAction.removeToken(token.id)
    } catch (error) {
      console.error('Error in logout:', error)
      throw error
    }
  }

  async sendPasswordResetEmail(user: IUser) {
    const { id, email, isVerified } = user
    if (!isVerified) return
    const code = genCode()
    try {
      await verifyCodeAction.deleteCode({ userId: id, type: 'resetPassword' })
      await verifyCodeAction.createCode({
        userId: id,
        code,
        type: 'resetPassword',
        expiredAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      })
      emailAction.sendResetPasswordEmail(email, code)
    } catch (error) {
      console.error('Error in sendPasswordResetEmail:', error)
      throw error
    }
  }

  async verifyForgotPassword(email: string, code: string): Promise<[boolean, IUser | null]> {
    try {
      const user = await userAction.getUserByEmail(email, true)
      if (!user) return [false, null]
      const record = await verifyCodeAction.getCode({
        userId: user.id,
        code,
        type: 'resetPassword',
      })
      if (!record || record.expiredAt < new Date()) {
        return [false, null]
      }
      return [true, user]
    } catch (error) {
      console.error('Error in verifyForgotPassword:', error)
      return [false, null]
    }
  }

  async forgotPassword(email: string, code: string, newPassword: string) {
    try {
      const [verify, user] = await this.verifyForgotPassword(email, code)
      if (!verify) {
        throw new ApiError(HttpStatusCode.BadRequest, 'Invalid code')
      }
      await userAction.update(user?.id, { password: newPassword })
      verifyCodeAction.deleteCode({ userId: user?.id, type: 'resetPassword' })
    } catch (error) {
      console.error('Error in forgotPassword:', error)
      throw error
    }
  }

  async changePassword(user: IUser, oldPassword: string, newPassword: string) {
    try {
      if (!user.password || !(await verifyPassword(oldPassword, user.password))) {
        throw new ApiError(HttpStatusCode.BadRequest, 'Incorrect old password')
      }
      await userAction.update(user.id, {
        password: await hashPassword(newPassword),
      })
    } catch (error) {
      console.error('Error in changePassword:', error)
      throw error
    }
  }

  async getUserProfileByEmail(token: string) {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        params: {
          access_token: token,
        },
      })

      return response.data
    } catch (error: any) {
      throw new Error(`Failed to fetch user profile: ${error.message}`)
    }
  }

  async getUserProfileByFacebook(token: string) {
    try {
      const response = await axios.get(`https://graph.facebook.com/me`, {
        params: {
          access_token: token,
          fields: 'id,name,email,picture',
        },
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to fetch user profile: ${error.message}`)
    }
  }

  async loginUserWithEmailToken(token_email: string) {
    try {
      const { email, name, picture } = await this.getUserProfileByEmail(token_email)

      let user = await userAction.getUserByEmail(email)
      if (!user) {
        user = await userAction.createUser({
          email,
          userName: name,
          avatar: picture?.data?.url,
        })
      } else if (user.isVerified == false) {
        await userAction.update(user.id, { isVerified: true })
      }
      return user
    } catch (error) {
      console.error('Error in loginUserWithEmailToken:', error)
      throw new ApiError(HttpStatusCode.BadRequest, 'Login failed')
    }
  }

  async loginUserWithFacebookToken(token_facebook: string) {
    try {
      const { email, name, picture } = await this.getUserProfileByFacebook(token_facebook)
      if (!email) {
        throw new ApiError(HttpStatusCode.BadRequest, 'Email not provided by Facebook')
      }
      let user = await userAction.getUserByEmail(email)
      if (!user) {
        user = await userAction.createUser({
          email,
          userName: name,
          avatar: picture?.data?.url,
        })
      } else if (user.isVerified == false) {
        await userAction.update(user.id, { isVerified: true })
      }
      return user
    } catch (error) {
      console.error('Error in loginUserWithFacebookToken:', error)
      throw new ApiError(HttpStatusCode.BadRequest, 'Login failed')
    }
  }
}

export default new AuthAction()
