import type { CSSProperties } from "react";
const cn = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");

export type Platform = "discord" | "facebook" | "instagram" | "linkedin" | "slack" | "snapchat" | "tiktok" | "x" | "youtube";

const PLATFORM_OPTICS: Record<Platform, { scale: number; translateX: number; translateY: number }> = {
  discord: { scale: 0.9, translateX: 0, translateY: 0.2 },
  facebook: { scale: 0.9, translateX: 0, translateY: 0 },
  instagram: { scale: 0.9, translateX: 0, translateY: 0 },
  linkedin: { scale: 0.9, translateX: -0.35, translateY: 0.1 },
  slack: { scale: 0.86, translateX: 0, translateY: 0 },
  snapchat: { scale: 0.93, translateX: 0, translateY: 0 },
  tiktok: { scale: 0.88, translateX: 0.15, translateY: 0 },
  x: { scale: 0.87, translateX: 0, translateY: 0 },
  youtube: { scale: 0.9, translateX: 0, translateY: 0 },
};

const PLATFORM_LABELS: Record<Platform, string> = {
  discord: "Discord",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  slack: "Slack",
  snapchat: "Snapchat",
  tiktok: "TikTok",
  x: "X",
  youtube: "YouTube",
};

export function PlatformIcon({
  className,
  platform,
}: {
  className?: string;
  platform: Platform;
}) {
  const optics = PLATFORM_OPTICS[platform];

  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex h-7 w-7 shrink-0 items-center justify-center", className)}
      data-optical-scale={optics.scale}
      data-optical-x={optics.translateX}
      data-optical-y={optics.translateY}
      data-platform-icon={platform}
    >
      <PlatformGlyph
        platform={platform}
        style={{
          transform: `translate(${optics.translateX}px, ${optics.translateY}px) scale(${optics.scale})`,
          transformOrigin: "50% 50%",
        }}
      />
    </span>
  );
}

export function PlatformIconBadge({
  className,
  platform,
}: {
  className?: string;
  platform: Platform;
}) {
  return (
    <span
      aria-label={`${PLATFORM_LABELS[platform]} logo`}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-black/[0.1] bg-[#faf9f6] p-0.5 shadow-none",
        className,
      )}
      data-platform-icon-badge={platform}
      role="img"
    >
      <PlatformIcon className="h-full w-full" platform={platform} />
    </span>
  );
}

