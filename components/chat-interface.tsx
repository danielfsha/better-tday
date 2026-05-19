import { motion } from "motion/react";

import { AnimatedMaskRevealText } from "./animated-mask-reveal-text";
import AppSidebar from "./app-sidebar";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import FormComponent from "./form-component";
import NumberFlow from "@number-flow/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
} from "./ui/popover";
import { SignOutIcon } from "@phosphor-icons/react";

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

          <Popover>
            <PopoverTrigger>
              <Avatar>
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent align="end" className={"gap-0 p-1"}>
              <div className="flex items-center justify-betweeen w-full hover:bg-gray-300 p-1 py-1.5 rounded-sm cursor-pointer">
                <div className="flex gap-4 items-center">
                  <Avatar size="lg">
                    <AvatarImage
                      src="https://github.com/evilrabbit.png"
                      alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col items-start justify-start">
                    <p className="text-sm">John Doe</p>
                    <span className="text-sm -mt-1 opacity-60">
                      jonhdoe@gmail.com
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-betweeen w-full hover:bg-red-300 text-red-500 text-center p-1 py-1.5 rounded-sm cursor-pointer">
                <div className="flex items-center justify-center gap-2 flex-1">
                  <SignOutIcon className="size-5" />
                  <PopoverDescription className={"text-center text-red-500"}>
                    Logout
                  </PopoverDescription>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
