import HttpException from "@exceptions/http.exception";

type RequestOptionsType = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
};

type HelperResponseType<T> = {
  status: number;
  data: T;
};

/**
 * Base class untuk helper yang memanggil service / API pihak ketiga (HTTP client).
 * Turunkan class ini di folder `helpers`, contoh: `class PaymentGatewayHelper extends Helper`.
 */
export default abstract class Helper {
  protected constructor(protected readonly baseUrl: string) {}

  protected async request<T = unknown>(path: string, options: RequestOptionsType = {}): Promise<HelperResponseType<T>> {
    const { method = "GET", headers = {}, body, timeoutMs = 30000 } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: { "content-type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });

    const text = await response.text();
    const data = (text ? this.parseJson(text) : null) as T;
    if (!response.ok) {
      throw new HttpException(response.status, String(response.status), `Request to ${path} failed`, data);
    }
    return { status: response.status, data };
  }

  private parseJson(text: string): unknown {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
}
