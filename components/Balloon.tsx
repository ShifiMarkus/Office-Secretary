export function Balloon({ color, size = 48, className = "", style }: { color: string; size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 70"
      width={size}
      height={size * 1.75}
      className={className}
      style={style}
    >
      <path d="M20 46 C 18 54, 23 58, 19 70" stroke="#9aa5b1" strokeWidth="1" fill="none" />
      <ellipse cx="20" cy="22" rx="16" ry="20" fill={color} />
      <path d="M17 42 L20 46 L23 42 Z" fill={color} />
      <ellipse cx="13" cy="14" rx="4" ry="6" fill="#fff" opacity="0.35" />
    </svg>
  );
}

export const BALLOON_COLORS = ["#4A6076", "#889DB0", "#E5A93D", "#D9677A", "#5BA88B", "#7D6BB3"];
