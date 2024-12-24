import { cookies } from 'next/headers'

import { HttpStatusCode } from '@/constants/http-status-code'
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
  } catch (error: any) {
    return Response.json({ message: error.message || 'Unauthorized' }, { status: HttpStatusCode.Unauthorized })
  }
}
