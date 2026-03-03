import React, { useState, useEffect, useRef } from 'react'
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

// ─── Data ────────────────────────────────────────────────────────────────────

const TASKS: Task[] = [
  { id: 1, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'none', overdue: true, group: 'overdue' },
  { id: 2, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'medium', group: 'today' },
  { id: 3, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'medium', group: 'today' },
  { id: 4, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'none', group: 'upcoming' },
  { id: 5, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'none', group: 'upcoming' },
  { id: 6, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'none', group: 'upcoming' },
  { id: 7, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'done', priority: 'none', group: 'completed' },
  { id: 8, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'done', priority: 'none', group: 'completed' },
  { id: 9, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'done', priority: 'none', group: 'completed' },
  { id: 10, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'done', priority: 'none', group: 'completed' },
]

// ─── Priority definitions ─────────────────────────────────────────────────────

const PRIORITY_OPTIONS: { value: Priority; label: string; shortcut: string }[] = [
  { value: 'none',   label: 'No priority', shortcut: '0' },
  { value: 'urgent', label: 'Urgent',      shortcut: '1' },
  { value: 'high',   label: 'High',        shortcut: '2' },
  { value: 'medium', label: 'Medium',      shortcut: '3' },
  { value: 'low',    label: 'Low',         shortcut: '4' },
]

// ─── Assignee definitions ─────────────────────────────────────────────────────

interface AssigneeOption {
  id: string
  name: string
  avatar?: string
  initials?: string
  color?: string
}

const ASSIGNEES: AssigneeOption[] = [
  { id: 'none',  name: 'No assignee' },
  { id: '1',     name: 'Bessie Cooper',  avatar: 'https://i.pravatar.cc/150?img=44' },
  { id: '2',     name: 'Arlene McCoy',   initials: 'A', color: '#f59e0b' },
  { id: '3',     name: 'Albert Flores',  avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '4',     name: 'Marvin McKinney', initials: 'M', color: '#8b5cf6' },
]

// ─── Date helpers ─────────────────────────────────────────────────────────────

function startOfDay(d: Date) {
  const c = new Date(d); c.setHours(0, 0, 0, 0); return c
}
function formatDueDate(d: Date | null): string {
  if (!d) return 'No date'
  const today    = startOfDay(new Date())
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  const v = startOfDay(d)
  if (v.getTime() === today.getTime())    return 'Today'
  if (v.getTime() === tomorrow.getTime()) return 'Tomorrow'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d)
}
function formatTaskDate(d: Date | null): string {
  if (!d) return ''
  return formatDueDate(d)
}

// ─── Priority icon ─────────────────────────────────────────────────────────────

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
    // 3 bars all dark, heights 6 9 12, bottom-aligned
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <rect x="1.5" y="8"  width="3" height="6"  fill="#626262" />
        <rect x="6.5" y="5"  width="3" height="9"  fill="#626262" />
        <rect x="11.5" y="2" width="3" height="12" fill="#626262" />
      </svg>
    )
  }
  if (priority === 'medium') {
    // 2 dark + 1 light, heights 6 9 12, bottom-aligned
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <rect x="1.5" y="8"  width="3" height="6"  fill="#626262" />
        <rect x="6.5" y="5"  width="3" height="9"  fill="#626262" />
        <rect x="11.5" y="2" width="3" height="12" fill="#e1e1e1" />
      </svg>
    )
  }
  if (priority === 'low') {
    // 1 dark + 2 light, heights 6 9 12, bottom-aligned
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <rect x="1.5" y="8"  width="3" height="6"  fill="#626262" />
        <rect x="6.5" y="5"  width="3" height="9"  fill="#e1e1e1" />
        <rect x="11.5" y="2" width="3" height="12" fill="#e1e1e1" />
      </svg>
    )
  }
  // none: 3 dots
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <circle cx="3.5"  cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
      <circle cx="8"    cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
      <circle cx="12.5" cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
    </svg>
  )
}

// ─── Priority picker dropdown ─────────────────────────────────────────────────

