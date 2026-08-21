import { ImageResponse } from "next/og";

export const alt =
  "Leakproof by HASH — contracted, delivered and billed drawn on one scale, with A$8,800 recoverable between them";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The link preview card for /leakproof.
 *
 * Read in about two seconds, at roughly 360px wide in a link unfurl and
 * smaller in some clients, with none of the page's surrounding context. Every
 * host that unfurls a link gets this same image — a mail client, Slack,
 * WhatsApp, iMessage, X, LinkedIn — so it is built for "legible small, on any
 * chrome", not tuned for one network.
 *
 * Two consequences of being read that small:
 *
 *  - Only one number. The page's figure carries four, which is right when you
 *    have the labels, the axis and a paragraph around it. At unfurl size four
 *    money figures just compete, so the bars keep their word labels and the
 *    only figure left is the one the whole page is about.
 *  - A defined edge. The card is near-black, and on dark host chrome a
 *    near-black rectangle has no shape at all. The flame band is the one
 *    frame colour no messaging client uses, so it survives being 1-2px wide
 *    after downscaling, on light chrome and dark chrome alike.
 *
 * It is the page's reconciliation figure, rebuilt for Satori. Geometry is in
 * pixels rather than percentages because the track is a fixed width and
 * Satori's percentage and calc() support is thinner than the browser's. Brand
 * hexes are literal for the same reason the site-wide card does it: there are
 * no CSS custom properties inside an ImageResponse.
 */
const TRACK = 800;
const SCALE = 17_800;
const px = (n: number) => Math.round((n / SCALE) * TRACK);

const CONTRACTED = 12_000;
const DELIVERED = 17_800;
const BILLED = 9_000;

const INK = "#FAFAF7";
const DIM = "#9B9BA3";
const BASE = "#6C6C74";
const FLAME = "linear-gradient(90deg, #E55A00, #FFA033)";

/** The frame. Thick enough to still be visible once this is 200px wide. */
const EDGE = 7;

const ROWS = [
  { name: "Contracted", base: px(CONTRACTED), gap: null },
  {
    name: "Delivered",
    base: px(CONTRACTED),
    gap: { left: px(CONTRACTED), width: px(DELIVERED) - px(CONTRACTED) },
  },
  {
    name: "Billed",
    base: px(BILLED),
    gap: { left: px(BILLED), width: px(CONTRACTED) - px(BILLED) },
  },
];

export default function LeakproofOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: EDGE,
          backgroundColor: "#E55A00",
          backgroundImage:
            "linear-gradient(120deg, #E55A00, #FF7A1A 45%, #FFA033)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0A0A0B",
            backgroundImage:
              "radial-gradient(ellipse 55% 60% at 88% 12%, rgba(255,122,26,0.20), transparent 68%)",
            padding: "38px 66px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                color: INK,
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "0.3em",
              }}
            >
              HASH
            </div>
            <div
              style={{
                display: "flex",
                color: "#FF8A3D",
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "0.22em",
              }}
            >
              LEAKPROOF
            </div>
          </div>

          {/* the caption belongs to the bars, so it sits nearer to them than
              to the wordmark above it */}
          <div
            style={{ display: "flex", flexDirection: "column", marginTop: 16 }}
          >
            <div
              style={{
                display: "flex",
                color: DIM,
                fontSize: 24,
                letterSpacing: "0.14em",
                marginBottom: 18,
              }}
            >
              ILLUSTRATIVE · ONE CLIENT, ONE MONTH
            </div>

            {ROWS.map((row, i) => (
              <div
                key={row.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: i === 0 ? 0 : 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 254,
                    color: INK,
                    fontSize: 38,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {row.name}
                </div>

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    width: TRACK,
                    height: 62,
                    borderRadius: 8,
                    backgroundColor: "#17171C",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: row.base,
                      backgroundColor: BASE,
                    }}
                  />
                  {row.gap ? (
                    <div
                      style={{
                        position: "absolute",
                        left: row.gap.left,
                        top: 0,
                        bottom: 0,
                        width: row.gap.width,
                        backgroundImage: FLAME,
                      }}
                    />
                  ) : null}
                  {/* the contracted line, carried across all three bars */}
                  <div
                    style={{
                      position: "absolute",
                      left: px(CONTRACTED) - 2,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      backgroundColor: "#0A0A0B",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* the same hairline the figure on the page puts above its total */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              borderTop: "1px solid rgba(255,255,255,0.10)",
              paddingTop: 30,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 132,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                backgroundImage: "linear-gradient(100deg, #FF7A1A, #FFA033)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              A$8,800
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 30,
                paddingBottom: 20,
                color: DIM,
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "0.2em",
              }}
            >
              RECOVERABLE
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
