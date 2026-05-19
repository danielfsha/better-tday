import {
  MousePointer2, Hand, Square, Circle as CircleIcon, Type, Minus,
  Pen, Frame as FrameIcon, Hexagon,
} from "lucide-react";
import type { Tool } from "./hooks/useKeyboardShortcuts";

export interface ToolDef {
  id: Tool;
  icon: typeof MousePointer2;
  label: string;
  shortcut: string;
  cursor?: string;
}

export const TOOLS: ToolDef[] = [
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "hand", icon: Hand, label: "Hand", shortcut: "H", cursor: "grab" },
  { id: "frame", icon: FrameIcon, label: "Frame", shortcut: "F", cursor: "crosshair" },
  { id: "rect", icon: Square, label: "Rectangle", shortcut: "R", cursor: "crosshair" },
  { id: "circle", icon: CircleIcon, label: "Ellipse", shortcut: "O", cursor: "crosshair" },
  { id: "polygon", icon: Hexagon, label: "Polygon", shortcut: "G", cursor: "crosshair" },
  { id: "line", icon: Minus, label: "Line", shortcut: "L", cursor: "crosshair" },
  { id: "pen", icon: Pen, label: "Pen", shortcut: "P", cursor: "crosshair" },
  { id: "text", icon: Type, label: "Text", shortcut: "T", cursor: "text" },
];