function PriorityPicker({
  current,
  anchorRect,
  onSelect,
  onClose,
}: {
  current: Priority
  anchorRect: DOMRect
  onSelect: (p: Priority) => void
  onClose: () => void
}) {
  const pickerRef = useRef<HTMLDivElement>(null)

  // Position below the anchor icon, aligned to its left
  const top = anchorRect.bottom + 6
  const left = anchorRect.left

  // Close on click-outside or Escape
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
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 999 }}
        onMouseDown={onClose}
      />
      {/* Dropdown */}
      <div
        ref={pickerRef}
        style={{
          position: 'fixed',
          top,
          left,
          zIndex: 1000,
          width: 240,
          background: 'white',
          borderRadius: 8,
          border: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '8px 12px 6px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 400 }}>
            Change priority to...
          </span>
          <span
            style={{
              fontSize: 11,
              color: 'rgba(0,0,0,0.4)',
              background: 'rgba(0,0,0,0.06)',
              borderRadius: 4,
              padding: '1px 5px',
              fontFamily: 'monospace',
            }}
          >
            P
          </span>
        </div>

        {/* Options */}
        {PRIORITY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className="flex items-center w-full"
            style={{
              gap: 8,
              height: 32,
              paddingLeft: 12,
              paddingRight: 12,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onClick={() => { onSelect(opt.value); onClose() }}
          >
            <PriorityIcon priority={opt.value} />
            <span
              className="flex-1"
              style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px' }}
            >
              {opt.label}
            </span>
            {current === opt.value && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: 8 }}>
                <path d="M2 7L5.5 10.5L12 3.5" stroke="rgba(0,0,0,0.61)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span
              style={{
                fontSize: 12,
                color: 'rgba(0,0,0,0.3)',
                fontFamily: 'monospace',
                marginLeft: 'auto',
              }}
            >
              {opt.shortcut}
            </span>
          </button>
        ))}
      </div>
    </>,
    document.body
  )
}

// ─── Circle checkbox ──────────────────────────────────────────────────────────

function CircleCheckbox({ done, onToggle }: { done: boolean; onToggle: () => void }) {
  if (done) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 16, height: 16, borderRadius: '50%',
          background: '#22c55e', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }
  return (
    <button
      onClick={onToggle}
      className="flex-shrink-0"
      style={{
        width: 16, height: 16, borderRadius: '50%',
        border: '1.5px solid rgba(0,0,0,0.2)',
        background: 'transparent', cursor: 'pointer', padding: 0,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.4)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)')}
    />
  )
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  onToggle,
  onPriorityChange,
}: {
  task: Task
  onToggle: (id: number) => void
  onPriorityChange: (id: number, priority: Priority) => void
}) {
  const done = task.status === 'done'
  const [isHovered, setIsHovered] = useState(false)
  const [pickerAnchor, setPickerAnchor] = useState<DOMRect | null>(null)

  const handlePriorityClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setPickerAnchor(rect)
  }

  return (
    <div
      className="flex items-center w-full"
      style={{
        gap: 4,
        paddingLeft: 6,
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12,
        background: isHovered ? '#f9f9f9' : 'white',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection checkbox — hidden until hover */}
      <div
        style={{
          width: 12,
          height: 12,
          flexShrink: 0,
          background: 'white',
          border: '1px solid rgba(0,0,0,0.27)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
      />

      {/* Main content */}
      <div className="flex items-center flex-1 min-w-0" style={{ gap: 8 }}>
        <CircleCheckbox done={done} onToggle={() => onToggle(task.id)} />

        {/* Priority button */}
        <button
          onClick={handlePriorityClick}
          className="flex-shrink-0"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            opacity: done ? 0.5 : 1,
          }}
          title="Change priority"
        >
          <PriorityIcon priority={task.priority} />
        </button>

        {pickerAnchor && (
          <PriorityPicker
            current={task.priority}
            anchorRect={pickerAnchor}
            onSelect={p => onPriorityChange(task.id, p)}
            onClose={() => setPickerAnchor(null)}
          />
        )}

        {/* Title */}
        <span
          className="flex-1 min-w-0"
          style={{
            color: '#202020',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '-0.04px',
            lineHeight: '19px',
            opacity: done ? 0.5 : 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {task.title}
        </span>
      </div>

      {/* Right side */}
      <div
        className="flex items-center flex-shrink-0"
        style={{ gap: 8, opacity: done ? 0.5 : 1 }}
      >
        {/* Due date */}
        <span
          style={{
            color: task.overdue && !done ? '#e5484d' : isHovered || done ? '#626262' : '#202020',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '-0.04px',
          }}
        >
          {task.dueDate}
        </span>

        {/* Assignee avatar */}
        <img
          src={task.assigneeAvatar}
          alt=""
          className="rounded-full object-cover flex-shrink-0"
          style={{ width: 16, height: 16 }}
        />
      </div>
    </div>
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 28, height: 16, borderRadius: 100, flexShrink: 0,
        background: on ? '#202020' : 'rgba(0,0,0,0.2)',
        position: 'relative',
        transition: 'background 0.15s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 12, height: 12, borderRadius: '50%',
          background: 'white',
          top: 2,
          left: on ? 14 : 2,
          transition: 'left 0.15s',
        }}
      />
    </div>
  )
}

