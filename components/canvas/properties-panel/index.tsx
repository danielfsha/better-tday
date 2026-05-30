import React, { useEffect, useState } from "react";
import * as fabric from "fabric";

import PositionPanel from "./position";
import AppearancePanel from "./appearance";
import FillPanel from "./fill";
import StrokePanel from "./stroke";
import EffectPanel from "./effect";
import LayoutPanel from "./layout";
import GuideExportPanel from "./guide-export";
import { Button } from "@/components/ui/button";

export default function PropertiesPanel({
  canvas,
}: {
  canvas?: fabric.Canvas | null;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null,
  );

  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [angle, setAngle] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const [opacity, setOpacity] = useState(1);
  const [visible, setVisible] = useState(true);

  const [fill, setFill] = useState("#000000");

  const [stroke, setStroke] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>([]);

  const [shadow, setShadow] = useState("none");

  const getDisplayedWidth = (obj: fabric.Object) =>
    (obj.width ?? 0) * (obj.scaleX ?? 1);

  const getDisplayedHeight = (obj: fabric.Object) =>
    (obj.height ?? 0) * (obj.scaleY ?? 1);

  const syncPropertiesFromObject = (obj: fabric.Object) => {
    setLeft(Math.round(obj.left ?? 0));
    setTop(Math.round(obj.top ?? 0));

    setWidth(Math.round(getDisplayedWidth(obj)));
    setHeight(Math.round(getDisplayedHeight(obj)));

    setAngle(Math.round(obj.angle ?? 0));

    setFlipX(obj.flipX ?? false);
    setFlipY(obj.flipY ?? false);

    setOpacity(obj.opacity ?? 1);
    setVisible(obj.visible ?? true);

    setFill((obj.fill as string) ?? "#000000");

    setStroke((obj.stroke as string) ?? "#000000");
    setStrokeWidth(obj.strokeWidth ?? 1);
    setStrokeDashArray(obj.strokeDashArray ?? []);

    setShadow(
      typeof obj.shadow === "string" ? obj.shadow : obj.shadow?.color || "none",
    );
  };

  const resizeKeepingTopLeft = (
    obj: fabric.Object,
    newWidth?: number,
    newHeight?: number,
  ) => {
    const oldBounds = obj.getBoundingRect();

    const baseWidth = obj.width ?? 1;
    const baseHeight = obj.height ?? 1;

    obj.set({
      scaleX: newWidth !== undefined ? newWidth / baseWidth : (obj.scaleX ?? 1),

      scaleY:
        newHeight !== undefined ? newHeight / baseHeight : (obj.scaleY ?? 1),
    });

    obj.setCoords();

    const newBounds = obj.getBoundingRect();

    obj.set({
      left: (obj.left ?? 0) + (oldBounds.left - newBounds.left),
      top: (obj.top ?? 0) + (oldBounds.top - newBounds.top),
    });

    obj.setCoords();
  };

  useEffect(() => {
    if (!canvas) return;

    const updateSelection = () => {
      const active = canvas.getActiveObject();

      setSelectedObject(active);

      if (active) {
        syncPropertiesFromObject(active);
      }
    };

    const objectChanged = (e: any) => {
      const obj = e.target;

      if (!obj) return;

      syncPropertiesFromObject(obj);
    };

    canvas.on("selection:created", updateSelection);
    canvas.on("selection:updated", updateSelection);

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    canvas.on("object:moving", objectChanged);
    canvas.on("object:scaling", objectChanged);
    canvas.on("object:modified", objectChanged);
    canvas.on("object:rotating", objectChanged);

    return () => {
      canvas.off("selection:created", updateSelection);
      canvas.off("selection:updated", updateSelection);

      canvas.off("object:moving", objectChanged);
      canvas.off("object:scaling", objectChanged);
      canvas.off("object:modified", objectChanged);
      canvas.off("object:rotating", objectChanged);
    };
  }, [canvas]);

  const updateWidth = (value: number) => {
    setWidth(value);

    if (!selectedObject || !canvas) return;

    resizeKeepingTopLeft(
      selectedObject,
      value,
      getDisplayedHeight(selectedObject),
    );

    canvas.requestRenderAll();
  };

  const updateHeight = (value: number) => {
    setHeight(value);

    if (!selectedObject || !canvas) return;

    resizeKeepingTopLeft(
      selectedObject,
      getDisplayedWidth(selectedObject),
      value,
    );

    canvas.requestRenderAll();
  };

  const handleInputChange =
    (setter: (value: any) => void, prop: keyof fabric.Object) =>
    (value: any) => {
      setter(value);

      if (!selectedObject || !canvas) return;

      selectedObject.set({
        [prop]: value,
      });

      selectedObject.setCoords();

      canvas.requestRenderAll();
    };

  useEffect(() => {
    if (!selectedObject || !canvas) return;

    selectedObject.set({
      angle,
      flipX,
      flipY,
      opacity,
      visible,
      fill,
      stroke,
      strokeWidth,
      strokeDashArray,
      shadow,
    });

    selectedObject.setCoords();

    canvas.requestRenderAll();
  }, [
    selectedObject,
    canvas,
    angle,
    flipX,
    flipY,
    opacity,
    visible,
    fill,
    stroke,
    strokeWidth,
    strokeDashArray,
    shadow,
  ]);

  if (isCollapsed) {
    return (
      <div
        className="absolute top-2 right-2 w-[280px] bg-[#2D2D2D] flex items-center justify-between cursor-pointer rounded-sm px-1 pr-1.5"
        onClick={() => setIsCollapsed(false)}
      >
        <Button
          size="icon-lg"
          variant="ghost"
          onClick={() => setIsCollapsed(false)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 6.90039C13 6.4721 12.9998 6.18012 12.9814 5.95508C12.9635 5.73615 12.9304 5.62405 12.8906 5.5459C12.7948 5.35793 12.6421 5.20522 12.4541 5.10938C12.376 5.06956 12.2639 5.03647 12.0449 5.01855C11.8199 5.00017 11.5279 5 11.0996 5H6V11H11.0996C11.5279 11 11.8199 10.9998 12.0449 10.9814C12.2639 10.9635 12.376 10.9304 12.4541 10.8906C12.6421 10.7948 12.7948 10.6421 12.8906 10.4541C12.9304 10.376 12.9635 10.2639 12.9814 10.0449C12.9998 9.81988 13 9.5279 13 9.09961V6.90039ZM3 9.09961C3 9.5279 3.00017 9.81988 3.01855 10.0449C3.03647 10.2639 3.06956 10.376 3.10938 10.4541C3.20521 10.6421 3.35793 10.7948 3.5459 10.8906C3.62405 10.9304 3.73615 10.9635 3.95508 10.9814C4.18012 10.9998 4.4721 11 4.90039 11H5V5H4.90039C4.4721 5 4.18012 5.00017 3.95508 5.01855C3.73615 5.03647 3.62405 5.06956 3.5459 5.10938C3.35793 5.20521 3.20521 5.35793 3.10938 5.5459C3.06956 5.62405 3.03647 5.73615 3.01855 5.95508C3.00017 6.18012 3 6.4721 3 6.90039V9.09961ZM14 9.09961C14 9.5114 14 9.85076 13.9775 10.126C13.9546 10.407 13.9059 10.6656 13.7822 10.9082C13.5905 11.2845 13.2845 11.5905 12.9082 11.7822C12.6656 11.9059 12.407 11.9546 12.126 11.9775C11.8508 12 11.5114 12 11.0996 12H4.90039C4.4886 12 4.14924 12 3.87402 11.9775C3.59301 11.9546 3.33444 11.9059 3.0918 11.7822C2.71554 11.5905 2.40951 11.2845 2.21777 10.9082C2.09414 10.6656 2.04543 10.407 2.02246 10.126C1.99998 9.85076 2 9.5114 2 9.09961V6.90039C2 6.4886 1.99998 6.14924 2.02246 5.87402C2.04543 5.59301 2.09414 5.33444 2.21777 5.0918C2.40951 4.71554 2.71554 4.40951 3.0918 4.21777C3.33444 4.09414 3.59301 4.04543 3.87402 4.02246C4.14924 3.99998 4.4886 4 4.90039 4H11.0996C11.5114 4 11.8508 3.99998 12.126 4.02246C12.407 4.04543 12.6656 4.09414 12.9082 4.21777C13.2845 4.40951 13.5905 4.71554 13.7822 5.0918C13.9059 5.33444 13.9546 5.59301 13.9775 5.87402C14 6.14924 14 6.4886 14 6.90039V9.09961Z"
              fill="#909090"
            />
          </svg>
        </Button>
        <span className="bg-pink-600 text-white size-7 rounded flex items-center justify-center">
          d
        </span>
      </div>
    );
  }

  return (
    <div className="absolute top-0 right-0 w-[300px] h-full bg-[#2D2D2D] flex flex-col items-center justify-start gap-1 p-1 overflow-hidden">
      <div className="w-full flex items-center justify-between text-gray-300 pr-1">
        <Button
          size="icon-lg"
          variant="ghost"
          onClick={() => setIsCollapsed(true)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 6.90039C13 6.4721 12.9998 6.18012 12.9814 5.95508C12.9635 5.73615 12.9304 5.62405 12.8906 5.5459C12.7948 5.35793 12.6421 5.20522 12.4541 5.10938C12.376 5.06956 12.2639 5.03647 12.0449 5.01855C11.8199 5.00017 11.5279 5 11.0996 5H6V11H11.0996C11.5279 11 11.8199 10.9998 12.0449 10.9814C12.2639 10.9635 12.376 10.9304 12.4541 10.8906C12.6421 10.7948 12.7948 10.6421 12.8906 10.4541C12.9304 10.376 12.9635 10.2639 12.9814 10.0449C12.9998 9.81988 13 9.5279 13 9.09961V6.90039ZM3 9.09961C3 9.5279 3.00017 9.81988 3.01855 10.0449C3.03647 10.2639 3.06956 10.376 3.10938 10.4541C3.20521 10.6421 3.35793 10.7948 3.5459 10.8906C3.62405 10.9304 3.73615 10.9635 3.95508 10.9814C4.18012 10.9998 4.4721 11 4.90039 11H5V5H4.90039C4.4721 5 4.18012 5.00017 3.95508 5.01855C3.73615 5.03647 3.62405 5.06956 3.5459 5.10938C3.35793 5.20521 3.20521 5.35793 3.10938 5.5459C3.06956 5.62405 3.03647 5.73615 3.01855 5.95508C3.00017 6.18012 3 6.4721 3 6.90039V9.09961ZM14 9.09961C14 9.5114 14 9.85076 13.9775 10.126C13.9546 10.407 13.9059 10.6656 13.7822 10.9082C13.5905 11.2845 13.2845 11.5905 12.9082 11.7822C12.6656 11.9059 12.407 11.9546 12.126 11.9775C11.8508 12 11.5114 12 11.0996 12H4.90039C4.4886 12 4.14924 12 3.87402 11.9775C3.59301 11.9546 3.33444 11.9059 3.0918 11.7822C2.71554 11.5905 2.40951 11.2845 2.21777 10.9082C2.09414 10.6656 2.04543 10.407 2.02246 10.126C1.99998 9.85076 2 9.5114 2 9.09961V6.90039C2 6.4886 1.99998 6.14924 2.02246 5.87402C2.04543 5.59301 2.09414 5.33444 2.21777 5.0918C2.40951 4.71554 2.71554 4.40951 3.0918 4.21777C3.33444 4.09414 3.59301 4.04543 3.87402 4.02246C4.14924 3.99998 4.4886 4 4.90039 4H11.0996C11.5114 4 11.8508 3.99998 12.126 4.02246C12.407 4.04543 12.6656 4.09414 12.9082 4.21777C13.2845 4.40951 13.5905 4.71554 13.7822 5.0918C13.9059 5.33444 13.9546 5.59301 13.9775 5.87402C14 6.14924 14 6.4886 14 6.90039V9.09961Z"
              fill="#909090"
            />
          </svg>
        </Button>

        <span className="bg-pink-600 text-white size-7 rounded flex items-center justify-center">
          d
        </span>
      </div>

      {selectedObject ? (
        <div className="w-full overflow-y-auto p-2 pb-4 flex flex-col gap-2">
          {/* Always visible panels */}
          <PositionPanel
            left={left}
            top={top}
            setLeft={setLeft}
            setTop={setTop}
            handleInputChange={handleInputChange}
          />
          <LayoutPanel
            width={width}
            height={height}
            angle={angle}
            flipX={flipX}
            flipY={flipY}
            setWidth={updateWidth}
            setHeight={updateHeight}
            setAngle={setAngle}
            setFlipX={setFlipX}
            setFlipY={setFlipY}
            handleInputChange={handleInputChange}
          />
          <AppearancePanel
            opacity={opacity}
            visible={visible}
            setOpacity={setOpacity}
            setVisible={setVisible}
            handleInputChange={handleInputChange}
          />

          {/* Optional panels with + button to add default value */}
          {/* Fill Section */}
          <div className="w-full flex flex-col border-b border-[#232323] pb-2 mb-2 last:mb-0 last:pb-0 last:border-b-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-300">Fill</span>
              {fill ? (
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-400 px-1"
                  onClick={() => setFill("")}
                  title="Remove Fill"
                >
                  &minus;
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-400 hover:text-green-400 px-1"
                  onClick={() => setFill("#000000")}
                  title="Add Fill"
                >
                  +
                </button>
              )}
            </div>
            {fill && (
              <FillPanel
                fill={fill}
                setFill={setFill}
                handleInputChange={handleInputChange}
              />
            )}
          </div>
          {/* Stroke Section */}
          <div className="w-full flex flex-col border-b border-[#232323] pb-2 mb-2 last:mb-0 last:pb-0 last:border-b-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-300">Stroke</span>
              {stroke ? (
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-400 px-1"
                  onClick={() => setStroke("")}
                  title="Remove Stroke"
                >
                  &minus;
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-400 hover:text-green-400 px-1"
                  onClick={() => setStroke("#000000")}
                  title="Add Stroke"
                >
                  +
                </button>
              )}
            </div>
            {stroke && (
              <StrokePanel
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDashArray={strokeDashArray}
                setStroke={setStroke}
                setStrokeWidth={setStrokeWidth}
                setStrokeDashArray={setStrokeDashArray}
                handleInputChange={handleInputChange}
              />
            )}
          </div>
          {/* Effect Section */}
          <div className="w-full flex flex-col border-b border-[#232323] pb-2 mb-2 last:mb-0 last:pb-0 last:border-b-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-300">Effect</span>
              {shadow !== "none" && shadow !== "" ? (
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-400 px-1"
                  onClick={() => setShadow("none")}
                  title="Remove Effect"
                >
                  &minus;
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-400 hover:text-green-400 px-1"
                  onClick={() => setShadow("rgba(0,0,0,0.2)")}
                  title="Add Effect"
                >
                  +
                </button>
              )}
            </div>
            {shadow !== "none" && shadow !== "" && (
              <EffectPanel
                shadow={shadow}
                setShadow={setShadow}
                handleInputChange={handleInputChange}
              />
            )}
          </div>
          {/* Export Section (always visible, no add/remove) */}
          <div className="w-full flex flex-col border-b border-[#232323] pb-2 mb-2 last:mb-0 last:pb-0 last:border-b-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-violet-400">Export</span>
            </div>
            <GuideExportPanel />
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center h-32">
          <p className="text-sm text-gray-500">
            Select an object to see properties
          </p>
        </div>
      )}
    </div>
  );
}
