import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../folk'
import { ActionBtn } from './ActionBtn'

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'done'
type TaskGroup  = 'overdue' | 'today' | 'upcoming' | 'completed'
type Priority   = 'urgent' | 'high' | 'medium' | 'low' | 'none'
type TaskTab    = 'my' | 'all' | 'john' | 'overdue'

interface Task {
  id: number
  title: string
  dueDate: Date | null
  assigneeAvatar: string
  status: TaskStatus
  priority?: Priority
}

interface AssigneeOption {
  id: string
  name: string
  avatar?: string
  initials?: string
  color?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ASSIGNEES: AssigneeOption[] = [
  { id: 'none', name: 'No assignee' },
  { id: '1',    name: 'Bessie Cooper',   avatar: 'https://i.pravatar.cc/150?img=44' },
  { id: '2',    name: 'Arlene McCoy',    initials: 'A', color: '#f59e0b' },
  { id: '3',    name: 'Albert Flores',   avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '4',    name: 'Marvin McKinney', initials: 'M', color: '#8b5cf6' },
]

const PRIORITY_OPTIONS: { value: Priority; label: string; shortcut: string }[] = [
  { value: 'none',   label: 'No priority', shortcut: '0' },
  { value: 'urgent', label: 'Urgent',      shortcut: '1' },
  { value: 'high',   label: 'High',        shortcut: '2' },
  { value: 'medium', label: 'Medium',      shortcut: '3' },
  { value: 'low',    label: 'Low',         shortcut: '4' },
]

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const TIME_OPTIONS: string[] = (() => {
  const opts: string[] = []
  for (let h = 0; h < 24; h++) {
    const period = h < 12 ? 'AM' : 'PM'
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    opts.push(`${hour12}:00 ${period}`)
    opts.push(`${hour12}:30 ${period}`)
  }
  return opts
})()

const REPEAT_OPTIONS   = ['Every day', 'Every week day', 'Every week', 'Every 2 weeks', 'Every month', 'Every year', 'Custom']
const REMINDER_OPTIONS = ['When task is due', '5 min before', '10 min before', '30 min before', '1 hour before', 'Custom']

const TABS: { key: TaskTab; label: string }[] = [
  { key: 'my',      label: 'My tasks' },
  { key: 'all',     label: 'All tasks' },
  { key: 'john',    label: "John's tasks" },
  { key: 'overdue', label: "Team's overdue" },
]

const SECTIONS: { key: TaskGroup; label: string }[] = [
  { key: 'overdue',   label: 'Overdue' },
  { key: 'today',     label: 'Today' },
  { key: 'upcoming',  label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function startOfDay(d: Date) {
  const c = new Date(d); c.setHours(0, 0, 0, 0); return c
}

function formatDueDate(d: Date | null): string {
  if (!d) return ''
  const today    = startOfDay(new Date())
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  const v = startOfDay(d)
  if (v.getTime() === today.getTime())    return 'Today'
  if (v.getTime() === tomorrow.getTime()) return 'Tomorrow'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d)
}

function getGroup(task: Task): TaskGroup {
  if (task.status === 'done') return 'completed'
  if (!task.dueDate) return 'upcoming'
  const d     = startOfDay(task.dueDate)
  const today = startOfDay(new Date())
  if (d < today) return 'overdue'
  if (d.getTime() === today.getTime()) return 'today'
  return 'upcoming'
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Respond to Tim's funding request",   dueDate: new Date(2026, 2, 4),  assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'high' },
  { id: 2, title: 'Send contract to Johnson & Co',      dueDate: new Date(2026, 2, 4),  assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'urgent' },
  { id: 3, title: 'Review Series A deck',               dueDate: new Date(2026, 2, 20), assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo' },
  { id: 4, title: 'Schedule product demo for April',    dueDate: new Date(2026, 3, 20), assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo' },
  { id: 5, title: 'Follow up with Berlin contacts',     dueDate: new Date(2026, 3, 23), assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo' },
  { id: 6, title: 'Update CRM with Berlin contacts',    dueDate: new Date(2026, 2, 1),  assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'done' },
  { id: 7, title: 'Book flights for SF summit',         dueDate: new Date(2026, 2, 1),  assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'done' },
]

let nextId = 100

// ─── Priority icon ────────────────────────────────────────────────────────────

function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === 'urgent') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="1" y="1" width="14" height="14" rx="3" fill="#202020" />
        <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">!</text>
      </svg>
    )
  }
  if (priority === 'high') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="1.5" y="8"  width="3" height="6"  fill="#626262" />
        <rect x="6.5" y="5"  width="3" height="9"  fill="#626262" />
        <rect x="11.5" y="2" width="3" height="12" fill="#626262" />
      </svg>
    )
  }
  if (priority === 'medium') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="1.5" y="8"  width="3" height="6"  fill="#626262" />
        <rect x="6.5" y="5"  width="3" height="9"  fill="#626262" />
        <rect x="11.5" y="2" width="3" height="12" fill="#e1e1e1" />
      </svg>
    )
  }
  if (priority === 'low') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="1.5" y="8"  width="3" height="6"  fill="#626262" />
        <rect x="6.5" y="5"  width="3" height="9"  fill="#e1e1e1" />
        <rect x="11.5" y="2" width="3" height="12" fill="#e1e1e1" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="3.5"  cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
      <circle cx="8"    cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
      <circle cx="12.5" cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
    </svg>
  )
}

