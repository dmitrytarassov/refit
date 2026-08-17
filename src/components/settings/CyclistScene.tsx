/**
 * CyclistScene — animated line-art cyclist (SVG, no dependencies).
 * Display-only: bike / position / surface come from props.
 *
 * Colors via CSS variables on any parent:
 *   --cyclist-line:  bike/road/wind color
 *   --cyclist-rider: rider color
 *
 * Extending:
 *   - new bike     → object in BIKES (named geometry points)
 *   - new position → object in POSITIONS (off = hand offset from bar center,
 *                    torso = torso angle, wind/ground/crankDps speeds)
 *   - new surface  → branch in groundTile()
 * The rider is not hardcoded: elbows and knees are two-bone IK every frame.
 */
import type { ReactElement } from "react";
import { useEffect, useMemo, useRef } from "react";

export type BikeKey = "road" | "gravel" | "mtb" | "tt";
export type PositionKey = "aero" | "drops" | "hoods" | "tops" | "grips";
export type SurfaceKey = "asphalt" | "badAsphalt" | "gravel";

type Vec = [number, number];

interface BikeConfig {
  label: string;
  wheelR: number;
  tireW: number;
  tread: boolean;
  rearAxle: Vec;
  frontAxle: Vec;
  bb: Vec;
  saddle: Vec;
  seatCluster: Vec;
  headTop: Vec;
  headBottom: Vec;
  bar: { type: "drop" | "flat" | "aero"; center: Vec };
}

interface PositionConfig {
  label: string;
  /** hand offset from the bar center */
  off: Vec;
  /** torso angle from horizontal, degrees */
  torso: number;
  kmh: number;
  /** crank speed, deg/s */
  crankDps: number;
  /** wind line speed, px/s */
  wind: number;
  /** road speed, px/s (slower than wind — parallax) */
  ground: number;
}

const RIDER = {
  torso: 120,
  femur: 88,
  shin: 88,
  upperArm: 68,
  foreArm: 68,
  headR: 17,
  neck: 36,
  crank: 42,
};

const POSITIONS: Record<PositionKey, PositionConfig> = {
  aero: {
    label: "Aero",
    off: [42, -6],
    torso: 15,
    kmh: 42,
    crankDps: 460,
    wind: 260,
    ground: 120,
  },
  drops: {
    label: "Drops",
    off: [9, 30],
    torso: 28,
    kmh: 36,
    crankDps: 400,
    wind: 210,
    ground: 95,
  },
  hoods: {
    label: "Hoods",
    off: [18, 2],
    torso: 37,
    kmh: 30,
    crankDps: 330,
    wind: 160,
    ground: 72,
  },
  tops: {
    label: "Tops",
    off: [-8, 0],
    torso: 46,
    kmh: 25,
    crankDps: 270,
    wind: 120,
    ground: 54,
  },
  grips: {
    label: "Grips",
    off: [6, 0],
    torso: 50,
    kmh: 18,
    crankDps: 210,
    wind: 80,
    ground: 36,
  },
};

const BIKES: Record<BikeKey, BikeConfig> = {
  road: {
    label: "Road bike",
    wheelR: 64,
    tireW: 2.5,
    tread: false,
    rearAxle: [200, 404],
    frontAxle: [400, 404],
    bb: [284, 422],
    saddle: [243, 288],
    seatCluster: [255, 326],
    headTop: [388, 318],
    headBottom: [397, 346],
    bar: { type: "drop", center: [408, 312] },
  },
  gravel: {
    label: "Gravel bike",
    wheelR: 63,
    tireW: 4,
    tread: true,
    rearAxle: [200, 405],
    frontAxle: [408, 405],
    bb: [287, 424],
    saddle: [246, 290],
    seatCluster: [258, 330],
    headTop: [392, 322],
    headBottom: [400, 350],
    bar: { type: "drop", center: [411, 315] },
  },
  mtb: {
    label: "MTB",
    wheelR: 60,
    tireW: 5,
    tread: true,
    rearAxle: [200, 408],
    frontAxle: [415, 408],
    bb: [290, 420],
    saddle: [253, 290],
    seatCluster: [263, 350],
    headTop: [392, 330],
    headBottom: [400, 362],
    bar: { type: "flat", center: [402, 324] },
  },
  tt: {
    label: "TT bike",
    wheelR: 64,
    tireW: 2.5,
    tread: false,
    rearAxle: [200, 404],
    frontAxle: [400, 404],
    bb: [284, 422],
    saddle: [250, 286],
    seatCluster: [258, 326],
    headTop: [388, 318],
    headBottom: [397, 346],
    bar: { type: "aero", center: [404, 308] },
  },
};

