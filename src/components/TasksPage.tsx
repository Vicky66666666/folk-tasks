import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../folk'

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'done'
type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

interface Task {
  id: number
  title: string
  dueDate: string
  assigneeAvatar: string
  status: TaskStatus
  priority: Priority
  overdue?: boolean
  group: 'overdue' | 'today' | 'upcoming' | 'completed'
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TASKS: Task[] = [
  { id: 1,  title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'urgent', overdue: true, group: 'overdue' },
  { id: 2,  title: 'Send proposal to Johnson & Co', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'none', overdue: true, group: 'overdue' },
  { id: 3,  title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'none', group: 'today' },
  { id: 4,  title: 'Review Q2 forecast', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'none', group: 'today' },
  { id: 5,  title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'none', group: 'upcoming' },
  { id: 6,  title: 'Follow up with Berlin office', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'none', group: 'upcoming' },
  { id: 7,  title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'none', group: 'upcoming' },
  { id: 8,  title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'done', priority: 'none', group: 'completed' },
  { id: 9,  title: 'Prepare investor deck', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'done', priority: 'none', group: 'completed' },
  { id: 10, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'done', priority: 'none', group: 'completed' },
  { id: 11, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'done', priority: 'none', group: 'completed' },
]

const PRIORITY_OPTIONS: { value: Priority; label: string; shortcut: string }[] = [
  { value: 'none',   label: 'No priority', shortcut: '0' },
  { value: 'urgent', label: 'Urgent',      shortcut: '1' },
  { value: 'high',   label: 'High',        shortcut: '2' },
  { value: 'medium', label: 'Medium',      shortcut: '3' },
  { value: 'low',    label: 'Low',         shortcut: '4' },
]

// ─── Priority icon ─────────────────────────────────────────────────────────

function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === 'urgent') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <rect x="1" y="1" width="14" height="14" rx="3" fill="#202020" />
        <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">!</text>
      </svg>
    )
  }
  if (priority === 'high') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <rect x="1.5" y="8"  width="3" height="6"  fill="#626262" />
        <rect x="6.5" y="5"  width="3" height="9"  fill="#626262" />
        <rect x="11.5" y="2" width="3" height="12" fill="#626262" />
      </svg>
    )
  }
  if (priority === 'medium') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <rect x="1.5" y="8"  width="3" height="6"  fill="#626262" />
        <rect x="6.5" y="5"  width="3" height="9"  fill="#626262" />
        <rect x="11.5" y="2" width="3" height="12" fill="#e1e1e1" />
      </svg>
    )
  }
  if (priority === 'low') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <rect x="1.5" y="8"  width="3" height="6"  fill="#626262" />
        <rect x="6.5" y="5"  width="3" height="9"  fill="#e1e1e1" />
        <rect x="11.5" y="2" width="3" height="12" fill="#e1e1e1" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <circle cx="3.5"  cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
      <circle cx="8"    cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
      <circle cx="12.5" cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
    </svg>
  )
}

// ─── Priority picker ────────────────────────────────────────────────────────

function PriorityPicker({
  current, anchorRect, onSelect, onClose,
}: {
  current: Priority
  anchorRect: DOMRect
  onSelect: (p: Priority) => void
  onClose: () => void
}) {
  const top  = anchorRect.bottom + 6
  const left = anchorRect.left

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      const opt = PRIORITY_OPTIONS.find(o => o.shortcut === e.key)
      if (opt) { onSelect(opt.value); onClose() }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onSelect, onClose])

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top, left, zIndex: 1000,
          width: 240, background: 'white', borderRadius: 8,
          border: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>Change priority to...</span>
        </div>
        {PRIORITY_OPTIONS.map(opt => (
          <div
            key={opt.value}
            className="flex items-center"
            style={{
              gap: 10, padding: '6px 12px', cursor: 'pointer',
              background: opt.value === current ? 'rgba(0,0,0,0.04)' : 'transparent',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = opt.value === current ? 'rgba(0,0,0,0.04)' : 'transparent' }}
            onMouseDown={e => { e.stopPropagation(); onSelect(opt.value); onClose() }}
          >
            <PriorityIcon priority={opt.value} />
            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.87)', flex: 1 }}>{opt.label}</span>
            <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)' }}>{opt.shortcut}</span>
          </div>
        ))}
      </div>
    </>,
    document.body,
  )
}

// ─── Circle checkbox ─────────────────────────────────────────────────────────

