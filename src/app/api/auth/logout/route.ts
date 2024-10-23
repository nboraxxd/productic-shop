import { cookies } from 'next/headers'
import authApi from '@/api-requests/auth.api'

export async function POST() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  cookieStore.delete('sessionToken')

  if (!sessionToken) {
    return Response.json({ message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại. (missing_token)' })
  }

  try {
    const { payload } = await authApi.logoutFromServerToBackend(sessionToken.value)

    return Response.json(payload)
  } catch (_err) {
    return Response.json({ message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại. (server_error)' })
  }
}
