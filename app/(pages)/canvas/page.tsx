"use client";

import FileTree from "@/components/canvas/file-tree";
import CanvasMenubar from "@/components/canvas/menubar";
import FormComponent from "@/components/form-component";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import UserProfile from "@/components/user-profile";
import { useState } from "react";

export default function Canvas() {
  const [value, setValue] = useState(50);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <header className="w-full flex items-center justify-between p-1">
        <CanvasMenubar />

        <UserProfile />
      </header>

      <div className="flex-1 w-full">
        <ResizablePanelGroup orientation="horizontal" className="h-full ">
          {/* Left vertical split */}
          <ResizablePanel defaultSize="20%">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="50%">
                <div className="h-full w-full flex flex-col items-start justify-start p-2">
                  <FileTree />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="50%">
                <div className="h-full w-full flex flex-col items-start justify-end p-2">
                  <FormComponent />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          {/* Middle panel */}
          <ResizablePanel defaultSize="60%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Middle</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          {/* Right panel */}
          <ResizablePanel defaultSize="20%">
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
