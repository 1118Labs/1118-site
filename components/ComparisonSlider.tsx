"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type SliderStyle = CSSProperties & {
  "--comparison-position": `${number}%`;
};

type ActiveDrag = {
  id?: number;
  input: "pointer" | "touch";
  mode: "horizontal" | "pending";
  moved: boolean;
  startX: number;
  startY: number;
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export function ComparisonSlider() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(50);

  const updateFromClientX = (clientX: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const bounds = viewport.getBoundingClientRect();
    const next = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.round(clamp(next)));
  };

  const releasePointerCapture = (pointerId?: number) => {
    const viewport = viewportRef.current;
    if (
      viewport &&
      typeof pointerId === "number" &&
      viewport.hasPointerCapture(pointerId)
    ) {
      viewport.releasePointerCapture(pointerId);
    }
  };

  const stopDragging = (pointerId?: number) => {
    releasePointerCapture(
      pointerId ??
        (activeDragRef.current?.input === "pointer"
          ? activeDragRef.current.id
          : undefined),
    );
    activeDragRef.current = null;
    setIsDragging(false);
  };

  useEffect(() => {
    const handleWindowBlur = () => {
      const viewport = viewportRef.current;
      const drag = activeDragRef.current;
      if (
        viewport &&
        drag?.input === "pointer" &&
        typeof drag.id === "number" &&
        viewport.hasPointerCapture(drag.id)
      ) {
        viewport.releasePointerCapture(drag.id);
      }
      activeDragRef.current = null;
      setIsDragging(false);
    };
    window.addEventListener("blur", handleWindowBlur);
    return () => window.removeEventListener("blur", handleWindowBlur);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.button !== 0) return;

    activeDragRef.current = {
      id: event.pointerId,
      input: "pointer",
      mode: "horizontal",
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateFromClientX(event.clientX);
    if (event.cancelable) event.preventDefault();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = activeDragRef.current;
    if (!drag || drag.input !== "pointer" || drag.id !== event.pointerId) return;

    drag.moved = drag.moved || event.clientX !== drag.startX;
    updateFromClientX(event.clientX);
  };

  const handlePointerRelease = (event: PointerEvent<HTMLDivElement>) => {
    const drag = activeDragRef.current;
    if (!drag || drag.input !== "pointer" || drag.id !== event.pointerId) return;

    updateFromClientX(event.clientX);
    stopDragging(event.pointerId);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (activeDragRef.current?.input === "pointer") {
      stopDragging(event.pointerId);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (!touch) return;

    activeDragRef.current = {
      input: "touch",
      mode: "pending",
      moved: false,
      startX: touch.clientX,
      startY: touch.clientY,
    };
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const drag = activeDragRef.current;
    const touch = event.touches[0];
    if (!drag || drag.input !== "touch" || !touch) return;

    const deltaX = Math.abs(touch.clientX - drag.startX);
    const deltaY = Math.abs(touch.clientY - drag.startY);

    if (drag.mode === "pending") {
      if (Math.max(deltaX, deltaY) < 8) return;
      if (deltaY > deltaX) {
        stopDragging();
        return;
      }
      drag.mode = "horizontal";
      drag.moved = true;
      setIsDragging(true);
    }

    drag.moved = drag.moved || deltaX > 0;
    updateFromClientX(touch.clientX);
    if (event.cancelable) event.preventDefault();
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const drag = activeDragRef.current;
    if (!drag || drag.input !== "touch") return;

    const touch = event.changedTouches[0];
    if (touch && (drag.mode === "pending" || !drag.moved)) {
      updateFromClientX(touch.clientX);
    }
    stopDragging();
  };

  const handleTouchCancel = () => {
    if (activeDragRef.current?.input === "touch") stopDragging();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setPosition((current) => clamp(current - 2));
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setPosition((current) => clamp(current + 2));
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  };

  const style = {
    "--comparison-position": `${position}%`,
  } as SliderStyle;

  return (
    <div
      className={`comparison ${isDragging ? "is-dragging" : ""}`}
      ref={viewportRef}
      role="group"
      aria-label="Original photograph and Etchr portrait comparison"
      onLostPointerCapture={() => stopDragging()}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerRelease}
      onTouchCancel={handleTouchCancel}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      style={style}
    >
      <div className="comparison-image comparison-after">
        <Image
          src="/brand/hero-etchr-aligned.png"
          alt="Etchr engraved editorial portrait"
          fill
          priority
          draggable={false}
          sizes="(max-width: 820px) 100vw, 70vw"
        />
      </div>
      <div className="comparison-image comparison-before">
        <Image
          src="/brand/hero-original-aligned.jpg"
          alt="Original portrait photograph"
          fill
          priority
          draggable={false}
          sizes="(max-width: 820px) 100vw, 70vw"
        />
      </div>
      <span className="comparison-label comparison-label-before">Original</span>
      <span className="comparison-label comparison-label-after">Etchr</span>
      <div
        className="comparison-divider"
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={position}
        aria-valuetext={`${position}% original photograph and ${100 - position}% Etchr portrait`}
        onKeyDown={handleKeyDown}
      >
        <span className="comparison-handle" aria-hidden="true">
          <span className="comparison-grip" />
        </span>
      </div>
    </div>
  );
}
