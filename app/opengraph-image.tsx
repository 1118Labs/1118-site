import { ImageResponse } from "next/og";

export const alt = "1118 — Original digital products";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbf8f2",
          color: "#182236",
          padding: "72px 80px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#1689ef",
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-5px",
          }}
        >
          1118
        </div>
        <div
          style={{
            width: "940px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 86,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-4px",
            }}
          >
            Original digital products.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: "#5d6675",
              fontSize: 30,
              lineHeight: 1.25,
            }}
          >
            Built and operated by 1118.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "2px solid #d8d2c8",
            color: "#5d6675",
            fontSize: 20,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <span>1118 LLC</span>
          <span>1118.io</span>
        </div>
      </div>
    ),
    size,
  );
}
