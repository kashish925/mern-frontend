export const BREATHING = {
  'box-breathing': [
    { label: 'Breathe in', seconds: 4, scale: 1 },
    { label: 'Hold', seconds: 4, scale: 1 },
    { label: 'Breathe out', seconds: 4, scale: 0.6 },
    { label: 'Hold', seconds: 4, scale: 0.6 }
  ],
  'four-seven-eight': [
    { label: 'Breathe in', seconds: 4, scale: 1 },
    { label: 'Hold', seconds: 7, scale: 1 },
    { label: 'Breathe out slowly', seconds: 8, scale: 0.6 }
  ],
  'coherent-breathing': [
    { label: 'Breathe in', seconds: 5, scale: 1 },
    { label: 'Breathe out', seconds: 5, scale: 0.6 }
  ]
}

export const STEPS = {
  'grounding-54321': [
    { title: '5 things you can see', text: 'Look around slowly. Name five things you can see, big or small.', seconds: 60 },
    { title: '4 things you can feel', text: 'Notice four things you can touch or feel: your feet on the floor, the chair, your clothes.', seconds: 60 },
    { title: '3 things you can hear', text: 'Listen closely. Name three sounds, near or far.', seconds: 60 },
    { title: '2 things you can smell', text: 'Notice two scents around you, or two you enjoy.', seconds: 60 },
    { title: '1 thing you can taste', text: 'Notice one taste in your mouth, or take a sip of water.', seconds: 60 }
  ],
  stretching: [
    { title: 'Neck rolls', text: 'Slowly roll your head in a circle, five times each way.', seconds: 60 },
    { title: 'Shoulder shrugs', text: 'Lift your shoulders to your ears, hold, then let them drop.', seconds: 60 },
    { title: 'Side stretch', text: 'Reach one arm overhead and lean gently to the side. Switch sides.', seconds: 90 },
    { title: 'Seated twist', text: 'Sit tall and twist gently to one side, then the other.', seconds: 90 },
    { title: 'Forward fold', text: 'Let your upper body hang forward, knees soft, head heavy.', seconds: 90 },
    { title: 'Breathe and rest', text: 'Stand or sit still and take five slow breaths.', seconds: 90 }
  ],
  'sleep-wind-down': [
    { title: 'Dim the lights', text: 'Lower the lights and put your phone face down after this.', seconds: 60 },
    { title: 'Slow your breath', text: 'Breathe in for 4, out for 6. Let each breath get a little slower.', seconds: 120 },
    { title: 'Relax your body', text: 'Starting at your toes, relax each part of your body, moving up to your face.', seconds: 180 },
    { title: 'Let the day go', text: 'Picture today’s worries as clouds drifting past. You don’t need to hold them.', seconds: 120 },
    { title: 'Rest', text: 'Stay still, breathe gently, and let sleep come when it’s ready.', seconds: 120 }
  ],
  'body-scan': [
    { title: 'Feet', text: 'Bring your attention to your feet. Notice any warmth, pressure or tingling, and let them soften.', seconds: 60 },
    { title: 'Legs', text: 'Move up through your calves, knees and thighs. Let them feel heavy and relaxed.', seconds: 60 },
    { title: 'Hips and belly', text: 'Notice your hips and belly rising and falling with each breath.', seconds: 60 },
    { title: 'Chest and back', text: 'Feel your chest and back. Let your breath move gently, without forcing it.', seconds: 60 },
    { title: 'Hands and arms', text: 'Notice your fingers, palms and arms. Let them rest loosely.', seconds: 60 },
    { title: 'Shoulders and neck', text: 'Let your shoulders drop away from your ears and your neck loosen.', seconds: 60 },
    { title: 'Face', text: 'Soften your jaw, your cheeks, the space between your eyebrows and your forehead.', seconds: 60 },
    { title: 'Whole body', text: 'Feel your whole body at once, resting and breathing. Stay here for a few breaths.', seconds: 60 }
  ],
  'progressive-muscle-relaxation': [
    { title: 'Hands', text: 'Make tight fists for five seconds, then release and feel the difference.', seconds: 75 },
    { title: 'Arms', text: 'Bend your elbows and tense your upper arms, hold, then let them go loose.', seconds: 75 },
    { title: 'Shoulders', text: 'Lift your shoulders toward your ears, hold, then let them drop.', seconds: 75 },
    { title: 'Face', text: 'Scrunch your face gently, hold, then release your jaw, eyes and forehead.', seconds: 75 },
    { title: 'Chest and belly', text: 'Take a deep breath and tighten your belly, hold, then breathe out and relax.', seconds: 75 },
    { title: 'Legs', text: 'Press your thighs together and tense your legs, hold, then release.', seconds: 75 },
    { title: 'Feet', text: 'Curl your toes, hold, then let your feet relax completely.', seconds: 75 },
    { title: 'Rest', text: 'Notice how your body feels now. Breathe slowly and enjoy the calm.', seconds: 75 }
  ],
  'loving-kindness': [
    { title: 'Settle in', text: 'Sit comfortably, close your eyes if you like, and take a few slow breaths.', seconds: 60 },
    { title: 'Yourself', text: 'Silently repeat: may I be safe, may I be well, may I be at ease.', seconds: 90 },
    { title: 'Someone you love', text: 'Picture someone you care about and wish them the same: may you be safe, well and at ease.', seconds: 90 },
    { title: 'Someone neutral', text: 'Think of someone you see but don’t know well, and offer them the same kind wishes.', seconds: 90 },
    { title: 'Everyone', text: 'Widen your wishes to everyone around you: may all people be safe, well and at ease.', seconds: 90 }
  ],
  'gratitude-pause': [
    { title: 'Arrive', text: 'Take three slow breaths and let your shoulders soften.', seconds: 30 },
    { title: 'Three good things', text: 'Name three things, big or small, that went well today or that you’re glad about.', seconds: 90 },
    { title: 'Someone who helped', text: 'Think of one person who made your day a little easier. Notice how that feels.', seconds: 60 },
    { title: 'Savour it', text: 'Pick one of those moments and replay it slowly. Let the good feeling stay a little longer.', seconds: 60 }
  ],
  'morning-energiser': [
    { title: 'Reach up', text: 'Stand tall, reach both arms overhead and stretch up through your fingertips.', seconds: 60 },
    { title: 'March in place', text: 'March gently on the spot, lifting your knees and swinging your arms.', seconds: 60 },
    { title: 'Arm circles', text: 'Make slow circles with your arms, forwards then backwards.', seconds: 60 },
    { title: 'Side bends', text: 'Reach one arm overhead and lean to the side. Switch sides and repeat.', seconds: 60 },
    { title: 'Energising breaths', text: 'Breathe in deeply through your nose, out through your mouth. Feel awake and ready.', seconds: 60 }
  ]
}

export function playerKind(exercise) {
  if (BREATHING[exercise.id]) return 'breathing'
  if (STEPS[exercise.id]) return 'steps'
  return 'timer'
}
