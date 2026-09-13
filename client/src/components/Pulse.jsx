function Pulse({ variant = "divider" }) {
  const isHero = variant === "hero";
  const width = isHero ? 480 : 1200;
  const height = isHero ? 160 : 40;

  const path = isHero
    ? "M0,80 L90,80 L120,80 L140,20 L160,140 L180,50 L200,80 L260,80 L300,80 L330,10 L350,150 L370,80 L480,80"
    : "M0,20 L520,20 L545,20 L560,4 L575,36 L590,10 L605,20 L660,20 L1200,20";

  return (
    <svg
      className={`pulse pulse--${variant}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={path} className="pulse__path" />
    </svg>
  );
}

export default Pulse;
