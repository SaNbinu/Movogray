export type TaskStatus = 'completed' | 'pending'

export type TherapistTask = {
  title: string
  icon: string
  status: TaskStatus
}

export type TherapistChild = {
  id: string
  name: string
  targetSound: string
  streak: string
  completedTasks: number
  totalTasks: number
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
    completedTasks: 4,
    totalTasks: 5,
    lastActivity: 'сьогодні',
    avatarColor: 'blue',
    tasks: [
      { title: 'Запусти ракету', icon: '🚀', status: 'completed' },
      { title: 'Повтори слова', icon: '🎯', status: 'completed' },
      { title: 'Потягни звук', icon: '🎤', status: 'pending' },
    ],
    recentResults: ['Сьогодні — 4 / 5', 'Вчора — 5 / 5', '18 вересня — 3 / 5'],
  },
  {
    id: 'sofiia',
    name: 'Софія',
    targetSound: 'С',
    streak: '5 днів',
    completedTasks: 5,
    totalTasks: 5,
    lastActivity: 'сьогодні',
    avatarColor: 'purple',
    tasks: [
      { title: 'Знайди звук', icon: '🔎', status: 'completed' },
      { title: 'Повтори слова', icon: '🎯', status: 'completed' },
      { title: 'Тихий струмок', icon: '🌊', status: 'completed' },
    ],
    recentResults: ['Сьогодні — 5 / 5', 'Вчора — 4 / 5', '18 вересня — 5 / 5'],
  },
  {
    id: 'artem',
    name: 'Артем',
    targetSound: 'Ш',
    streak: '1 день',
    completedTasks: 2,
    totalTasks: 5,
    lastActivity: 'вчора',
    avatarColor: 'mint',
    tasks: [
      { title: 'Знайди звук', icon: '🔎', status: 'completed' },
      { title: 'Легке дихання', icon: '🍃', status: 'completed' },
      { title: 'Шиплячі слова', icon: '💬', status: 'pending' },
    ],
    recentResults: ['Вчора — 2 / 5', '18 вересня — 3 / 5', '17 вересня — 4 / 5'],
  },
]
