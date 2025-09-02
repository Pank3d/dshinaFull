import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DSHINA.RU - Интернет-магазин шин и дисков";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(180deg, #1e40af 0%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: "bold", marginBottom: 20 }}>
          DSHINA.RU
        </div>
        <div style={{ fontSize: 36, fontWeight: 400, textAlign: "center" }}>
          Интернет-магазин шин и дисков
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 300,
            marginTop: 20,
            opacity: 0.9,
          }}
        >
          Широкий выбор • Выгодные цены • Быстрая доставка
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
