import { makeScene2D, Path } from '@motion-canvas/2d';
import { all, createRef, easeOutCubic, delay } from '@motion-canvas/core';
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
      lineWidth={12}
      start={0}
      end={0}
      scale={0.5}
      position={[-60, -60]}
      shadowColor='rgba(0, 0, 0, 0.5)'
      shadowOffset={[6, 6]}
      shadowBlur={7}
      lineCap="round"
      lineJoin="round"
      antialiased={true}
    />
  );

  yield* all(
    letters().end(1, 2.5),
  );

  yield* all(
    letters().fill('#312D31', 1),
  );

  yield* all(
    letters().shadowBlur(15, 1).to(25, 1).to(15, 0.5)
  );
});
