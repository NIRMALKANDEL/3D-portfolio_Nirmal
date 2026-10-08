import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#090c0b",
          color: "#ebf3ee",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#3ecf8e", fontWeight: 700, letterSpacing: 2 }}>
          {site.role.toUpperCase()}
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 20 }}>{site.name}</div>
        <div style={{ fontSize: 30, color: "#95a69c", marginTop: 24, maxWidth: 900 }}>
          {site.tagline}
        </div>
      </div>
    ),
    size
  );
}
