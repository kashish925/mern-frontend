import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '../../context/ThemeContext.jsx'
import { shortDate } from '../../utils/dates.js'

function TooltipBox({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-lift">
      <p className="font-bold text-ink-muted">{shortDate(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-extrabold" style={{ color: p.color }}>
          {p.name}: {p.value ?? '–'}
          {unit && p.value != null ? ` ${unit}` : ''}
        </p>
      ))}
    </div>
  )
}

export function TrendChart({ data, series, height = 220, yDomain = [0, 5], unit, compact = false }) {
  const { chart } = useTheme()
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: compact ? -28 : -16, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.45} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke={chart.grid} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tick={{ fill: chart.axis, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            minTickGap={18}
            hide={compact}
          />
          <YAxis domain={yDomain} tick={{ fill: chart.axis, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} hide={compact} />
          <Tooltip content={<TooltipBox unit={unit} />} cursor={{ stroke: chart.cursor, strokeDasharray: 4 }} />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={3}
              fill={`url(#fill-${s.key})`}
              connectNulls
              dot={{ r: 3, fill: s.color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