function CircleCheckbox({ done, onToggle }: { done: boolean; onToggle: () => void }) {
  if (done) {
    return (
      <button
        onClick={e => { e.stopPropagation(); onToggle() }}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7.5" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.1)" />
          <path d="M4.5 8L7 10.5L11.5 6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle() }}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16 }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7.5" stroke="rgba(0,0,0,0.2)" />
      </svg>
    </button>
  )
}

// ─── Task row ────────────────────────────────────────────────────────────────

function TaskRow({
  task, onToggle, onPriorityChange, onOpen,
}: {
  task: Task
  onToggle: (id: number) => void
  onPriorityChange: (id: number, p: Priority) => void
  onOpen: (task: Task) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [priorityAnchor, setPriorityAnchor] = useState<DOMRect | null>(null)
  const priorityRef = useRef<HTMLButtonElement>(null)

  const isCompleted = task.status === 'done'

  return (
    <>
      <div
        className="flex items-center"
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          height: 36,
          gap: 8,
          background: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onOpen(task)}
      >
        {/* Priority icon / drag handle */}
        <button
          ref={priorityRef}
          style={{
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 16, height: 16,
            opacity: hovered || task.priority !== 'none' ? 1 : 0.4,
          }}
          onClick={e => {
            e.stopPropagation()
            setPriorityAnchor(priorityRef.current!.getBoundingClientRect())
          }}
        >
          <PriorityIcon priority={task.priority} />
        </button>

        {/* Checkbox */}
        <CircleCheckbox done={isCompleted} onToggle={() => onToggle(task.id)} />

        {/* Title */}
        <span
          className="flex-1 truncate"
          style={{
            fontSize: 13,
            color: isCompleted ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)',
            letterSpacing: '-0.04px',
          }}
        >
          {task.title}
        </span>

        {/* Date */}
        {task.dueDate && (
          <span
            style={{
              fontSize: 12,
              color: task.overdue ? '#e5484d' : isCompleted ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.45)',
              flexShrink: 0,
            }}
          >
            {task.dueDate}
          </span>
        )}

        {/* Avatar */}
        <img
          src={task.assigneeAvatar}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            flexShrink: 0,
            opacity: isCompleted ? 0.4 : 1,
          }}
        />
      </div>

      {priorityAnchor && (
        <PriorityPicker
          current={task.priority}
          anchorRect={priorityAnchor}
          onSelect={p => onPriorityChange(task.id, p)}
          onClose={() => setPriorityAnchor(null)}
        />
      )}
    </>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  label, count, collapsed, onToggle,
}: {
  label: string
  count: number
  collapsed: boolean
  onToggle: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="flex items-center"
      style={{
        paddingLeft: 14,
        paddingRight: 16,
        height: 32,
        gap: 6,
        cursor: 'pointer',
        background: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
      }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        width="12" height="12" viewBox="0 0 12 12" fill="none"
        style={{
          flexShrink: 0,
          transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s ease',
          color: 'rgba(0,0,0,0.4)',
        }}
      >
        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px' }}>
        {label}
      </span>
      <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.38)' }}>{count}</span>
    </div>
  )
}

// ─── New Task Form (inline) ────────────────────────────────────────────────────

