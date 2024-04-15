export default class FileService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_NODE_API_BASE_URL!;
  }

  async upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/file`, {
      method: 'POST',
      body: formData,
    });

    if (response.status === 413) {
      throw new Error('File is too large');
    } else if (!response.ok) {
      console.error(response);
      throw new Error('Failed to upload file');
    }

    return await response.json();
  }
}

