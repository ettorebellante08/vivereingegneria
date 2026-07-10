"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

export type Scene = {
  kicker: string;
  title: string;
  text: string;
  /** Tailwind classes for the scene's full-bleed background layer. */
  bg: string;
};

/**
 * A pinned, scroll-driven sequence. The section is `scenes.length` viewports
 * tall; inside, a sticky stage cross-fades between full-screen scenes as the
 * user scrolls — the signature cinematic moment of the site.
 */
export function ScrollScenes({ scenes }: { scenes: Scene[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      style={{ height: `${scenes.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* progress rail */}
        <ProgressRail count={scenes.length} progress={scrollYProgress} />
        {scenes.map((scene, i) => (
          <SceneLayer
            key={scene.title}
            scene={scene}
            index={i}
            total={scenes.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function SceneLayer({
  scene,
  index,
  total,
  progress,
}: {
  scene: Scene;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const p0 = index * seg;
  const p1 = (index + 1) * seg;
  const fade = seg * 0.35;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const inputs = [p0, p0 + fade, p1 - fade, p1];
  const opacityOut = [
    isFirst ? 1 : 0,
    1,
    1,
    isLast ? 1 : 0,
  ];

  const opacity = useTransform(progress, inputs, opacityOut);
  const y = useTransform(progress, [p0, p1], [60, -60]);
  const scale = useTransform(progress, [p0, p1], [1.08, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {/* background */}
      <motion.div
        aria-hidden
        style={{ scale }}
        className={`absolute inset-0 ${scene.bg}`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_40%,rgba(3,6,20,0.55))]"
      />

      {/* content */}
      <motion.div
        style={{ y }}
        className="relative mx-auto max-w-4xl px-6 text-center text-white"
      >
        <p className="eyebrow text-white/70">{scene.kicker}</p>
        <h2 className="mt-6 text-balance text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
          {scene.title}
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-balance text-lg text-white/75">
          {scene.text}
        </p>
      </motion.div>
    </motion.div>
  );
}

function ProgressRail({
  count,
  progress,
}: {
  count: number;
  progress: MotionValue<number>;
}) {
  return (
    <div className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} index={i} total={count} progress={progress} />
      ))}
    </div>
  );
}

function Dot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const opacity = useTransform(
    progress,
    [index * seg, (index + 0.5) * seg, (index + 1) * seg],
    [0.3, 1, 0.3],
  );
  const scale = useTransform(
    progress,
    [index * seg, (index + 0.5) * seg, (index + 1) * seg],
    [1, 1.6, 1],
  );
  return (
    <motion.span
      style={{ opacity, scale }}
      className="size-1.5 rounded-full bg-white"
    />
  );
}
