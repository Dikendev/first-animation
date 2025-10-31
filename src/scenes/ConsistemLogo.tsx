import { makeScene2D, Path, Rect } from '@motion-canvas/2d';
import { all, createRef, easeOutCubic, createSignal, waitFor, easeInCubic } from '@motion-canvas/core';
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
  const highlight = createRef<Path>();
  const highlightSoft = createRef<Path>();
  const flashRect = createRef<Rect>();

  const sweep = createSignal(-0.15);

  const gradient = new Gradient({
    from: [-200, -200],
    to: [200, 200],
    stops: [
      { offset: 0, color: '#E84F3D' },
      { offset: 0.5, color: '#FF6B54' },
      { offset: 1, color: '#312D31' }
    ]
  });

  view.add(
    <Path
      ref={letters}
      data={svgPaths[0]}
      stroke={gradient}
      lineWidth={10}
      start={0}
      end={0}
      scale={0.5}
      position={[-60, -60]}
      shadowColor="rgba(0, 0, 0, 0.5)"
      shadowOffset={[6, 6]}
      shadowBlur={7}
      lineCap="round"
      lineJoin="round"
      antialiased={true}
    />
  );

  view.add(
    <Path
      ref={highlightSoft}
      data={svgPaths[0]}
      stroke="#ffffff"
      lineWidth={20}
      start={sweep}
      end={() => sweep() + 0.12}
      scale={0.5}
      position={[-60, -60]}
      opacity={0}
      lineCap="round"
      lineJoin="round"
      antialiased={true}
      shadowColor="#ffffff"
      shadowOffset={[0, 0]}
      shadowBlur={12}
    />
  );

  view.add(
    <Path
      ref={highlight}
      data={svgPaths[0]}
      stroke="#ffffff"
      lineWidth={10}
      start={sweep}
      end={() => sweep() + 0.12}
      scale={0.5}
      position={[-60, -60]}
      opacity={0}
      lineCap="round"
      lineJoin="round"
      antialiased={true}
    />
  );

  view.add(
    <Rect
      ref={flashRect}
      fill="#ffffff"
      width="100%"
      height="100%"
      opacity={0}
      zIndex={999}
    />
  );

  yield* all(letters().end(1, 2.5));
  yield* all(letters().fill('#312D31', 1));

  yield* all(
    flashRect().opacity(0.7, 0.5, easeInCubic),
    letters().shadowBlur(15, 0.3, easeOutCubic),
  );

  yield* all(
    flashRect().opacity(0, 0.6, easeOutCubic),
    highlightSoft().opacity(0.7, 0.1),
    highlight().opacity(1, 0.1),
    sweep(1, 0.9, easeOutCubic),
    letters().shadowBlur(12, 0).to(20, 0.45).to(12, 0.45)
  );

  yield* all(
    highlight().opacity(0, 0.2),
    highlightSoft().opacity(0, 0.2)
  );

  yield* all(
    letters().shadowBlur(15, 1).to(10, 1).to(5, 0.5)
  );
});
