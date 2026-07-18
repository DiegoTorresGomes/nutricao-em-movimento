import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Generated Apple touch icon (home-screen shortcut).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#556B2F",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1 }}>NM</div>
        <div
          style={{
            marginTop: 10,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#E9DCC9",
          }}
        >
          NUTRIÇÃO
        </div>
      </div>
    ),
    { ...size }
  );
}
