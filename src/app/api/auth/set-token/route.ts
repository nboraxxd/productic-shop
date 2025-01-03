import { z } from 'zod'
import { cookies } from 'next/headers'

import { HttpStatusCode } from '@/constants/http-status-code'
import { setTokenBodySchema, SetTokenBodyType } from '@/lib/schema-validations/auth.schema'

export async function POST(req: Request) {
  const body: SetTokenBodyType = await req.json()
  const cookieStore = cookies()

  try {
    const { expiresAt, token } = await setTokenBodySchema.parseAsync(body)

    cookieStore.set('sessionToken', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date(expiresAt),
    })

    return Response.json({ message: 'Set token success' })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          message: 'Validation error occurred in body',
          errorInfo: error.errors,
          statusCode: HttpStatusCode.BadRequest,
        },
        { status: HttpStatusCode.BadRequest }
      )
    } else {
      return Response.json(
        { message: error.message || error.toString() },
        { status: HttpStatusCode.InternalServerError }
      )
    }
  }
}