function NewTaskForm({ onSubmit, onCancel }: { onSubmit: (title: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) { onSubmit(value.trim()); return }
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div
      className="flex items-center"
      style={{ paddingLeft: 16, paddingRight: 16, height: 36, gap: 8, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div style={{ width: 16, height: 16, flexShrink: 0 }} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <circle cx="8" cy="8" r="7.5" stroke="rgba(0,0,0,0.2)" />
      </svg>
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => { if (!value.trim()) onCancel() }}
        placeholder="Task name"
        style={{
          flex: 1, border: 'none', outline: 'none', fontSize: 13,
          color: 'rgba(0,0,0,0.87)', background: 'transparent',
          letterSpacing: '-0.04px',
        }}
      />
    </div>
  )
}

// ─── TasksPage ────────────────────────────────────────────────────────────────

export function TasksPage() {
  const [activeTab, setActiveTab] = useState<'mine' | 'all'>('mine')
  const [searchQuery, setSearchQuery] = useState('')
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [showNewTaskForm, setShowNewTaskForm] = useState<string | null>(null)

  const handleToggle = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const done = t.status === 'done'
      return {
        ...t,
        status: done ? 'todo' : 'done',
        group: done ? (t.overdue ? 'overdue' : 'upcoming') : 'completed',
      }
    }))
  }

  const handlePriorityChange = (id: number, priority: Priority) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority } : t))
  }

  const handleNewTask = (title: string) => {
    const id = Math.max(...tasks.map(t => t.id)) + 1
    const group = (showNewTaskForm as Task['group']) || 'upcoming'
    setTasks(prev => [...prev, {
      id, title, dueDate: '', assigneeAvatar: 'https://i.pravatar.cc/150?img=12',
      status: 'todo', priority: 'none', group,
    }])
    setShowNewTaskForm(null)
  }

  const filteredTasks = searchQuery
    ? tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : tasks

  const GROUPS: Array<{ key: Task['group']; label: string }> = [
    { key: 'overdue',   label: 'Overdue' },
    { key: 'today',     label: 'Today' },
    { key: 'upcoming',  label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
  ]

  const myTasksCount = tasks.filter(t => t.assigneeAvatar.includes('img=12') && t.status === 'todo').length
  const allTasksCount = tasks.filter(t => t.status === 'todo').length

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>

      {/* ── Header tabs ── */}
      <div
        className="flex items-center"
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          height: 48,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          flexShrink: 0,
          gap: 0,
        }}
      >
        <TabButton
          label="My tasks"
          count={myTasksCount}
          active={activeTab === 'mine'}
          onClick={() => setActiveTab('mine')}
        />
        <TabButton
          label="All tasks"
          count={allTasksCount}
          active={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
        />
        <div style={{ marginLeft: 'auto' }}>
          <button
            style={{
              height: 32,
              paddingLeft: 14,
              paddingRight: 14,
              background: '#111',
              color: 'white',
              border: 'none',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '-0.04px',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#333')}
            onMouseLeave={e => (e.currentTarget.style.background = '#111')}
            onClick={() => setShowNewTaskForm('upcoming')}
          >
            New task
          </button>
        </div>
      </div>

      {/* ── Search + Filter ── */}
      <div
        className="flex items-center"
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
          gap: 8,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center"
          style={{
            gap: 6,
            height: 32,
            paddingLeft: 10,
            paddingRight: 10,
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 8,
            background: 'white',
            width: 220,
          }}
        >
          <Icon name="search" size={14} style={{ color: 'rgba(0,0,0,0.38)', flexShrink: 0 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 13, color: 'rgba(0,0,0,0.87)',
              background: 'transparent', letterSpacing: '-0.04px',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Icon name="close" size={12} style={{ color: 'rgba(0,0,0,0.38)' }} />
            </button>
          )}
        </div>

        {/* Filter button */}
        <button
          className="flex items-center"
          style={{
            gap: 6, height: 32, paddingLeft: 10, paddingRight: 10,
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderRadius: 8,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Icon name="filter_list" size={14} style={{ color: 'rgba(0,0,0,0.55)' }} />
          <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', letterSpacing: '-0.04px' }}>Filter</span>
        </button>
      </div>

      {/* ── Task list ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {GROUPS.map(({ key, label }) => {
          const items = filteredTasks.filter(t => t.group === key)
          if (items.length === 0 && showNewTaskForm !== key) return null
          const isCollapsed = !!collapsed[key]

          return (
            <React.Fragment key={key}>
              <SectionHeader
                label={label}
                count={items.length}
                collapsed={isCollapsed}
                onToggle={() => setCollapsed(c => ({ ...c, [key]: !c[key] }))}
              />
              {!isCollapsed && (
                <>
                  {items.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={handleToggle}
                      onPriorityChange={handlePriorityChange}
                      onOpen={() => {}}
                    />
                  ))}
                  {showNewTaskForm === key && (
                    <NewTaskForm
                      onSubmit={handleNewTask}
                      onCancel={() => setShowNewTaskForm(null)}
                    />
                  )}
                </>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tab button ────────────────────────────────────────────────────────────────

function TabButton({
  label, count, active, onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        borderBottom: active ? '2px solid rgba(0,0,0,0.87)' : '2px solid transparent',
        padding: '0 12px',
        height: '100%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        marginBottom: active ? 0 : 0,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          color: active ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.45)',
          letterSpacing: '-0.04px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          color: active ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.3)',
          fontWeight: 400,
        }}
      >
        {count}
      </span>
    </button>
  )
}
