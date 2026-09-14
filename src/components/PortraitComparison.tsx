import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import laurieSource from '../assets/showcase/portrait/laurie-source.jpg';
import laurieResult from '../assets/showcase/portrait/laurie-result.webp';
import eliseSource from '../assets/showcase/portrait/elise-source.webp';
import eliseResult from '../assets/showcase/portrait/elise-result.webp';
import sloaneSource from '../assets/showcase/portrait/sloane-source.webp';
import sloaneResult from '../assets/showcase/portrait/sloane-result.webp';
import './PortraitComparison.css';
import PortraitHeroReveal from './PortraitHeroReveal';
import ResponsiveImage, { portraitImageSizes, portraitSourceSizes } from './ResponsiveImage';

interface PortraitComparisonProps {
  className?: string;
  interactive?: boolean;
  priority?: boolean;
  gallery?: boolean;
  subject?: 'laurie' | 'elise' | 'sloane';
}

const portraits = {
  sloane: { name: 'Sloane', source: sloaneSource, result: sloaneResult, width: 1122, height: 1402, transform: 'translate(0.339%, 9.223%) rotate(0.278deg) scale(1.2674)' },
  laurie: { name: 'Laurie V.', source: laurieSource, result: laurieResult, width: 768, height: 1024, transform: 'translate(-0.837%, 3.078%) rotate(0.215deg) scale(1.0339)' },
  elise: { name: 'Elise', source: eliseSource, result: eliseResult, width: 1122, height: 1402, transform: 'translate(2.499%, 7.171%) rotate(-0.579deg) scale(1.1304)' },
};

export default function PortraitComparison({ className = '', interactive = true, priority = false, gallery = false, subject = 'laurie' }: PortraitComparisonProps) {
  const [position, setPosition] = useState(46);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; mode: 'pending' | 'horizontal' | 'vertical' } | null>(null);
  const instructions = useId();
  const portrait = portraits[subject];

  const update = (x: number) => {
    const rect = stage.current?.getBoundingClientRect();
    if (rect?.width) setPosition(Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100)));
  };

  const begin = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !event.isPrimary || event.button !== 0) return;
    const touch = event.pointerType === 'touch';
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, mode: touch ? 'pending' : 'horizontal' };
    if (!touch) {
      event.currentTarget.setPointerCapture(event.pointerId);
      update(event.clientX);
    }
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId || gesture.mode === 'vertical') return;
    if (gesture.mode === 'pending') {
      const dx = Math.abs(event.clientX - gesture.x);
      const dy = Math.abs(event.clientY - gesture.y);
      if (Math.max(dx, dy) < 8) return;
      gesture.mode = dy >= dx ? 'vertical' : 'horizontal';
      if (gesture.mode === 'vertical') return;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    update(event.clientX);
  };

  const finish = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    if (event.type === 'pointerup' && gesture.mode === 'pending') update(event.clientX);
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') setPosition(value => Math.max(0, value - step));
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') setPosition(value => Math.min(100, value + step));
    else if (event.key === 'Home') setPosition(0);
    else if (event.key === 'End') setPosition(100);
    else return;
    event.preventDefault();
  };

  if (priority && subject === 'laurie') return <PortraitHeroReveal sourceUrl={portrait.source} outputUrl={portrait.result} sourceImageStyle={{transform:portrait.transform}} sourceAlt="Laurie V. original source image" outputAlt="Laurie V. as a Portrait editorial portrait" title="Laurie V. Portrait comparison" />;

  return (
    <div className={`portrait-comparison ${className}`} data-subject={subject} ref={stage}
      style={{ '--portrait-position': `${position}%` } as CSSProperties}
      onPointerDown={begin} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish}>
      <ResponsiveImage deferUntilNear={gallery ? 1600 : undefined} deferUntilScroll={gallery} sizes={portraitSourceSizes} className="portrait-comparison-image portrait-comparison-source" src={portrait.source}
        alt={`${portrait.name}, original photograph`}
        width={portrait.width} height={portrait.height} draggable={false}
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : gallery ? 'auto' : 'low'}
        decoding={priority ? 'sync' : 'async'} style={{ transform: portrait.transform }} />
      <div className="portrait-comparison-result">
        <ResponsiveImage deferUntilNear={gallery ? 1600 : undefined} deferUntilScroll={gallery} sizes={portraitImageSizes} className="portrait-comparison-image" src={portrait.result}
          alt={`${portrait.name}, finished editorial portrait`} width={1024} height={1024}
          draggable={false} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : gallery ? 'auto' : 'low'} decoding={priority ? 'sync' : 'async'} />
      </div>
      <div className="portrait-comparison-labels" aria-hidden="true"><span>Finished portrait</span><span>Original photo</span></div>
      <div className="portrait-comparison-divider" aria-hidden="true" />
      {interactive && <>
        <div className="portrait-comparison-handle" role="slider" tabIndex={0} aria-label={`${portrait.name} Portrait comparison`}
          aria-orientation="horizontal" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% finished portrait, ${100 - Math.round(position)}% original photo`}
          aria-describedby={instructions} onKeyDown={keyboard}>
          <span className="portrait-native-handle" aria-hidden="true"><i /></span>
        </div>
        <span className="portrait-comparison-instructions" id={instructions}>Drag horizontally to compare. Use arrow keys to adjust, Home for the original photo, or End for the finished portrait.</span>
      </>}
    </div>
  );
}