function PlatformGlyph({
  platform,
  style,
}: {
  platform: Platform;
  style: CSSProperties;
}) {
  if (platform === "linkedin") {
    return (
      <svg aria-hidden="true" className="block h-full w-full" fill="none" style={style} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#0A66C2" />
        <path d="M7.2 9.6h3.1v8.2H7.2V9.6Zm1.55-3.8a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm3.2 3.8h2.95v1.12c.42-.65 1.3-1.32 2.62-1.32 2.02 0 3.28 1.34 3.28 4.03v4.37h-3.08v-3.92c0-1.18-.43-1.88-1.34-1.88-.74 0-1.13.5-1.32.98-.07.17-.09.42-.09.67v4.15h-3.02V9.6Z" fill="white" />
      </svg>
    );
  }

  if (platform === "discord") {
    return (
      <svg aria-hidden="true" className="block h-full w-full" fill="none" style={style} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#5865F2" />
        <path d="M8.1 7.2c2.55-1.15 5.25-1.15 7.8 0 1.18 1.7 1.83 3.62 1.98 5.78-1.2 1.28-2.48 2.08-3.82 2.48l-.92-1.22c.55-.2 1.08-.48 1.56-.84-.2.14-.43.26-.66.37-1.26.58-2.63.86-4.04.82-1.48-.04-2.87-.45-4.1-1.2.5.37 1.05.66 1.62.86l-.94 1.21c-1.34-.4-2.62-1.2-3.81-2.48.14-2.16.8-4.08 1.97-5.78.58-.27 1.17-.5 1.78-.67l.44.58A9.7 9.7 0 0 1 12 6.4c1.75 0 3.43.45 5.03 1.3l.45-.58c.61.17 1.2.4 1.78.67" fill="white" transform="translate(-.02 .55) scale(.92)" />
        <circle cx="9.3" cy="12.1" r="1.35" fill="#5865F2" />
        <circle cx="14.7" cy="12.1" r="1.35" fill="#5865F2" />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg aria-hidden="true" className="block h-full w-full" fill="none" style={style} viewBox="0 0 24 24">
        <defs>
          <linearGradient id="etchr-platform-instagram-gradient" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.5" stopColor="#E11D48" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#etchr-platform-instagram-gradient)" />
        <rect x="7" y="7" width="10" height="10" rx="3.2" stroke="white" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="2.35" stroke="white" strokeWidth="1.7" />
        <circle cx="16.1" cy="7.9" r="1" fill="white" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg aria-hidden="true" className="block h-full w-full" fill="none" style={style} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#111111" />
        <path d="M14.65 5.2c.38 2.03 1.62 3.38 3.7 3.62v2.55a6.5 6.5 0 0 1-3.52-1.1v4.86c0 2.42-1.66 4.14-4.22 4.14-2.23 0-3.96-1.46-3.96-3.68 0-2.36 1.86-3.86 4.13-3.86.28 0 .55.03.8.09v2.7a2.5 2.5 0 0 0-.84-.14c-.82 0-1.45.44-1.45 1.16 0 .68.54 1.14 1.3 1.14.9 0 1.42-.54 1.42-1.52V5.2h2.64Z" fill="white" />
        <path d="M14.65 5.2c.38 2.03 1.62 3.38 3.7 3.62" stroke="#22D3EE" strokeWidth="1.1" />
        <path d="M8.7 16.18c.17.34.64.5 1.02.5" stroke="#FB2D55" strokeWidth="1.1" />
      </svg>
    );
  }

  if (platform === "slack") {
    return (
      <svg aria-hidden="true" className="block h-full w-full" fill="none" style={style} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#F7F6F2" />
        <path d="M9.15 4.7a1.75 1.75 0 0 1 1.75 1.75v4.1H7.4a1.75 1.75 0 1 1 0-3.5h1.75v-.6A1.75 1.75 0 0 1 9.15 4.7Z" fill="#36C5F0" />
        <path d="M19.3 9.15a1.75 1.75 0 0 1-1.75 1.75h-4.1V7.4a1.75 1.75 0 1 1 3.5 0v1.75h.6a1.75 1.75 0 0 1 1.75 1.75Z" fill="#2EB67D" />
        <path d="M14.85 19.3a1.75 1.75 0 0 1-1.75-1.75v-4.1h3.5a1.75 1.75 0 1 1 0 3.5h-1.75v.6a1.75 1.75 0 0 1-1.75 1.75Z" fill="#ECB22E" />
        <path d="M4.7 14.85a1.75 1.75 0 0 1 1.75-1.75h4.1v3.5a1.75 1.75 0 1 1-3.5 0v-1.75h-.6a1.75 1.75 0 0 1-1.75-1.75Z" fill="#E01E5A" />
      </svg>
    );
  }

  if (platform === "facebook") {
    return (
      <svg aria-hidden="true" className="block h-full w-full" fill="none" style={style} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#1877F2" />
        <path d="M14.55 8.2h1.65V5.35c-.8-.08-1.62-.13-2.43-.13-2.42 0-4.08 1.48-4.08 4.16v2.08H7v3.18h2.69v7.06h3.28v-7.06h2.72l.43-3.18h-3.15V9.7c0-.92.25-1.5 1.58-1.5Z" fill="white" />
      </svg>
    );
  }

  if (platform === "snapchat") {
    return (
      <svg aria-hidden="true" className="block h-full w-full" fill="none" style={style} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#FFFC00" />
        <path d="M12.02 4.75c2.02 0 3.46 1.54 3.46 3.7 0 .55-.05 1.08-.05 1.55 0 .32.19.48.48.48.2 0 .43-.08.65-.18.38-.17.77.08.77.5 0 .48-.56.86-1.5 1.2.2.62.75 1.54 2.07 1.86.36.08.55.45.42.8-.23.62-1.25.76-2.11.82-.4.03-.57.28-.7.63-.16.45-.4.66-.84.66-.35 0-.78-.16-1.26-.33-.45-.17-.9-.32-1.39-.32-.5 0-.96.15-1.42.32-.47.17-.89.33-1.24.33-.44 0-.69-.22-.84-.66-.13-.35-.3-.6-.7-.63-.86-.06-1.88-.2-2.11-.82-.13-.35.06-.72.42-.8 1.31-.32 1.86-1.24 2.06-1.86-.94-.34-1.49-.72-1.49-1.2 0-.42.39-.67.77-.5.22.1.45.18.65.18.29 0 .48-.16.48-.48 0-.47-.06-1-.06-1.55 0-2.16 1.45-3.7 3.48-3.7Z" fill="#111111" />
      </svg>
    );
  }

  if (platform === "youtube") {
    return (
      <svg aria-hidden="true" className="block h-full w-full" fill="none" style={style} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#FF0000" />
        <path d="m10 8.2 6 3.8-6 3.8V8.2Z" fill="white" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="block h-full w-full" fill="none" style={style} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#111111" />
      <path d="M7 6h3.1l7.1 12H14.1L7 6Zm.2 12 4.2-4.8M16.8 6l-4 4.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
