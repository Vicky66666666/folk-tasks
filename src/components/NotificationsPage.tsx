import { useState } from 'react'
import { Icon } from '../folk'

// ─── Shared ───────────────────────────────────────────────────────────────────

type Tab = 'tasks' | 'notifications'
const MUTED = 'rgba(0,0,0,0.61)'
const DOT_COLOR = '#0090ff'

// ─── Tasks types & data ───────────────────────────────────────────────────────

type TaskGroup = 'overdue' | 'today' | 'week' | 'upnext' | 'completed'
type AvatarVariant = 'photo' | 'person' | 'company' | 'paid'

interface PageTask {
  id: number
  title: string
  date: string
  group: TaskGroup
  avatar: AvatarVariant
  avatarSrc?: string
}

const TASKS: PageTask[] = [
  { id: 1,  group: 'overdue', title: 'Call lead to discuss next steps',      date: 'Apr 4',  avatar: 'photo',   avatarSrc: 'https://i.pravatar.cc/150?img=47' },
  { id: 2,  group: 'today',   title: 'Connect with prospect on Linkedin',    date: 'Apr 12', avatar: 'paid' },
  { id: 3,  group: 'today',   title: 'Send contract to Acme Corp',           date: 'Apr 12', avatar: 'photo',   avatarSrc: 'https://i.pravatar.cc/150?img=5' },
  { id: 4,  group: 'week',    title: 'Connect with prospect on Linkedin',    date: 'Apr 12', avatar: 'paid' },
  { id: 5,  group: 'week',    title: 'Send contract to Acme Corp',           date: 'Apr 12', avatar: 'photo',   avatarSrc: 'https://i.pravatar.cc/150?img=5' },
  { id: 6,  group: 'upnext',  title: 'Schedule demo with NewCo',             date: 'May 3',  avatar: 'company' },
  { id: 7,  group: 'upnext',  title: 'Send thank you email after call',      date: 'May 5',  avatar: 'person' },
  { id: 8,  group: 'upnext',  title: 'Update CRM with call notes',           date: 'Jun 12', avatar: 'photo',   avatarSrc: 'https://i.pravatar.cc/150?img=12' },
  { id: 9,  group: 'upnext',  title: 'Follow up with Bloom re: pricing',     date: 'Jun 12', avatar: 'company' },
  { id: 10, group: 'upnext',  title: 'Email lead re: partnership',           date: 'Jul 4',  avatar: 'photo',   avatarSrc: 'https://i.pravatar.cc/150?img=20' },
  { id: 11, group: 'upnext',  title: 'Prepare presentation for demo',        date: 'Oct 31', avatar: 'company' },
  { id: 12, group: 'upnext',  title: 'Check in with lead after proposal',    date: 'Dec 21', avatar: 'photo',   avatarSrc: 'https://i.pravatar.cc/150?img=30' },
]

const TASK_SECTIONS: { key: TaskGroup; label: string }[] = [
  { key: 'overdue',   label: 'Overdue' },
  { key: 'today',     label: 'Today' },
  { key: 'week',      label: 'This week' },
  { key: 'upnext',    label: 'Upcoming' },
  { key: 'completed', label: 'Done' },
]

// ─── Task avatar ──────────────────────────────────────────────────────────────

