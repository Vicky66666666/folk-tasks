import React, { useState } from 'react'
import { Icon } from '../folk'

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'done'

interface RecordRef {
  type: 'person' | 'company' | 'deal'
  name: string
}

interface Task {
  id: number
  title: string
  dueDate: string
  assigneeName: string
  assigneeInitials: string
  assigneeColor: string
  status: TaskStatus
  overdue?: boolean
  record: RecordRef
  description: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Respond to Tim's funding request",
    dueDate: 'Mar 4',
    assigneeName: 'John Doe', assigneeInitials: 'JD', assigneeColor: '#5b6c8e',
    status: 'todo', overdue: true,
    record: { type: 'person', name: 'John Doe' },
    description: 'Prepare a report on the proposal received last week from the investors.',
  },
  {
    id: 2,
    title: 'Send contract to Johnson & Co',
    dueDate: 'Mar 4',
    assigneeName: 'John Doe', assigneeInitials: 'JD', assigneeColor: '#5b6c8e',
    status: 'todo', overdue: true,
    record: { type: 'company', name: 'Qonto' },
    description: 'Prepare a report on the partnership agreement draft v2.',
  },
  {
    id: 3,
    title: 'Review Series A deck',
    dueDate: 'Mar 20',
    assigneeName: 'John Doe', assigneeInitials: 'JD', assigneeColor: '#5b6c8e',
    status: 'todo',
    record: { type: 'deal', name: 'Deal 23' },
    description: 'Prepare a report on the projected growth metrics for the next fiscal year.',
  },
  {
    id: 4,
    title: 'Schedule product demo for April',
    dueDate: 'Apr 20',
    assigneeName: 'John Doe', assigneeInitials: 'JD', assigneeColor: '#5b6c8e',
    status: 'todo',
    record: { type: 'person', name: 'Avner' },
    description: 'Prepare a report on the Q3 pipeline and key account updates.',
  },
  {
    id: 5,
    title: 'Follow up with Berlin contacts',
    dueDate: 'Apr 23',
    assigneeName: 'John Doe', assigneeInitials: 'JD', assigneeColor: '#5b6c8e',
    status: 'todo',
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

// ─── Record icon ──────────────────────────────────────────────────────────────

function RecordIcon({ type }: { type: RecordRef['type'] }) {
  if (type === 'company') {
    return (
      <div style={{
        width: 16, height: 16, borderRadius: 4, background: '#1a56db',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'white', lineHeight: 1 }}>Q</span>
      </div>
    )
  }
  if (type === 'deal') {
    return <Icon name="handshake" size={14} style={{ color: 'rgba(0,0,0,0.4)', flexShrink: 0 }} />
  }
  return <Icon name="account_circle" size={14} style={{ color: 'rgba(0,0,0,0.4)', flexShrink: 0 }} />
}

// ─── Column widths ────────────────────────────────────────────────────────────

// Name: flex + Checkbox offset handled inside cell
// Due date: 120px
// Assignee: 160px
// Record: 160px
// Description: 200px

const COL_DUE      = 120
const COL_ASSIGNEE = 160
const COL_RECORD   = 160
const COL_DESC     = 200

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

  function createInline() {
    if (!newTitle.trim()) { setAddingInline(false); return }
    setTasks(prev => [...prev, {
      id: nextId++,
      title: newTitle.trim(),
      dueDate: '',
      assigneeName: 'John Doe', assigneeInitials: 'JD', assigneeColor: '#5b6c8e',
      status: 'todo',
      record: { type: 'person', name: 'John Doe' },
      description: '',
    }])
    setNewTitle('')
    setAddingInline(false)
  }

  const displayed = activeTab === 'overdue'
    ? tasks.filter(t => t.overdue)
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
          <button style={{
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4, marginLeft: 4,
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Icon name="add" size={14} style={{ color: 'rgba(0,0,0,0.45)' }} />
          </button>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {(['filter_list', 'swap_vert', 'search'] as const).map(icon => (
            <button
              key={icon}
              style={{
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4,
              }}
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
          <HeaderCell label="Name" flex />
          <HeaderCell label="Due date" width={COL_DUE} />
          <HeaderCell label="Assignee" width={COL_ASSIGNEE} />
          <HeaderCell label="Record" width={COL_RECORD} />
          <HeaderCell label="Description" width={COL_DESC} last />
        </div>

        {/* Rows */}
        {displayed.map(task => (
          <TaskRow key={task.id} task={task} onToggle={toggleTask} />
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

// ─── Header cell ──────────────────────────────────────────────────────────────

function HeaderCell({ label, flex, width, last }: {
  label: string
  flex?: boolean
  width?: number
  last?: boolean
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
      paddingRight: 12,
    }}>
      <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 400, letterSpacing: '-0.04px' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  const [hovered, setHovered] = useState(false)
  const done = task.status === 'done'

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
        flex: 1, minWidth: 0,
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
      <div style={{
        width: COL_DUE, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        height: '100%',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        paddingLeft: 12, paddingRight: 12,
      }}>
        <span style={{
          fontSize: 13, letterSpacing: '-0.04px',
          color: task.overdue && !done ? '#e5484d' : 'rgba(0,0,0,0.45)',
        }}>
          {task.dueDate}
        </span>
      </div>

      {/* Assignee */}
      <div style={{
        width: COL_ASSIGNEE, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 6,
        height: '100%',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        paddingLeft: 12, paddingRight: 12,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          background: task.assigneeColor, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 8, fontWeight: 700, color: 'white',
        }}>
          {task.assigneeInitials.charAt(0)}
        </div>
        <span style={{ fontSize: 13, letterSpacing: '-0.04px', color: 'rgba(0,0,0,0.87)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.assigneeName}
        </span>
      </div>

      {/* Record */}
      <div style={{
        width: COL_RECORD, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 6,
        height: '100%',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        paddingLeft: 12, paddingRight: 12,
      }}>
        <RecordIcon type={task.record.type} />
        <span style={{ fontSize: 13, letterSpacing: '-0.04px', color: 'rgba(0,0,0,0.87)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.record.name}
        </span>
      </div>

      {/* Description */}
      <div style={{
        width: COL_DESC, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        height: '100%',
        paddingLeft: 12,
      }}>
        <span style={{
          fontSize: 13, letterSpacing: '-0.04px', color: 'rgba(0,0,0,0.4)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {task.description}
        </span>
      </div>
    </div>
  )
}
