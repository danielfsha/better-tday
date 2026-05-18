import { motion } from "motion/react";

import { AnimatedMaskRevealText } from "./animated-mask-reveal-text";
import AppSidebar from "./app-sidebar";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import FormComponent from "./form-component";
import { AnimatedText } from "./animated-text";
import NumberFlow from "@number-flow/react";
import { useState } from "react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ChatInterface() {
  const [value, setValue] = useState(50);
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      <AppSidebar />

      <motion.main
        layout
        transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.9 }}
        className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
      >
        <header className="absolute top-0 left-0 w-full flex items-center justify-between gap-4 border-b border-border/60 px-4 py-1">
          <motion.div
            layout
            animate={{ x: isExpanded ? 0 : 8, scale: isExpanded ? 1 : 0.98 }}
            transition={{
              type: "spring",
              stiffness: 700,
              damping: 42,
              mass: 0.7,
            }}
            className="origin-left flex gap-1 items-center justify-center"
          >
            <SidebarTrigger />
            <span className="font-serif text-4xl">
              {/* <AnimatedText value={value.toString()} /> */}

              <NumberFlow value={value} />
            </span>
          </motion.div>

          <Avatar>
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </header>

        <motion.section
          layout
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 30,
            mass: 0.9,
          }}
          className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 px-6 py-10 text-center"
        >
          <span className="font-serif text-4xl">
            <NumberFlow value={value} />
          </span>

          <Switch />

          <AnimatedMaskRevealText
            text={"What would you like\nto design tday?"}
            className="text-4xl font-serif lg:text-6xl"
          />

          {/* make a 2 sentence description for the app description*/}
          <p className="text-gray-600 font-sans max-w-md">
            Pick a format and start designing your idea. Tday understands your
            creativity and helps bring it to life.
          </p>

          <FormComponent />

          <div className="w-full max-w-75">
            <Slider
              value={value}
              onValueChange={(newValue) => setValue(newValue)}
              text="Creativity"
            />
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
