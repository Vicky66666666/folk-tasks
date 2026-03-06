import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../folk'

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'done'

interface RecordRef {
  type: 'person' | 'company' | 'deal'
  name: string
}

interface AssigneeOption {
  id: string
  name: string
  avatar?: string
  initials?: string
  color?: string
}

interface Task {
  id: number
  title: string
  dueDate: Date | null
  dueTime: string | null
  assigneeId: string
  status: TaskStatus
  record: RecordRef
  description: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ASSIGNEES: AssigneeOption[] = [
  { id: 'none', name: 'No assignee' },
  { id: '1',    name: 'John Doe',      initials: 'JD', color: '#5b6c8e' },
  { id: '2',    name: 'Bessie Cooper', avatar: 'https://i.pravatar.cc/150?img=44' },
  { id: '3',    name: 'Arlene McCoy',  initials: 'A',  color: '#f59e0b' },
  { id: '4',    name: 'Albert Flores', avatar: 'https://i.pravatar.cc/150?img=12' },
]

const RECORDS: RecordRef[] = [
  { type: 'person',  name: 'John Doe' },
  { type: 'person',  name: 'Avner' },
  { type: 'person',  name: 'Jean' },
  { type: 'company', name: 'Qonto' },
  { type: 'company', name: 'Apple' },
  { type: 'deal',    name: 'Deal 23' },
  { type: 'deal',    name: 'Deal 45' },
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

function isOverdue(d: Date | null): boolean {
  if (!d) return false
  return startOfDay(d) < startOfDay(new Date())
}

function getAssignee(id: string): AssigneeOption {
  return ASSIGNEES.find(a => a.id === id) ?? ASSIGNEES[0]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  {
    id: 1, title: "Respond to Tim's funding request",
    dueDate: new Date(2026, 2, 4), dueTime: null, assigneeId: '1', status: 'todo',
    record: { type: 'person', name: 'John Doe' },
    description: 'Prepare a report on the proposal received last week from the investors.',
  },
  {
    id: 2, title: 'Send contract to Johnson & Co',
    dueDate: new Date(2026, 2, 4), dueTime: null, assigneeId: '1', status: 'todo',
    record: { type: 'company', name: 'Qonto' },
    description: 'Prepare a report on the partnership agreement draft v2.',
  },
  {
    id: 3, title: 'Review Series A deck',
    dueDate: new Date(2026, 2, 20), dueTime: null, assigneeId: '1', status: 'todo',
    record: { type: 'deal', name: 'Deal 23' },
    description: 'Prepare a report on the projected growth metrics for the next fiscal year.',
  },
  {
    id: 4, title: 'Schedule product demo for April',
    dueDate: new Date(2026, 3, 20), dueTime: null, assigneeId: '1', status: 'todo',
    record: { type: 'person', name: 'Avner' },
    description: 'Prepare a report on the Q3 pipeline and key account updates.',
  },
  {
    id: 5, title: 'Follow up with Berlin contacts',
    dueDate: new Date(2026, 3, 23), dueTime: null, assigneeId: '1', status: 'todo',
    record: { type: 'person', name: 'Jean' },
    description: 'Prepare a report on the Berlin expansion opportunity and next steps.',
  },
]

// ─── Tab types ────────────────────────────────────────────────────────────────

type TaskTab = 'my' | 'all' | 'john' | 'overdue'

const TABS: { key: TaskTab; label: string }[] = [
  { key: 'my',      label: 'My tasks' },
  { key: 'all',     label: 'All task' },
  { key: 'john',    label: "John's task" },
  { key: 'overdue', label: "Team's overdue" },
]

// ─── Column widths ────────────────────────────────────────────────────────────

const COL_NAME     = 280
const COL_DUE      = 120
const COL_ASSIGNEE = 160
const COL_RECORD   = 160

// ─── Record icon ──────────────────────────────────────────────────────────────

function RecordIcon({ type }: { type: RecordRef['type'] }) {
  if (type === 'company') {
    return (
      <div style={{
        width: 16, height: 16, borderRadius: 4, background: '#1a56db',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon name="business" size={10} style={{ color: 'white' }} />
      </div>
    )
  }
  if (type === 'deal') {
    return <Icon name="handshake" size={14} style={{ color: 'rgba(0,0,0,0.4)', flexShrink: 0 }} />
  }
  return <Icon name="account_circle" size={14} style={{ color: 'rgba(0,0,0,0.4)', flexShrink: 0 }} />
}

// ─── Sub picker (time / repeat / reminder) ────────────────────────────────────

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
        {/* Quick picks */}
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

        {/* DOW header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px', marginBottom: 2 }}>
          {DOW_LABELS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', paddingBottom: 4 }}>{d}</div>
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

        {/* Footer: Time / Remind me / Repeat */}
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

      {timeAnchor && (
        <SubPicker options={TIME_OPTIONS} current={time} anchorRect={timeAnchor}
          onSelect={v => onTimeChange(v)} onClose={() => setTimeAnchor(null)} />
      )}
      {repeatAnchor && (
        <SubPicker options={REPEAT_OPTIONS} current={repeat} anchorRect={repeatAnchor}
          onSelect={v => onRepeatChange(v)} onClose={() => setRepeatAnchor(null)} />
      )}
      {reminderAnchor && (
        <SubPicker options={REMINDER_OPTIONS} current={reminder} anchorRect={reminderAnchor}
          onSelect={v => onReminderChange(v)} onClose={() => setReminderAnchor(null)} />
      )}
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
          boxShadow: '0px 9px 24px rgba(24,26,27,0.16), 0px 3px 6px rgba(24,26,27,0.08), 0px 0px 1px rgba(24,26,27,0.04)',
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

// ─── Record picker ────────────────────────────────────────────────────────────

function RecordPicker({ current, anchorRect, onSelect, onClose }: {
  current: RecordRef
  anchorRect: DOMRect
  onSelect: (r: RecordRef) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = RECORDS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))

  const groups: { type: RecordRef['type']; label: string }[] = [
    { type: 'person',  label: 'People' },
    { type: 'company', label: 'Companies' },
    { type: 'deal',    label: 'Deals' },
  ]

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1001 }} onMouseDown={onClose} />
      <div
        style={{
          position: 'fixed', top: anchorRect.bottom + 6, left: anchorRect.left,
          zIndex: 1002, width: 240, background: 'white', borderRadius: 8,
          border: '1px solid rgba(141,141,141,0.24)',
          boxShadow: '0px 9px 24px rgba(24,26,27,0.16), 0px 3px 6px rgba(24,26,27,0.08), 0px 0px 1px rgba(24,26,27,0.04)',
          overflow: 'hidden', maxHeight: 320, overflowY: 'auto',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 8, position: 'sticky', top: 0, background: 'white' }}>
          <Icon name="search" size={14} style={{ color: 'rgba(0,0,0,0.3)', flexShrink: 0 }} />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search records..."
            onKeyDown={e => e.key === 'Escape' && onClose()}
            style={{ border: 'none', outline: 'none', padding: 0, flex: 1, fontFamily: 'inherit', fontSize: 13, color: '#202020', background: 'transparent' }}
          />
        </div>
        {groups.map(g => {
          const items = filtered.filter(r => r.type === g.type)
          if (!items.length) return null
          return (
            <div key={g.type}>
              <div style={{ padding: '6px 12px 2px', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {g.label}
              </div>
              {items.map(r => (
                <button
                  key={r.name}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 32, paddingLeft: 12, paddingRight: 12, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => { onSelect(r); onClose() }}
                >
                  <RecordIcon type={r.type} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#202020', letterSpacing: '-0.04px' }}>{r.name}</span>
                  {current.type === r.type && current.name === r.name && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="rgba(0,0,0,0.61)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </>,
    document.body
  )
}

// ─── Header cell ──────────────────────────────────────────────────────────────

function HeaderCell({ label, flex, width, last, first }: {
  label: string; flex?: boolean; width?: number; last?: boolean; first?: boolean
}) {
  return (
    <div style={{
      flex: flex ? 1 : undefined,
      width: flex ? undefined : width,
      minWidth: flex ? 0 : width,
      maxWidth: flex ? undefined : width,
      flexShrink: flex ? 1 : 0,
      display: 'flex', alignItems: 'center',
      height: '100%',
      borderRight: last ? 'none' : '1px solid rgba(0,0,0,0.08)',
      paddingLeft: first ? 0 : 12,
      paddingRight: 12,
    }}>
      <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 400, letterSpacing: '-0.04px' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle, onUpdate }: {
  task: Task
  onToggle: (id: number) => void
  onUpdate: (id: number, changes: Partial<Task>) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [dateAnchor,     setDateAnchor]     = useState<DOMRect | null>(null)
  const [assigneeAnchor, setAssigneeAnchor] = useState<DOMRect | null>(null)
  const [recordAnchor,   setRecordAnchor]   = useState<DOMRect | null>(null)
  const [editingDesc, setEditingDesc] = useState(false)
  const [descDraft,   setDescDraft]   = useState(task.description)

  const done    = task.status === 'done'
  const overdue = isOverdue(task.dueDate) && !done
  const assignee = getAssignee(task.assigneeId)

  function commitDesc() {
    onUpdate(task.id, { description: descDraft })
    setEditingDesc(false)
  }

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        paddingLeft: 16, paddingRight: 16, height: 36,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        background: hovered ? 'rgba(0,0,0,0.015)' : 'transparent',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Checkbox */}
      <div
        style={{ flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: 10 }}
        onClick={() => onToggle(task.id)}
      >
        {done
          ? <Icon name="check_circle" size={16} style={{ color: 'rgba(0,0,0,0.2)' }} />
          : <Icon name="radio_button_unchecked" size={16} style={{ color: hovered ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.18)' }} />
        }
      </div>

      {/* Name */}
      <div style={{
        width: COL_NAME, flexShrink: 0, minWidth: 0,
        display: 'flex', alignItems: 'center',
        height: '100%',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        paddingRight: 12,
      }}>
        <span style={{
          fontSize: 13, letterSpacing: '-0.04px',
          color: done ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.87)',
          textDecoration: done ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {task.title}
        </span>
      </div>

      {/* Due date */}
      <div
        style={{
          width: COL_DUE, flexShrink: 0,
          display: 'flex', alignItems: 'center',
          height: '100%',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          paddingLeft: 12, paddingRight: 12,
          cursor: 'pointer',
        }}
        onClick={e => setDateAnchor(e.currentTarget.getBoundingClientRect())}
      >
        <span style={{
          fontSize: 13, letterSpacing: '-0.04px',
          color: overdue ? '#e5484d' : task.dueDate ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.2)',
        }}>
          {task.dueDate ? formatDueDate(task.dueDate) : 'Date'}
        </span>
      </div>

      {/* Assignee */}
      <div
        style={{
          width: COL_ASSIGNEE, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 6,
          height: '100%',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          paddingLeft: 12, paddingRight: 12,
          cursor: 'pointer',
        }}
        onClick={e => setAssigneeAnchor(e.currentTarget.getBoundingClientRect())}
      >
        {assignee.id === 'none' ? (
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="account_circle" size={12} style={{ color: 'rgba(0,0,0,0.3)' }} />
          </div>
        ) : assignee.avatar ? (
          <img src={assignee.avatar} alt="" style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0 }} />
        ) : (
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            background: assignee.color || '#e5e7eb', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 700, color: 'white',
          }}>
            {(assignee.initials || assignee.name).charAt(0)}
          </div>
        )}
        <span style={{ fontSize: 13, letterSpacing: '-0.04px', color: assignee.id === 'none' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.87)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {assignee.name}
        </span>
      </div>

      {/* Record */}
      <div
        style={{
          width: COL_RECORD, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 6,
          height: '100%',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          paddingLeft: 12, paddingRight: 12,
          cursor: 'pointer',
        }}
        onClick={e => setRecordAnchor(e.currentTarget.getBoundingClientRect())}
      >
        <RecordIcon type={task.record.type} />
        <span style={{ fontSize: 13, letterSpacing: '-0.04px', color: 'rgba(0,0,0,0.87)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.record.name}
        </span>
      </div>

      {/* Description */}
      <div
        style={{
          flex: 1, minWidth: 0,
          display: 'flex', alignItems: 'center',
          height: '100%',
          paddingLeft: 12,
          cursor: 'text',
        }}
        onClick={() => { if (!editingDesc) { setDescDraft(task.description); setEditingDesc(true) } }}
      >
        {editingDesc ? (
          <input
            autoFocus
            value={descDraft}
            onChange={e => setDescDraft(e.target.value)}
            onBlur={commitDesc}
            onKeyDown={e => {
              if (e.key === 'Enter') commitDesc()
              if (e.key === 'Escape') { setEditingDesc(false); setDescDraft(task.description) }
            }}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'inherit', fontSize: 13, letterSpacing: '-0.04px',
              color: 'rgba(0,0,0,0.87)', padding: 0,
            }}
          />
        ) : (
          <span style={{
            fontSize: 13, letterSpacing: '-0.04px',
            color: task.description ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {task.description || 'Add a note…'}
          </span>
        )}
      </div>

      {/* Portals */}
      {dateAnchor && (
        <DatePicker
          current={task.dueDate}
          anchorRect={dateAnchor}
          onSelect={d => onUpdate(task.id, { dueDate: d })}
          onClose={() => setDateAnchor(null)}
          time={task.dueTime}
          onTimeChange={t => onUpdate(task.id, { dueTime: t })}
          repeat={null} onRepeatChange={() => {}}
          reminder={null} onReminderChange={() => {}}
        />
      )}
      {assigneeAnchor && (
        <AssigneePicker
          current={task.assigneeId}
          anchorRect={assigneeAnchor}
          onSelect={a => onUpdate(task.id, { assigneeId: a.id })}
          onClose={() => setAssigneeAnchor(null)}
        />
      )}
      {recordAnchor && (
        <RecordPicker
          current={task.record}
          anchorRect={recordAnchor}
          onSelect={r => onUpdate(task.id, { record: r })}
          onClose={() => setRecordAnchor(null)}
        />
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

let nextId = 100

export function TasksPage() {
  const [activeTab, setActiveTab] = useState<TaskTab>('my')
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [newTitle, setNewTitle] = useState('')
  const [addingInline, setAddingInline] = useState(false)

  function toggleTask(id: number) {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
    ))
  }

  function updateTask(id: number, changes: Partial<Task>) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t))
  }

  function createInline() {
    if (!newTitle.trim()) { setAddingInline(false); return }
    setTasks(prev => [...prev, {
      id: nextId++,
      title: newTitle.trim(),
      dueDate: null, dueTime: null,
      assigneeId: '1',
      status: 'todo',
      record: { type: 'person', name: 'John Doe' },
      description: '',
    }])
    setNewTitle('')
    setAddingInline(false)
  }

  const displayed = activeTab === 'overdue'
    ? tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done')
    : tasks

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: 'white' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', flexShrink: 0,
        padding: '0 20px', height: 52,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.3px' }}>
          Tasks
        </span>
        <button
          onClick={() => setAddingInline(true)}
          style={{
            marginLeft: 'auto',
            height: 28, paddingLeft: 12, paddingRight: 12,
            background: 'rgba(0,0,0,0.87)', color: 'white',
            border: 'none', borderRadius: 100,
            fontSize: 12, fontWeight: 500, cursor: 'pointer', letterSpacing: '-0.04px',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.72)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.87)')}
        >
          New task
        </button>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', flexShrink: 0,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        paddingLeft: 20, paddingRight: 20, height: 38,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1 }}>
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
            style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4, marginLeft: 4 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Icon name="add" size={14} style={{ color: 'rgba(0,0,0,0.45)' }} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {(['filter_list', 'swap_vert', 'search'] as const).map(icon => (
            <button
              key={icon}
              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Icon name={icon} size={14} style={{ color: 'rgba(0,0,0,0.45)' }} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Column headers */}
        <div style={{
          display: 'flex', alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          paddingLeft: 42, paddingRight: 16,
          height: 34, flexShrink: 0,
        }}>
          <HeaderCell label="Name" width={COL_NAME} first />
          <HeaderCell label="Due date" width={COL_DUE} />
          <HeaderCell label="Assignee" width={COL_ASSIGNEE} />
          <HeaderCell label="Record" width={COL_RECORD} />
          <HeaderCell label="Description" flex last />
        </div>

        {/* Rows */}
        {displayed.map(task => (
          <TaskRow key={task.id} task={task} onToggle={toggleTask} onUpdate={updateTask} />
        ))}

        {/* Inline add row */}
        {addingInline ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            paddingLeft: 16, paddingRight: 16, height: 36,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}>
            <div style={{ width: 16, height: 16, flexShrink: 0 }} />
            <input
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') createInline()
                if (e.key === 'Escape') { setAddingInline(false); setNewTitle('') }
              }}
              onBlur={createInline}
              placeholder="New task title..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'inherit', fontSize: 13, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px',
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setAddingInline(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              paddingLeft: 16, paddingTop: 8, paddingBottom: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.04px',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.61)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.4)')}
          >
            <Icon name="add" size={14} style={{ color: 'inherit' }} />
            <span>New task</span>
          </button>
        )}
      </div>
    </div>
  )
}