function TaskAvatar({ task }: { task: PageTask }) {
  if (task.avatar === 'photo' && task.avatarSrc) {
    return <img src={task.avatarSrc} alt="" style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0 }} />
  }
  if (task.avatar === 'person')  return <Icon name="person"   size={16} style={{ color: 'rgba(0,0,0,0.35)', flexShrink: 0 }} />
  if (task.avatar === 'company') return <Icon name="business" size={16} style={{ color: 'rgba(0,0,0,0.35)', flexShrink: 0 }} />
  if (task.avatar === 'paid')    return <Icon name="paid"     size={16} style={{ color: 'rgba(0,0,0,0.35)', flexShrink: 0 }} />
  return null
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, done, onToggle }: { task: PageTask; done: boolean; onToggle: (id: number) => void }) {
  const isOverdue = task.group === 'overdue'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 20, paddingRight: 24, paddingTop: 8, paddingBottom: 8, opacity: done ? 0.5 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        <div onClick={() => onToggle(task.id)} style={{ flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Icon
            name={done ? 'check_circle' : 'radio_button_unchecked'}
            size={16}
            style={{ color: done ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.2)' }}
          />
        </div>
        <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500, color: '#202020', letterSpacing: '-0.04px', lineHeight: '19px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.title}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '-0.04px', whiteSpace: 'nowrap', color: isOverdue ? '#e5484d' : '#626262' }}>
          {task.date}
        </span>
        <TaskAvatar task={task} />
      </div>
    </div>
  )
}

// ─── Task section header ──────────────────────────────────────────────────────

function TaskSectionHeader({ label, count, collapsed, onToggle }: {
  label: string; count: number; collapsed: boolean; onToggle: () => void
}) {
  const isDone = label === 'Done'
  return (
    <div style={{ paddingLeft: 24, paddingRight: 18, paddingTop: isDone ? 10 : 12, paddingBottom: isDone ? 10 : 0 }}>
      <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#626262', letterSpacing: '-0.04px', lineHeight: '18px' }}>
          {label}
        </span>
        {!isDone && (
          <span style={{ fontSize: 11, color: MUTED, lineHeight: 'normal' }}>{count}</span>
        )}
        {isDone
          ? <Icon name="chevron_right" size={16} style={{ color: MUTED }} />
          : <Icon name="expand_more" size={16} style={{ color: MUTED, transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
        }
      </button>
    </div>
  )
}

// ─── Tasks tab ────────────────────────────────────────────────────────────────

function TasksTab() {
  const [collapsed, setCollapsed] = useState<Record<TaskGroup, boolean>>({
    overdue: false, today: false, week: false, upnext: false, completed: true,
  })
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set())

  const toggleCollapse = (g: TaskGroup) => setCollapsed(prev => ({ ...prev, [g]: !prev[g] }))
  const toggleDone = (id: number) => setDoneIds(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <div className="flex flex-col overflow-y-auto" style={{ paddingBottom: 12 }}>
      {TASK_SECTIONS.map(({ key, label }) => {
        const isDoneSection = key === 'completed'
        const items = isDoneSection
          ? TASKS.filter(t => doneIds.has(t.id))
          : TASKS.filter(t => t.group === key && !doneIds.has(t.id))
        const isCollapsed = collapsed[key]
        return (
          <div key={key}>
            <TaskSectionHeader label={label} count={items.length} collapsed={isCollapsed} onToggle={() => toggleCollapse(key)} />
            {!isCollapsed && items.map(task => (
              <TaskRow key={task.id} task={task} done={doneIds.has(task.id)} onToggle={toggleDone} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

// ─── Notifications types & data ───────────────────────────────────────────────

type NotifGroup = 'today' | 'week' | 'older'

interface Actor {
  name: string
  initials: string
  color: string
  image?: string
}

interface NotifItem {
  id: number
  actor?: Actor
  title: string
  time: string
  group: NotifGroup
  unread?: boolean
}

const NOTIF_ITEMS: NotifItem[] = [
  { id: 1,  group: 'today', unread: true,  time: '11m',    actor: { name: 'Leslie Alexander', initials: 'LA', color: '#7c6fcd', image: 'https://i.pravatar.cc/150?img=47' }, title: 'Leslie Alexander mentioned you on Jane Cooper' },
  { id: 2,  group: 'week',  unread: true,  time: '2h',     actor: { name: 'Wilsey', initials: 'W', color: 'rgba(199,0,126,0.75)' }, title: 'Wilsey assigned you to John doe' },
  { id: 3,  group: 'week',  unread: false, time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },
  { id: 4,  group: 'week',  unread: true,  time: '2h',     actor: { name: 'Wilsey', initials: 'W', color: 'rgba(199,0,126,0.75)' }, title: 'Wilsey assigned you to John doe' },
  { id: 5,  group: 'week',  unread: true,  time: '2h',     actor: { name: 'Wilsey', initials: 'W', color: 'rgba(199,0,126,0.75)' }, title: 'Wilsey assigned you to John doe' },
  { id: 6,  group: 'week',  unread: true,  time: '2h',     actor: { name: 'Wilsey', initials: 'W', color: 'rgba(199,0,126,0.75)' }, title: 'Wilsey assigned you to John doe' },
  { id: 7,  group: 'older', time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },
  { id: 8,  group: 'older', time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },
  { id: 9,  group: 'older', time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },
  { id: 10, group: 'older', time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },
]

const NOTIF_GROUP_LABELS: Record<NotifGroup, string> = { today: 'Today', week: 'This week', older: 'Older' }

// ─── Notification components ──────────────────────────────────────────────────

function Avatar({ actor }: { actor: Actor }) {
  return (
    <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: actor.color, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'white', letterSpacing: '0.5px' }}>
      {actor.image
        ? <img src={actor.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : actor.initials}
    </div>
  )
}

function NotifRow({ item }: { item: NotifItem }) {
  const isOlder = item.group === 'older'
  const showDot = item.unread === true && !isOlder
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 24, paddingRight: 16, paddingTop: 4, paddingBottom: 4, opacity: isOlder ? 0.5 : 1 }}>
      {item.actor && <Avatar actor={item.actor} />}
      <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px', lineHeight: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.title}
      </span>
      <span style={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.time}</span>
      {showDot
        ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: DOT_COLOR, flexShrink: 0 }} />
        : <div style={{ width: 6, flexShrink: 0 }} />}
    </div>
  )
}

function NotifGroupLabel({ label }: { label: string }) {
  return (
    <div style={{ paddingLeft: 24, paddingTop: 8, paddingBottom: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: MUTED, lineHeight: '16px' }}>{label}</span>
    </div>
  )
}

// ─── Notifications tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const grouped = (['today', 'week', 'older'] as NotifGroup[])
    .map(g => ({ key: g, label: NOTIF_GROUP_LABELS[g], items: NOTIF_ITEMS.filter(i => i.group === g) }))
    .filter(g => g.items.length > 0)

  return (
    <div className="flex flex-col overflow-y-auto" style={{ paddingBottom: 12 }}>
      {grouped.map(group => (
        <div key={group.key}>
          <NotifGroupLabel label={group.label} />
          {group.items.map(item => <NotifRow key={item.id} item={item} />)}
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks')

  const notifUnreadCount = NOTIF_ITEMS.filter(i => i.unread).length

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'tasks',         label: 'Tasks' },
    { key: 'notifications', label: 'Notifications', count: notifUnreadCount },
  ]

  return (
    <div className="flex flex-1 overflow-hidden" style={{ background: 'white' }}>
      {/* Left panel */}
      <div className="flex flex-col flex-shrink-0" style={{ width: 420, borderRight: '1px solid rgba(0,0,0,0.08)' }}>

        {/* Tab bar */}
        <div className="flex items-center flex-shrink-0" style={{ paddingLeft: 24, paddingRight: 16, borderBottom: '1px solid #e1e1e1', height: 48 }}>
          <div className="flex items-center flex-1" style={{ height: '100%', gap: 16 }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  height: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0 9px',
                  borderBottom: activeTab === tab.key ? '2px solid rgba(0,0,0,0.87)' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', gap: 4, marginBottom: -1, flexShrink: 0,
                }}
              >
                <span style={{
                  fontSize: 13, fontWeight: 500, letterSpacing: '-0.04px', whiteSpace: 'nowrap', lineHeight: '19px',
                  color: activeTab === tab.key ? 'rgba(0,0,0,0.87)' : MUTED,
                }}>
                  {tab.label}
                </span>
                {tab.count !== undefined && (
                  <span style={{ fontSize: 11, color: activeTab === tab.key ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.3)', lineHeight: 'normal', letterSpacing: '0.05px' }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'tasks' ? <TasksTab /> : <NotificationsTab />}
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center">
        <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.3)', letterSpacing: '-0.04px' }}>
          Select an item
        </span>
      </div>
    </div>
  )
}
