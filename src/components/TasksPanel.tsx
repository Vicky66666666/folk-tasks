import { useState } from 'react'
import { Icon } from '../folk'

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'done'

interface Task {
  id: number
  title: string
  dueDate: string
  dueLabel: string
  assignee: string
  assigneeInitials: string
  status: TaskStatus
  overdue?: boolean
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TASKS: Task[] = [
  { id: 1, title: 'Send partnership proposal deck', dueLabel: 'Yesterday', dueDate: 'Mar 1', assignee: 'Julien', assigneeInitials: 'JL', status: 'todo', overdue: true },
  { id: 2, title: 'Follow up on intro email to Steve', dueLabel: 'Yesterday', dueDate: 'Mar 1', assignee: 'Vicky', assigneeInitials: 'VM', status: 'todo', overdue: true },
  { id: 3, title: 'Prepare Q2 review call', dueLabel: 'Today', dueDate: 'Mar 2', assignee: 'Vicky', assigneeInitials: 'VM', status: 'todo' },
  { id: 4, title: 'Share product roadmap PDF', dueLabel: 'Today', dueDate: 'Mar 2', assignee: 'Julien', assigneeInitials: 'JL', status: 'todo' },
  { id: 5, title: 'Book dinner at Nobu for next week', dueLabel: 'Mar 7', dueDate: 'Mar 7', assignee: 'Vicky', assigneeInitials: 'VM', status: 'todo' },
  { id: 6, title: 'Confirm attendance for Fundraising event', dueLabel: 'Mar 12', dueDate: 'Mar 12', assignee: 'Julien', assigneeInitials: 'JL', status: 'todo' },
  { id: 7, title: 'Intro call done — send recap', dueLabel: 'Feb 28', dueDate: 'Feb 28', assignee: 'Vicky', assigneeInitials: 'VM', status: 'done' },
]

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  const done = task.status === 'done'

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 group cursor-default"
      style={{
        borderBottom: '1px solid var(--folk-separator)',
        opacity: done ? 0.5 : 1,
        background: 'var(--folk-surface-default)',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-bg-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--folk-surface-default)')}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
        style={{
          border: done ? 'none' : `1px solid var(--folk-checkbox-border)`,
          background: done ? 'var(--folk-text-primary)' : 'var(--folk-surface-default)',
        }}
        onMouseEnter={e => {
          if (!done) (e.currentTarget as HTMLElement).style.borderColor = 'var(--folk-checkbox-border-hover)'
        }}
        onMouseLeave={e => {
          if (!done) (e.currentTarget as HTMLElement).style.borderColor = 'var(--folk-checkbox-border)'
        }}
      >
        {done && <Icon name="check" size={11} className="text-white" />}
      </button>

      {/* Title */}
      <span
        className="flex-1 text-sm"
        style={{
          color: 'var(--folk-text-primary)',
          textDecoration: done ? 'line-through' : 'none',
          fontSize: 13,
        }}
      >
        {task.title}
      </span>

      {/* Due date */}
      <span
        className="text-xs flex-shrink-0"
        style={{
          color: task.overdue && !done ? 'var(--folk-text-error)' : 'var(--folk-text-muted)',
          fontSize: 11,
          minWidth: 52,
          textAlign: 'right',
        }}
      >
        {task.dueLabel}
      </span>

      {/* Assignee avatar */}
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
        style={{
          background: 'var(--folk-bg-selected)',
          color: 'var(--folk-text-primary)',
          fontSize: 9,
          border: '1px solid var(--folk-separator)',
        }}
        title={task.assignee}
      >
        {task.assigneeInitials}
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label, count, overdue }: { label: string; count: number; overdue?: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2"
      style={{ background: 'var(--folk-surface-muted)' }}
    >
      <span
        className="text-xs font-medium"
        style={{ color: overdue ? 'var(--folk-text-error)' : 'var(--folk-text-muted)', fontSize: 11 }}
      >
        {label}
      </span>
      <span
        className="text-xs"
        style={{ color: overdue ? 'var(--folk-text-error)' : 'var(--folk-text-muted)', fontSize: 11 }}
      >
        {count}
      </span>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'interactions', label: 'Interactions', count: 8 },
  { key: 'notes', label: 'Notes', count: 1 },
  { key: 'tasks', label: 'Tasks', count: 6 },
]

// ─── Tasks tab content ────────────────────────────────────────────────────────

