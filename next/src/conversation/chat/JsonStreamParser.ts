export class JsonStreamParser<T> {
  private partialBuffer = "";

  public pushChunk(chunk: string): T[] {
    this.partialBuffer += chunk;

    const results: T[] = [];
    let searchStart = 0;

    while (true) {
      // Find the first '{' from where we left off
      const startIndex = this.partialBuffer.indexOf('{', searchStart);
      if (startIndex === -1) break;

      // Try to find a matching '}' using bracket counting
      let openBraces = 0;
      let endIndex = -1;

      for (let i = startIndex; i < this.partialBuffer.length; i++) {
        if (this.partialBuffer[i] === '{') {
          openBraces++;
        } else if (this.partialBuffer[i] === '}') {
          openBraces--;
          if (openBraces === 0) {
            endIndex = i;
            break;
          }
        }
      }

      if (endIndex === -1) {
        // We didn’t find a complete JSON object yet,
        // so break and wait for more chunks.
        break;
      }

      // We have a full JSON substring from startIndex to endIndex
      const jsonStr = this.partialBuffer.substring(startIndex, endIndex + 1);

      try {
        const parsed = JSON.parse(jsonStr) as T;
        results.push(parsed);
      } catch (err) {
        console.error("JSON parsing error:", err, jsonStr);
      }

      // Move the search start to endIndex + 1
      // so we continue looking after the current object
      searchStart = endIndex + 1;
    }

    // If we've successfully parsed some objects, we can drop
    // everything up to searchStart from the buffer.
    // The remainder is a partial (incomplete) JSON object.
    if (searchStart > 0) {
      this.partialBuffer = this.partialBuffer.substring(searchStart);
    }

    return results;
  }
}
