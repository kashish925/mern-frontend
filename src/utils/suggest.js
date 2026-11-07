export function suggestExercise({ exercises, mood, stress, goals = [], premium }) {
  if (!exercises?.length) return null
  const byId = (id) => exercises.find((e) => e.id === id)
  const allowed = (id) => {
    const ex = byId(id)
    return ex && (premium || !ex.premium) ? ex : null
  }
  const hour = new Date().getHours()
  const candidates = []
  if (hour >= 20 && goals.includes('better_sleep')) candidates.push('sleep-wind-down', 'body-scan', 'four-seven-eight')
  if (stress >= 4) candidates.push('progressive-muscle-relaxation', 'box-breathing')
  if (mood && mood <= 2) candidates.push('grounding-54321', 'four-seven-eight')
  if (hour < 11) candidates.push('morning-energiser')
  if (goals.includes('calmer_mind')) candidates.push('meditation-5', 'coherent-breathing')
  if (goals.includes('manage_burnout')) candidates.push('stretching', 'gratitude-pause')
  candidates.push('box-breathing', 'four-seven-eight')
  for (const id of candidates) {
    const ex = allowed(id)
    if (ex) return ex
  }
  return exercises.find((e) => !e.premium) || null
}
