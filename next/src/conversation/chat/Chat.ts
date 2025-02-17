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
  display?: string;
  citations?: Citation[];
  error?: string;
}
