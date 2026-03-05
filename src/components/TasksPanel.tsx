import { useState, useRef, useEffect } from 'react'
import { Icon } from '../folk'

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'done'

interface Task {
  id: number
  title: string
  dueDate: string
  assigneeAvatar: string
  status: TaskStatus
  overdue?: boolean
}

// ─── Data ────────────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'Follow up with Lisa Anderson',    dueDate: 'Mar 28', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', overdue: true },
  { id: 2, title: 'Send NDA to Acme Corp',           dueDate: 'Apr 1',  assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', overdue: true },
  { id: 3, title: 'Review partnership proposal',     dueDate: 'Apr 4',  assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo' },
  { id: 4, title: 'Schedule demo with Stripe team',  dueDate: 'Apr 6',  assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo' },
  { id: 5, title: 'Prepare Q2 pipeline report',      dueDate: 'Apr 10', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo' },
  { id: 6, title: 'Intro call with Y Combinator',    dueDate: 'Apr 1',  assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'done' },
  { id: 7, title: 'Send thank you note to Jake',     dueDate: 'Mar 30', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'done' },
  { id: 8, title: 'Update CRM with Berlin contacts', dueDate: 'Mar 28', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'done' },
  { id: 9, title: 'Book flights for SF summit',      dueDate: 'Mar 25', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'done' },
]

// ─── Tab bar ─────────────────────────────────────────────────────────────────

type Tab = 'interactions' | 'notes' | 'tasks'

// ─── Task row ────────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  const [hovered, setHovered] = useState(false)
  const done = task.status === 'done'

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '5px 16px', cursor: 'pointer',
        background: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Check icon */}
      <div
        style={{ flexShrink: 0, cursor: 'pointer' }}
        onClick={e => { e.stopPropagation(); onToggle(task.id) }}
      >
        {done
          ? <Icon name="check_circle" size={16} style={{ color: 'rgba(0,0,0,0.2)' }} />
          : <Icon name="radio_button_unchecked" size={16} style={{ color: hovered ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)' }} />
        }
      </div>

      {/* Title */}
      <span style={{
        flex: 1, minWidth: 0,
        fontSize: 13, letterSpacing: '-0.04px', lineHeight: '18px',
        color: done ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.87)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {task.title}
      </span>

      {/* Date */}
      <span style={{
        fontSize: 12, flexShrink: 0,
        color: task.overdue ? '#e5484d' : done ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.4)',
      }}>
        {task.dueDate}
      </span>

      {/* Avatar */}
      <img
        src={task.assigneeAvatar}
        style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, opacity: done ? 0.35 : 1 }}
      />
    </div>
  )
}

// ─── New task row ─────────────────────────────────────────────────────────────

function NewTaskRow({ onSubmit, onCancel }: { onSubmit: (title: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && value.trim()) { onSubmit(value.trim()); return }
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 16px' }}>
      <Icon name="radio_button_unchecked" size={16} style={{ color: 'rgba(0,0,0,0.2)', flexShrink: 0 }} />
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => { if (!value.trim()) onCancel() }}
        placeholder="Task name"
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontSize: 13, letterSpacing: '-0.04px', color: 'rgba(0,0,0,0.87)',
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

// ─── Section header ──────────────────────────────────────────────────────────

function SectionHeader({ label, count, onNewTask }: { label: string; count: number; onNewTask?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px 6px' }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.3px' }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.3)', marginLeft: 6 }}>
        {count}
      </span>
      {onNewTask && (
        <button
          onClick={onNewTask}
          style={{
            marginLeft: 'auto',
            height: 24, paddingLeft: 12, paddingRight: 12,
            background: 'rgba(0,0,0,0.87)', color: 'white',
            border: 'none', borderRadius: 100,
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
            letterSpacing: '-0.04px',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.87)')}
        >
          New task
        </button>
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

let nextId = 100

export function TasksPanel() {
  const [activeTab, setActiveTab]     = useState<Tab>('tasks')
  const [tasks, setTasks]             = useState<Task[]>(INITIAL_TASKS)
  const [addingTask, setAddingTask]   = useState(false)

  const todo      = tasks.filter(t => t.status === 'todo')
  const completed = tasks.filter(t => t.status === 'done')

  function toggle(id: number) {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'todo' ? 'done' : 'todo', overdue: false } : t
    ))
  }

  function createTask(title: string) {
    setTasks(prev => [{
      id: nextId++, title, dueDate: '', assigneeAvatar: 'https://i.pravatar.cc/150?img=12',
      status: 'todo',
    }, ...prev])
    setAddingTask(false)
  }

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'interactions', label: 'Interactions', count: 8 },
    { key: 'notes',        label: 'Notes',        count: 1 },
    { key: 'tasks',        label: 'Tasks',        count: todo.length },
  ]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      flex: 1, minWidth: 0,
      borderLeft: '1px solid rgba(0,0,0,0.08)',
      background: 'white', overflow: 'hidden',
    }}>

      {/* Tab bar */}
      <div style={{
        display: 'flex', alignItems: 'center', flexShrink: 0,
        borderBottom: '1px solid rgba(0,0,0,0.08)', height: 40,
        paddingLeft: 8,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              height: '100%', paddingLeft: 8, paddingRight: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '1.5px solid rgba(0,0,0,0.87)' : '1.5px solid transparent',
              display: 'flex', alignItems: 'center', gap: 4, marginBottom: -1,
            }}
          >
            <span style={{
              fontSize: 13, letterSpacing: '-0.04px', whiteSpace: 'nowrap',
              color: activeTab === tab.key ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.45)',
              fontWeight: activeTab === tab.key ? 500 : 400,
            }}>
              {tab.label}
            </span>
            <span style={{ fontSize: 11, color: activeTab === tab.key ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.3)' }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {activeTab === 'tasks' && (
          <>
            <SectionHeader label="Overdue" count={todo.length} onNewTask={() => setAddingTask(true)} />
            {addingTask && (
              <NewTaskRow onSubmit={createTask} onCancel={() => setAddingTask(false)} />
            )}
            {todo.map(task => <TaskRow key={task.id} task={task} onToggle={toggle} />)}

            <SectionHeader label="Completed" count={completed.length} />
            {completed.map(task => <TaskRow key={task.id} task={task} onToggle={toggle} />)}
          </>
        )}
      </div>
    </div>
  )
}
