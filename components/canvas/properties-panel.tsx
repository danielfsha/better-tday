"use client";

import React, { useEffect, useState } from "react";
import * as fabric from "fabric";

export default function PropertiesPanel({
  canvas,
}: {
  canvas?: fabric.Canvas | null;
}) {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null,
  );

  // Position
  const [left, setLeft] = useState<number>(0);
  const [top, setTop] = useState<number>(0);

  // Layout / Dimensions
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);
  const [angle, setAngle] = useState<number>(0);
  const [skewX, setSkewX] = useState<number>(0);
  const [skewY, setSkewY] = useState<number>(0);
  const [flipX, setFlipX] = useState<boolean>(false);
  const [flipY, setFlipY] = useState<boolean>(false);

  // Appearance / Visibility
  const [opacity, setOpacity] = useState<number>(1);
  const [visible, setVisible] = useState<boolean>(true);
  const [padding, setPadding] = useState<number>(0);

  // Fill
  const [fill, setFill] = useState<string>("#000000");
  const [fillRule, setFillRule] = useState<"nonzero" | "evenodd">("nonzero");

  // Stroke
  const [stroke, setStroke] = useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>([]);
  const [strokeDashOffset, setStrokeDashOffset] = useState<number>(0);
  const [strokeLineCap, setStrokeLineCap] = useState<
    "butt" | "round" | "square"
  >("butt");
  const [strokeLineJoin, setStrokeLineJoin] = useState<
    "bevel" | "round" | "miter"
  >("miter");
  const [strokeMiterLimit, setStrokeMiterLimit] = useState<number>(4);
  const [strokeUniform, setStrokeUniform] = useState<boolean>(false);

  // Effects
  const [shadow, setShadow] = useState<fabric.Shadow | string>("none");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [globalCompositeOperation, setGlobalCompositeOperation] =
    useState<string>("source-over");

  // Text-specific (only if using fabric.Text)
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [textAlign, setTextAlign] = useState<
    "left" | "center" | "right" | "justify"
  >("left");
  const [lineHeight, setLineHeight] = useState<number>(1.2);
  const [charSpacing, setCharSpacing] = useState<number>(0);
  const [fontWeight, setFontWeight] = useState<string | number>("normal");
  const [fontStyle, setFontStyle] = useState<"normal" | "italic">("normal");
  const [underline, setUnderline] = useState<boolean>(false);
  const [overline, setOverline] = useState<boolean>(false);
  const [linethrough, setLinethrough] = useState<boolean>(false);
  const [textBackgroundColor, setTextBackgroundColor] = useState<string>("");

  // Controls / Interaction
  const [cornerSize, setCornerSize] = useState<number>(13);
  const [cornerColor, setCornerColor] = useState<string>("rgb(178,204,255)");
  const [cornerStrokeColor, setCornerStrokeColor] = useState<string>("");
  const [cornerDashArray, setCornerDashArray] = useState<number[]>([]);
  const [cornerStyle, setCornerStyle] = useState<"rect" | "circle">("rect");
  const [transparentCorners, setTransparentCorners] = useState<boolean>(true);
  const [borderColor, setBorderColor] = useState<string>("rgb(178,204,255)");
  const [borderDashArray, setBorderDashArray] = useState<number[]>([]);
  const [borderOpacityWhenMoving, setBorderOpacityWhenMoving] =
    useState<number>(0.4);
  const [borderScaleFactor, setBorderScaleFactor] = useState<number>(1);
  const [hasBorders, setHasBorders] = useState<boolean>(true);
  const [hasControls, setHasControls] = useState<boolean>(true);
  const [selectable, setSelectable] = useState<boolean>(true);
  const [evented, setEvented] = useState<boolean>(true);
  const [hoverCursor, setHoverCursor] = useState<string>("");
  const [moveCursor, setMoveCursor] = useState<string>("");

  // Locking / Constraints
  const [lockMovementX, setLockMovementX] = useState<boolean>(false);
  const [lockMovementY, setLockMovementY] = useState<boolean>(false);
  const [lockRotation, setLockRotation] = useState<boolean>(false);
  const [lockScalingX, setLockScalingX] = useState<boolean>(false);
  const [lockScalingY, setLockScalingY] = useState<boolean>(false);
  const [lockScalingFlip, setLockScalingFlip] = useState<boolean>(false);
  const [lockSkewingX, setLockSkewingX] = useState<boolean>(false);
  const [lockSkewingY, setLockSkewingY] = useState<boolean>(false);
  const [minScaleLimit, setMinScaleLimit] = useState<number>(0);

  // Sync properties from selected object
  const syncPropertiesFromObject = (object: fabric.Object) => {
    // Position
    setLeft(object.left ?? 0);
    setTop(object.top ?? 0);

    // Layout
    setWidth(object.width ?? 0);
    setHeight(object.height ?? 0);
    setScaleX(object.scaleX ?? 1);
    setScaleY(object.scaleY ?? 1);
    setAngle(object.angle ?? 0);
    setSkewX(object.skewX ?? 0);
    setSkewY(object.skewY ?? 0);
    setFlipX(object.flipX ?? false);
    setFlipY(object.flipY ?? false);

    // Appearance
    setOpacity(object.opacity ?? 1);
    setVisible(object.visible ?? true);
    setPadding(object.padding ?? 0);

    // Fill
    setFill((object.fill as string) ?? "#000000");
    setFillRule(object.fillRule ?? "nonzero");

    // Stroke
    setStroke((object.stroke as string) ?? "#000000");
    setStrokeWidth(object.strokeWidth ?? 1);
    setStrokeDashArray(object.strokeDashArray ?? []);
    setStrokeDashOffset(object.strokeDashOffset ?? 0);
    setStrokeLineCap(object.strokeLineCap ?? "butt");
    setStrokeLineJoin(object.strokeLineJoin ?? "miter");
    setStrokeMiterLimit(object.strokeMiterLimit ?? 4);
    setStrokeUniform(object.strokeUniform ?? false);

    // Effects
    setShadow(object.shadow ?? "none");
    setBackgroundColor(object.backgroundColor ?? "");
    setGlobalCompositeOperation(
      object.globalCompositeOperation ?? "source-over",
    );

    // Controls / Interaction
    setCornerSize(object.cornerSize ?? 13);
    setCornerColor(object.cornerColor ?? "rgb(178,204,255)");
    setCornerStrokeColor(object.cornerStrokeColor ?? "");
    setCornerDashArray(object.cornerDashArray ?? []);
    setCornerStyle(object.cornerStyle ?? "rect");
    setTransparentCorners(object.transparentCorners ?? true);
    setBorderColor(object.borderColor ?? "rgb(178,204,255)");
    setBorderDashArray(object.borderDashArray ?? []);
    setBorderOpacityWhenMoving(object.borderOpacityWhenMoving ?? 0.4);
    setBorderScaleFactor(object.borderScaleFactor ?? 1);
    setHasBorders(object.hasBorders ?? true);
    setHasControls(object.hasControls ?? true);
    setSelectable(object.selectable ?? true);
    setEvented(object.evented ?? true);
    setHoverCursor(object.hoverCursor ?? "");
    setMoveCursor(object.moveCursor ?? "");

    // Locking
    setLockMovementX(object.lockMovementX ?? false);
    setLockMovementY(object.lockMovementY ?? false);
    setLockRotation(object.lockRotation ?? false);
    setLockScalingX(object.lockScalingX ?? false);
    setLockScalingY(object.lockScalingY ?? false);
    setLockScalingFlip(object.lockScalingFlip ?? false);
    setLockSkewingX(object.lockSkewingX ?? false);
    setLockSkewingY(object.lockSkewingY ?? false);
    setMinScaleLimit(object.minScaleLimit ?? 0);

    // Text-specific properties
    if (object instanceof fabric.Text) {
      setFontSize(object.fontSize ?? 16);
      setFontFamily(object.fontFamily ?? "Arial");
      setLineHeight(object.lineHeight ?? 1.2);
      setCharSpacing(object.charSpacing ?? 0);
      setFontWeight(object.fontWeight ?? "normal");
      setUnderline(object.underline ?? false);
      setOverline(object.overline ?? false);
      setLinethrough(object.linethrough ?? false);
      setTextBackgroundColor(object.textBackgroundColor ?? "");
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      setSelectedObject(activeObject);

      if (activeObject) {
        syncPropertiesFromObject(activeObject);
      }
    };

    const handleSelectionCleared = () => {
      setSelectedObject(null);
    };

    // Listen to object modification events for real-time sync

    const handleObjectModified = (
      options: fabric.ModifiedEvent<fabric.TPointerEvent>,
    ) => {
      const target = options.target;
      if (target && target === canvas.getActiveObject()) {
        syncPropertiesFromObject(target);
      }
    };

    const handleObjectScaling = (
      options: fabric.ScalingEvent<fabric.TPointerEvent>,
    ) => {
      const target = options.target;
      if (target && target === canvas.getActiveObject()) {
        setScaleX(target.scaleX ?? 1);
        setScaleY(target.scaleY ?? 1);
        setWidth(target.width ?? 0);
        setHeight(target.height ?? 0);
      }
    };

    const handleObjectRotating = (
      options: fabric.IEvent<fabric.TPointerEvent>,
    ) => {
      const target = options.target as fabric.Object | undefined;
      if (target && target === canvas.getActiveObject()) {
        setAngle(target.angle ?? 0);
      }
    };

    const handleObjectMoving = (
      options: fabric.IEvent<fabric.TPointerEvent>,
    ) => {
      const target = options.target;
      if (target && target === canvas.getActiveObject()) {
        setLeft(target.left ?? 0);
        setTop(target.top ?? 0);
      }
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleSelectionCleared);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:scaling", handleObjectScaling);
    canvas.on("object:rotating", handleObjectRotating);
    canvas.on("object:moving", handleObjectMoving);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleSelectionCleared);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:scaling", handleObjectScaling);
      canvas.off("object:rotating", handleObjectRotating);
      canvas.off("object:moving", handleObjectMoving);
    };
  }, [canvas]);

  // Apply changes to selected object when state changes
  useEffect(() => {
    if (!selectedObject || !canvas) return;

    selectedObject.set({
      left,
      top,
      width,
      height,
      scaleX,
      scaleY,
      angle,
      skewX,
      skewY,
      flipX,
      flipY,
      opacity,
      visible,
      padding,
      fill,
      fillRule,
      stroke,
      strokeWidth,
      strokeDashArray,
      strokeDashOffset,
      strokeLineCap,
      strokeLineJoin,
      strokeMiterLimit,
      strokeUniform,
      shadow,
      backgroundColor,
      globalCompositeOperation,
      cornerSize,
      cornerColor,
      cornerStrokeColor,
      cornerDashArray,
      cornerStyle,
      transparentCorners,
      borderColor,
      borderDashArray,
      borderOpacityWhenMoving,
      borderScaleFactor,
      hasBorders,
      hasControls,
      selectable,
      evented,
      hoverCursor,
      moveCursor,
      lockMovementX,
      lockMovementY,
      lockRotation,
      lockScalingX,
      lockScalingY,
      lockScalingFlip,
      lockSkewingX,
      lockSkewingY,
      minScaleLimit,
    });

    // Text-specific
    if (selectedObject instanceof fabric.Text) {
      selectedObject.set({
        fontSize,
        fontFamily,
        textAlign,
        lineHeight,
        charSpacing,
        fontWeight,
        fontStyle,
        underline,
        overline,
        linethrough,
        textBackgroundColor,
      });
    }

    selectedObject.setCoords();
    canvas.requestRenderAll();
  }, [
    selectedObject,
    canvas,
    left,
    top,

    width,
    height,
    scaleX,
    scaleY,
    angle,
    skewX,
    skewY,
    flipX,
    flipY,
    opacity,
    visible,
    padding,
    fill,
    fillRule,
    stroke,
    strokeWidth,
    strokeDashArray,
    strokeDashOffset,
    strokeLineCap,
    strokeLineJoin,
    strokeMiterLimit,
    strokeUniform,
    shadow,
    backgroundColor,
    globalCompositeOperation,
    cornerSize,
    cornerColor,
    cornerStrokeColor,
    cornerDashArray,
    cornerStyle,
    transparentCorners,
    borderColor,
    borderDashArray,
    borderOpacityWhenMoving,
    borderScaleFactor,
    hasBorders,
    hasControls,
    selectable,
    evented,
    hoverCursor,
    moveCursor,
    lockMovementX,
    lockMovementY,
    lockRotation,
    lockScalingX,
    lockScalingY,
    lockScalingFlip,
    lockSkewingX,
    lockSkewingY,
    minScaleLimit,
    fontSize,
    fontFamily,
    textAlign,
    lineHeight,
    charSpacing,
    fontWeight,
    fontStyle,
    underline,
    overline,
    linethrough,
    textBackgroundColor,
  ]);

  const handleInputChange =
    (
      setter: (value: any) => void,
      fabricProp: keyof fabric.Object,
      isTextProp = false,
    ) =>
    (value: any) => {
      setter(value);
      if (selectedObject && canvas) {
        if (isTextProp && selectedObject instanceof fabric.Text) {
          selectedObject.set({ [fabricProp]: value });
        } else if (!isTextProp) {
          selectedObject.set({ [fabricProp]: value });
        }
        selectedObject.setCoords();
        canvas.requestRenderAll();
      }
    };

  return (
    <div className="absolute top-0 right-0 w-[300px] h-full bg-[#2D2D2D] flex flex-col items-center justify-start gap-1 p-1 overflow-hidden">
      <h3 className="text-sm font-semibold text-gray-300">Properties</h3>

      <div className="w-full h-px bg-gray-600 my-1" />

      {selectedObject ? (
        <div className="w-full flex flex-col items-start justify-start gap-3 overflow-y-auto p-2 pb-4">
          {/* Position */}
          <div className="w-full flex flex-col items-start gap-2">
            <span className="text-xs font-semibold text-gray-400">
              Position
            </span>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Left</label>
              <input
                type="number"
                value={left}
                onChange={(e) =>
                  handleInputChange(
                    setLeft,
                    "left",
                  )(parseFloat(e.target.value) || 0)
                }
                className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Top</label>
              <input
                type="number"
                value={top}
                onChange={(e) =>
                  handleInputChange(
                    setTop,
                    "top",
                  )(parseFloat(e.target.value) || 0)
                }
                className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              />
            </div>
          </div>

          {/* Layout */}
          <div className="w-full flex flex-col items-start gap-2">
            <span className="text-xs font-semibold text-gray-400">Layout</span>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) =>
                  handleInputChange(
                    setWidth,
                    "width",
                  )(parseFloat(e.target.value) || 0)
                }
                className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) =>
                  handleInputChange(
                    setHeight,
                    "height",
                  )(parseFloat(e.target.value) || 0)
                }
                className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              />
            </div>

            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Angle</label>
              <input
                type="number"
                step="1"
                value={angle}
                onChange={(e) =>
                  handleInputChange(
                    setAngle,
                    "angle",
                  )(parseFloat(e.target.value) || 0)
                }
                className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Flip X</label>
              <input
                type="checkbox"
                checked={flipX}
                onChange={(e) =>
                  handleInputChange(setFlipX, "flipX")(e.target.checked)
                }
                className="w-4 h-4"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Flip Y</label>
              <input
                type="checkbox"
                checked={flipY}
                onChange={(e) =>
                  handleInputChange(setFlipY, "flipY")(e.target.checked)
                }
                className="w-4 h-4"
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="w-full flex flex-col items-start gap-2">
            <span className="text-xs font-semibold text-gray-400">
              Appearance
            </span>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Opacity</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={opacity}
                onChange={(e) =>
                  handleInputChange(
                    setOpacity,
                    "opacity",
                  )(parseFloat(e.target.value) || 1)
                }
                className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Visible</label>
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) =>
                  handleInputChange(setVisible, "visible")(e.target.checked)
                }
                className="w-4 h-4"
              />
            </div>
          </div>

          {/* Fill */}
          <div className="w-full flex flex-col items-start gap-2">
            <span className="text-xs font-semibold text-gray-400">Fill</span>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Color</label>
              <input
                type="color"
                value={fill}
                onChange={(e) =>
                  handleInputChange(setFill, "fill")(e.target.value)
                }
                className="w-16 h-8 p-0 border border-gray-600 rounded"
              />
            </div>
          </div>

          {/* Stroke */}
          <div className="w-full flex flex-col items-start gap-2">
            <span className="text-xs font-semibold text-gray-400">Stroke</span>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Color</label>
              <input
                type="color"
                value={stroke}
                onChange={(e) =>
                  handleInputChange(setStroke, "stroke")(e.target.value)
                }
                className="w-16 h-8 p-0 border border-gray-600 rounded"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Width</label>
              <input
                type="number"
                step="1"
                value={strokeWidth}
                onChange={(e) =>
                  handleInputChange(
                    setStrokeWidth,
                    "strokeWidth",
                  )(parseFloat(e.target.value) || 1)
                }
                className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Dash Array</label>
              <input
                type="text"
                placeholder="e.g. 5,5"
                value={strokeDashArray.join(",")}
                onChange={(e) => {
                  const arr = e.target.value
                    .split(",")
                    .map((n) => parseFloat(n.trim()))
                    .filter((n) => !isNaN(n));
                  handleInputChange(setStrokeDashArray, "strokeDashArray")(arr);
                }}
                className="w-24 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Line Cap</label>
              <select
                value={strokeLineCap}
                onChange={(e) =>
                  handleInputChange(
                    setStrokeLineCap,
                    "strokeLineCap",
                  )(e.target.value as "butt" | "round" | "square")
                }
                className="w-20 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              >
                <option value="butt">butt</option>
                <option value="round">round</option>
                <option value="square">square</option>
              </select>
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Line Join</label>
              <select
                value={strokeLineJoin}
                onChange={(e) =>
                  handleInputChange(
                    setStrokeLineJoin,
                    "strokeLineJoin",
                  )(e.target.value as "bevel" | "round" | "miter")
                }
                className="w-20 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              >
                <option value="bevel">bevel</option>
                <option value="round">round</option>
                <option value="miter">miter</option>
              </select>
            </div>
          </div>

          {/* Effects */}
          <div className="w-full flex flex-col items-start gap-2">
            <span className="text-xs font-semibold text-gray-400">Effects</span>
            <div className="w-full flex items-center justify-between gap-2">
              <label className="text-sm text-gray-300">Shadow</label>
              <input
                type="text"
                placeholder="none or color"
                value={shadow === "none" ? "" : (shadow as string)}
                onChange={(e) =>
                  handleInputChange(
                    setShadow,
                    "shadow",
                  )(e.target.value || "none")
                }
                className="w-24 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
              />
            </div>
          </div>

          {/* Text (only for fabric.Text) */}
          {selectedObject instanceof fabric.Text && (
            <div className="w-full flex flex-col items-start gap-2">
              <span className="text-xs font-semibold text-gray-400">Text</span>
              <div className="w-full flex items-center justify-between gap-2">
                <label className="text-sm text-gray-300">Font Size</label>
                <input
                  type="number"
                  step="1"
                  value={fontSize}
                  //   onChange={(e) =>
                  //     handleInputChange(setFontSize, "fontSize", true)(
                  //       parseFloat(e.target.value) || 16,
                  //     )
                  //   }
                  className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
                />
              </div>
              <div className="w-full flex items-center justify-between gap-2">
                <label className="text-sm text-gray-300">Font Family</label>
                <input
                  type="text"
                  value={fontFamily}
                  //   onChange={(e) =>
                  //     handleInputChange(setFontFamily, "fontFamily", true)(
                  //       e.target.value,
                  //     )
                  //   }
                  className="w-32 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
                />
              </div>
              <div className="w-full flex items-center justify-between gap-2">
                <label className="text-sm text-gray-300">Text Align</label>
                <select
                  value={textAlign}
                  //   onChange={(e) =>
                  //     handleInputChange(
                  //       setTextAlign,
                  //       "textAlign",
                  //       true,
                  //     )(e.target.value as "left" | "center" | "right" | "justify")
                  //   }
                  className="w-24 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
                >
                  <option value="left">left</option>
                  <option value="center">center</option>
                  <option value="right">right</option>
                  <option value="justify">justify</option>
                </select>
              </div>
              <div className="w-full flex items-center justify-between gap-2">
                <label className="text-sm text-gray-300">Line Height</label>
                <input
                  type="number"
                  step="0.1"
                  value={lineHeight}
                  //   onChange={(e) =>
                  //     handleInputChange(setLineHeight, "lineHeight", true)(
                  //       parseFloat(e.target.value) || 1.2,
                  //     )
                  //   }
                  className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
                />
              </div>
              <div className="w-full flex items-center justify-between gap-2">
                <label className="text-sm text-gray-300">Bold</label>
                <input
                  type="checkbox"
                  checked={fontWeight === "bold"}
                  //   onChange={(e) =>
                  //     handleInputChange(
                  //       setFontWeight,
                  //       "fontWeight",
                  //       true,
                  //     )(e.target.checked ? "bold" : "normal")
                  //   }
                  className="w-4 h-4"
                />
              </div>
              <div className="w-full flex items-center justify-between gap-2">
                <label className="text-sm text-gray-300">Italic</label>
                <input
                  type="checkbox"
                  checked={fontStyle === "italic"}
                  //   onChange={(e) =>
                  //     handleInputChange(
                  //       setFontStyle,
                  //       "fontStyle",
                  //       true,
                  //     )(e.target.checked ? "italic" : "normal")
                  //   }
                  className="w-4 h-4"
                />
              </div>
              <div className="w-full flex items-center justify-between gap-2">
                <label className="text-sm text-gray-300">Underline</label>
                <input
                  type="checkbox"
                  checked={underline}
                  //   onChange={(e) =>
                  //     handleInputChange(
                  //       setUnderline,
                  //       "underline",
                  //       true,
                  //     )(e.target.checked)
                  //   }
                  className="w-4 h-4"
                />
              </div>
            </div>
          )}
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
