import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function handleApiRequest(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const response = await handler();
    if (!response) {
      throw new Error("Handler did not return a Response");
    }
    return response;
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        {
          status: error.statusCode,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      {
        status: HttpStatusCode.InternalServerError,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
