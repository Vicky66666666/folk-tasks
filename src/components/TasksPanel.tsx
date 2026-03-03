import { useState } from 'react'
import { Icon } from '../folk'

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'done'
type Priority = 'urgent' | 'medium' | 'none'

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

// ─── Priority icon ─────────────────────────────────────────────────────────────
// Matching Figma "Frame" component exactly

function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === 'urgent') {
    return (
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 16,
          height: 16,
          borderRadius: 3,
          background: '#e5484d',
          color: 'white',
          fontSize: 10,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        !
      </span>
    )
  }
  if (priority === 'medium') {
    // 3 bars bottom-aligned: dark (#626262) dark (#626262) light (#e1e1e1)
    // heights: 6px, 9px, 12px from left to right
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <rect x="1.5" y="8" width="3" height="6" fill="#626262" />
        <rect x="6.5" y="5" width="3" height="9" fill="#626262" />
        <rect x="11.5" y="2" width="3" height="12" fill="#e1e1e1" />
      </svg>
    )
  }
  // none: 3 dots (matching Figma "Union" shape)
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <circle cx="3.5" cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
      <circle cx="8" cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
      <circle cx="12.5" cy="8" r="1.5" fill="rgba(0,0,0,0.3)" />
    </svg>
  )
}

// ─── Circle checkbox (unchecked) ──────────────────────────────────────────────

