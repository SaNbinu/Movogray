import { useEffect, useRef, useState } from 'react'
import AddChildScreen from './components/AddChildScreen'
import AssignTaskScreen from './components/AssignTaskScreen'
import ChildHomeScreen from './components/ChildHomeScreen'
import ChildProfileScreen from './components/ChildProfileScreen'
import ChildSelectionScreen from './components/ChildSelectionScreen'
import EditChildScreen from './components/EditChildScreen'
import RocketGameScreen from './components/RocketGameScreen'
import RoleSelectionScreen from './components/RoleSelectionScreen'
import TherapistHomeScreen from './components/TherapistHomeScreen'
import { therapistChildren } from './data/therapistChildren'
import type { NewTherapistTask, TherapistChild, TherapistTask } from './data/therapistChildren'
import './App.css'

const CHILDREN_STORAGE_KEY = 'movogray_children'

type AppScreen = 'home' | 'rocket-game'
type UserRole = 'child' | 'therapist' | null
type TherapistScreen = 'home' | 'profile' | 'assign-task' | 'add-child' | 'edit-child'

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home')
  const [role, setRole] = useState<UserRole>(null)
  const [children, setChildren] = useState<TherapistChild[]>(() => {
    try {
      const savedChildren = localStorage.getItem(CHILDREN_STORAGE_KEY)
      const parsedChildren: unknown = savedChildren ? JSON.parse(savedChildren) : null

      return Array.isArray(parsedChildren) ? parsedChildren : therapistChildren
    } catch {
      return therapistChildren
    }
  })
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [therapistScreen, setTherapistScreen] = useState<TherapistScreen>('home')
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const nextTaskIdRef = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(children))
    } catch {
      // Persistence is optional; the in-memory state remains usable if storage is unavailable.
    }
  }, [children])

  // Developer reset helper: localStorage.removeItem(CHILDREN_STORAGE_KEY)

  function completeTask(childId: string, taskId: string) {
    setChildren((currentChildren) => currentChildren.map((child) => {
      if (child.id !== childId) {
        return child
      }

      const taskToComplete = child.tasks.find((task) => task.id === taskId)
      if (!taskToComplete || taskToComplete.completed) {
        return child
      }

      return {
        ...child,
        points: child.points + 25,
        tasks: child.tasks.map((task) => (
          task.id === taskId ? { ...task, completed: true } : task
        )),
      }
    }))
  }

  function handleRoleSelection(nextRole: 'child' | 'therapist') {
    setRole(nextRole)
    setSelectedChildId(null)
    setTherapistScreen('home')
    setCurrentScreen('home')
    setActiveTaskId(null)
  }

  function handleChangeRole() {
    setRole(null)
    setSelectedChildId(null)
    setTherapistScreen('home')
    setCurrentScreen('home')
    setActiveTaskId(null)
  }

  function handleSelectTherapistChild(childId: string) {
    setSelectedChildId(childId)
    setTherapistScreen('profile')
  }

  function handleSelectPlayingChild(childId: string) {
    setSelectedChildId(childId)
    setCurrentScreen('home')
    setActiveTaskId(null)
  }

  function handleAssignTask(task: NewTherapistTask) {
    if (!selectedChildId) {
      return
    }

    setChildren((currentChildren) => currentChildren.map((child) => (
      child.id === selectedChildId
        ? {
            ...child,
            tasks: [
              ...child.tasks,
              {
                ...task,
                id: `task-${child.id}-${nextTaskIdRef.current++}`,
                completed: false,
              },
            ],
          }
        : child
    )))
    setTherapistScreen('profile')
  }

  function addChild({ name, targetSound }: Pick<TherapistChild, 'name' | 'targetSound'>) {
    setChildren((currentChildren) => {
      const avatarColors = ['blue', 'purple', 'mint'] as const
      const avatarColor = avatarColors[currentChildren.length % avatarColors.length]

      return [
        ...currentChildren,
        {
          id: crypto.randomUUID(),
          name,
          targetSound,
          points: 0,
          streak: '0 днів',
          lastActivity: 'ще не було',
          avatarColor,
          tasks: [],
          recentResults: [],
        },
      ]
    })
    setTherapistScreen('home')
  }

  function updateChild(childId: string, updates: Pick<TherapistChild, 'name' | 'targetSound'>) {
    setChildren((currentChildren) => currentChildren.map((child) => (
      child.id === childId ? { ...child, ...updates } : child
    )))
    setTherapistScreen('profile')
  }

  if (role === null) {
    return <RoleSelectionScreen onSelectRole={handleRoleSelection} />
  }

  if (role === 'therapist') {
    const selectedChild = children.find((child) => child.id === selectedChildId)

    if (therapistScreen === 'add-child') {
      return (
        <AddChildScreen
          onBack={() => setTherapistScreen('home')}
          onAdd={addChild}
        />
      )
    }

    if (selectedChild && therapistScreen === 'edit-child') {
      return (
        <EditChildScreen
          child={selectedChild}
          onBack={() => setTherapistScreen('profile')}
          onSave={(updates) => updateChild(selectedChild.id, updates)}
        />
      )
    }

    if (selectedChild && therapistScreen === 'assign-task') {
      return (
        <AssignTaskScreen
          child={selectedChild}
          onBack={() => setTherapistScreen('profile')}
          onAssign={handleAssignTask}
        />
      )
    }

    if (selectedChild && therapistScreen === 'profile') {
      return (
        <ChildProfileScreen
          child={selectedChild}
          onEdit={() => setTherapistScreen('edit-child')}
          onBack={() => {
            setSelectedChildId(null)
            setTherapistScreen('home')
          }}
          onAssignTask={() => setTherapistScreen('assign-task')}
        />
      )
    }

    return (
      <TherapistHomeScreen
        children={children}
        onChangeRole={handleChangeRole}
        onAddChild={() => setTherapistScreen('add-child')}
        onSelectChild={handleSelectTherapistChild}
      />
    )
  }

  const selectedChild = children.find((child) => child.id === selectedChildId)

  if (!selectedChild) {
    return (
      <ChildSelectionScreen
        children={children}
        onChangeRole={handleChangeRole}
        onSelectChild={handleSelectPlayingChild}
      />
    )
  }

  const activeRocketTask = selectedChild.tasks.find(
    (task) => task.id === activeTaskId && task.type === 'rocket',
  )

  if (currentScreen === 'rocket-game' && activeRocketTask) {
    return (
      <RocketGameScreen
        task={activeRocketTask}
        onBack={() => {
          setActiveTaskId(null)
          setCurrentScreen('home')
        }}
        onComplete={(taskId) => completeTask(selectedChild.id, taskId)}
      />
    )
  }

  return (
    <ChildHomeScreen
      child={selectedChild}
      onChangeRole={handleChangeRole}
      onChangeProfile={() => {
        setSelectedChildId(null)
        setCurrentScreen('home')
        setActiveTaskId(null)
      }}
      onStartTask={(task: TherapistTask) => {
        if (task.type === 'rocket' && !task.completed) {
          setActiveTaskId(task.id)
          setCurrentScreen('rocket-game')
        }
      }}
    />
  )
}

export default App