// ─── Pill button style ────────────────────────────────────────────────────────

const pillStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  height: 28, paddingLeft: 8, paddingRight: 10,
  background: 'white', border: '1px solid #bbb', borderRadius: 100,
  boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.06)',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: '#202020',
  whiteSpace: 'nowrap',
}

// ─── Assignee picker ──────────────────────────────────────────────────────────

function AssigneePicker({
  current, anchorRect, onSelect, onClose,
}: {
  current: string
  anchorRect: DOMRect
  onSelect: (a: AssigneeOption) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = ASSIGNEES.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1001 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed',
          top: anchorRect.bottom + 6,
          left: anchorRect.left,
          zIndex: 1002,
          width: 240,
          background: 'white',
          borderRadius: 8,
          border: '1px solid rgba(141,141,141,0.24)',
          boxShadow: '0px 9px 24px rgba(24,26,27,0.16), 0px 3px 6px rgba(24,26,27,0.08), 0px 0px 1px rgba(24,26,27,0.04)',
          overflow: 'hidden',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Search */}
        <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="search" size={14} style={{ color: 'rgba(0,0,0,0.3)', flexShrink: 0 }} />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search member"
            onKeyDown={e => e.key === 'Escape' && onClose()}
            style={{ border: 'none', outline: 'none', padding: 0, flex: 1, fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#202020', background: 'transparent' }}
          />
        </div>
        {/* Group label */}
        <div style={{ padding: '6px 12px 2px', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif' }}>
          Assign to
        </div>
        {/* Members */}
        {filtered.map(a => (
          <button
            key={a.id}
            className="flex items-center w-full"
            style={{ gap: 8, height: 32, paddingLeft: 12, paddingRight: 12, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onClick={() => { onSelect(a); onClose() }}
          >
            {a.id === 'none' ? (
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="account_circle" size={12} style={{ color: 'rgba(0,0,0,0.4)' }} />
              </div>
            ) : a.avatar ? (
              <img src={a.avatar} alt="" style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: a.color || '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 9, fontWeight: 700, color: 'white' }}>
                {a.initials}
              </div>
            )}
            <span style={{ flex: 1, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#202020', letterSpacing: '-0.04px' }}>{a.name}</span>
            {current === a.id && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="rgba(0,0,0,0.61)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        ))}
        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '4px 0' }} />
        {/* Invite footer */}
        <button
          className="flex items-center w-full"
          style={{ gap: 8, height: 32, paddingLeft: 12, paddingRight: 12, border: 'none', background: 'transparent', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px dashed rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="add" size={10} style={{ color: 'rgba(0,0,0,0.4)' }} />
          </div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.61)', letterSpacing: '-0.04px' }}>
            Invite &amp; assign new member
          </span>
        </button>
      </div>
    </>,
    document.body
  )
}

// ─── Date picker ──────────────────────────────────────────────────────────────

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function DatePicker({
  current, anchorRect, onSelect, onClose,
}: {
  current: Date | null
  anchorRect: DOMRect
  onSelect: (d: Date | null) => void
  onClose: () => void
}) {
  const today = startOfDay(new Date())
  const [viewMonth, setViewMonth] = useState(startOfDay(current || today))

  const year  = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewMonth)

  // Build calendar grid (Mon-first)
  const firstDay = new Date(year, month, 1)
  let startOffset = firstDay.getDay() - 1  // 0=Mon
  if (startOffset < 0) startOffset = 6
  const cells: Date[] = []
  for (let i = startOffset; i > 0; i--)
    cells.push(new Date(year, month, 1 - i))
  const lastDate = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= lastDate; d++)
    cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0)
    cells.push(new Date(year, month, lastDate + (cells.length - startOffset - lastDate + 1)))

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  const quickPicks = [
    { label: 'Today',      date: today },
    { label: 'Tomorrow',   date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) },
    { label: 'In 3 days',  date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3) },
    { label: 'In 1 week',  date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7) },
    { label: 'In 2 weeks', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14) },
  ]

  // Position: prefer below anchor, flip up if near bottom
  const spaceBelow = window.innerHeight - anchorRect.bottom - 8
  const pickerH = 340
  const top = spaceBelow >= pickerH ? anchorRect.bottom + 6 : anchorRect.top - pickerH - 6
  const left = Math.min(anchorRect.left, window.innerWidth - 288)

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1001 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top, left,
          zIndex: 1002, width: 280,
          background: 'white', borderRadius: 8,
          border: '1px solid rgba(141,141,141,0.24)',
          boxShadow: '0px 9px 24px rgba(24,26,27,0.16), 0px 3px 6px rgba(24,26,27,0.08), 0px 0px 1px rgba(24,26,27,0.04)',
          overflow: 'hidden',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Quick-pick chips */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.12)', flexWrap: 'wrap', background: '#f9f9f9' }}>
          {quickPicks.map(q => (
            <button
              key={q.label}
              onClick={() => { onSelect(q.date); onClose() }}
              style={{
                height: 24, paddingLeft: 10, paddingRight: 10,
                background: current && isSameDay(current, q.date) ? '#202020' : 'white',
                color: current && isSameDay(current, q.date) ? 'white' : '#202020',
                border: `1px solid ${current && isSameDay(current, q.date) ? '#202020' : '#bbb'}`,
                borderRadius: 100, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
              }}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 12px 6px' }}>
          <button
            onClick={() => setViewMonth(new Date(year, month - 1, 1))}
            style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Icon name="chevron_left" size={16} style={{ color: 'rgba(0,0,0,0.61)' }} />
          </button>
          <span style={{ flex: 1, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#202020', letterSpacing: '-0.04px' }}>
            {monthLabel}
          </span>
          <button
            onClick={() => setViewMonth(new Date(year, month + 1, 1))}
            style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Icon name="chevron_right" size={16} style={{ color: 'rgba(0,0,0,0.61)' }} />
          </button>
        </div>

        {/* Day-of-week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px', marginBottom: 2 }}>
          {DOW_LABELS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', paddingBottom: 4 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px 12px', gap: 2 }}>
          {cells.map((cell, i) => {
            const isCurrentM = cell.getMonth() === month
            const isSelected = current ? isSameDay(cell, current) : false
            const isTodayCell = isSameDay(cell, today)
            return (
              <button
                key={i}
                onClick={() => { onSelect(cell); onClose() }}
                style={{
                  height: 28, width: '100%',
                  borderRadius: 6,
                  border: isTodayCell && !isSelected ? '1px solid rgba(0,0,0,0.12)' : 'none',
                  background: isSelected ? '#202020' : 'transparent',
                  color: isSelected ? 'white' : isCurrentM ? '#202020' : 'rgba(0,0,0,0.3)',
                  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                {cell.getDate()}
              </button>
            )
          })}
        </div>

        {/* No date footer */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '4px 4px' }}>
          <button
            className="flex items-center w-full"
            style={{ gap: 8, height: 32, paddingLeft: 12, paddingRight: 12, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 6 }}
            onClick={() => { onSelect(null); onClose() }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Icon name="event_busy" size={14} style={{ color: 'rgba(0,0,0,0.4)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.61)', letterSpacing: '-0.04px' }}>No date</span>
          </button>
        </div>

        {/* Time / Remind me / Repeat footer */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '4px 4px' }}>
          {[
            { icon: 'schedule',      label: '9 AM' },
            { icon: 'notifications', label: 'Remind me' },
            { icon: 'replay',        label: 'Repeat' },
          ].map(row => (
            <button
              key={row.label}
              className="flex items-center w-full"
              style={{ gap: 8, height: 28, paddingLeft: 6, paddingRight: 8, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Icon name={row.icon} size={16} style={{ color: 'rgba(0,0,0,0.61)', flexShrink: 0 }} />
              <span>{row.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  )
}

// ─── New task form ────────────────────────────────────────────────────────────

function NewTaskForm({
  group, anchorRect, onClose, onCreate,
}: {
  group: string
  anchorRect: DOMRect
  onClose: () => void
  onCreate: (task: Omit<Task, 'id'>) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('none')
  const [assignee, setAssignee] = useState<AssigneeOption>(ASSIGNEES[0])
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [createMore, setCreateMore] = useState(false)

  const [priorityAnchor, setPriorityAnchor]   = useState<DOMRect | null>(null)
  const [assigneeAnchor, setAssigneeAnchor]   = useState<DOMRect | null>(null)
  const [dateAnchor,     setDateAnchor]       = useState<DOMRect | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => { titleRef.current?.focus() }, [])

  const priorityLabel = priority === 'none' ? 'No prio'
    : priority.charAt(0).toUpperCase() + priority.slice(1)

  const handleCreate = () => {
    if (!title.trim()) return
    onCreate({
      title: title.trim(),
      dueDate: dueDate ? formatTaskDate(dueDate) : 'No date',
      assigneeAvatar: assignee.avatar ?? 'https://i.pravatar.cc/150?img=44',
      status: 'todo',
      priority,
      group: group as Task['group'],
    })
    if (createMore) {
      setTitle(''); setDescription(''); setPriority('none')
      setAssignee(ASSIGNEES[0]); setDueDate(null)
      titleRef.current?.focus()
    } else {
      onClose()
    }
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 999 }}
        onMouseDown={onClose}
      />

      {/* Modal card — centered, 576px wide, no border-radius */}
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
        {/* Top */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* Title + description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input
              ref={titleRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              style={{
                border: 'none', outline: 'none', padding: 0, width: '100%',
                fontFamily: '"Uxum Grotesque", sans-serif',
                fontSize: 20, fontWeight: 500, lineHeight: '24px',
                color: '#202020', background: 'transparent',
              }}
            />
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add description..."
              style={{
                border: 'none', outline: 'none', padding: 0, width: '100%',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13, fontWeight: 400, lineHeight: '18px',
                letterSpacing: '-0.04px', color: '#8c8c8c', background: 'transparent',
              }}
            />
          </div>

          {/* Attribute pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>

            {/* 1. Priority */}
            <button
              style={pillStyle}
              onClick={e => setPriorityAnchor(e.currentTarget.getBoundingClientRect())}
            >
              <PriorityIcon priority={priority} />
              <span>{priorityLabel}</span>
            </button>

            {/* 2. Assignee */}
            <button
              style={pillStyle}
              onClick={e => setAssigneeAnchor(e.currentTarget.getBoundingClientRect())}
            >
              {assignee.id === 'none' ? (
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="account_circle" size={12} style={{ color: 'rgba(0,0,0,0.4)' }} />
                </div>
              ) : assignee.avatar ? (
                <img src={assignee.avatar} alt="" style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: assignee.color || '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 9, fontWeight: 700, color: 'white' }}>
                  {assignee.initials}
                </div>
              )}
              <span>{assignee.id === 'none' ? 'Assignee' : assignee.name}</span>
            </button>

            {/* 3. Date */}
            <button
              style={pillStyle}
              onClick={e => setDateAnchor(e.currentTarget.getBoundingClientRect())}
            >
              <Icon name="calendar_today" size={14} style={{ color: 'rgba(0,0,0,0.61)', flexShrink: 0 }} />
              <span>{dueDate ? formatDueDate(dueDate) : 'Date'}</span>
            </button>

            {/* 4. Record */}
            <button style={pillStyle}>
              <img src="https://i.pravatar.cc/150?img=12" alt="" style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0 }} />
              <span>Jane Cooper</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e1e1e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <button
            onClick={() => setCreateMore(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <ToggleSwitch on={createMore} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, color: '#626262' }}>
              Create more
            </span>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{ height: 28, paddingLeft: 12, paddingRight: 12, background: 'white', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 100, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px', color: 'rgba(0,0,0,0.61)', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              style={{ height: 28, paddingLeft: 12, paddingRight: 12, background: title.trim() ? '#202020' : 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 100, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px', color: title.trim() ? 'white' : 'rgba(0,0,0,0.3)', cursor: title.trim() ? 'pointer' : 'default', transition: 'background 0.15s, color 0.15s' }}
            >
              Create task
            </button>
          </div>
        </div>
      </div>

      {/* Sub-pickers (z-index above modal) */}
      {priorityAnchor && (
        <PriorityPicker
          current={priority}
          anchorRect={priorityAnchor}
          onSelect={p => { setPriority(p); setPriorityAnchor(null) }}
          onClose={() => setPriorityAnchor(null)}
        />
      )}
      {assigneeAnchor && (
        <AssigneePicker
          current={assignee.id}
          anchorRect={assigneeAnchor}
          onSelect={a => setAssignee(a)}
          onClose={() => setAssigneeAnchor(null)}
        />
      )}
      {dateAnchor && (
        <DatePicker
          current={dueDate}
          anchorRect={dateAnchor}
          onSelect={d => setDueDate(d)}
          onClose={() => setDateAnchor(null)}
        />
      )}
    </>,
    document.body
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  label,
  count,
  showPlus,
  collapsed,
  onToggle,
  onOpenForm,
  isFirst,
}: {
  label: string
  count: number
  showPlus?: boolean
  collapsed?: boolean
  onToggle: () => void
  onOpenForm?: (rect: DOMRect) => void
  isFirst?: boolean
}) {
  return (
    <div
      className="flex items-center w-full cursor-pointer"
      style={{
        height: 36,
        background: '#f9f9f9',
        borderTop: isFirst ? undefined : '1px solid #e1e1e1',
        borderBottom: '1px solid #e1e1e1',
        paddingLeft: 20,
        paddingRight: 8,
        flexShrink: 0,
      }}
      onClick={onToggle}
    >
      <Icon
        name={collapsed ? 'chevron_right' : 'expand_more'}
        size={16}
        style={{ color: 'rgba(0,0,0,0.61)', flexShrink: 0 }}
      />
      <div className="flex items-center flex-1" style={{ gap: 8, marginLeft: 4 }}>
        <span style={{ color: '#202020', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px', lineHeight: '18px' }}>
          {label}
        </span>
        <span style={{ color: '#8c8c8c', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px', lineHeight: '18px' }}>
          {count}
        </span>
      </div>
      {showPlus && (
        <button
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 28, height: 28, borderRadius: 100, background: 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={e => { e.stopPropagation(); onOpenForm?.(e.currentTarget.getBoundingClientRect()) }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Icon name="add" size={16} style={{ color: 'rgba(0,0,0,0.61)' }} />
        </button>
      )}
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'interactions', label: 'Interactions', count: 8 },
  { key: 'notes',        label: 'Notes',        count: 1 },
  { key: 'tasks',        label: 'Tasks',        count: 0 },
]

// ─── Tasks tab content ────────────────────────────────────────────────────────

function TasksContent({
  tasks,
  onToggle,
  onPriorityChange,
  onCreate,
}: {
  tasks: Task[]
  onToggle: (id: number) => void
  onPriorityChange: (id: number, priority: Priority) => void
  onCreate: (task: Omit<Task, 'id'>) => void
}) {
  const overdue   = tasks.filter(t => t.group === 'overdue'   && t.status === 'todo')
  const today     = tasks.filter(t => t.group === 'today'     && t.status === 'todo')
  const upcoming  = tasks.filter(t => t.group === 'upcoming'  && t.status === 'todo')
  const completed = tasks.filter(t => t.status === 'done')

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [formState, setFormState] = useState<{ group: string; rect: DOMRect } | null>(null)
  const toggle = (key: string) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))

  const sections = [
    overdue.length   > 0 && 'overdue',
    today.length     > 0 && 'today',
    upcoming.length  > 0 && 'upcoming',
    completed.length > 0 && 'completed',
  ].filter(Boolean) as string[]
  const firstSection = sections[0]

  return (
    <>
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Overdue */}
        {overdue.length > 0 && (
          <>
            <SectionHeader label="Overdue" count={overdue.length}
              isFirst={firstSection === 'overdue'}
              collapsed={collapsed['overdue']} onToggle={() => toggle('overdue')}
            />
            {!collapsed['overdue'] && overdue.map(t =>
              <TaskRow key={t.id} task={t} onToggle={onToggle} onPriorityChange={onPriorityChange} />
            )}
          </>
        )}

        {/* Today */}
        {today.length > 0 && (
          <>
            <SectionHeader label="Today" count={today.length} showPlus
              isFirst={firstSection === 'today'}
              collapsed={collapsed['today']} onToggle={() => toggle('today')}
              onOpenForm={rect => setFormState({ group: 'today', rect })}
            />
            {!collapsed['today'] && today.map(t =>
              <TaskRow key={t.id} task={t} onToggle={onToggle} onPriorityChange={onPriorityChange} />
            )}
          </>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <>
            <SectionHeader label="Upcoming" count={upcoming.length} showPlus
              isFirst={firstSection === 'upcoming'}
              collapsed={collapsed['upcoming']} onToggle={() => toggle('upcoming')}
              onOpenForm={rect => setFormState({ group: 'upcoming', rect })}
            />
            {!collapsed['upcoming'] && upcoming.map(t =>
              <TaskRow key={t.id} task={t} onToggle={onToggle} onPriorityChange={onPriorityChange} />
            )}
          </>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <SectionHeader label="Completed" count={completed.length} showPlus
              isFirst={firstSection === 'completed'}
              collapsed={collapsed['completed']} onToggle={() => toggle('completed')}
              onOpenForm={rect => setFormState({ group: 'completed', rect })}
            />
            {!collapsed['completed'] && completed.map(t =>
              <TaskRow key={t.id} task={t} onToggle={onToggle} onPriorityChange={onPriorityChange} />
            )}
          </>
        )}
      </div>

      {/* Modal form (portal) */}
      {formState && (
        <NewTaskForm
          group={formState.group}
          anchorRect={formState.rect}
          onClose={() => setFormState(null)}
          onCreate={task => { onCreate(task) }}
        />
      )}
    </>
  )
}

// ─── Interactions tab ─────────────────────────────────────────────────────────

function InteractionsContent() {
  const items = [
    { icon: 'mail',  title: 'Intro: Jane Cooper & Steve',  date: 'Today',  people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
    { icon: 'mail',  title: 'Intro: Jane Cooper & JSteve', date: 'Today',  people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
    { icon: 'event', title: 'Fundraising event',           date: 'in 5 min', people: 'John Wick, John Lenon +3', preview: '', chip: true },
    { icon: 'mail',  title: 'Intro: Jane Cooper & JSteve', date: 'Today',  people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
    { icon: 'event', title: 'Fundraising event',           date: 'in 5 min', people: 'John Wick, John Lenon +3', preview: '', chip: true },
    { icon: 'mail',  title: 'Intro: Jane Cooper & Steve',  date: 'Today',  people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
  ]
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div
        className="flex items-center justify-between"
        style={{ padding: '10px 24px', borderBottom: '1px solid rgba(0,0,0,0.12)' }}
      >
        <span style={{ color: 'rgba(0,0,0,0.87)', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px' }}>
          Past interactions
        </span>
        <div className="flex items-center" style={{ gap: 8 }}>
          <button
            className="flex items-center"
            style={{ gap: 4, padding: '0 8px', height: 28, border: '1px solid rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.61)', background: 'transparent', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}
          >
            <Icon name="filter_list" size={12} style={{ color: 'rgba(0,0,0,0.61)' }} /> Filter
          </button>
          <button
            style={{ padding: '0 10px', height: 28, border: '1px solid rgba(0,0,0,0.27)', background: 'white', color: 'rgba(0,0,0,0.87)', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px', borderRadius: 100, boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.06)', cursor: 'pointer' }}
          >
            New interaction
          </button>
        </div>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex"
          style={{ gap: 12, padding: '12px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {item.chip ? (
            <div className="flex flex-col items-center justify-center flex-shrink-0 text-white font-bold" style={{ width: 32, height: 32, borderRadius: 6, background: '#e5484d', fontSize: 9 }}>
              <span style={{ textTransform: 'uppercase', fontSize: 8 }}>APR</span>
              <span style={{ fontSize: 14, lineHeight: 1 }}>12</span>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.06)' }}>
              <Icon name={item.icon} size={14} style={{ color: 'rgba(0,0,0,0.61)' }} />
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0" style={{ gap: 2 }}>
            <div className="flex items-center justify-between" style={{ gap: 8 }}>
              <span className="truncate" style={{ color: 'rgba(0,0,0,0.87)', fontSize: 12, fontWeight: 500, letterSpacing: '-0.04px' }}>{item.title}</span>
              <span className="flex-shrink-0" style={{ color: 'rgba(0,0,0,0.61)', fontSize: 11 }}>{item.date}</span>
            </div>
            <span style={{ color: 'rgba(0,0,0,0.61)', fontSize: 11 }}>{item.people}</span>
            {item.preview && <span className="truncate" style={{ color: 'rgba(0,0,0,0.61)', fontSize: 11 }}>{item.preview}</span>}
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
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const newStatus: TaskStatus = t.status === 'done' ? 'todo' : 'done'
      return { ...t, status: newStatus, group: newStatus === 'done' ? 'completed' : t.overdue ? 'overdue' : t.group }
    }))
  }

  const handlePriorityChange = (id: number, priority: Priority) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority } : t))
  }

  const handleCreate = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }])
  }

  const todoCount = tasks.filter(t => t.status === 'todo').length

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden" style={{ background: 'white' }}>

      {/* Activity banner */}
      <div style={{ paddingTop: 16, paddingBottom: 8, paddingLeft: 16, paddingRight: 16, flexShrink: 0 }}>
        <div className="flex items-center" style={{ gap: 8, background: '#f9f9f9', padding: 8, cursor: 'pointer' }}>
          <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 20, height: 20, borderRadius: 100, background: '#fff0bd', overflow: 'hidden' }}>
            <span style={{ fontSize: 11 }}>🧀</span>
          </div>
          <p className="flex-1 truncate" style={{ margin: 0, color: 'rgba(0,0,0,0.61)', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px' }}>
            Julien requested Make or Zapier credentials to build automation templates and discussed platform choice
          </p>
          <Icon name="expand_more" size={16} style={{ color: 'rgba(0,0,0,0.61)', flexShrink: 0 }} />
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-end"
        style={{ gap: 16, paddingTop: 12, paddingLeft: 24, paddingRight: 24, borderBottom: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }}
      >
        {TABS.map(tab => {
          const count = tab.key === 'tasks' ? todoCount : tab.count
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center relative"
              style={{ gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isActive ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.61)', padding: 0, paddingBottom: 9 }}
            >
              <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, letterSpacing: '-0.04px', lineHeight: '19px' }}>
                {tab.label}
              </span>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05px', color: 'rgba(0,0,0,0.61)', lineHeight: 'normal' }}>
                {count}
              </span>
              {isActive && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.87)' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'tasks' && (
        <TasksContent tasks={tasks} onToggle={handleToggle} onPriorityChange={handlePriorityChange} onCreate={handleCreate} />
      )}
      {activeTab === 'interactions' && <InteractionsContent />}
      {activeTab === 'notes' && (
        <div className="flex flex-col items-center justify-center flex-1" style={{ gap: 8, color: 'rgba(0,0,0,0.61)' }}>
          <Icon name="sticky_note_2" size={24} style={{ color: 'rgba(0,0,0,0.3)' }} />
          <span style={{ fontSize: 13 }}>No notes yet</span>
        </div>
      )}
    </div>
  )
}
