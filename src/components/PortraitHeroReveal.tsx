// Ported from current Portrait EtchrBeforeAfterCard and HeroStorySection, 2026-09-11.
// Native pointer/touch/keyboard state machine retained; Tailwind presentation translated to scoped CSS.
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type TouchEvent as ReactTouchEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import './PortraitHeroReveal.css';
const DRAG_INTENT_THRESHOLD = 10;
const restRevealPercent = 46;
const hoverRevealPercent = 56;
const persistManualReveal = true;
export default function PortraitHeroReveal({ sourceUrl, outputUrl, sourceImageStyle, sourceAlt, outputAlt, title, onOpen }: { sourceUrl: string; outputUrl: string; sourceImageStyle: CSSProperties; sourceAlt: string; outputAlt: string; title: string; onOpen?: () => void }) {
  const rootRef = useRef<HTMLButtonElement | null>(null);
  const activeDragRef = useRef<{
    id?: number;
    input: "pointer" | "touch";
    mode: "horizontal" | "pending";
    moved: boolean;
    startX: number;
    startY: number;
  } | null>(null);
  const suppressOpenRef = useRef(false);
  const suppressOpenUntilRef = useRef(0);
  const lastDragEndedAtRef = useRef(0);
  const manualRevealRef = useRef(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [manualReveal, setManualReveal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [revealPercent, setRevealPercent] = useState(restRevealPercent);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const media = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setCoarsePointer(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  const setManualRevealState = (value: boolean) => {
    manualRevealRef.current = value;
    setManualReveal(value);
  };

  const showComparison = Boolean(sourceUrl && outputUrl);

  const updateFromClientX = (clientX: number) => {
    const element = rootRef.current;
    if (!element || !showComparison) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const nextValue = ((clientX - bounds.left) / bounds.width) * 100;
    setRevealPercent(clamp(nextValue, 0, 100));
  };

  const getPrimaryTouch = (touchList: ReactTouchEvent<HTMLButtonElement>["changedTouches"] | ReactTouchEvent<HTMLButtonElement>["touches"]) => touchList[0] ?? null;

  const showRevealState = () => {
    if (!showComparison) {
      return;
    }

    setRevealed(true);
    setRevealPercent((current) => Math.max(current, hoverRevealPercent));
  };

  const resetRevealState = (force = false) => {
    if (coarsePointer || dragging) {
      return;
    }

    if (persistManualReveal && manualRevealRef.current) {
      return;
    }

    if (!force && manualRevealRef.current) {
      return;
    }

    setManualRevealState(false);
    setRevealed(false);
    setRevealPercent(restRevealPercent);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!showComparison) {
      return;
    }

    if (event.pointerType === "touch") {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    activeDragRef.current = {
      id: event.pointerId,
      input: "pointer",
      mode: "horizontal",
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
    };

    showRevealState();
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
    event.preventDefault();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!showComparison) {
      return;
    }

    const drag = activeDragRef.current;
    if (!drag || drag.input !== "pointer" || drag.id !== event.pointerId) {
      return;
    }

    const deltaX = Math.abs(event.clientX - drag.startX);
    const deltaY = Math.abs(event.clientY - drag.startY);
    const exceededDragThreshold = Math.max(deltaX, deltaY) >= DRAG_INTENT_THRESHOLD;

    if (drag.mode === "pending") {
      if (!exceededDragThreshold) {
        return;
      }

      if (deltaY > deltaX) {
        activeDragRef.current = null;
        return;
      }

      drag.mode = "horizontal";
      drag.moved = true;
      setManualRevealState(true);
      showRevealState();
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      setDragging(true);
    }

    if (exceededDragThreshold) {
      drag.moved = true;
    }
    setRevealed(true);
    updateFromClientX(event.clientX);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = activeDragRef.current;
    if (!drag || drag.input !== "pointer" || drag.id !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activeDragRef.current = null;
    setDragging(false);
    suppressOpenRef.current = drag.moved;
    if (drag.moved) {
      setManualRevealState(true);
      lastDragEndedAtRef.current = Date.now();
      suppressOpenUntilRef.current = Date.now() + 420;
    }

    if (drag.moved) {
      updateFromClientX(event.clientX);
    }
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (activeDragRef.current?.input !== "pointer") {
      return;
    }

    if (activeDragRef.current?.moved) {
      lastDragEndedAtRef.current = Date.now();
      suppressOpenRef.current = true;
      suppressOpenUntilRef.current = Date.now() + 420;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activeDragRef.current = null;
    setDragging(false);
  };

  const handleLostPointerCapture = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (activeDragRef.current?.input !== "pointer" || activeDragRef.current?.id !== event.pointerId) {
      return;
    }

    if (activeDragRef.current.moved) {
      lastDragEndedAtRef.current = Date.now();
      suppressOpenRef.current = true;
      suppressOpenUntilRef.current = Date.now() + 420;
    }
    activeDragRef.current = null;
    setDragging(false);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLButtonElement>) => {
    if (!showComparison) {
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }

    activeDragRef.current = {
      input: "touch",
      mode: "pending",
      moved: false,
      startX: touch.clientX,
      startY: touch.clientY,
    };
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLButtonElement>) => {
    if (!showComparison) {
      return;
    }

    const drag = activeDragRef.current;
    if (!drag || drag.input !== "touch") {
      return;
    }

    const touch = getPrimaryTouch(event.touches);
    if (!touch) {
      return;
    }

    const deltaX = Math.abs(touch.clientX - drag.startX);
    const deltaY = Math.abs(touch.clientY - drag.startY);
    const exceededDragThreshold = Math.max(deltaX, deltaY) >= DRAG_INTENT_THRESHOLD;

    if (drag.mode === "pending") {
      if (!exceededDragThreshold) {
        return;
      }

      if (deltaY > deltaX) {
        activeDragRef.current = null;
        return;
      }

      drag.mode = "horizontal";
      drag.moved = true;
      setManualRevealState(true);
      showRevealState();
      setDragging(true);
    }

    if (exceededDragThreshold) {
      drag.moved = true;
    }
    setRevealed(true);
    updateFromClientX(touch.clientX);
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLButtonElement>) => {
    const drag = activeDragRef.current;
    if (!drag || drag.input !== "touch") {
      return;
    }

    const touch = getPrimaryTouch(event.changedTouches);
    if (!touch) {
      activeDragRef.current = null;
      setDragging(false);
      return;
    }

    activeDragRef.current = null;
    setDragging(false);
    suppressOpenRef.current = drag.moved;
    if (drag.moved) {
      setManualRevealState(true);
      lastDragEndedAtRef.current = Date.now();
      suppressOpenUntilRef.current = Date.now() + 420;
      updateFromClientX(touch.clientX);
      return;
    }

    suppressOpenRef.current = true;
    suppressOpenUntilRef.current = Date.now() + 260;
    showRevealState();
    updateFromClientX(touch.clientX);
  };

  const handleTouchCancel = () => {
    if (activeDragRef.current?.input !== "touch") {
      return;
    }

    if (activeDragRef.current.moved) {
      lastDragEndedAtRef.current = Date.now();
      suppressOpenRef.current = true;
      suppressOpenUntilRef.current = Date.now() + 420;
    }
    activeDragRef.current = null;
    setDragging(false);
  };

  const handleActivate = () => {
    if (suppressOpenRef.current || Date.now() < suppressOpenUntilRef.current || Date.now() - lastDragEndedAtRef.current < 260) {
      suppressOpenRef.current = false;
      return;
    }

    if (coarsePointer && showComparison && !revealed) {
      showRevealState();
      return;
    }

    onOpen?.();
  };

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (suppressOpenRef.current || Date.now() < suppressOpenUntilRef.current || Date.now() - lastDragEndedAtRef.current < 260) {
      suppressOpenRef.current = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    handleActivate();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!showComparison) {
      if ((event.key === "Enter" || event.key === " ") && onOpen) {
        event.preventDefault();
        onOpen();
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setRevealed(true);
      setRevealPercent((current) => clamp(current - 6, 0, 100));
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setRevealed(true);
      setRevealPercent((current) => clamp(current + 6, 0, 100));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  const visiblePercent = revealed ? revealPercent : restRevealPercent;
  const mode = dragging ? 'drag' : revealed ? 'hover' : 'rest';
  const duration = prefersReducedMotion || dragging ? '0ms' : revealed ? '540ms' : '620ms';
  return <button className="portrait-hero-reveal portrait-comparison" type="button" aria-label={title}
    data-etchr-before-after-card="true" data-etchr-manual-reveal={manualReveal ? 'true' : 'false'} data-etchr-reveal-percent={Math.round(visiblePercent)}
    data-mode={mode} data-coarse={coarsePointer} ref={rootRef}
    onBlur={() => resetRevealState(true)} onClick={handleClick} onFocus={showRevealState} onKeyDown={handleKeyDown}
    onLostPointerCapture={handleLostPointerCapture} onMouseEnter={showRevealState} onMouseLeave={() => resetRevealState(true)}
    onPointerCancel={handlePointerCancel} onPointerDown={handlePointerDown} onPointerLeave={() => resetRevealState(true)} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
    onTouchCancel={handleTouchCancel} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove} onTouchStart={handleTouchStart}
    style={{ cursor: dragging ? 'grabbing' : 'pointer', touchAction: 'pan-y', '--reveal-duration': duration } as CSSProperties}>
    <span className="portrait-hero-stage">
      <img src={sourceUrl} alt={sourceAlt} width="768" height="1024" decoding="sync" loading="eager" fetchPriority="high" draggable={false} style={sourceImageStyle} />
      <span className="portrait-hero-result" style={{clipPath:`inset(0 ${100-visiblePercent}% 0 0)`}}><img src={outputUrl} alt={outputAlt} width="1024" height="1024" decoding="sync" loading="eager" draggable={false}/></span>
      <span aria-hidden="true" data-etchr-reveal-divider="true" className="portrait-hero-divider" style={{left:`${clamp(visiblePercent,3,97)}%`,opacity:mode==='rest'?.94:1}}>
        <span data-etchr-reveal-handle="true" className="portrait-hero-handle" style={{opacity:mode==='rest'?.94:1,transform:`translate(-50%, -50%) scale(${mode==='rest'?.92:1})`}}><span><i/></span></span>
      </span>
    </span>
  </button>;
}
function clamp(value: number, min: number, max: number) { return Math.min(Math.max(value, min), max); }
