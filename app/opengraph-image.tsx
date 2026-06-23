import { ImageResponse } from "next/og";

export const alt = "HASH — Take on more clients without the chaos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bar = (style: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  borderRadius: 18,
  background: "linear-gradient(135deg, #FFA033, #FF7A1A 55%, #E55A00)",
  ...style,
});

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0B",
          backgroundImage:
            "radial-gradient(ellipse 60% 55% at 78% 40%, rgba(255,122,26,0.16), transparent 70%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* tilted hash mark, top right */}
        <div
          style={{
            position: "absolute",
            top: 120,
            right: 110,
            width: 300,
            height: 300,
            display: "flex",
            transform: "rotate(0deg)",
          }}
        >
          <div
            style={bar({
              left: 88,
              top: 0,
              width: 40,
              height: 300,
              transform: "rotate(10deg)",
            })}
          />
          <div
            style={bar({
              left: 172,
              top: 0,
              width: 40,
              height: 300,
              transform: "rotate(10deg)",
            })}
          />
          <div
            style={bar({
              left: 0,
              top: 86,
              width: 300,
              height: 40,
              transform: "rotate(-8deg)",
            })}
          />
          <div
            style={bar({
              left: 0,
              top: 174,
              width: 300,
              height: 40,
              transform: "rotate(-8deg)",
            })}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#FAFAF7",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "0.3em",
          }}
        >
          HASH
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#FAFAF7",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            Take on more clients
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              backgroundImage: "linear-gradient(100deg, #FF7A1A, #FFA033)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            without it all breaking.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 27,
              color: "#9B9BA3",
              display: "flex",
            }}
          >
            Audit-first systems for service businesses · hashops.io
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
