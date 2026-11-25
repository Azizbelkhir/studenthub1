import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  gradient: string;
  glowColor?: string;
  delay?: number;
}

export const StatCard = ({ title, value, subtitle, icon, gradient, glowColor = 'rgba(59,130,246,0.2)', delay = 0 }: StatCardProps) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}ms`,
        animation: 'slideUp 0.4s ease both',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: glowColor,
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div
          style={{
            width: 48, height: 48,
            borderRadius: 12,
            background: gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px ${glowColor}`,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <div style={{
        fontSize: 36,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        marginBottom: 6,
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'count-up 0.5s ease both',
        animationDelay: `${delay + 100}ms`,
      }}>
        {value}
      </div>

      {/* Title */}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
        {title}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
