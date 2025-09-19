export interface ApiTypeModel {
  apiType: string;
  model: string;
  input: number;
  output: number;
}

export interface ResponseFile {
  name: string;
  data: string;
  type: string;
}

export interface Citation {
  text: string;
  indices: number[];
}

export interface ChatResponse {
  text?: string;
  thought?: string;
  code?: string;
  code_output?: string;
  files?: ResponseFile[];
  display?: string;
  citations?: Citation[];
  error?: string;
  input_tokens?: number;
  output_tokens?: number;
}
