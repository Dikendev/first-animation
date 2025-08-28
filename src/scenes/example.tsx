import { makeScene2D, Path } from '@motion-canvas/2d';
import { all, createRef } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const letter1 = createRef<Path>();
  const letter2 = createRef<Path>();
  const letter3 = createRef<Path>();

  view.add(
    <Path
      ref={letter1}
      data="M5.31338071,5.49612183 L5.31338071,32.0625381 L10.6257868,32.0625381 L10.6257868,10.8092589 L15.9384365,10.8092589 L15.9384365,32.0625381 L21.2523046,32.0625381 L21.2523046,10.8092589 L26.5654416,10.8092589 L26.5654416,37.3754315 L0,37.3754315 L0,0.183715736 L69.0676142,0.183715736 L69.0676142,5.49612183 L5.31338071,5.49612183"
      stroke={'#1e00e4'}
      lineWidth={1}
      start={0}
      position={[-355, -230]}
      end={0}
      scale={10}
    ></Path>,
    // ... and so on for each letter
  );

  view.add(
    <Path
      ref={letter2}
      data="M47.8182335,26.7476954 L47.8182335,10.8092589 L31.8778477,10.8092589 L31.8778477,37.3754315 L47.8172589,37.3754315 L47.8172589,32.0625381 L37.1912284,32.0625381 L37.1912284,26.7476954 L47.8182335,26.7476954 L47.8182335,26.7476954 Z M37.1912284,16.120934 L42.5050964,16.120934 L42.5050964,21.4350457 L37.1912284,21.4350457 L37.1912284,16.120934 Z"
      stroke={'#1e00e4'}
      lineWidth={1}
      position={[-355, -230]}
      start={0}
      end={0}
      scale={10}
    ></Path>
    // ... and so on for each letter
  );

  view.add(
    <Path
      ref={letter3}
      data="M69.0676142,48 L69.0676142,10.8092589 L53.129665,10.8092589 L53.129665,37.3754315 L63.7559391,37.3754315 L63.7559391,42.6875939 L0,42.6875939 L0,48 L69.0676142,48 L69.0676142,48 Z M58.4430457,16.1233706 L63.7559391,16.1233706 L63.7559391,32.0625381 L58.4430457,32.0625381 L58.4430457,16.1233706 Z"
      stroke={'#1e00e4'}
      lineWidth={1}
      position={[-355, -230]}
      start={0}
      end={0}
      scale={10}
    ></Path>
  );

  yield* all(
    letter1().end(1, 5),
    letter2().end(1, 4),
    letter3().end(1, 5),
  );

  yield* all(
    letter1().fill('#1e00e4', 0.5),
    letter2().fill('#1e00e4', 0.5),
    letter3().fill('#1e00e4', 0.5)
  );
});
