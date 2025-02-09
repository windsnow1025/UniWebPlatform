export interface ApiTypeModel {
  api_type: string;
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
  display?: string;
  citations?: Citation[];
  error?: string;
}
