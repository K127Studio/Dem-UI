import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useUI } from "@dem-ui/foundation";
import { cn } from "@dem-ui/foundation/utils";
import { HeroContent, type HeroLayoutProps } from "./HeroContent";

export type ChromeBlobQuality = "auto" | "high" | "medium" | "low";

/** A hex colour, or one per colour mode. */
export type ModeColor = string | { light: string; dark: string };

export interface ChromeBlobHeroProps extends HeroLayoutProps {
  /** Tint of the mercury. Omit for plain silver chrome. */
  blobColor?: ModeColor;
  /** What shows where the blob is not. Defaults to white. */
  backgroundColor?: ModeColor;
  /** Classes of a layer above the canvas, to help the text read. */
  overlayClassName?: string;
  /** The liquid follows the pointer. Turn off for a purely ambient loop. */
  interactive?: boolean;
  heightClassName?: string;
  /** The canvas stays fixed to the viewport, for a hero wrapping a whole tall page. */
  fixedBackground?: boolean;
  /**
   * Upper limit of the pixel ratio. The shader is a raymarcher, so its cost is linear in the
   * pixels drawn; it also has no pipeline antialiasing, so below native resolution edges step.
   */
  quality?: ChromeBlobQuality;
  /** The animation is slow enough that above 30 nothing is gained. 0 means no limit. */
  maxFps?: number;
  className?: string;
}

const QUALITY_PIXEL_RATIO: Record<ChromeBlobQuality, number> = { auto: 2, high: 2, medium: 1.5, low: 1 };

