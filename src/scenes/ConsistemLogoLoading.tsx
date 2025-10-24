import { makeScene2D, Path } from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutSine,
  easeOutBack,
} from '@motion-canvas/core';
import { Gradient } from '@motion-canvas/2d';

async function loadSvgPaths(url: string): Promise<string[]> {
  const response = await fetch(url);
  const svgText = await response.text();
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  const paths = Array.from(svgDoc.querySelectorAll('path'));
  return paths.map(p => p.getAttribute('d') || '');
}

export default makeScene2D(function* (view) {
  const svgPaths = yield loadSvgPaths('./consistem-logo.svg');
  const letters = createRef<Path>();
  const shadow3D = createRef<Path>();

  const gradient = new Gradient({
    from: [-200, -200],
    to: [200, 200],
    stops: [
      { offset: 0, color: '#E84F3D' },
      { offset: 0.5, color: '#FF6B54' },
      { offset: 1, color: '#312D31' },
    ],
  });

  view.add(
    <Path
      ref={shadow3D}
      data={svgPaths[0]}
      stroke={'#1a1a1a'}
      lineWidth={12}
      start={0}
      end={0}
      scale={0.5}
      position={[-58, -58]}
      shadowColor="rgba(0, 0, 0, 0.8)"
      shadowOffset={[2, 2]}
      shadowBlur={15}
      lineCap="round"
      lineJoin="round"
      antialiased={true}
      opacity={0.3}
    />
  );

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
      shadowColor="rgba(0, 0, 0, 0.4)"
      shadowOffset={[6, 6]}
      shadowBlur={7}
      lineCap="round"
      lineJoin="round"
      antialiased={true}
      rotation={0}
    />
  );

  yield* all(
    letters().end(1, 0),
    shadow3D().end(1, 0),
  );

  yield* all(
    letters().rotation(15, 0,).to(0, 1, easeOutBack),
    shadow3D().rotation(10, 0).to(0, 1, easeOutBack),
    letters().fill('#312D31', 1),
    shadow3D().fill('#0a0a0a', 0.5),
    letters().position([-60, -60], 0).to([-62, -62], 0.5, easeInOutSine),
    shadow3D().position([-58, -58], 0).to([-56, -56], 0.5, easeInOutSine)
  );

  yield* all(
    letters().scale(0.55, 0.3, easeInOutSine),
    letters().lineWidth(14, 0.5, easeInOutSine),
    shadow3D().scale(0.55, 0.3, easeInOutSine),
    shadow3D().lineWidth(14, 0.5, easeInOutSine),
  );

  yield* letters().fill('#312D31', 0.5);

  yield* all(
    letters().scale(0.5, 0.3, easeInOutSine),
    letters().lineWidth(10, 0.3, easeInOutSine),
    shadow3D().opacity(0.2, 0).to(0, 0.8)
  );

  yield* all(
    letters().rotation(-20, 1, easeInOutSine),
    shadow3D().rotation(-8, 1, easeInOutSine),
    letters().fill(null, 1),
    shadow3D().fill(null, 1),
    letters().opacity(1, 0).to(0, 0.8),
  );
});
