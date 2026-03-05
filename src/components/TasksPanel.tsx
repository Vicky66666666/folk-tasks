import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
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

const ASSIGNEES = [
  { avatar: 'https://i.pravatar.cc/150?img=12', name: 'Alex' },
  { avatar: 'https://i.pravatar.cc/150?img=44', name: 'Jordan' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(raw: string): string {
  if (!raw) return ''
  const d = new Date(raw + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

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

// ─── Pill style ──────────────────────────────────────────────────────────────

const pillStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  height: 28, paddingLeft: 10, paddingRight: 10,
  background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 100, cursor: 'pointer',
  fontSize: 12, fontWeight: 400, letterSpacing: '-0.04px',
  color: 'rgba(0,0,0,0.61)', fontFamily: 'inherit',
}

// ─── New task modal ───────────────────────────────────────────────────────────

function NewTaskModal({ onClose, onCreate }: {
  onClose: () => void
  onCreate: (task: Omit<Task, 'id'>) => void
}) {
  const [title, setTitle]           = useState('')
  const [dueDateRaw, setDueDateRaw] = useState('')
  const [assignee, setAssignee]     = useState(ASSIGNEES[0])
  const titleRef                    = useRef<HTMLInputElement>(null)

  useEffect(() => { titleRef.current?.focus() }, [])

  const formattedDate = formatDate(dueDateRaw)

  const handleCreate = () => {
    if (!title.trim()) return
    onCreate({
      title: title.trim(),
      dueDate: formattedDate,
      assigneeAvatar: assignee.avatar,
      status: 'todo',
    })
    onClose()
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.32)' }}
        onMouseDown={onClose}
      />

      {/* Modal card */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000, width: 576,
          background: 'white',
          border: '1px solid #e1e1e1',
          overflow: 'hidden',
          boxShadow: '0px 9px 24px 0px rgba(24,26,27,0.16), 0px 3px 6px 0px rgba(24,26,27,0.08), 0px 0px 1px 0px rgba(24,26,27,0.04)',
        }}
        onMouseDown={e => e.stopPropagation()}
        onKeyDown={e => {
          if (e.key === 'Escape') { e.stopPropagation(); onClose() }
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCreate()
        }}
      >
        {/* Body */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* Title input */}
          <input
            ref={titleRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            style={{
              border: 'none', outline: 'none', padding: 0, width: '100%',
              fontFamily: 'inherit',
              fontSize: 20, fontWeight: 500, lineHeight: '24px',
              color: '#202020', background: 'transparent',
            }}
          />

          {/* Attribute pills */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

            {/* Date pill — wraps a hidden native date input */}
            <label style={{ ...pillStyle, position: 'relative' }}>
              <Icon name="calendar_today" size={14} style={{ color: 'rgba(0,0,0,0.61)', flexShrink: 0 }} />
              <span style={{ color: formattedDate ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.45)' }}>
                {formattedDate || 'Date'}
              </span>
              <input
                type="date"
                value={dueDateRaw}
                onChange={e => setDueDateRaw(e.target.value)}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
              />
            </label>

            {/* Assignee avatars */}
            <div style={{ display: 'flex', gap: 4 }}>
              {ASSIGNEES.map(a => (
                <img
                  key={a.avatar}
                  src={a.avatar}
                  title={a.name}
                  onClick={() => setAssignee(a)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', cursor: 'pointer',
                    opacity: assignee.avatar === a.avatar ? 1 : 0.3,
                    outline: assignee.avatar === a.avatar ? '2px solid rgba(0,0,0,0.7)' : 'none',
                    outlineOffset: 1,
                    transition: 'opacity 0.1s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e1e1e1',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '12px 16px', gap: 8,
        }}>
          <button
            onClick={onClose}
            style={{
              height: 28, paddingLeft: 12, paddingRight: 12,
              background: 'white', border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 100, fontFamily: 'inherit',
              fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px',
              color: 'rgba(0,0,0,0.61)', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            style={{
              height: 28, paddingLeft: 12, paddingRight: 12,
              background: title.trim() ? '#202020' : 'rgba(0,0,0,0.08)',
              border: 'none', borderRadius: 100, fontFamily: 'inherit',
              fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px',
              color: title.trim() ? 'white' : 'rgba(0,0,0,0.3)',
              cursor: title.trim() ? 'pointer' : 'default',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Create task
          </button>
        </div>
      </div>
    </>,
    document.body
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
  const [activeTab, setActiveTab]   = useState<Tab>('tasks')
  const [tasks, setTasks]           = useState<Task[]>(INITIAL_TASKS)
  const [addingTask, setAddingTask] = useState(false)

  const todo      = tasks.filter(t => t.status === 'todo')
  const completed = tasks.filter(t => t.status === 'done')

  function toggle(id: number) {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'todo' ? 'done' : 'todo', overdue: false } : t
    ))
  }

  function createTask(task: Omit<Task, 'id'>) {
    setTasks(prev => [{ id: nextId++, ...task }, ...prev])
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
            {todo.map(task => <TaskRow key={task.id} task={task} onToggle={toggle} />)}

            <SectionHeader label="Completed" count={completed.length} />
            {completed.map(task => <TaskRow key={task.id} task={task} onToggle={toggle} />)}
          </>
        )}
      </div>

      {/* New task modal (portal) */}
      {addingTask && (
        <NewTaskModal onClose={() => setAddingTask(false)} onCreate={createTask} />
      )}
    </div>
  )
}
