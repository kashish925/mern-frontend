import { useEffect, useState } from 'react'
import { checkinsApi } from '../../api/checkins.js'
import { useToast } from '../../context/ToastContext.jsx'
import { localDate } from '../../utils/dates.js'
import { MOOD_TAGS } from '../../utils/format.js'
import Alert from '../ui/Alert.jsx'
import Button from '../ui/Button.jsx'
import Card, { CardHeader } from '../ui/Card.jsx'
import Icon from '../ui/Icon.jsx'
import LockedCard from './LockedCard.jsx'
import MoodPicker, { LevelPicker, TagChips } from './MoodPicker.jsx'
import SleepInput from './SleepInput.jsx'

export default function CheckInCard({ todayMood, todaySleep, premium, onSaved }) {
  const toast = useToast()
  const [mood, setMood] = useState(todayMood?.mood ?? null)
  const [stress, setStress] = useState(todayMood?.stress ?? null)
  const [tags, setTags] = useState(todayMood?.tags ?? [])
  const [note, setNote] = useState(todayMood?.note ?? '')
  const [hours, setHours] = useState(todaySleep?.hours ?? '')
  const [quality, setQuality] = useState(todaySleep?.quality ?? null)
  const [showMore, setShowMore] = useState(Boolean(todayMood?.note))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMood(todayMood?.mood ?? null)
    setStress(todayMood?.stress ?? null)
    setTags(todayMood?.tags ?? [])
    setNote(todayMood?.note ?? '')
  }, [todayMood])

  useEffect(() => {
    setHours(todaySleep?.hours ?? '')
    setQuality(todaySleep?.quality ?? null)
  }, [todaySleep])

  if (!premium) {
    return (
      <Card>
        <CardHeader title="Daily check-in" icon={<Icon name="heart" />} />
        <LockedCard
          title="Check-ins are paused"
          text="Your free trial has ended. Choose a plan to keep logging mood and sleep. Your history is still here."
        />
      </Card>
    )
  }

  const save = async (event) => {
    event.preventDefault()
    setError('')
    if (!mood || !stress) {
      setError('Choose your mood and stress level to save.')
      return
    }
    if (hours !== '' && (hours < 0 || hours > 24)) {
      setError('Sleep must be between 0 and 24 hours.')
      return
    }
    setSaving(true)
    const date = localDate()
    try {
      const moodBody = { date, mood, stress, tags }
      if (note.trim()) moodBody.note = note.trim()
      const saved = await checkinsApi.logMood(moodBody)
      let sleepSaved = null
      if (hours !== '') {
        const sleepBody = { date, hours: Number(hours) }
        if (quality) sleepBody.quality = quality
        sleepSaved = await checkinsApi.logSleep(sleepBody)
      }
      toast.success(todayMood ? 'Check-in updated' : 'Check-in saved. Nicely done.')
      onSaved?.(saved, sleepSaved)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title={todayMood ? 'Today’s check-in' : 'How are you feeling today?'}
        subtitle={todayMood ? 'Saved. You can update it any time today.' : 'It takes less than 30 seconds.'}
        icon={<Icon name="heart" />}
      />
      <form onSubmit={save} className="space-y-5">
        <MoodPicker value={mood} onChange={setMood} />
        <div className="grid gap-5 md:grid-cols-2">
          <LevelPicker label="Stress level" name="stress" value={stress} onChange={setStress} lowLabel="Calm" highLabel="Very stressed" />
          <SleepInput value={hours} onChange={setHours} />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold">What’s on your mind?</p>
          <TagChips options={MOOD_TAGS} value={tags} onChange={setTags} />
        </div>
        {showMore ? (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="block text-sm font-bold">A short note (optional)</span>
              <textarea
                className="field min-h-[88px]"
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything you want to remember about today"
              />
            </label>
            <LevelPicker label="Sleep quality (optional)" name="quality" value={quality} onChange={setQuality} lowLabel="Restless" highLabel="Deep" />
          </div>
        ) : (
          <button type="button" onClick={() => setShowMore(true)} className="block text-sm font-bold text-primary hover:underline">
            + Add a note or sleep quality
          </button>
        )}
        {error ? <Alert tone="danger" title={error} /> : null}
        <Button type="submit" loading={saving} className="w-full sm:w-auto">
          <Icon name="check" size={18} /> {todayMood ? 'Update check-in' : 'Save check-in'}
        </Button>
      </form>
    </Card>
  )
}
