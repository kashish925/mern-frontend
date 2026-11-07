export const palettes = {
  light: {
    primary: { DEFAULT: '#7C5CBF', dark: '#6847A8', soft: '#E6DFF8' },
    lavender: { DEFAULT: '#B79CED', light: '#E6DFF8', mist: '#F3EEFD' },
    violet: '#986BED',
    blush: { DEFAULT: '#F47EC3', soft: '#FB9BC7', mist: '#FDE7F3' },
    surface: { DEFAULT: '#FFFFFF', muted: '#FAF8FF' },
    ink: { DEFAULT: '#2D2640', muted: '#6B6280', faint: '#9A92AD' },
    line: '#ECE6F8',
    success: '#3F9C7A',
    warning: '#C98A2B',
    danger: '#C2477A'
  },
  dark: {
    primary: { DEFAULT: '#9D80E6', dark: '#B79CED', soft: '#2F2647' },
    lavender: { DEFAULT: '#B79CED', light: '#3A2F57', mist: '#231C33' },
    violet: '#A47EF0',
    blush: { DEFAULT: '#F47EC3', soft: '#FB9BC7', mist: '#3A2032' },
    surface: { DEFAULT: '#1D1729', muted: '#14101D' },
    ink: { DEFAULT: '#F2EDFB', muted: '#BDB3D1', faint: '#8C82A3' },
    line: '#30283F',
    success: '#5CC39E',
    warning: '#E3A853',
    danger: '#EC7AAA'
  }
}

export const colors = palettes.light

function flatten(palette, prefix = '') {
  return Object.entries(palette).flatMap(([key, value]) => {
    const name = key === 'DEFAULT' ? prefix : prefix ? `${prefix}-${key}` : key
    return typeof value === 'string' ? [[name, value]] : flatten(value, name)
  })
}

function channels(hex) {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

export function cssVariables(mode) {
  return Object.fromEntries(flatten(palettes[mode]).map(([name, hex]) => [`--c-${name}`, channels(hex)]))
}

function asVariables(palette, prefix = '') {
  return Object.fromEntries(
    Object.entries(palette).map(([key, value]) => {
      const name = key === 'DEFAULT' ? prefix : prefix ? `${prefix}-${key}` : key
      return [key, typeof value === 'string' ? `rgb(var(--c-${name}) / <alpha-value>)` : asVariables(value, name)]
    })
  )
}

export const themeColors = asVariables(palettes.light)

export function cssColor(name) {
  return `rgb(var(--c-${name}))`
}

export function chartColors(mode = 'light') {
  const p = palettes[mode]
  return {
    mood: p.violet,
    sleep: p.blush.soft,
    stress: p.primary.DEFAULT,
    grid: p.line,
    axis: p.ink.faint,
    cursor: p.lavender.DEFAULT,
    ringTrack: p.lavender.light,
    ringStart: p.blush.soft,
    ringEnd: p.violet
  }
}
