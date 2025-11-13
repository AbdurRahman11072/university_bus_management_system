import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ip = searchParams.get("ip");

  if (!ip) {
    return NextResponse.json(
      { error: "IP address is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("[v0] Non-JSON response received:", await response.text());
      return NextResponse.json(
        { error: "Invalid response from geolocation service" },
        { status: 500 }
      );
    }

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.reason || "Failed to fetch location" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      region: data.region,
      country: data.country_name,
      timezone: data.timezone,
      isp: data.org,
    });
  } catch (error) {
    console.error("[v0] Location fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch location data" },
      { status: 500 }
    );
  }
}
