export type ParamsProps = {
  params: { id: string }
}

export type SearchParamsProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export type MessageResponse = {
  message: string
}

export type SuccessResponse<D> = {
  message: string
  data: D
}