// ─── Sub picker ───────────────────────────────────────────────────────────────

function SubPicker({ options, current, anchorRect, onSelect, onClose }: {
  options: string[]
  current: string | null
  anchorRect: DOMRect
  onSelect: (v: string) => void
  onClose: () => void
}) {
  const pickerWidth = 188
  const spaceRight  = window.innerWidth - anchorRect.right - 8
  const left = spaceRight >= pickerWidth ? anchorRect.right + 4 : anchorRect.left - pickerWidth - 4
  const top  = Math.min(anchorRect.top, window.innerHeight - 260)

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1003 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top, left, zIndex: 1004, width: pickerWidth,
          background: 'white', borderRadius: 8,
          border: '1px solid rgba(141,141,141,0.24)',
          boxShadow: '0px 9px 24px rgba(24,26,27,0.16), 0px 3px 6px rgba(24,26,27,0.08)',
          overflow: 'hidden', maxHeight: 244, overflowY: 'auto',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{ padding: '4px' }}>
          {options.map(opt => (
            <button
              key={opt}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                height: 32, paddingLeft: 8, paddingRight: 8,
                border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
                borderRadius: 4, fontFamily: 'inherit', fontSize: 13,
                fontWeight: current === opt ? 500 : 400,
                color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px',
              }}
              onMouseEnter={e => { if (current !== opt) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={e => { if (current !== opt) e.currentTarget.style.background = 'transparent' }}
              onClick={() => { onSelect(opt); onClose() }}
            >
              <div style={{ width: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {current === opt && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7L5.5 10.5L12 3.5" stroke="rgba(0,0,0,0.61)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  )
}

// ─── Date picker ──────────────────────────────────────────────────────────────

function DatePicker({
  current, anchorRect, onSelect, onClose,
  time, onTimeChange, repeat, onRepeatChange, reminder, onReminderChange,
}: {
  current: Date | null
  anchorRect: DOMRect
  onSelect: (d: Date | null) => void
  onClose: () => void
  time: string | null;     onTimeChange: (t: string | null) => void
  repeat: string | null;   onRepeatChange: (r: string | null) => void
  reminder: string | null; onReminderChange: (rem: string | null) => void
}) {
  const today = startOfDay(new Date())
  const [viewMonth, setViewMonth] = useState(startOfDay(current || today))
  const [timeAnchor,     setTimeAnchor]     = useState<DOMRect | null>(null)
  const [repeatAnchor,   setRepeatAnchor]   = useState<DOMRect | null>(null)
  const [reminderAnchor, setReminderAnchor] = useState<DOMRect | null>(null)

  const year  = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewMonth)

  const firstDay = new Date(year, month, 1)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6
  const cells: Date[] = []
  for (let i = startOffset; i > 0; i--) cells.push(new Date(year, month, 1 - i))
  const lastDate = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= lastDate; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(new Date(year, month, lastDate + (cells.length - startOffset - lastDate + 1)))

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  const quickPicks = [
    { label: 'Today',      date: today },
    { label: 'Tomorrow',   date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) },
    { label: 'In 3 days',  date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3) },
    { label: 'In 1 week',  date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7) },
    { label: 'In 2 weeks', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14) },
  ]

  const spaceBelow = window.innerHeight - anchorRect.bottom - 8
  const pickerH    = 360
  const top  = spaceBelow >= pickerH ? anchorRect.bottom + 6 : anchorRect.top - pickerH - 6
  const left = Math.min(anchorRect.left, window.innerWidth - 292)

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1001 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top, left, zIndex: 1002, width: 280,
          background: 'white', borderRadius: 8,
          border: '1px solid rgba(141,141,141,0.24)',
          boxShadow: '0px 9px 24px rgba(24,26,27,0.16), 0px 3px 6px rgba(24,26,27,0.08), 0px 0px 1px rgba(24,26,27,0.04)',
          overflow: 'hidden',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.12)', flexWrap: 'wrap', background: '#f9f9f9' }}>
          {quickPicks.map(q => (
            <button
              key={q.label}
              onClick={() => { onSelect(q.date); onClose() }}
              style={{
                height: 24, paddingLeft: 10, paddingRight: 10,
                background: current && isSameDay(current, q.date) ? '#202020' : 'white',
                color:      current && isSameDay(current, q.date) ? 'white' : '#202020',
                border: `1px solid ${current && isSameDay(current, q.date) ? '#202020' : '#bbb'}`,
                borderRadius: 100, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
              }}
            >{q.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 12px 6px' }}>
          <button
            onClick={() => setViewMonth(new Date(year, month - 1, 1))}
            style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Icon name="chevron_left" size={16} style={{ color: 'rgba(0,0,0,0.61)' }} />
          </button>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#202020', letterSpacing: '-0.04px' }}>{monthLabel}</span>
          <button
            onClick={() => setViewMonth(new Date(year, month + 1, 1))}
            style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Icon name="chevron_right" size={16} style={{ color: 'rgba(0,0,0,0.61)' }} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px', marginBottom: 2 }}>
          {DOW_LABELS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', paddingBottom: 4 }}>{d}</div>
          ))}
        </div>
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
                  height: 28, width: '100%', borderRadius: 6,
                  border: isTodayCell && !isSelected ? '1px solid rgba(0,0,0,0.12)' : 'none',
                  background: isSelected ? '#202020' : 'transparent',
                  color: isSelected ? 'white' : isCurrentM ? '#202020' : 'rgba(0,0,0,0.3)',
                  fontFamily: 'inherit', fontSize: 12, fontWeight: isSelected ? 600 : 400, cursor: 'pointer',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                {cell.getDate()}
              </button>
            )
          })}
        </div>
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '4px 4px' }}>
          {([
            { icon: 'schedule',      value: time,     defaultLabel: '9 AM',      onOpen: setTimeAnchor,     onClear: () => onTimeChange(null),     noClear: true },
            { icon: 'notifications', value: reminder, defaultLabel: 'Remind me', onOpen: setReminderAnchor, onClear: () => onReminderChange(null) },
            { icon: 'replay',        value: repeat,   defaultLabel: 'Repeat',    onOpen: setRepeatAnchor,   onClear: () => onRepeatChange(null) },
          ] as { icon: string; value: string | null; defaultLabel: string; onOpen: (r: DOMRect) => void; onClear: () => void; noClear?: boolean }[]).map(row => (
            <div
              key={row.defaultLabel}
              style={{ display: 'flex', alignItems: 'center', height: 28, paddingLeft: 6, paddingRight: 8, gap: 8, borderRadius: 4, cursor: 'pointer' }}
              onClick={e => row.onOpen(e.currentTarget.getBoundingClientRect())}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Icon name={row.icon} size={16} style={{ color: row.value ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.61)', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px' }}>{row.value || row.defaultLabel}</span>
              {row.value && !row.noClear && (
                <div
                  onClick={e => { e.stopPropagation(); row.onClear() }}
                  style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Icon name="close" size={12} style={{ color: 'rgba(0,0,0,0.4)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {timeAnchor     && <SubPicker options={TIME_OPTIONS}     current={time}     anchorRect={timeAnchor}     onSelect={v => onTimeChange(v)}     onClose={() => setTimeAnchor(null)} />}
      {repeatAnchor   && <SubPicker options={REPEAT_OPTIONS}   current={repeat}   anchorRect={repeatAnchor}   onSelect={v => onRepeatChange(v)}   onClose={() => setRepeatAnchor(null)} />}
      {reminderAnchor && <SubPicker options={REMINDER_OPTIONS} current={reminder} anchorRect={reminderAnchor} onSelect={v => onReminderChange(v)} onClose={() => setReminderAnchor(null)} />}
    </>,
    document.body
  )
}

// ─── Assignee picker ──────────────────────────────────────────────────────────

function AssigneePicker({ current, anchorRect, onSelect, onClose }: {
  current: string
  anchorRect: DOMRect
  onSelect: (a: AssigneeOption) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = ASSIGNEES.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1001 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top: anchorRect.bottom + 6, left: anchorRect.left,
          zIndex: 1002, width: 240, background: 'white', borderRadius: 8,
          border: '1px solid rgba(141,141,141,0.24)',
          boxShadow: '0px 9px 24px rgba(24,26,27,0.16), 0px 3px 6px rgba(24,26,27,0.08)',
          overflow: 'hidden',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="search" size={14} style={{ color: 'rgba(0,0,0,0.3)', flexShrink: 0 }} />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search member"
            onKeyDown={e => e.key === 'Escape' && onClose()}
            style={{ border: 'none', outline: 'none', padding: 0, flex: 1, fontFamily: 'inherit', fontSize: 13, color: '#202020', background: 'transparent' }}
          />
        </div>
        <div style={{ padding: '6px 12px 2px', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Assign to
        </div>
        {filtered.map(a => (
          <button
            key={a.id}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 32, paddingLeft: 12, paddingRight: 12, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
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
                {(a.initials || a.name).charAt(0)}
              </div>
            )}
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#202020', letterSpacing: '-0.04px' }}>{a.name}</span>
            {current === a.id && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="rgba(0,0,0,0.61)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        ))}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '4px 0' }} />
        <button
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 32, paddingLeft: 12, paddingRight: 12, border: 'none', background: 'transparent', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px dashed rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="add" size={10} style={{ color: 'rgba(0,0,0,0.4)' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.61)', letterSpacing: '-0.04px' }}>Invite &amp; assign new member</span>
        </button>
      </div>
    </>,
    document.body
  )
}

// ─── Priority picker ──────────────────────────────────────────────────────────

function PriorityPicker({ current, anchorRect, onSelect, onClose }: {
  current: Priority
  anchorRect: DOMRect
  onSelect: (p: Priority) => void
  onClose: () => void
}) {
  const spaceRight = window.innerWidth - anchorRect.right - 8
  const left = spaceRight >= 240 ? anchorRect.left : anchorRect.right - 240
  const top  = anchorRect.bottom + 6

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1001 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top, left, zIndex: 1002, width: 240,
          background: 'white', borderRadius: 8,
          border: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 6px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 400 }}>Change priority to...</span>
        </div>
        {PRIORITY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 32, paddingLeft: 12, paddingRight: 12, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onClick={() => { onSelect(opt.value); onClose() }}
          >
            <PriorityIcon priority={opt.value} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px' }}>{opt.label}</span>
            {current === opt.value && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: 8 }}>
                <path d="M2 7L5.5 10.5L12 3.5" stroke="rgba(0,0,0,0.61)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </>,
    document.body
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <div style={{ width: 28, height: 16, borderRadius: 100, flexShrink: 0, background: on ? '#202020' : 'rgba(0,0,0,0.2)', position: 'relative', transition: 'background 0.15s' }}>
      <div style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: 'white', top: 2, left: on ? 14 : 2, transition: 'left 0.15s' }} />
    </div>
  )
}

// ─── Pill style ───────────────────────────────────────────────────────────────

const pillStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  height: 28, paddingLeft: 8, paddingRight: 10,
  background: 'white', border: '1px solid #bbb', borderRadius: 100,
  boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.06)',
  cursor: 'pointer',
  fontFamily: 'inherit', fontSize: 12, fontWeight: 500, color: '#202020',
  whiteSpace: 'nowrap',
}

// ─── New task form (modal) ────────────────────────────────────────────────────

function NewTaskForm({ onClose, onCreate }: {
  onClose: () => void
  onCreate: (task: Omit<Task, 'id'>) => void
}) {
  const [title,      setTitle]      = useState('')
  const [priority,   setPriority]   = useState<Priority>('none')
  const [assignee,   setAssignee]   = useState<AssigneeOption>(ASSIGNEES[0])
  const [dueDate,    setDueDate]    = useState<Date | null>(null)
  const [createMore, setCreateMore] = useState(false)
  const [time,       setTime]       = useState<string | null>(null)
  const [repeat,     setRepeat]     = useState<string | null>(null)
  const [reminder,   setReminder]   = useState<string | null>(null)

  const [priorityAnchor, setPriorityAnchor] = useState<DOMRect | null>(null)
  const [assigneeAnchor, setAssigneeAnchor] = useState<DOMRect | null>(null)
  const [dateAnchor,     setDateAnchor]     = useState<DOMRect | null>(null)

  const titleRef = useRef<HTMLInputElement>(null)
  useEffect(() => { titleRef.current?.focus() }, [])

  const priorityLabel = priority === 'none' ? 'No prio' : priority.charAt(0).toUpperCase() + priority.slice(1)

  function handleCreate() {
    if (!title.trim()) return
    onCreate({
      title: title.trim(),
      dueDate,
      assigneeAvatar: assignee.avatar ?? 'https://i.pravatar.cc/150?img=44',
      status: 'todo',
      priority,
    })
    if (createMore) {
      setTitle(''); setPriority('none'); setAssignee(ASSIGNEES[0]); setDueDate(null)
      setTime(null); setRepeat(null); setReminder(null)
      titleRef.current?.focus()
    } else {
      onClose()
    }
  }

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.32)' }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000, width: 576,
          background: 'white', border: '1px solid #e1e1e1', overflow: 'hidden',
          boxShadow: '0px 9px 24px 0px rgba(24,26,27,0.16), 0px 3px 6px 0px rgba(24,26,27,0.08), 0px 0px 1px 0px rgba(24,26,27,0.04)',
        }}
        onMouseDown={e => e.stopPropagation()}
        onKeyDown={e => {
          if (e.key === 'Escape') { e.stopPropagation(); onClose() }
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCreate()
        }}
      >
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input
              ref={titleRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              style={{
                border: 'none', outline: 'none', padding: 0, width: '100%',
                fontFamily: 'inherit', fontSize: 20, fontWeight: 500, lineHeight: '24px',
                color: '#202020', background: 'transparent',
              }}
            />
            <input
              placeholder="Add description..."
              style={{
                border: 'none', outline: 'none', padding: 0, width: '100%',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 400, lineHeight: '18px',
                letterSpacing: '-0.04px', color: '#8c8c8c', background: 'transparent',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button style={pillStyle} onClick={e => setPriorityAnchor(e.currentTarget.getBoundingClientRect())}>
              <PriorityIcon priority={priority} />
              <span>{priorityLabel}</span>
            </button>
            <button style={pillStyle} onClick={e => setAssigneeAnchor(e.currentTarget.getBoundingClientRect())}>
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
            <button style={pillStyle} onClick={e => setDateAnchor(e.currentTarget.getBoundingClientRect())}>
              <Icon name="calendar_today" size={14} style={{ color: 'rgba(0,0,0,0.61)', flexShrink: 0 }} />
              <span>{dueDate ? formatDueDate(dueDate) : 'Date'}</span>
            </button>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e1e1e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <button onClick={() => setCreateMore(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <ToggleSwitch on={createMore} />
            <span style={{ fontSize: 12, fontWeight: 400, color: '#626262' }}>Create more</span>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{ height: 28, paddingLeft: 12, paddingRight: 12, background: 'white', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 100, fontFamily: 'inherit', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px', color: 'rgba(0,0,0,0.61)', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              style={{ height: 28, paddingLeft: 12, paddingRight: 12, background: title.trim() ? '#202020' : 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 100, fontFamily: 'inherit', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px', color: title.trim() ? 'white' : 'rgba(0,0,0,0.3)', cursor: title.trim() ? 'pointer' : 'default' }}
            >
              Create task
            </button>
          </div>
        </div>
      </div>
      {priorityAnchor && (
        <PriorityPicker current={priority} anchorRect={priorityAnchor}
          onSelect={p => { setPriority(p); setPriorityAnchor(null) }} onClose={() => setPriorityAnchor(null)} />
      )}
      {assigneeAnchor && (
        <AssigneePicker current={assignee.id} anchorRect={assigneeAnchor}
          onSelect={a => setAssignee(a)} onClose={() => setAssigneeAnchor(null)} />
      )}
      {dateAnchor && (
        <DatePicker
          current={dueDate} anchorRect={dateAnchor}
          onSelect={d => setDueDate(d)} onClose={() => setDateAnchor(null)}
          time={time} onTimeChange={setTime}
          repeat={repeat} onRepeatChange={setRepeat}
          reminder={reminder} onReminderChange={setReminder}
        />
      )}
    </>,
    document.body
  )
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  const [hovered, setHovered] = useState(false)
  const group = getGroup(task)
  const done  = group === 'completed'

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
      <div
        style={{ flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        onClick={e => { e.stopPropagation(); onToggle(task.id) }}
      >
        {done
          ? <Icon name="check_circle" size={16} style={{ color: 'rgba(0,0,0,0.2)' }} />
          : <Icon name="radio_button_unchecked" size={16} style={{ color: hovered ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)' }} />
        }
      </div>
      <span style={{
        flex: 1, minWidth: 0,
        fontSize: 13, letterSpacing: '-0.04px', lineHeight: '18px',
        color: done ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.87)',
        textDecoration: done ? 'line-through' : 'none',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {task.title}
      </span>
      <span style={{ fontSize: 12, flexShrink: 0, color: group === 'overdue' ? '#e5484d' : done ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.4)' }}>
        {task.dueDate ? formatDueDate(task.dueDate) : ''}
      </span>
      <img src={task.assigneeAvatar} alt="" style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, opacity: done ? 0.35 : 1 }} />
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label, count, collapsed, onToggle, onAdd }: {
  label: string
  count: number
  collapsed: boolean
  onToggle: () => void
  onAdd: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px 4px', cursor: 'default', borderTop: '1px solid rgba(0,0,0,0.06)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onToggle}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 3, flexShrink: 0 }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        <Icon
          name="chevron_right"
          size={14}
          style={{ color: 'rgba(0,0,0,0.4)', transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.15s' }}
        />
      </button>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.04px' }}>{count}</span>
      <button
        onClick={onAdd}
        style={{
          marginLeft: 'auto', background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 20, height: 20, borderRadius: 4,
          opacity: hovered ? 1 : 0, transition: 'opacity 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        <Icon name="add" size={14} style={{ color: 'rgba(0,0,0,0.5)' }} />
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TasksPage() {
  const [activeTab,  setActiveTab]  = useState<TaskTab>('my')
  const [tasks,      setTasks]      = useState<Task[]>(INITIAL_TASKS)
  const [showForm,   setShowForm]   = useState(false)
  const [collapsed,  setCollapsed]  = useState<Record<TaskGroup, boolean>>({
    overdue: false, today: false, upcoming: false, completed: false,
  })

  function toggle(id: number) {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, status: t.status === 'done' ? 'todo' : 'done' }
        : t
    ))
  }

  function createTask(task: Omit<Task, 'id'>) {
    setTasks(prev => [{ id: nextId++, ...task }, ...prev])
  }

  function toggleCollapse(group: TaskGroup) {
    setCollapsed(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const displayed = activeTab === 'overdue'
    ? tasks.filter(t => getGroup(t) === 'overdue')
    : tasks

  const grouped = {
    overdue:   displayed.filter(t => getGroup(t) === 'overdue'),
    today:     displayed.filter(t => getGroup(t) === 'today'),
    upcoming:  displayed.filter(t => getGroup(t) === 'upcoming'),
    completed: displayed.filter(t => getGroup(t) === 'completed'),
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: 'white' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', flexShrink: 0,
        padding: '0 20px', height: 52,
        borderBottom: '1px solid rgba(0,0,0,0.12)',
      }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.3px' }}>
          Tasks
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ActionBtn icon="filter_list" />
          <ActionBtn icon="swap_vert" />
          <ActionBtn icon="search" />
          <ActionBtn icon="add" label="New task" onClick={() => setShowForm(true)} />
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', flexShrink: 0,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        paddingLeft: 12, paddingRight: 20, height: 38,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                height: 38, paddingLeft: 10, paddingRight: 10,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13, letterSpacing: '-0.04px',
                color: activeTab === tab.key ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.45)',
                fontWeight: activeTab === tab.key ? 500 : 400,
                borderBottom: activeTab === tab.key ? '1.5px solid rgba(0,0,0,0.87)' : '1.5px solid transparent',
                marginBottom: -1, whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
          <button
            style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4, marginLeft: 2 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Icon name="add" size={14} style={{ color: 'rgba(0,0,0,0.45)' }} />
          </button>
        </div>
      </div>

      {/* ── Task list ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {SECTIONS.map(section => {
          const items = grouped[section.key]
          return (
            <div key={section.key}>
              <SectionHeader
                label={section.label}
                count={items.length}
                collapsed={collapsed[section.key]}
                onToggle={() => toggleCollapse(section.key)}
                onAdd={() => setShowForm(true)}
              />
              {!collapsed[section.key] && items.map(task => (
                <TaskRow key={task.id} task={task} onToggle={toggle} />
              ))}
            </div>
          )
        })}
      </div>

      {/* ── New task modal ── */}
      {showForm && (
        <NewTaskForm
          onClose={() => setShowForm(false)}
          onCreate={task => { createTask(task); setShowForm(false) }}
        />
      )}
    </div>
  )
}
