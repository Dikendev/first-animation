import { makeScene2D, Path, Rect } from '@motion-canvas/2d';
import { all, createRef, easeInOutSine } from '@motion-canvas/core';
import { Gradient } from '@motion-canvas/2d';

async function loadSvgPaths(url: string): Promise<string[]> {
  const response = await fetch(url);
  const svgText = await response.text();
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  const paths = Array.from(svgDoc.querySelectorAll("path"));
  return paths.map(p => p.getAttribute("d") || "");
}

export default makeScene2D(function* (view) {
  const svgPaths = yield loadSvgPaths("./consistem-logo.svg");
  const letters = createRef<Path>();
  const glass = createRef<Rect>();
  const glassEdge = createRef<Rect>();

  // Logo gradient
  const gradient = new Gradient({
    from: [-200, -200],
    to: [200, 200],
    stops: [
      { offset: 0, color: '#E84F3D' },
      { offset: 0.5, color: '#FF6B54' },
      { offset: 1, color: '#312D31' }
    ]
  });

  // Glass body: soft translucent band
  const glassGradient = new Gradient({
    from: [-400, 0],
    to: [400, 0],
    stops: [
      { offset: 0, color: 'rgba(255,255,255,0)' },
      { offset: 0.45, color: 'rgba(255,255,255,0.10)' },
      { offset: 0.5, color: 'rgba(255,255,255,0.18)' },
      { offset: 0.55, color: 'rgba(255,255,255,0.10)' },
      { offset: 1, color: 'rgba(255,255,255,0)' },
    ],
  });

  // Specular edge: thin bright line in the center
  const edgeGradient = new Gradient({
    from: [-400, 0],
    to: [400, 0],
    stops: [
      { offset: 0.48, color: 'rgba(255,255,255,0)' },
      { offset: 0.5, color: 'rgba(255,255,255,0.9)' },
      { offset: 0.52, color: 'rgba(255,255,255,0)' },
    ],
  });

  view.add(
    <Path
      ref={letters}
      data={svgPaths[0]}
      stroke={gradient}
      lineWidth={10}
      scale={0.5}
      position={[-60, -60]}
      shadowColor='rgba(0, 0, 0, 0.5)'
      shadowOffset={[6, 6]}
      shadowBlur={5}
      lineCap="round"
      fill={'#312D31'}
      lineJoin="round"
      antialiased={true}
    />
  );

  // Glass overlays (on top)
  view.add(
    <Rect
      ref={glass}
      fill={glassGradient}
      size={[1600, 520]}
      position={[-300, -60]}
      rotation={20}
      opacity={0}
    />
  );

  view.add(
    <Rect
      ref={glassEdge}
      fill={edgeGradient}
      size={[1600, 520]}
      position={[-300, -60]}
      rotation={20}
      opacity={0}
    />
  );

  // Sweep the glass across the logo
  yield* all(
    glass().opacity(1, 0.15),
    glassEdge().opacity(0.9, 0.15)
  );

  yield* all(
    glass().position([400, -60], 5, easeInOutSine),
    glassEdge().position([400, -60], 5, easeInOutSine),
    // Subtle refraction feel via glow bump while passing
    letters().shadowBlur(5, 0).to(9, 0.6).to(5, 0.6)
  );

  yield* all(
    glass().opacity(0, 0.18),
    glassEdge().opacity(0, 0.18)
  );
});
