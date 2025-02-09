export interface ApiTypeModel {
  api_type: string
  model: string
  input: number
  output: number
}

export interface ChatResponse {
  text?: string
  display?: string
  error?: string
}