function TasksContent({ tasks, onToggle }: { tasks: Task[]; onToggle: (id: number) => void }) {
  const overdue = tasks.filter(t => t.overdue && t.status === 'todo')
  const today = tasks.filter(t => t.dueLabel === 'Today' && t.status === 'todo')
  const upcoming = tasks.filter(t => !t.overdue && t.dueLabel !== 'Today' && t.status === 'todo')
  const done = tasks.filter(t => t.status === 'done')

  const [showDone, setShowDone] = useState(false)

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: '1px solid var(--folk-separator)' }}
      >
        <span className="text-sm font-medium" style={{ color: 'var(--folk-text-primary)', fontSize: 13 }}>
          Tasks
        </span>
        <button
          className="flex items-center gap-1 px-2.5 h-7 rounded text-xs font-medium cursor-pointer"
          style={{
            background: 'var(--folk-btn-primary-bg)',
            color: 'var(--folk-btn-primary-text)',
            border: 'none',
            fontSize: 12,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Icon name="add" size={13} className="text-white" />
          New task
        </button>
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <>
          <SectionHeader label="Overdue" count={overdue.length} overdue />
          {overdue.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </>
      )}

      {/* Today */}
      {today.length > 0 && (
        <>
          <SectionHeader label="Today" count={today.length} />
          {today.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <>
          <SectionHeader label="Upcoming" count={upcoming.length} />
          {upcoming.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </>
      )}

      {/* Done */}
      {done.length > 0 && (
        <>
          <button
            className="flex items-center gap-2 px-4 py-2 w-full text-left"
            style={{ background: 'var(--folk-surface-muted)' }}
            onClick={() => setShowDone(v => !v)}
          >
            <Icon
              name={showDone ? 'expand_more' : 'chevron_right'}
              size={13}
              className="text-gray-9"
            />
            <span className="text-xs font-medium" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>
              Done
            </span>
            <span className="text-xs" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{done.length}</span>
          </button>
          {showDone && done.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </>
      )}
    </div>
  )
}

// ─── Interactions tab placeholder ─────────────────────────────────────────────

function InteractionsContent() {
  const items = [
    { icon: 'mail', title: 'Intro: Jane Cooper & Steve', date: 'Today', people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
    { icon: 'mail', title: 'Intro: Jane Cooper & JSteve', date: 'Today', people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
    { icon: 'event', title: 'Fundraising event', date: 'in 5 min', people: 'John Wick, John Lenon +3', preview: '', chip: 'APR 12', chipColor: '#e5484d' },
    { icon: 'mail', title: 'Intro: Jane Cooper & JSteve', date: 'Today', people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
    { icon: 'event', title: 'Fundraising event', date: 'in 5 min', people: 'John Wick, John Lenon +3', preview: '', chip: 'APR 12', chipColor: '#e5484d' },
    { icon: 'mail', title: 'Intro: Jane Cooper & Steve', date: 'Today', people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
  ]
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--folk-separator)' }}>
        <span className="text-sm font-medium" style={{ color: 'var(--folk-text-primary)', fontSize: 13 }}>Past interactions</span>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-2 h-7 rounded text-xs" style={{ border: '1px solid var(--folk-separator)', color: 'var(--folk-text-muted)', background: 'transparent', fontSize: 12 }}>
            <Icon name="filter_list" size={12} className="text-gray-9" /> Filter
          </button>
          <button className="flex items-center gap-1 px-2.5 h-7 rounded text-xs font-medium" style={{ border: '1px solid var(--folk-separator)', background: 'var(--folk-surface-default)', color: 'var(--folk-text-primary)', fontSize: 12 }}>
            New interaction
          </button>
        </div>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 px-4 py-3 cursor-pointer" style={{ borderBottom: '1px solid var(--folk-separator)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {item.chip ? (
            <div className="w-8 h-8 rounded flex flex-col items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: item.chipColor, fontSize: 9, lineHeight: 1.2 }}>
              <span style={{ fontSize: 8, textTransform: 'uppercase' }}>APR</span>
              <span style={{ fontSize: 14, lineHeight: 1 }}>12</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--folk-bg-selected)' }}>
              <Icon name={item.icon} size={14} className="text-gray-11" />
            </div>
          )}
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium truncate" style={{ color: 'var(--folk-text-primary)', fontSize: 12 }}>{item.title}</span>
              <span className="text-xs flex-shrink-0" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{item.date}</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{item.people}</span>
            {item.preview && <span className="text-xs truncate" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{item.preview}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function TasksPanel() {
  const [activeTab, setActiveTab] = useState<string>('tasks')
  const [tasks, setTasks] = useState<Task[]>(TASKS)

  const handleToggle = (id: number) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
    ))
  }

  const taskCount = tasks.filter(t => t.status === 'todo').length

  const tabCounts = {
    interactions: 8,
    notes: 1,
    tasks: taskCount,
  }

  return (
    <div
      className="flex flex-col flex-1 h-full overflow-hidden"
      style={{ background: 'var(--folk-surface-default)' }}
    >
      {/* Activity banner */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{
          background: 'var(--folk-surface-muted)',
          borderBottom: '1px solid var(--folk-separator)',
          flexShrink: 0,
        }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
          style={{ background: 'var(--folk-bg-selected)', color: 'var(--folk-text-primary)', fontSize: 9 }}
        >
          JL
        </div>
        <p className="text-xs flex-1 truncate" style={{ color: 'var(--folk-text-muted)', fontSize: 12 }}>
          Julien requested Make or Zapier credentials to build automation templates and discussed platform choice…
        </p>
        <Icon name="expand_more" size={14} className="text-gray-9" />
      </div>

      {/* Tabs */}
      <div
        className="flex items-end gap-1 px-4"
        style={{ borderBottom: '1px solid var(--folk-separator)', flexShrink: 0, height: 40 }}
      >
        {TABS.map(tab => {
          const count = tab.key === 'tasks' ? tabCounts.tasks : tabCounts[tab.key as keyof typeof tabCounts]
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-1 pb-2 text-xs cursor-pointer"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--folk-text-primary)' : '2px solid transparent',
                color: isActive ? 'var(--folk-text-primary)' : 'var(--folk-text-muted)',
                fontWeight: isActive ? 500 : 400,
                fontSize: 13,
                marginBottom: -1,
                paddingBottom: 9,
                cursor: 'pointer',
              }}
            >
              {tab.label}
              <span style={{ color: 'var(--folk-text-muted)', fontWeight: 400, fontSize: 12 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'tasks' && (
        <TasksContent tasks={tasks} onToggle={handleToggle} />
      )}
      {activeTab === 'interactions' && <InteractionsContent />}
      {activeTab === 'notes' && (
        <div className="flex flex-col items-center justify-center flex-1 gap-2" style={{ color: 'var(--folk-text-muted)' }}>
          <Icon name="sticky_note_2" size={24} className="text-gray-7" />
          <span className="text-sm" style={{ fontSize: 13 }}>No notes yet</span>
        </div>
      )}
    </div>
  )
}
