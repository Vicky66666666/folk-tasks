import { useState, useEffect, useRef } from 'react'
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

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  label,
  count,
  showPlus,
  collapsed,
  onToggle,
  isFirst,
}: {
  label: string
  count: number
  showPlus?: boolean
  collapsed?: boolean
  onToggle: () => void
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
        paddingLeft: 5,
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
          onClick={e => e.stopPropagation()}
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
}: {
  tasks: Task[]
  onToggle: (id: number) => void
  onPriorityChange: (id: number, priority: Priority) => void
}) {
  const overdue   = tasks.filter(t => t.group === 'overdue'   && t.status === 'todo')
  const today     = tasks.filter(t => t.group === 'today'     && t.status === 'todo')
  const upcoming  = tasks.filter(t => t.group === 'upcoming'  && t.status === 'todo')
  const completed = tasks.filter(t => t.status === 'done')

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))

  const sections = [
    overdue.length   > 0 && 'overdue',
    today.length     > 0 && 'today',
    upcoming.length  > 0 && 'upcoming',
    completed.length > 0 && 'completed',
  ].filter(Boolean) as string[]
  const firstSection = sections[0]

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Overdue */}
      {overdue.length > 0 && (
        <>
          <SectionHeader
            label="Overdue"
            count={overdue.length}
            isFirst={firstSection === 'overdue'}
            collapsed={collapsed['overdue']}
            onToggle={() => toggle('overdue')}
          />
          {!collapsed['overdue'] && overdue.map(t =>
            <TaskRow key={t.id} task={t} onToggle={onToggle} onPriorityChange={onPriorityChange} />
          )}
        </>
      )}

      {/* Today */}
      {today.length > 0 && (
        <>
          <SectionHeader
            label="Today"
            count={today.length}
            showPlus
            isFirst={firstSection === 'today'}
            collapsed={collapsed['today']}
            onToggle={() => toggle('today')}
          />
          {!collapsed['today'] && today.map(t =>
            <TaskRow key={t.id} task={t} onToggle={onToggle} onPriorityChange={onPriorityChange} />
          )}
        </>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <>
          <SectionHeader
            label="Upcoming"
            count={upcoming.length}
            showPlus
            isFirst={firstSection === 'upcoming'}
            collapsed={collapsed['upcoming']}
            onToggle={() => toggle('upcoming')}
          />
          {!collapsed['upcoming'] && upcoming.map(t =>
            <TaskRow key={t.id} task={t} onToggle={onToggle} onPriorityChange={onPriorityChange} />
          )}
        </>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <SectionHeader
            label="Completed"
            count={completed.length}
            showPlus
            isFirst={firstSection === 'completed'}
            collapsed={collapsed['completed']}
            onToggle={() => toggle('completed')}
          />
          {!collapsed['completed'] && completed.map(t =>
            <TaskRow key={t.id} task={t} onToggle={onToggle} onPriorityChange={onPriorityChange} />
          )}
        </>
      )}
    </div>
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
        <TasksContent tasks={tasks} onToggle={handleToggle} onPriorityChange={handlePriorityChange} />
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
