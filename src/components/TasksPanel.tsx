import { useState } from 'react'
import { Icon } from '../folk'

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'done'
type Priority = 'urgent' | 'medium' | 'none'

interface Task {
  id: number
  title: string
  dueDate: string
  assigneeInitials: string
  assigneeAvatar: string
  status: TaskStatus
  priority: Priority
  overdue?: boolean
  group: 'overdue' | 'today' | 'upcoming' | 'completed'
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TASKS: Task[] = [
  { id: 1, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'JL', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'urgent', overdue: true, group: 'overdue' },
  { id: 2, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'VM', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'medium', group: 'today' },
  { id: 3, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'JL', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'medium', group: 'today' },
  { id: 4, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'VM', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'urgent', group: 'upcoming' },
  { id: 5, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'JL', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'todo', priority: 'none', group: 'upcoming' },
  { id: 6, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'VM', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'todo', priority: 'none', group: 'upcoming' },
  { id: 7, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'JL', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'done', priority: 'none', group: 'completed' },
  { id: 8, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'VM', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'done', priority: 'none', group: 'completed' },
  { id: 9, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'JL', assigneeAvatar: 'https://i.pravatar.cc/150?img=12', status: 'done', priority: 'none', group: 'completed' },
  { id: 10, title: 'Call back for Y project', dueDate: 'Apr 2', assigneeInitials: 'VM', assigneeAvatar: 'https://i.pravatar.cc/150?img=44', status: 'done', priority: 'none', group: 'completed' },
]

// ─── Priority icon ─────────────────────────────────────────────────────────────

function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === 'urgent') {
    return (
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          background: '#ff6900',
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
    return (
      <span
        className="flex items-center gap-px flex-shrink-0"
        style={{ width: 14, height: 14 }}
        aria-label="medium priority"
      >
        {[4, 7, 10].map((h, i) => (
          <span
            key={i}
            style={{
              display: 'block',
              width: 3,
              height: h,
              background: 'var(--color-gray-9)',
              borderRadius: 1,
              alignSelf: 'flex-end',
            }}
          />
        ))}
      </span>
    )
  }
  // none
  return (
    <span
      className="flex-shrink-0"
      style={{ color: 'var(--color-gray-7)', fontSize: 11, lineHeight: '14px', width: 14, textAlign: 'center' }}
    >
      ···
    </span>
  )
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  const done = task.status === 'done'

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 group cursor-default"
      style={{ background: 'var(--folk-surface-default)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-bg-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--folk-surface-default)')}
    >
      {/* Circular checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: done ? 'none' : '1.5px solid var(--color-gray-7)',
          background: done ? '#22c55e' : 'transparent',
          cursor: 'pointer',
          padding: 0,
        }}
        onMouseEnter={e => {
          if (!done) (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gray-10)'
        }}
        onMouseLeave={e => {
          if (!done) (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gray-7)'
        }}
      >
        {done && <Icon name="check" size={10} className="text-white" />}
      </button>

      {/* Priority icon */}
      <PriorityIcon priority={task.priority} />

      {/* Title */}
      <span
        className="flex-1 truncate"
        style={{
          color: done ? 'var(--folk-text-muted)' : 'var(--folk-text-primary)',
          textDecoration: done ? 'line-through' : 'none',
          fontSize: 13,
        }}
      >
        {task.title}
      </span>

      {/* Due date */}
      <span
        className="flex-shrink-0"
        style={{
          color: task.overdue && !done ? '#e5484d' : 'var(--folk-text-muted)',
          fontSize: 12,
        }}
      >
        {task.dueDate}
      </span>

      {/* Assignee avatar */}
      <img
        src={task.assigneeAvatar}
        alt={task.assigneeInitials}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: 16, height: 16 }}
      />
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  label,
  count,
  overdue,
  showPlus,
  collapsed,
  onToggle,
}: {
  label: string
  count: number
  overdue?: boolean
  showPlus?: boolean
  collapsed?: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="flex items-center px-4 cursor-pointer"
      style={{ height: 28, background: 'var(--folk-surface-muted)' }}
      onClick={onToggle}
    >
      <Icon
        name={collapsed ? 'chevron_right' : 'expand_more'}
        size={14}
        className={overdue ? 'text-red-9' : 'text-gray-9'}
      />
      <span
        className="ml-1"
        style={{
          color: overdue ? '#e5484d' : 'var(--folk-text-muted)',
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        className="ml-1"
        style={{
          color: overdue ? '#e5484d' : 'var(--folk-text-muted)',
          fontSize: 12,
        }}
      >
        {count}
      </span>
      {showPlus && (
        <button
          className="ml-auto flex items-center justify-center"
          style={{ width: 20, height: 20, color: 'var(--folk-text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 4 }}
          onClick={e => { e.stopPropagation() }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Icon name="add" size={14} className="text-gray-9" />
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
            overdue
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
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--folk-separator)' }}>
        <span style={{ color: 'var(--folk-text-primary)', fontSize: 13, fontWeight: 500 }}>Past interactions</span>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-2 h-7 rounded" style={{ border: '1px solid var(--folk-separator)', color: 'var(--folk-text-muted)', background: 'transparent', fontSize: 12, cursor: 'pointer' }}>
            <Icon name="filter_list" size={12} className="text-gray-9" /> Filter
          </button>
          <button className="flex items-center gap-1 px-2.5 h-7 rounded" style={{ border: '1px solid var(--folk-separator)', background: 'var(--folk-surface-default)', color: 'var(--folk-text-primary)', fontSize: 12, cursor: 'pointer' }}>
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
            <div className="flex flex-col items-center justify-center flex-shrink-0 text-white font-bold" style={{ width: 32, height: 32, borderRadius: 6, background: '#e5484d', fontSize: 9 }}>
              <span style={{ textTransform: 'uppercase', fontSize: 8 }}>APR</span>
              <span style={{ fontSize: 14, lineHeight: 1 }}>12</span>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--folk-bg-selected)' }}>
              <Icon name={item.icon} size={14} className="text-gray-11" />
            </div>
          )}
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate" style={{ color: 'var(--folk-text-primary)', fontSize: 12, fontWeight: 500 }}>{item.title}</span>
              <span className="flex-shrink-0" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{item.date}</span>
            </div>
            <span style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{item.people}</span>
            {item.preview && <span className="truncate" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{item.preview}</span>}
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
      return {
        ...t,
        status: newStatus,
        group: newStatus === 'done' ? 'completed' : t.overdue ? 'overdue' : t.group,
      }
    }))
  }

  const todoCount = tasks.filter(t => t.status === 'todo').length

  return (
    <div
      className="flex flex-col flex-1 h-full overflow-hidden"
      style={{ background: 'var(--folk-surface-default)' }}
    >
      {/* Activity banner */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 cursor-pointer"
        style={{
          background: 'var(--folk-surface-muted)',
          borderBottom: '1px solid var(--folk-separator)',
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-bg-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--folk-surface-muted)')}
      >
        <span style={{ fontSize: 16 }}>🧀</span>
        <p className="flex-1 truncate" style={{ color: 'var(--folk-text-muted)', fontSize: 12, margin: 0 }}>
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
          const count = tab.key === 'tasks' ? todoCount : tab.count
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-1 cursor-pointer"
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
          <span style={{ fontSize: 13 }}>No notes yet</span>
        </div>
      )}
    </div>
  )
}
