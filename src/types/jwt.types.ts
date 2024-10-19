import { TokenType } from '@/types'

export interface TokenPayload {
  userId: number
  tokenType: (typeof TokenType)[keyof typeof TokenType]
  iat: number
  exp: number
}
