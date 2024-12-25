import http from '@/utils/http'
import { UploadImageResponseType } from '@/lib/schema-validations/media.schema'

const mediaApi = {
  // API of backend server
  uploadImageFromBrowserToBackend: (body: FormData) => http.post<UploadImageResponseType>('/media/upload', body),
}

export default mediaApi