function CircleCheckbox({ done, onToggle }: { done: boolean; onToggle: () => void }) {
  if (done) {
    // Green filled circle with white check (matching Figma "check_circle")
    return (
      <button
        onClick={onToggle}
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#22c55e',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
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
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '1.5px solid rgba(0,0,0,0.2)',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.4)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)')}
    />
  )
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  const done = task.status === 'done'

  return (
    <div
      className="flex items-center w-full"
      style={{
        gap: 8,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12,
        background: 'white',
        cursor: 'default',
        opacity: done ? 1 : 1,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
    >
      <CircleCheckbox done={done} onToggle={() => onToggle(task.id)} />

      <PriorityIcon priority={task.priority} />

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

      {/* Due date */}
      <span
        className="flex-shrink-0"
        style={{
          color: task.overdue && !done ? '#e5484d' : '#8c8c8c',
          fontSize: done ? 13 : 12,
          fontWeight: 500,
          letterSpacing: done ? '-0.04px' : undefined,
          opacity: done ? 0.5 : 1,
        }}
      >
        {task.dueDate}
      </span>

      {/* Assignee avatar */}
      <img
        src={task.assigneeAvatar}
        alt=""
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: 16, height: 16, opacity: done ? 0.5 : 1 }}
      />
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
// Matching Figma: bg-[#f9f9f9] h-[36px] pl-[5px] border top+bottom #e1e1e1

function SectionHeader({
  label,
  count,
  showPlus,
  collapsed,
  onToggle,
}: {
  label: string
  count: number
  showPlus?: boolean
  collapsed?: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="flex items-center w-full cursor-pointer"
      style={{
        height: 36,
        background: '#f9f9f9',
        borderBottom: '1px solid #e1e1e1',
        paddingLeft: 5,
        paddingRight: 8,
        flexShrink: 0,
      }}
      onClick={onToggle}
    >
      {/* Chevron */}
      <Icon
        name={collapsed ? 'chevron_right' : 'expand_more'}
        size={16}
        style={{ color: 'rgba(0,0,0,0.61)', flexShrink: 0 }}
      />

      {/* Label + count */}
      <div className="flex items-center flex-1" style={{ gap: 8, marginLeft: 4 }}>
        <span
          style={{
            color: '#202020',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '-0.04px',
            lineHeight: '18px',
          }}
        >
          {label}
        </span>
        <span
          style={{
            color: '#8c8c8c',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '-0.04px',
            lineHeight: '18px',
          }}
        >
          {count}
        </span>
      </div>

      {/* + add button */}
      {showPlus && (
        <button
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 28,
            height: 28,
            borderRadius: 100,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
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
  { key: 'notes', label: 'Notes', count: 1 },
  { key: 'tasks', label: 'Tasks', count: 0 },
]

// ─── Tasks tab content ────────────────────────────────────────────────────────

function TasksContent({ tasks, onToggle }: { tasks: Task[]; onToggle: (id: number) => void }) {
  const overdue = tasks.filter(t => t.group === 'overdue' && t.status === 'todo')
  const today = tasks.filter(t => t.group === 'today' && t.status === 'todo')
  const upcoming = tasks.filter(t => t.group === 'upcoming' && t.status === 'todo')
  const completed = tasks.filter(t => t.status === 'done')

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Overdue */}
      {overdue.length > 0 && (
        <>
          <SectionHeader
            label="Overdue"
            count={overdue.length}
            collapsed={collapsed['overdue']}
            onToggle={() => toggle('overdue')}
          />
          {!collapsed['overdue'] && overdue.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </>
      )}

      {/* Today */}
      {today.length > 0 && (
        <>
          <SectionHeader
            label="Today"
            count={today.length}
            showPlus
            collapsed={collapsed['today']}
            onToggle={() => toggle('today')}
          />
          {!collapsed['today'] && today.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <>
          <SectionHeader
            label="Upcoming"
            count={upcoming.length}
            showPlus
            collapsed={collapsed['upcoming']}
            onToggle={() => toggle('upcoming')}
          />
          {!collapsed['upcoming'] && upcoming.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <SectionHeader
            label="Completed"
            count={completed.length}
            showPlus
            collapsed={collapsed['completed']}
            onToggle={() => toggle('completed')}
          />
          {!collapsed['completed'] && completed.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </>
      )}
    </div>
  )
}

// ─── Interactions tab ─────────────────────────────────────────────────────────

function InteractionsContent() {
  const items = [
    { icon: 'mail', title: 'Intro: Jane Cooper & Steve', date: 'Today', people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
    { icon: 'mail', title: 'Intro: Jane Cooper & JSteve', date: 'Today', people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
    { icon: 'event', title: 'Fundraising event', date: 'in 5 min', people: 'John Wick, John Lenon +3', preview: '', chip: true },
    { icon: 'mail', title: 'Intro: Jane Cooper & JSteve', date: 'Today', people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
    { icon: 'event', title: 'Fundraising event', date: 'in 5 min', people: 'John Wick, John Lenon +3', preview: '', chip: true },
    { icon: 'mail', title: 'Intro: Jane Cooper & Steve', date: 'Today', people: 'John Wick, John Lenon +3', preview: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offi…' },
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
            style={{
              gap: 4,
              padding: '0 8px',
              height: 28,
              border: '1px solid rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.61)',
              background: 'transparent',
              fontSize: 12,
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            <Icon name="filter_list" size={12} style={{ color: 'rgba(0,0,0,0.61)' }} />
            Filter
          </button>
          <button
            style={{
              padding: '0 10px',
              height: 28,
              border: '1px solid rgba(0,0,0,0.27)',
              background: 'white',
              color: 'rgba(0,0,0,0.87)',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '-0.04px',
              borderRadius: 100,
              boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.06)',
              cursor: 'pointer',
            }}
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
            <div
              className="flex flex-col items-center justify-center flex-shrink-0 text-white font-bold"
              style={{ width: 32, height: 32, borderRadius: 6, background: '#e5484d', fontSize: 9 }}
            >
              <span style={{ textTransform: 'uppercase', fontSize: 8 }}>APR</span>
              <span style={{ fontSize: 14, lineHeight: 1 }}>12</span>
            </div>
          ) : (
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.06)' }}
            >
              <Icon name={item.icon} size={14} style={{ color: 'rgba(0,0,0,0.61)' }} />
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0" style={{ gap: 2 }}>
            <div className="flex items-center justify-between" style={{ gap: 8 }}>
              <span
                className="truncate"
                style={{ color: 'rgba(0,0,0,0.87)', fontSize: 12, fontWeight: 500, letterSpacing: '-0.04px' }}
              >
                {item.title}
              </span>
              <span className="flex-shrink-0" style={{ color: 'rgba(0,0,0,0.61)', fontSize: 11 }}>{item.date}</span>
            </div>
            <span style={{ color: 'rgba(0,0,0,0.61)', fontSize: 11 }}>{item.people}</span>
            {item.preview && (
              <span className="truncate" style={{ color: 'rgba(0,0,0,0.61)', fontSize: 11 }}>
                {item.preview}
              </span>
            )}
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
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const newStatus: TaskStatus = t.status === 'done' ? 'todo' : 'done'
        return {
          ...t,
          status: newStatus,
          group: newStatus === 'done' ? 'completed' : t.overdue ? 'overdue' : t.group,
        }
      })
    )
  }

  const todoCount = tasks.filter(t => t.status === 'todo').length

  return (
    <div
      className="flex flex-col flex-1 h-full overflow-hidden"
      style={{ background: 'white' }}
    >
      {/* Activity / note banner — Figma: pt-16 pb-8 px-16, inner bg-#f9f9f9 p-8 gap-8 */}
      <div
        style={{
          paddingTop: 16,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center"
          style={{ gap: 8, background: '#f9f9f9', padding: 8, cursor: 'pointer' }}
        >
          {/* Tiny avatar */}
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 20, height: 20, borderRadius: 100, background: '#fff0bd', overflow: 'hidden' }}
          >
            <span style={{ fontSize: 11 }}>🧀</span>
          </div>
          <p
            className="flex-1 truncate"
            style={{ margin: 0, color: 'rgba(0,0,0,0.61)', fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px' }}
          >
            Julien requested Make or Zapier credentials to build automation templates and discussed platform choice
          </p>
          <Icon name="expand_more" size={16} style={{ color: 'rgba(0,0,0,0.61)', flexShrink: 0 }} />
        </div>
      </div>

      {/* Tabs — Figma: border-bottom rgba(0,0,0,0.12), pt-12 px-24 gap-16 */}
      <div
        className="flex items-end"
        style={{
          gap: 16,
          paddingTop: 12,
          paddingLeft: 24,
          paddingRight: 24,
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          flexShrink: 0,
        }}
      >
        {TABS.map(tab => {
          const count = tab.key === 'tasks' ? todoCount : tab.count
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center relative"
              style={{
                gap: 4,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.61)',
                padding: 0,
                paddingBottom: 9,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: '-0.04px',
                  lineHeight: '19px',
                }}
              >
                {tab.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05px',
                  color: 'rgba(0,0,0,0.61)',
                  lineHeight: 'normal',
                }}
              >
                {count}
              </span>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'rgba(0,0,0,0.87)',
                  }}
                />
              )}
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
        <div
          className="flex flex-col items-center justify-center flex-1"
          style={{ gap: 8, color: 'rgba(0,0,0,0.61)' }}
        >
          <Icon name="sticky_note_2" size={24} style={{ color: 'rgba(0,0,0,0.3)' }} />
          <span style={{ fontSize: 13 }}>No notes yet</span>
        </div>
      )}
    </div>
  )
}
