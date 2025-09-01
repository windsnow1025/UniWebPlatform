export interface ApiTypeModel {
  apiType: string;
  model: string;
  input: number;
  output: number;
}

export interface Citation {
  text: string;
  indices: number[];
}

export interface ChatResponse {
  text?: string;
  thought?: string;
  image?: string;
  display?: string;
  citations?: Citation[];
  error?: string;
  input_tokens?: number;
  output_tokens?: number;
}
