import React, { useEffect, useState } from "react";
import * as fabric from "fabric";

import PositionPanel from "./position";
import AppearancePanel from "./appearance";
import FillPanel from "./fill";
import StrokePanel from "./stroke";
import EffectPanel from "./effect";
import LayoutPanel from "./layout";
import GuideExportPanel from "./guide-export";

export default function PropertiesPanel({
  canvas,
}: {
  canvas?: fabric.Canvas | null;
}) {
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

  return (
    <div className="absolute top-0 right-0 w-[300px] h-full bg-[#2D2D2D] flex flex-col items-center justify-start gap-1 p-1 overflow-hidden">
      <h3 className="text-sm font-semibold text-gray-300">Properties</h3>

      <div className="w-full h-px bg-gray-600 my-1" />

      {selectedObject ? (
        <div className="w-full flex flex-col gap-3 overflow-y-auto p-2 pb-4">
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

          <FillPanel
            fill={fill}
            setFill={setFill}
            handleInputChange={handleInputChange}
          />

          <StrokePanel
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDashArray={strokeDashArray}
            setStroke={setStroke}
            setStrokeWidth={setStrokeWidth}
            setStrokeDashArray={setStrokeDashArray}
            handleInputChange={handleInputChange}
          />

          <EffectPanel
            shadow={shadow}
            setShadow={setShadow}
            handleInputChange={handleInputChange}
          />

          <GuideExportPanel />
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
