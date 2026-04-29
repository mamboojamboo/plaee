import { NextResponse } from "next/server";

export const GAMMA_PROXY_CACHE_EVENTS =
  "public, s-maxage=30, stale-while-revalidate=60";

export const GAMMA_PROXY_CACHE_TAGS =
  "public, s-maxage=3600, stale-while-revalidate=7200";

export type GammaProxyJsonHeaders = Record<string, string>;

export function gammaProxyJsonHeaders(
  cacheControl: string,
): GammaProxyJsonHeaders {
  return {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": cacheControl,
  };
}

type GammaUpstreamToNextJsonOptions = {
  onParsed?: (data: unknown) => void;
};

export async function gammaUpstreamToNextJson(
  response: Response,
  cacheControl: string,
  options?: GammaUpstreamToNextJsonOptions,
): Promise<NextResponse> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Polymarket API error: ${response.status} - ${errorText}`);
  }
  const data: unknown = await response.json();
  options?.onParsed?.(data);
  return NextResponse.json(data, {
    headers: gammaProxyJsonHeaders(cacheControl),
  });
}

export function gammaProxyErrorNextResponse(
  error: unknown,
  userMessage: string,
  logLabel: string,
): NextResponse {
  console.error(
    logLabel,
    error instanceof Error ? error.message : String(error),
  );
  return NextResponse.json(
    {
      error: userMessage,
      details: error instanceof Error ? error.message : String(error),
    },
    { status: 500 },
  );
}

export function devGammaProxyLog(...args: unknown[]): void {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}