const SURFACES: Record<SurfaceKey, { label: string }> = {
  asphalt: { label: "Asphalt" },
  badAsphalt: { label: "Rough asphalt" },
  gravel: { label: "Gravel" },
};

const TILE = 680;
const d2r = (a: number): number => (a * Math.PI) / 180;

function ik(a: Vec, b: Vec, l1: number, l2: number, bend: 1 | -1): Vec {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.5);
  const cos = Math.max(
    -1,
    Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)),
  );
  const ang = Math.atan2(dy, dx) + bend * Math.acos(cos);
  return [a[0] + l1 * Math.cos(ang), a[1] + l1 * Math.sin(ang)];
}

const L = (p: Vec, q: Vec, w: number, c: string, o?: number): string =>
  `<polyline points="${p[0].toFixed(1)},${p[1].toFixed(1)},${q[0].toFixed(1)},${q[1].toFixed(1)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${o ? ` opacity="${o}"` : ""}/>`;

const PL = (pts: Vec[], w: number, c: string, o?: number): string =>
  `<polyline points="${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o ? ` opacity="${o}"` : ""}/>`;

/** deterministic PRNG — the road tile is always identical, the seam is invisible */
function seeded(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function groundTile(
  gy: number,
  surf: SurfaceKey,
  C: string,
  M: string,
): string {
  let s = "";
  if (surf === "asphalt") {
    s += `<line x1="0" y1="${gy}" x2="${TILE}" y2="${gy}" stroke="${C}" stroke-width="2"/>`;
    s += `<line x1="0" y1="${gy + 8}" x2="${TILE}" y2="${gy + 8}" stroke="${M}" stroke-width="1.5" stroke-dasharray="24 18" opacity="0.6"/>`;
  } else if (surf === "badAsphalt") {
    const r = seeded(7);
    let d = `M 0 ${gy}`;
    let x = 0;
    while (x < 650) {
      x = Math.min(x + 30 + r() * 45, TILE);
      if (r() < 0.4 && x < 640) {
        const w = 8 + r() * 12;
        const dep = 3 + r() * 4;
        d += ` L ${(x - w / 2).toFixed(1)} ${gy} L ${x.toFixed(1)} ${(gy + dep).toFixed(1)} L ${(x + w / 2).toFixed(1)} ${gy}`;
        x += w / 2;
      } else {
        d += ` L ${x.toFixed(1)} ${gy}`;
      }
    }
    d += ` L ${TILE} ${gy}`;
    s += `<path d="${d}" fill="none" stroke="${C}" stroke-width="2" stroke-linejoin="round"/>`;
    for (let i = 0; i < 8; i++) {
      const cx = 20 + r() * 630;
      s += PL(
        [
          [cx, gy + 2],
          [cx + 2 + r() * 3, gy + 7 + r() * 4],
          [cx - 1 - r() * 3, gy + 12 + r() * 5],
        ],
        1,
        M,
        0.7,
      );
    }
    for (let i = 0; i < 4; i++) {
      const cx = 20 + r() * 610;
      const w = 16 + r() * 20;
      s += `<line x1="${cx.toFixed(1)}" y1="${gy + 5}" x2="${(cx + w).toFixed(1)}" y2="${gy + 5}" stroke="${M}" stroke-width="3" opacity="0.35"/>`;
    }
  } else {
    const r = seeded(13);
    s += `<line x1="0" y1="${gy}" x2="${TILE}" y2="${gy}" stroke="${M}" stroke-width="1" stroke-dasharray="3 6" opacity="0.7"/>`;
    for (let i = 0; i < 85; i++) {
      s += `<circle cx="${(r() * TILE).toFixed(1)}" cy="${(gy + 1 + r() * 11).toFixed(1)}" r="${(0.8 + r() * 1.4).toFixed(1)}" fill="${M}" opacity="${(0.35 + r() * 0.45).toFixed(2)}"/>`;
    }
    for (let i = 0; i < 9; i++) {
      s += `<circle cx="${(10 + r() * 660).toFixed(1)}" cy="${(gy + 3 + r() * 8).toFixed(1)}" r="${(2.2 + r()).toFixed(1)}" fill="none" stroke="${M}" stroke-width="1" opacity="0.7"/>`;
    }
  }
  return s;
}

function drawBar(g: BikeConfig, C: string): string {
  const c = g.bar.center;
  if (g.bar.type === "drop") {
    return `<path d="M ${c[0] - 8} ${c[1]} L ${c[0] + 12} ${c[1] + 1} Q ${c[0] + 24} ${c[1] + 4} ${c[0] + 20} ${c[1] + 20} Q ${c[0] + 17} ${c[1] + 32} ${c[0] + 4} ${c[1] + 32}" fill="none" stroke="${C}" stroke-width="3" stroke-linecap="round"/>`;
  }
  if (g.bar.type === "flat") {
    return L([c[0] - 6, c[1] + 3], [c[0] + 10, c[1] - 2], 3.5, C);
  }
  return (
    L([c[0] - 6, c[1] + 2], [c[0] + 8, c[1]], 3.5, C) +
    L([c[0] + 2, c[1] - 2], [c[0] + 46, c[1] - 7], 3, C) +
    L([c[0] + 6, c[1] + 2], [c[0] + 6, c[1] - 4], 3, C)
  );
}

function drawBike(g: BikeConfig, C: string): string {
  const R = g.wheelR;
  let s = "";
  ([g.rearAxle, g.frontAxle] as Vec[]).forEach(([x, y], i) => {
    s += `<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="${C}" stroke-width="${g.tireW}"/>`;
    if (g.tread) {
      s += `<circle cx="${x}" cy="${y}" r="${R + g.tireW * 0.9}" fill="none" stroke="${C}" stroke-width="1.5" stroke-dasharray="2.5 5" opacity="0.8"/>`;
    }
    s += `<circle cx="${x}" cy="${y}" r="${R - 8}" fill="none" stroke="${C}" stroke-width="1" opacity="0.4"/>`;
    const ir = R - 9;
    s += `<g data-spoke="${i}">`;
    for (let k = 0; k < 3; k++) {
      const a = d2r(k * 60);
      const dx = Math.cos(a) * ir;
      const dy = Math.sin(a) * ir;
      s += `<line x1="${(x - dx).toFixed(1)}" y1="${(y - dy).toFixed(1)}" x2="${(x + dx).toFixed(1)}" y2="${(y + dy).toFixed(1)}" stroke="${C}" stroke-width="1.5" opacity="0.45"/>`;
    }
    s += `<circle cx="${x}" cy="${y - ir + 3}" r="2.5" fill="${C}" opacity="0.7"/>`;
    s += `</g>`;
    s += `<circle cx="${x}" cy="${y}" r="3.5" fill="${C}"/>`;
  });
  s += L(g.bb, g.saddle, 3.5, C);
  s += L(g.bb, g.rearAxle, 3.5, C);
  s += L(g.rearAxle, g.seatCluster, 3.5, C);
  s += L(g.bb, g.headBottom, 3.5, C);
  s += L(g.seatCluster, g.headTop, 3.5, C);
  s += L(g.headTop, g.headBottom, 3.5, C);
  s += L(g.headBottom, g.frontAxle, 3.5, C);
  s += L(g.headTop, g.bar.center, 3, C);
  s += drawBar(g, C);
  s += L(
    [g.saddle[0] - 16, g.saddle[1] - 2],
    [g.saddle[0] + 14, g.saddle[1] - 4],
    4,
    C,
  );
  s += `<circle cx="${g.bb[0]}" cy="${g.bb[1]}" r="4" fill="${C}"/>`;
  s += `<circle cx="${g.bb[0]}" cy="${g.bb[1]}" r="13" fill="none" stroke="${C}" stroke-width="1" opacity="0.4"/>`;
  return s;
}

function drawLeg(
  g: BikeConfig,
  hip: Vec,
  crankDeg: number,
  C: string,
  A: string,
  w: number,
  op?: number,
): string {
  const bb = g.bb;
  const c = RIDER.crank;
  const pedal: Vec = [
    bb[0] + c * Math.cos(d2r(crankDeg)),
    bb[1] + c * Math.sin(d2r(crankDeg)),
  ];
  const ankle: Vec = [pedal[0] - 3, pedal[1] - 7];
  const knee = ik(hip, ankle, RIDER.femur, RIDER.shin, -1);
  let s = L(bb, pedal, 2.5, C, op);
  s += L([pedal[0] - 9, pedal[1]], [pedal[0] + 9, pedal[1]], 3, C, op);
  s += PL([hip, knee, ankle], w, A, op);
  s += L(ankle, [pedal[0] + 15, pedal[1] + 1], w * 0.85, A, op);
  return s;
}

function drawRider(
  g: BikeConfig,
  P: PositionConfig,
  crank: number,
  C: string,
  A: string,
): string {
  const hand: Vec = [g.bar.center[0] + P.off[0], g.bar.center[1] + P.off[1]];
  const hip: Vec = [g.saddle[0] + 4, g.saddle[1] - 8];
  const t = d2r(P.torso);
  const shoulder: Vec = [
    hip[0] + RIDER.torso * Math.cos(t),
    hip[1] - RIDER.torso * Math.sin(t),
  ];
  const elbow = ik(shoulder, hand, RIDER.upperArm, RIDER.foreArm, 1);
  const u: Vec = [
    (shoulder[0] - hip[0]) / RIDER.torso,
    (shoulder[1] - hip[1]) / RIDER.torso,
  ];
  const head: Vec = [
    shoulder[0] + u[0] * RIDER.neck + 7,
    shoulder[1] + u[1] * RIDER.neck - 3,
  ];
  let s = "";
  s += drawLeg(g, hip, crank + 180, C, A, 4, 0.35);
  s += drawLeg(g, hip, crank, C, A, 4.5);
  s += PL([hip, shoulder], 5, A);
  s += PL([shoulder, elbow, hand], 4, A);
  s += `<circle cx="${head[0].toFixed(1)}" cy="${head[1].toFixed(1)}" r="${RIDER.headR}" fill="none" stroke="${A}" stroke-width="4"/>`;
  return s;
}

interface CyclistSceneProps {
  bike: BikeKey;
  position: PositionKey;
  surface: SurfaceKey;
  className?: string;
}

interface WindLine {
  el: SVGLineElement;
  x: number;
  y: number;
  len: number;
  f: number;
}

export function CyclistScene({
  bike,
  position,
  surface,
  className,
}: CyclistSceneProps): ReactElement {
  const C = "var(--cyclist-line, #71716b)";
  const M = "var(--cyclist-line, #9a9a92)";
  const A = "var(--cyclist-rider, #D85A30)";

  const rootRef = useRef<SVGSVGElement>(null);
  const riderRef = useRef<SVGGElement>(null);
  const groundRef = useRef<SVGGElement>(null);
  const windRef = useRef<SVGGElement>(null);
  const stateRef = useRef({ bike, position });
  stateRef.current = { bike, position };

  const g = BIKES[bike];
  const gy = Math.max(g.rearAxle[1], g.frontAxle[1]) + g.wheelR;

  const bikeSvg = useMemo(() => drawBike(g, C), [g, C]);
  const tileSvg = useMemo(
    () => groundTile(gy, surface, C, M),
    [gy, surface, C, M],
  );

  useEffect(() => {
    const wg = windRef.current;
    if (!wg) {
      return;
    }
    wg.innerHTML = "";
    const lines: WindLine[] = [];
    const r = seeded(29);
    for (let i = 0; i < 12; i++) {
      const len = 20 + r() * 45;
      const y = 85 + r() * 270;
      const x = 50 + r() * 540;
      const f = 0.6 + r() * 0.8;
      const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
      el.setAttribute("stroke", M);
      el.setAttribute("stroke-width", (1 + r() * 1.3).toFixed(1));
      el.setAttribute("stroke-linecap", "round");
      el.setAttribute("opacity", (0.25 + r() * 0.35).toFixed(2));
      wg.appendChild(el);
      lines.push({ el, x, y, len, f });
    }

    const anim = { crank: 20, last: 0, groundOff: 0, wheel: 0 };
    let raf = 0;

    const tick = (ts: number): void => {
      if (!anim.last) {
        anim.last = ts;
      }
      const dt = Math.min((ts - anim.last) / 1000, 0.05);
      anim.last = ts;
      const P = POSITIONS[stateRef.current.position];
      const B = BIKES[stateRef.current.bike];

      anim.crank = (anim.crank + P.crankDps * dt) % 360;
      anim.groundOff = (anim.groundOff + P.ground * dt) % TILE;
      anim.wheel =
        (anim.wheel + (P.ground / B.wheelR) * (180 / Math.PI) * dt) % 360;

      if (riderRef.current) {
        riderRef.current.innerHTML = drawRider(B, P, anim.crank, C, A);
      }
      if (groundRef.current) {
        groundRef.current.setAttribute(
          "transform",
          `translate(${anim.groundOff.toFixed(1)} 0)`,
        );
      }
      rootRef.current
        ?.querySelectorAll<SVGGElement>("[data-spoke]")
        .forEach((el, i) => {
          const [x, y] = i === 0 ? B.rearAxle : B.frontAxle;
          el.setAttribute(
            "transform",
            `rotate(${anim.wheel.toFixed(1)} ${x} ${y})`,
          );
        });
      for (const w of lines) {
        w.x += P.wind * w.f * dt;
        if (w.x > 645) {
          w.x = 35 - w.len;
          w.y = 85 + Math.random() * 270;
        }
        w.el.setAttribute("x1", w.x.toFixed(1));
        w.el.setAttribute("x2", (w.x + w.len).toFixed(1));
        w.el.setAttribute("y1", w.y.toFixed(1));
        w.el.setAttribute("y2", w.y.toFixed(1));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [C, M, A]);

  return (
    <div className={className}>
      <svg
        ref={rootRef}
        width="100%"
        viewBox="0 0 680 510"
        role="img"
        aria-label={`Cyclist: ${g.label}, ${POSITIONS[position].label}, ${SURFACES[surface].label}`}
      >
        <g ref={windRef} />
        <g ref={groundRef}>
          <g dangerouslySetInnerHTML={{ __html: tileSvg }} />
          <g
            transform={`translate(-${TILE} 0)`}
            dangerouslySetInnerHTML={{ __html: tileSvg }}
          />
        </g>
        <g transform="translate(680 0) scale(-1 1)">
          <g dangerouslySetInnerHTML={{ __html: bikeSvg }} />
          <g ref={riderRef} />
        </g>
      </svg>
    </div>
  );
}
