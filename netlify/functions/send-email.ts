import { processSendEmail, type EmailPayload } from "../../api/send-email.ts";

interface HandlerEvent {
  httpMethod?: string;
  body?: string | null;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
  isBase64Encoded?: boolean;
}

interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

/**
 * Netlify Function handler for sending project enquiry emails.
 * Supports both Netlify Functions v1 (event-based) and v2 (Request/Response) runtimes.
 */
export const handler = async (
  eventOrReq: HandlerEvent | Request,
  _context?: any
): Promise<HandlerResponse | Response> => {
  // Check if runtime passed a standard Web Fetch Request (Netlify Functions v2)
  if (
    typeof Request !== "undefined" &&
    (eventOrReq instanceof Request ||
      (eventOrReq && typeof (eventOrReq as any).json === "function"))
  ) {
    const req = eventOrReq as Request;

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const payload: EmailPayload = await req.json();
      const result = await processSendEmail(payload);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("Production email error (Netlify v2):", err);
      return new Response(
        JSON.stringify({ error: err.message || "Failed to send email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Otherwise, handle as Netlify Functions v1 (AWS Lambda style event)
  const event = eventOrReq as HandlerEvent;

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const bodyString = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;

    const payload: EmailPayload =
      typeof bodyString === "string" ? JSON.parse(bodyString) : bodyString;

    const result = await processSendEmail(payload);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (err: any) {
    console.error("Production email error (Netlify v1):", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Failed to send email" }),
    };
  }
};

export default handler;
