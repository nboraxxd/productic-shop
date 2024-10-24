import { cookies } from 'next/headers'

import { HttpError } from '@/utils/errors'
import authApi from '@/api-requests/auth.api'

export async function POST() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value

  if (!sessionToken) {
    return Response.json({ message: 'Session token is missing' }, { status: 401 })
  }

  try {
    const { payload, statusCode: status } = await authApi.slideSessionFromServerToBackend(sessionToken)
    const { token, expiresAt } = payload.data

    cookieStore.set('sessionToken', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date(expiresAt),
    })

    return Response.json(payload, { status })
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.statusCode })
    } else {
      return Response.json({ message: 'Internal server error' }, { status: 500 })
    }
  }
}
