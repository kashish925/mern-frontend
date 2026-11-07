export const AGE_RANGES = [
  { value: 'under_13', label: 'Under 13' },
  { value: '13_17', label: '13 to 17' },
  { value: '18_24', label: '18 to 24' },
  { value: '25_34', label: '25 to 34' },
  { value: '35_44', label: '35 to 44' },
  { value: '45_54', label: '45 to 54' },
  { value: '55_plus', label: '55 or older' }
]

export const CONCERNS = [
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'stress', label: 'Stress' },
  { value: 'low_mood', label: 'Low mood' },
  { value: 'poor_sleep', label: 'Poor sleep' },
  { value: 'burnout', label: 'Burnout' },
  { value: 'loneliness', label: 'Loneliness' },
  { value: 'other', label: 'Something else' }
]

export const GOALS = [
  { value: 'better_sleep', label: 'Sleep better' },
  { value: 'calmer_mind', label: 'A calmer mind' },
  { value: 'track_mood', label: 'Track my mood' },
  { value: 'journaling_habit', label: 'Build a journaling habit' },
  { value: 'manage_burnout', label: 'Manage burnout' }
]

export const CHECKIN_QUESTIONS = [
  { key: 'nervous', text: 'How often have you felt nervous or on edge?', low: 'Rarely', high: 'Very often' },
  { key: 'down', text: 'How often have you felt down or hopeless?', low: 'Rarely', high: 'Very often' },
  { key: 'sleep', text: 'How well have you been sleeping?', low: 'Poorly', high: 'Very well' },
  { key: 'overwhelmed', text: 'How overwhelmed do you feel by work or study?', low: 'Not at all', high: 'Very much' },
  { key: 'energy', text: 'How is your energy level?', low: 'Very low', high: 'Very high' }
]

export const MOODS = [
  { value: 1, emoji: '😞', label: 'Very low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' }
]

export const MOOD_TAGS = ['calm', 'anxious', 'tired', 'happy', 'sad', 'stressed', 'grateful', 'lonely', 'hopeful', 'irritable']

export const PLANS = [
  { id: 'monthly', name: 'Monthly', price: 19, period: 'month', note: 'Billed every month' },
  { id: 'quarterly', name: 'Pro', price: 49, period: '3 months', note: 'Save 14% vs monthly', featured: true },
  { id: 'annual', name: 'Annual', price: 185, period: 'year', note: 'Save 19% vs monthly' }
]

export function labelFor(list, value) {
  return list.find((item) => item.value === value)?.label ?? value
}

export function moodEmoji(value) {
  return MOODS.find((m) => m.value === value)?.emoji ?? '·'
}

export function minutes(sec) {
  const m = Math.round(sec / 60)
  return `${m} min`
}

export function clock(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.max(0, sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
