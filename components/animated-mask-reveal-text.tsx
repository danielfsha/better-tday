import { cubicBezier, motion } from "motion/react";

interface AnimatedMaskRevealProps {
  text: string;
  className?: string;
}

function splitLines(text: string) {
  return text.split(/\n/);
}

function splitCharacters(text: string) {
  return Array.from(text);
}

export function AnimatedMaskRevealText({
  text,
  className,
}: AnimatedMaskRevealProps) {
  const lines = splitLines(text);
  // soft-blur-in (Motion): scaled duration/stagger from skill effect contract
  const duration = 0.648; // 648ms
  const stagger = 0.018; // 18ms
  const easing = cubicBezier(0.22, 1, 0.36, 1);
  let globalCharIndex = 0;

  return (
    <h1 className={"text-center leading-tight " + (className || "")}>
      {lines.map((line, lineIndex) => {
        const chars = splitCharacters(line);

        return (
          <span
            key={`line-${lineIndex}`}
            style={{ display: "block", whiteSpace: "pre" }}
          >
            {chars.map((char, charIndex) => {
              const delay = globalCharIndex * stagger;
              globalCharIndex += 1;

              return (
                <motion.span
                  key={`char-${lineIndex}-${charIndex}`}
                  initial={{ opacity: 0, y: 10, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration,
                    delay,
                    ease: easing,
                  }}
                  style={{
                    display: "inline-block",
                    backfaceVisibility: "hidden",
                    transformOrigin: "50% 55%",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
