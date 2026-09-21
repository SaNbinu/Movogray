export type TaskType = 'rocket' | 'word-repeat' | 'sound-hold' | 'other'

export type TherapistTask = {
  id: string
  type: TaskType
  title: string
  icon: string
  targetSound: string
  repetitions: 3 | 5 | 10
  durationSeconds: 2 | 3 | 5
  completed: boolean
}

export type NewTherapistTask = Omit<TherapistTask, 'id' | 'completed'>

export type TherapistChild = {
  id: string
  name: string
  targetSound: string
  streak: string
  lastActivity: string
  avatarColor: 'blue' | 'purple' | 'mint'
  tasks: TherapistTask[]
  recentResults: string[]
}

export const therapistChildren: TherapistChild[] = [
  {
    id: 'maksym',
    name: 'Максим',
    targetSound: 'Р',
    streak: '3 дні',
    lastActivity: 'сьогодні',
    avatarColor: 'blue',
    tasks: [
      { id: 'maksym-rocket', type: 'rocket', title: 'Запусти ракету', icon: '🚀', targetSound: 'Р', repetitions: 5, durationSeconds: 3, completed: true },
      { id: 'maksym-words', type: 'word-repeat', title: 'Повтори слова', icon: '🎯', targetSound: 'Р', repetitions: 5, durationSeconds: 3, completed: true },
      { id: 'maksym-sound', type: 'sound-hold', title: 'Потягни звук', icon: '🎤', targetSound: 'Р', repetitions: 5, durationSeconds: 3, completed: false },
    ],
    recentResults: ['Сьогодні — 4 / 5', 'Вчора — 5 / 5', '18 вересня — 3 / 5'],
  },
  {
    id: 'sofiia',
    name: 'Софія',
    targetSound: 'С',
    streak: '5 днів',
    lastActivity: 'сьогодні',
    avatarColor: 'purple',
    tasks: [
      { id: 'sofiia-find', type: 'other', title: 'Знайди звук', icon: '🔎', targetSound: 'С', repetitions: 5, durationSeconds: 3, completed: true },
      { id: 'sofiia-words', type: 'word-repeat', title: 'Повтори слова', icon: '🎯', targetSound: 'С', repetitions: 5, durationSeconds: 3, completed: true },
      { id: 'sofiia-stream', type: 'other', title: 'Тихий струмок', icon: '🌊', targetSound: 'С', repetitions: 5, durationSeconds: 3, completed: true },
    ],
    recentResults: ['Сьогодні — 5 / 5', 'Вчора — 4 / 5', '18 вересня — 5 / 5'],
  },
  {
    id: 'artem',
    name: 'Артем',
    targetSound: 'Ш',
    streak: '1 день',
    lastActivity: 'вчора',
    avatarColor: 'mint',
    tasks: [
      { id: 'artem-find', type: 'other', title: 'Знайди звук', icon: '🔎', targetSound: 'Ш', repetitions: 5, durationSeconds: 3, completed: true },
      { id: 'artem-breath', type: 'other', title: 'Легке дихання', icon: '🍃', targetSound: 'Ш', repetitions: 5, durationSeconds: 3, completed: true },
      { id: 'artem-words', type: 'word-repeat', title: 'Шиплячі слова', icon: '💬', targetSound: 'Ш', repetitions: 5, durationSeconds: 3, completed: false },
    ],
    recentResults: ['Вчора — 2 / 5', '18 вересня — 3 / 5', '17 вересня — 4 / 5'],
  },
]
