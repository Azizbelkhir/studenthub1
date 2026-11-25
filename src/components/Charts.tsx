import type { StatsData } from '../types/student';
import { FILIERE_COLORS } from '../types/student';

interface ChartsProps {
  stats: StatsData;
}

// ─── Bar Chart SVG (par filière) ──────────────────────────────────────────────
const BarChart = ({ data }: { data: { filiere: string; count: number }[] }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  const barWidth = Math.min(60, Math.floor(560 / data.length) - 20);
  const svgWidth = Math.max(400, data.length * (barWidth + 20) + 60);
  const height = 200;
  const paddingBottom = 60;
  const paddingLeft = 40;
  const chartHeight = height - paddingBottom - 20;

  return (
    <svg width="100%" viewBox={`0 0 ${svgWidth} ${height}`} style={{ overflow: 'visible' }}>
      {/* Y-axis grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(tick => {
        const y = 20 + chartHeight * (1 - tick);
        return (
          <g key={tick}>
            <line x1={paddingLeft} y1={y} x2={svgWidth - 10} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"/>
            <text x={paddingLeft - 6} y={y + 4} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="end">
              {Math.round(max * tick)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((item, i) => {
        const barH = (item.count / max) * chartHeight;
        const x = paddingLeft + i * (barWidth + 20) + 10;
        const y = 20 + chartHeight - barH;
        const color = FILIERE_COLORS[item.filiere] || '#3b82f6';

        return (
          <g key={item.filiere}>
            {/* Bar background */}
            <rect
              x={x} y={20}
              width={barWidth}
              height={chartHeight}
              fill="rgba(255,255,255,0.03)"
              rx="4"
            />
            {/* Bar */}
            <rect
              x={x} y={y}
              width={barWidth}
              height={barH}
              fill={color}
              rx="4"
              opacity={0.9}
              style={{
                filter: `drop-shadow(0 4px 8px ${color}50)`,
              }}
            />
            {/* Count label */}
            <text
              x={x + barWidth / 2} y={y - 6}
              fill="white" fontSize="11" fontWeight="700" textAnchor="middle"
            >
              {item.count}
            </text>
            {/* Filière label */}
            <text
              x={x + barWidth / 2} y={height - paddingBottom + 20}
              fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="middle"
            >
              {item.filiere.length > 8 ? item.filiere.slice(0, 8) + '…' : item.filiere}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Donut Chart (par niveau) ─────────────────────────────────────────────────
const DonutChart = ({ data }: { data: { niveau: string; count: number }[] }) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucune donnée</p>;

  const COLORS = ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6'];
  const cx = 100, cy = 100, R = 75, r = 42;
  let angle = -90;

  const slices = data.map((item, i) => {
    const pct = item.count / total;
    const start = angle;
    angle += pct * 360;
    return { ...item, pct, startAngle: start, endAngle: angle, color: COLORS[i % COLORS.length] };
  });

  const toXY = (ang: number, radius: number) => {
    const rad = (ang * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const arcPath = (s: typeof slices[0]) => {
    const start = toXY(s.startAngle, R);
    const end = toXY(s.endAngle, R);
    const iStart = toXY(s.startAngle, r);
    const iEnd = toXY(s.endAngle, r);
    const large = s.endAngle - s.startAngle > 180 ? 1 : 0;
    return `M${start.x},${start.y} A${R},${R} 0 ${large},1 ${end.x},${end.y} L${iEnd.x},${iEnd.y} A${r},${r} 0 ${large},0 ${iStart.x},${iStart.y} Z`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {/* SVG */}
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
        {slices.map(s => (
          <path key={s.niveau} d={arcPath(s)} fill={s.color} opacity={0.9}
            style={{ filter: `drop-shadow(0 2px 4px ${s.color}60)` }}/>
        ))}
        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="22" fontWeight="800">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">étudiants</text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
        {slices.map(s => (
          <div key={s.niveau} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }}/>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{s.niveau}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.count}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 36, textAlign: 'right' }}>
              {Math.round(s.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Progress Bars (par filière détaillée) ────────────────────────────────────
const FiliereProgress = ({ data, total }: { data: { filiere: string; count: number }[]; total: number }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        const color = FILIERE_COLORS[item.filiere] || '#3b82f6';
        return (
          <div key={item.filiere}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.filiere}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>
                  {item.count}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {pct}%
                </span>
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}99, ${color})`,
                  boxShadow: `0 0 8px ${color}60`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Charts Component ────────────────────────────────────────────────────
export const Charts = ({ stats }: ChartsProps) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>

      {/* Répartition par filière - Bar Chart */}
      <div className="glass-card" style={{ padding: 24, gridColumn: 'span 2' }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            📊 Répartition par filière
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Nombre d'étudiants par filière
          </p>
        </div>
        {stats.byFiliere.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <BarChart data={stats.byFiliere} />
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            Aucune donnée disponible
          </p>
        )}
      </div>

      {/* Répartition par niveau - Donut */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            🎓 Par niveau d'études
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Distribution des niveaux
          </p>
        </div>
        <DonutChart data={stats.byNiveau} />
      </div>

      {/* Filière détaillée - Progress bars */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            📈 Détail des filières
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Pourcentage par filière
          </p>
        </div>
        {stats.byFiliere.length > 0 ? (
          <FiliereProgress data={stats.byFiliere} total={stats.total} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            Aucune donnée disponible
          </p>
        )}
      </div>
    </div>
  );
};
