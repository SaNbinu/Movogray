import { useRef, useState } from 'react'
import AssignTaskScreen from './components/AssignTaskScreen'
import ChildHomeScreen from './components/ChildHomeScreen'
import ChildProfileScreen from './components/ChildProfileScreen'
import ChildSelectionScreen from './components/ChildSelectionScreen'
import RocketGameScreen from './components/RocketGameScreen'
import RoleSelectionScreen from './components/RoleSelectionScreen'
import TherapistHomeScreen from './components/TherapistHomeScreen'
import { therapistChildren } from './data/therapistChildren'
import type { NewTherapistTask, TherapistTask } from './data/therapistChildren'
import './App.css'

type AppScreen = 'home' | 'rocket-game'
type UserRole = 'child' | 'therapist' | null
type TherapistScreen = 'home' | 'profile' | 'assign-task'

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home')
  const [role, setRole] = useState<UserRole>(null)
  const [children, setChildren] = useState(therapistChildren)
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [therapistScreen, setTherapistScreen] = useState<TherapistScreen>('home')
  const [missionCompleted, setMissionCompleted] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const rewardClaimedRef = useRef(false)
  const nextTaskIdRef = useRef(0)

  function handleMissionComplete() {
    if (rewardClaimedRef.current) {
      return
    }

    if (!selectedChildId) {
      return
    }

    rewardClaimedRef.current = true
    setChildren((currentChildren) => currentChildren.map((child) => (
      child.id === selectedChildId
        ? { ...child, points: child.points + 25 }
        : child
    )))
    setMissionCompleted(true)
  }

  function handleRoleSelection(nextRole: 'child' | 'therapist') {
    setRole(nextRole)
    setSelectedChildId(null)
    setTherapistScreen('home')
    setCurrentScreen('home')
    setActiveTaskId(null)
    setMissionCompleted(false)
    rewardClaimedRef.current = false
  }

  function handleChangeRole() {
    setRole(null)
    setSelectedChildId(null)
    setTherapistScreen('home')
    setCurrentScreen('home')
    setActiveTaskId(null)
    setMissionCompleted(false)
    rewardClaimedRef.current = false
  }

  function handleSelectTherapistChild(childId: string) {
    setSelectedChildId(childId)
    setTherapistScreen('profile')
  }

  function handleSelectPlayingChild(childId: string) {
    setSelectedChildId(childId)
    setCurrentScreen('home')
    setActiveTaskId(null)
    setMissionCompleted(false)
    rewardClaimedRef.current = false
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

  if (role === null) {
    return <RoleSelectionScreen onSelectRole={handleRoleSelection} />
  }

  if (role === 'therapist') {
    const selectedChild = children.find((child) => child.id === selectedChildId)

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
    (task) => task.id === activeTaskId && task.type === 'rocket' && !task.completed,
  )

  if (currentScreen === 'rocket-game' && activeRocketTask) {
    return (
      <RocketGameScreen
        task={activeRocketTask}
        onBack={() => {
          setActiveTaskId(null)
          setCurrentScreen('home')
        }}
        onMissionComplete={handleMissionComplete}
      />
    )
  }

  return (
    <ChildHomeScreen
      child={selectedChild}
      missionCompleted={missionCompleted}
      onChangeRole={handleChangeRole}
      onChangeProfile={() => {
        setSelectedChildId(null)
        setCurrentScreen('home')
        setActiveTaskId(null)
        setMissionCompleted(false)
        rewardClaimedRef.current = false
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
