interface ImageClientConfig {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export class ImageClient {
  private config: ImageClientConfig;

  constructor(config: ImageClientConfig) {
    this.config = config;
  }

  upload = async ({
    id,
    body,
    mimeType,
  }: {
    id: string;
    body: ArrayBuffer | Blob;
    mimeType: string;
  }) => {
    const url = `${this.config.endpoint}/${this.config.bucket}/${id}`;
    const now = new Date();
    const isoString = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateString = isoString.slice(0, 8);

    // Convert body to ArrayBuffer if it's a Blob
    const bodyArrayBuffer =
      body instanceof Blob ? await body.arrayBuffer() : body;

    // Calculate content hash
    const bodyUint8 = new Uint8Array(bodyArrayBuffer);
    const contentSha256 = await this.sha256(bodyUint8);

    // Prepare headers
    const host = new URL(this.config.endpoint).host;
    const headers = new Map([
      ["content-type", mimeType],
      ["content-length", bodyArrayBuffer.byteLength.toString()],
      ["host", host],
      ["x-amz-content-sha256", contentSha256],
      ["x-amz-date", isoString],
    ]);

    // Create signature
    const signature = await this.createSignature({
      contentSha256,
      dateString,
      headers,
      method: "PUT",
      path: `/${this.config.bucket}/${id}`,
      timestamp: isoString,
    });

    // Add authorization header
    headers.set("authorization", signature);

    // Convert headers to regular object
    const fetchHeaders: Record<string, string> = {};
    for (const [key, value] of headers.entries()) {
      fetchHeaders[key] = value;
    }

    // Make the request
    const response = await fetch(url, {
      body: bodyArrayBuffer,
      headers: fetchHeaders,
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`,
      );
    }

    return response;
  };

  private async createSignature({
    method,
    path,
    headers,
    contentSha256,
    timestamp,
    dateString,
  }: {
    method: string;
    path: string;
    headers: Map<string, string>;
    contentSha256: string;
    timestamp: string;
    dateString: string;
  }): Promise<string> {
    const service = "s3";
    const region = this.config.region;
    const algorithm = "AWS4-HMAC-SHA256";

    // Sort headers and create canonical headers
    const sortedHeaders = new Map<string, string>(
      [...headers.entries()].sort(),
    );
    const canonicalHeaders = `${Array.from(sortedHeaders.entries())
      .map(
        ([key, value]: [string, string]) =>
          `${key.toLowerCase()}:${value.trim()}`,
      )
      .join("\n")}\n`;

    const signedHeaders = Array.from(sortedHeaders.keys())
      .map((key: string) => key.toLowerCase())
      .join(";");

    // Create canonical request
    const canonicalRequest = [
      method,
      path,
      "", // query string (empty for simple PUT)
      canonicalHeaders,
      signedHeaders,
      contentSha256,
    ].join("\n");

    // Create string to sign
    const credentialScope = `${dateString}/${region}/${service}/aws4_request`;
    const canonicalRequestHash = await this.sha256(
      new TextEncoder().encode(canonicalRequest),
    );

    const stringToSign = [
      algorithm,
      timestamp,
      credentialScope,
      canonicalRequestHash,
    ].join("\n");

    // Calculate signature
    const signingKey = await this.getSigningKey(dateString, region, service);
    const signature = await this.hmacSha256(signingKey, stringToSign);

    // Create authorization header
    return `${algorithm} Credential=${this.config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  }

  private async getSigningKey(
    dateString: string,
    region: string,
    service: string,
  ): Promise<Uint8Array> {
    const kDate = await this.hmacSha256(
      new TextEncoder().encode(`AWS4${this.config.secretAccessKey}`),
      dateString,
    );
    const kRegion = await this.hmacSha256(
      new Uint8Array(await this.hexToBytes(kDate)),
      region,
    );
    const kService = await this.hmacSha256(
      new Uint8Array(await this.hexToBytes(kRegion)),
      service,
    );
    const kSigning = await this.hmacSha256(
      new Uint8Array(await this.hexToBytes(kService)),
      "aws4_request",
    );
    return new Uint8Array(await this.hexToBytes(kSigning));
  }

  private async hmacSha256(key: Uint8Array, data: string): Promise<string> {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key.slice(),
      { hash: "SHA-256", name: "HMAC" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      new TextEncoder().encode(data),
    );
    return this.bytesToHex(new Uint8Array(signature));
  }

  private async sha256(data: Uint8Array): Promise<string> {
    const hash = await crypto.subtle.digest("SHA-256", data.slice());
    return this.bytesToHex(new Uint8Array(hash));
  }

  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private async hexToBytes(hex: string): Promise<number[]> {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(Number.parseInt(hex.substring(i, i + 2), 16));
    }
    return bytes;
  }

  delete = async (id: string) => {
    const url = `${this.config.endpoint}/${this.config.bucket}/${id}`;
    const now = new Date();
    const isoString = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateString = isoString.slice(0, 8);

    // Prepare headers for DELETE request
    const host = new URL(this.config.endpoint).host;
    const headers = new Map([
      ["host", host],
      ["x-amz-date", isoString],
    ]);

    // Create signature for DELETE request
    const signature = await this.createSignature({
      contentSha256: "UNSIGNED-PAYLOAD", // For DELETE requests, we can use UNSIGNED-PAYLOAD
      dateString,
      headers,
      method: "DELETE",
      path: `/${this.config.bucket}/${id}`,
      timestamp: isoString,
    });

    // Add authorization header
    headers.set("authorization", signature);

    // Convert headers to regular object
    const fetchHeaders: Record<string, string> = {};
    for (const [key, value] of headers.entries()) {
      fetchHeaders[key] = value;
    }

    // Make the DELETE request
    const response = await fetch(url, {
      headers: fetchHeaders,
      method: "DELETE",
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(
        `Delete failed: ${response.status} ${response.statusText}`,
      );
    }

    return response;
  };
}
