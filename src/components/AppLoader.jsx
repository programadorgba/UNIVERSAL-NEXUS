import { useEffect, useState } from "react";

// ─── CONFIGURA AQUÍ TU TEMA ───────────────────────────────────
// Puedes pasar props: <AppLoader messages={[...]} color="#10b981" />
const DEFAULT_MESSAGES = [
  "Cargando datos...",
  "Conectando con el servidor...",
  "Casi listo...",
  "Obteniendo información...",
  "Un momento por favor...",
];

// ─── ESTILOS ─────────────────────────────────────────────────
const css = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes spinReverse {
    from { transform: rotate(360deg); }
    to   { transform: rotate(0deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.85); }
  }
  @keyframes fadeSlideUp {
    0%   { opacity: 0; transform: translateY(10px); }
    15%  { opacity: 1; transform: translateY(0); }
    85%  { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  @keyframes orbit {
    from { transform: rotate(var(--start)) translateX(54px) rotate(calc(-1 * var(--start))); }
    to   { transform: rotate(calc(var(--start) + 360deg)) translateX(54px) rotate(calc(-1 * (var(--start) + 360deg))); }
  }
  @keyframes barGrow {
    0%   { transform: scaleY(0.3); }
    50%  { transform: scaleY(1); }
    100% { transform: scaleY(0.3); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
`;

// ─── COMPONENTE ───────────────────────────────────────────────
const AppLoader = ({
  messages = DEFAULT_MESSAGES,
  color = "#10b981",
  bgColor = "#020617",
  label = "Cargando",
}) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((p) => (p + 1) % messages.length);
    }, 2000);

    // Barra de progreso falsa que nunca llega al 100
    const progTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p + 0.2;
        return p + Math.random() * 4;
      });
    }, 200);

    return () => {
      clearInterval(msgTimer);
      clearInterval(progTimer);
    };
  }, [messages]);

  const ORBIT_DOTS = [0, 1, 2, 3, 4, 5];

  return (
    <>
      <style>{css}</style>

      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: bgColor,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "32px",
      }}>

        {/* ── Anillo orbital ─────────────────────────────────── */}
        <div style={{ position: "relative", width: 140, height: 140 }}>

          {/* Aro exterior */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: `2px solid ${color}22`,
            animation: "spin 8s linear infinite",
          }}>
            <div style={{
              position: "absolute", top: -4, left: "50%",
              transform: "translateX(-50%)",
              width: 8, height: 8,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 12px ${color}`,
            }} />
          </div>

          {/* Aro medio inverso */}
          <div style={{
            position: "absolute", inset: 14,
            borderRadius: "50%",
            border: `1.5px solid ${color}44`,
            animation: "spinReverse 5s linear infinite",
          }}>
            <div style={{
              position: "absolute", bottom: -3, left: "50%",
              transform: "translateX(-50%)",
              width: 6, height: 6,
              borderRadius: "50%",
              background: color,
              opacity: 0.7,
            }} />
          </div>

          {/* Aro interior */}
          <div style={{
            position: "absolute", inset: 28,
            borderRadius: "50%",
            border: `1px solid ${color}66`,
            animation: "spin 3s linear infinite",
          }} />

          {/* Núcleo pulsante */}
          <div style={{
            position: "absolute", inset: 44,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}cc 0%, ${color}33 60%, transparent 100%)`,
            animation: "pulse 2s ease-in-out infinite",
          }} />

          {/* Puntos en órbita */}
          {ORBIT_DOTS.map((i) => (
            <div key={i} style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 5, height: 5,
              borderRadius: "50%",
              background: color,
              opacity: 0.3 + i * 0.12,
              marginTop: -2.5, marginLeft: -2.5,
              "--start": `${i * 60}deg`,
              animation: `orbit ${2 + i * 0.4}s linear infinite`,
              animationDelay: `${i * -0.3}s`,
            }} />
          ))}
        </div>

        {/* ── Barras de audio ────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: 4, height: 32,
        }}>
          {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4].map((h, i) => (
            <div key={i} style={{
              width: 4,
              height: `${h * 100}%`,
              borderRadius: 2,
              background: color,
              opacity: 0.6,
              transformOrigin: "center",
              animation: `barGrow ${0.8 + i * 0.1}s ease-in-out infinite`,
              animationDelay: `${i * 0.08}s`,
            }} />
          ))}
        </div>

        {/* ── Texto con shimmer ──────────────────────────────── */}
        <div style={{ textAlign: "center", maxWidth: 280 }}>
          <p style={{
            fontSize: 13,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            background: `linear-gradient(90deg, ${color}88 0%, ${color} 40%, #ffffff 50%, ${color} 60%, ${color}88 100%)`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 2.5s linear infinite",
            marginBottom: 8,
          }}>
            {label}
          </p>

          <p key={msgIndex} style={{
            color: "#94a3b8",
            fontSize: 14,
            animation: "fadeSlideUp 2s ease forwards",
          }}>
            {messages[msgIndex]}
          </p>
        </div>

        {/* ── Barra de progreso ─────────────────────────────── */}
        <div style={{
          width: 220, height: 2,
          background: "#ffffff11",
          borderRadius: 2,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${Math.min(progress, 95)}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: 2,
            transition: "width 0.3s ease",
            boxShadow: `0 0 8px ${color}`,
          }} />
        </div>

      </div>
    </>
  );
};

export default AppLoader;
