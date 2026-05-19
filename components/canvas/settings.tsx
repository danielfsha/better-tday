"use client";

import { useState } from "react";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

export default function SettingsPanel({}) {
  const [value, setValue] = useState(50);
  return (
    <div className="flex flex-col h-full items-start justify-start p-2 gap-2">
      <div className="w-full flex items-center justify-between py-1">
        Dark mode
        <Switch />
      </div>

      <div className="w-full">
        <Slider
          value={value}
          onValueChange={(newValue) => setValue(newValue)}
          text="Creativity"
        />
      </div>
    </div>
  );
}