// A mouse lerp of 0.08 lags visibly behind the pointer; 0.22 stays smooth and attached.
const MOUSE_LERP = 0.22;

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uTintColor;
  uniform vec3 uBgColor;
  varying vec2 vUv;

  #define MAX_STEPS 90
  // I corpi sono confinati in un raggio di ~7.2 dall'origine (i micro-bead
  // arrivano a x 5.2 / y 3.6, piu' raggio e allargamento dello smooth-min) e
  // la camera sta a z = -8.2: nessun raggio puo' incontrare qualcosa oltre
  // ~15.2. I 40 di prima facevano marciare ogni pixel di sfondo per 25 unita'
  // di vuoto (o, piu' spesso, gli facevano esaurire tutti i 90 step).
  #define MAX_DIST 16.0
  // Raggio della bounding sphere usata per il rigetto analitico: 8.0 lascia
  // margine sopra i ~7.2 effettivi, cosi' non taglia mai la silhouette.
  #define SCENE_RADIUS 8.0
  #define SURF_DIST 0.001

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float getSceneSDF(vec3 p) {
    float t = uTime * 0.12;
    vec2 mPos = (uMouse - 0.5) * 6.5;

    float d = length(p - vec3(mPos.x, mPos.y, 1.2)) - 0.9;

    for(int i = 0; i < 8; i++) {
        float fi = float(i);
        vec3 pos = vec3(
            sin(t * 0.7 + fi * 1.5) * 3.8,
            cos(t * 0.5 + fi * 2.2) * 2.2,
            sin(t * 0.9 + fi * 0.8) * 1.0
        );
        vec3 p_str = p - pos;
        p_str.y *= 0.8 + 0.3 * sin(t + fi);
        float r = 0.5 + 0.3 * sin(t * 0.8 + fi);
        d = smin(d, length(p_str) - r, 1.1);
    }

    for(int j = 0; j < 16; j++) {
        float fj = float(j);
        vec3 pos = vec3(
            sin(t * 1.3 + fj * 4.1) * 5.2,
            cos(t * 1.0 + fj * 2.8) * 3.6,
            sin(t * 1.6 + fj * 0.7) * 0.8
        );
        float r = 0.08 + 0.2 * abs(cos(t * 1.8 + fj * 1.2));
        d = smin(d, length(p - pos) - r, 0.45);
    }

    d += sin(p.x * 2.5 + t) * sin(p.y * 2.5 + t) * 0.06;
    return d;
  }

  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    vec3 n = vec3(
        getSceneSDF(p + e.xyy) - getSceneSDF(p - e.xyy),
        getSceneSDF(p + e.yxy) - getSceneSDF(p - e.yxy),
        getSceneSDF(p + e.yyx) - getSceneSDF(p - e.yyx)
    );
    return normalize(n);
  }

  vec3 getEnvironment(vec3 r) {
    vec3 col = vec3(1.0);

    float overhead = smoothstep(-0.5, 0.5, r.y);
    col = mix(vec3(0.85, 0.9, 0.96), vec3(1.0), overhead);

    float bar1 = pow(max(0.0, dot(r, normalize(vec3(1.5, 0.2, -0.8)))), 24.0);
    float bar2 = pow(max(0.0, dot(r, normalize(vec3(-1.2, 0.1, -0.4)))), 32.0);
    col += vec3(1.8) * bar1 * overhead;
    col += vec3(1.2) * bar2 * (1.0 - overhead);

    float panelA = smoothstep(0.4, 0.9, abs(r.x));
    float panelB = smoothstep(0.2, 0.7, abs(r.z));
    col = mix(col, vec3(0.0), panelA * 0.85 * (1.0 - overhead));
    col = mix(col, vec3(0.01), panelB * 0.65);

    float strips = pow(abs(cos(r.x * 2.5 + r.z * 1.5 + uTime * 0.05)), 60.0);
    col = mix(col, vec3(1.5), strips * 0.4 * overhead);

    return col;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    vec3 ro = vec3(0.0, 0.0, -8.2);
    vec3 rd = normalize(vec3(uv, 3.2));

    // Rigetto analitico contro la bounding sphere della scena, prima di
    // toccare il raymarcher: la SDF costa 24 sfere + uno smooth-min per
    // valutazione, quindi un raggio di sfondo che non intersecava nulla
    // bruciava fino a 90 x 24 length() per niente. Qui bastano una decina di
    // istruzioni per saperlo, e i pixel di sfondo — la maggioranza — escono
    // subito.
    float b = dot(ro, rd);
    float c = dot(ro, ro) - SCENE_RADIUS * SCENE_RADIUS;
    float h = b * b - c;

    // Fuori dalla sfera non c'e' geometria: dTotal oltre MAX_DIST marca il
    // pixel come sfondo senza entrare nel loop. Non si esce con un return
    // anticipato perche' la correzione gamma in fondo va applicata anche allo
    // sfondo.
    float dTotal = MAX_DIST + 1.0;

    if(h > 0.0) {
        h = sqrt(h);
        // Si parte dall'ingresso nella sfera (mai dietro la camera) e si
        // smette all'uscita: il vuoto prima e dopo non va marciato.
        float tExit = min(MAX_DIST, -b + h);
        dTotal = max(0.0, -b - h);

        // Epsilon di superficie proporzionale all'impronta del pixel: mezzo
        // pixel proiettato alla distanza corrente (il piano immagine sta a
        // 3.2, quindi un pixel vale 1/uResolution.y in unita' uv). Con una
        // soglia fissa a 0.001 i raggi lontani continuavano a fare passi
        // sub-pixel per una precisione che lo schermo non puo' rappresentare.
        float epsSlope = 0.5 / (uResolution.y * 3.2);

        for(int i = 0; i < MAX_STEPS; i++) {
            vec3 p = ro + rd * dTotal;
            float dS = getSceneSDF(p);
            float eps = SURF_DIST + dTotal * epsSlope;
            dTotal += dS;
            if(dTotal > tExit || abs(dS) < eps) break;
        }

        // tExit puo' essere piu' vicino di MAX_DIST: senza normalizzare, un
        // raggio uscito dalla sfera senza colpire nulla passerebbe comunque
        // il test "dTotal < MAX_DIST" qui sotto e verrebbe ombreggiato.
        if(dTotal > tExit) dTotal = MAX_DIST + 1.0;
    }

    vec3 col = uBgColor;

    if(dTotal < MAX_DIST) {
        vec3 p = ro + rd * dTotal;
        vec3 n = getNormal(p);
        vec3 v = -rd;
        vec3 r = reflect(rd, n);

        vec3 reflection = getEnvironment(r);

        col = reflection * vec3(0.98, 0.99, 1.0);

        vec3 lightPos = normalize(vec3((uMouse.x - 0.5) * 15.0, (uMouse.y - 0.5) * 15.0 + 5.0, -3.5));

        float specPeak = pow(max(0.0, dot(reflect(-lightPos, n), v)), 4000.0);
        col += vec3(3.5) * specPeak;

        float fres = pow(1.0 - max(0.0, dot(n, v)), 6.0);
        col = mix(col, vec3(1.0), fres * 0.75);

        col += fres * vec3(0.6, 0.8, 1.2) * 0.6;

        float specSoft = pow(max(0.0, dot(reflect(-lightPos, n), v)), 64.0);
        col += vec3(0.4, 0.6, 1.0) * specSoft * 0.35;

        float curve = 1.0 - abs(dot(n, vec3(0,0,1)));
        col *= mix(1.0, 0.7, pow(curve, 3.5));

        // Tinta del "mercurio" — moltiplicativa (non additiva) per non
        // spegnere i glint speculari, che restano bianchi/luminosi sopra la
        // base colorata. uTintColor = (1,1,1) => nessuna tinta, cromo argento.
        col *= mix(vec3(1.0), uTintColor * 1.35, 0.55);
    }

    col = pow(col, vec3(0.85));
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function toVec3(color: ModeColor | undefined, isDark: boolean, fallback: [number, number, number]) {
  const hex = typeof color === "string" ? color : color?.[isDark ? "dark" : "light"];
  const match = hex && /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return fallback;
  return [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255] as [number, number, number];
}

/**
 * Liquid chrome: raymarched metaballs under a photo-studio environment, chasing the pointer.
 * Ported from Typamine. Without WebGL the hero still shows its content.
 */
export function ChromeBlobHero({
  children,
  align,
  vAlign,
  contentClassName,
  blobColor,
  backgroundColor,
  overlayClassName,
  interactive = true,
  heightClassName = "min-h-dvh",
  fixedBackground = false,
  quality = "auto",
  maxFps = 30,
  className,
}: ChromeBlobHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const isDark = useUI().scope["data-mode"] === "dark";

  const tint = toVec3(blobColor, isDark, [1, 1, 1]);
  const background = toVec3(backgroundColor, isDark, [1, 1, 1]);

  // Only the uniforms change with the mode: rebuilding the renderer would flash.
  useEffect(() => {
    materialRef.current?.uniforms.uTintColor.value.set(...tint);
    materialRef.current?.uniforms.uBgColor.value.set(...background);
  }, [...tint, ...background]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, depth: false, stencil: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      return;
    }

    const mouse = new THREE.Vector2(0.5, 0.5);
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const getSize = () => {
      if (fixedBackground) return { width: window.innerWidth, height: window.innerHeight };
      const rect = container.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    };

    const pixelRatio = Math.min(window.devicePixelRatio, QUALITY_PIXEL_RATIO[quality]);
    const size = getSize();
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(size.width, size.height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        // In drawing-buffer pixels, like gl_FragCoord: with CSS pixels the blob shifts on retina.
        uResolution: { value: new THREE.Vector2(size.width * pixelRatio, size.height * pixelRatio) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTintColor: { value: new THREE.Vector3(...tint) },
        uBgColor: { value: new THREE.Vector3(...background) },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    materialRef.current = material;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // Rendering is the expensive part, so only it is throttled; the mouse lerp keeps the refresh rate.
    const frameInterval = maxFps > 0 ? 1000 / maxFps : 0;
    let lastRenderAt = -Infinity;
    let animationId = requestAnimationFrame(function tick(now) {
      animationId = requestAnimationFrame(tick);
      mouse.lerp(targetMouse, MOUSE_LERP);
      if (now - lastRenderAt < frameInterval - 0.5) return;
      lastRenderAt = now;
      material.uniforms.uTime.value = now * 0.001;
      material.uniforms.uMouse.value.copy(mouse);
      renderer.render(scene, camera);
    });

    const onResize = () => {
      const next = getSize();
      renderer.setSize(next.width, next.height, false);
      material.uniforms.uResolution.value.set(next.width * pixelRatio, next.height * pixelRatio);
    };
    const resizeObserver = fixedBackground ? null : new ResizeObserver(onResize);
    resizeObserver?.observe(container);
    if (fixedBackground) window.addEventListener("resize", onResize);

    const pointerTarget: Window | HTMLElement = fixedBackground ? window : container;
    const onPointerMove = (event: Event) => {
      const { clientX, clientY } = event as PointerEvent;
      const rect = fixedBackground ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight } : container.getBoundingClientRect();
      targetMouse.set((clientX - rect.left) / rect.width, 1 - (clientY - rect.top) / rect.height);
    };
    if (interactive) pointerTarget.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver?.disconnect();
      if (fixedBackground) window.removeEventListener("resize", onResize);
      if (interactive) pointerTarget.removeEventListener("pointermove", onPointerMove);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      materialRef.current = null;
    };
    // The colours are applied by the effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, fixedBackground, quality, maxFps]);

  const layer = fixedBackground ? "fixed" : "absolute";

  return (
    <div
      ref={containerRef}
      className={cn("relative isolate flex", fixedBackground ? "overflow-x-clip" : "overflow-hidden", heightClassName, className)}
    >
      <canvas ref={canvasRef} className={cn(layer, "inset-0 -z-20 h-full w-full")} />
      {overlayClassName && <div className={cn(layer, "inset-0 -z-10", overlayClassName)} />}
      <HeroContent align={align} vAlign={vAlign} contentClassName={contentClassName}>
        {children}
      </HeroContent>
    </div>
  );
}

export default ChromeBlobHero;
