import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "HASH — Operational Systems for Service Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FLAME = "linear-gradient(135deg, #FFB36B, #FF7A1A 42%, #D85706)";

function Bar({
  left,
  top,
  width,
  height,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: 10,
        background: FLAME,
      }}
    />
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0A0A0B",
          backgroundImage:
            "radial-gradient(circle at 80% 8%, rgba(255,122,26,0.22), transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              position: "relative",
              width: 64,
              height: 64,
              display: "flex",
              transform: "rotate(-16deg)",
            }}
          >
            <Bar left={21} top={5} width={8} height={54} />
            <Bar left={35} top={5} width={8} height={54} />
            <Bar left={5} top={21} width={54} height={8} />
            <Bar left={5} top={35} width={54} height={8} />
          </div>
          <div
            style={{
              color: "#FAFAF7",
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: 10,
            }}
          >
            HASH
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              color: "#9B9BA3",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Operational systems
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 70,
              fontWeight: 700,
              color: "#FAFAF7",
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Your business isn&apos;t disorganized. Your systems are.
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6C6C74",
            fontSize: 26,
          }}
        >
          <div style={{ color: "#FF8A33", fontWeight: 600 }}>hashops.io</div>
          <div style={{ display: "flex" }}>Audit-first. ROI-justified.</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
