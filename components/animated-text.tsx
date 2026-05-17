"use client";

import { AnimatePresence, motion } from "motion/react";

export function AnimatedText({
  value = "0",
  animateKey = 0,
}: {
  value?: string;
  animateKey?: string | number;
}) {
  const chars = value.split("");

  return (
    <motion.span layout className="inline-flex items-baseline">
      <AnimatePresence mode="popLayout" initial={false}>
        {chars.map((ch, index) => (
          <motion.span
            key={`${animateKey}-${index}-${ch}`}
            layout
            initial={{ y: -10, opacity: 0, filter: "blur(6px)" }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                type: "spring",
                stiffness: 520,
                damping: 34,
                mass: 0.35,
                delay: index * 0.055,
              },
            }}
            exit={{
              y: 10,
              opacity: 0,
              filter: "blur(5px)",
              transition: {
                duration: 0.12,
                ease: "easeOut",
                delay: index * 0.02,
              },
            }}
            className="inline-block will-change-transform"
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.span>
  );
}
