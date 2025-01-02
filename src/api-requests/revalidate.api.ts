import http from '@/utils/http'
import envVariables from '@/lib/schema-validations/env-variables.schema'

const revalidateApi = {
  revalidateTag: (tag: string) => http.get(`/api/revalidate?tag=${tag}`, { baseUrl: envVariables.NEXT_PUBLIC_URL }),
}

export default revalidateApi
