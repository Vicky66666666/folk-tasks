import { useState } from 'react'
import { Icon } from '../folk'

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = 'mention' | 'assignment' | 'followup' | 'reminder' | 'group-invite'
type Tab = 'today' | 'week' | 'next' | 'completed'

interface Actor {
  name: string
  initials: string
  color: string
  image?: string
}

interface InboxItem {
  id: number
  type: ItemType
  actor?: Actor
  isFolk?: boolean
  title: string
  time: string
  unread?: boolean
  group: 'today' | 'week' | 'next' | 'completed'
}

// ─── Actions per type ─────────────────────────────────────────────────────────

const ACTIONS: Record<ItemType, Array<{ icon: string; label: string }>> = {
  mention:        [{ icon: 'reply', label: 'Reply' },            { icon: 'check', label: 'Done' },    { icon: 'close', label: 'Dismiss' }],
  assignment:     [{ icon: 'open_in_new', label: 'View' },       { icon: 'check', label: 'Done' },    { icon: 'close', label: 'Dismiss' }],
  followup:       [{ icon: 'forward_to_inbox', label: 'Reply' }, { icon: 'snooze', label: 'Snooze' }, { icon: 'close', label: 'Dismiss' }],
  reminder:       [{ icon: 'check', label: 'Done' },             { icon: 'snooze', label: 'Snooze' }, { icon: 'close', label: 'Dismiss' }],
  'group-invite': [{ icon: 'check', label: 'Accept' },           { icon: 'close', label: 'Decline' }],
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ITEMS: InboxItem[] = [
  {
    id: 1, type: 'mention', group: 'today', unread: true, time: '11m',
    actor: { name: 'Leslie Alexander', initials: 'LA', color: '#7c6fcd', image: 'https://i.pravatar.cc/150?img=47' },
    title: 'Leslie mentioned you on Jane Cooper',
  },
  {
    id: 2, type: 'followup', group: 'today', unread: true, time: 'Now', isFolk: true,
    title: 'Follow up with Tim Berners-Lee',
  },
  {
    id: 3, type: 'reminder', group: 'today', unread: true, time: '10 PM',
    title: 'Call John',
  },
  {
    id: 4, type: 'assignment', group: 'today', unread: true, time: '2h',
    actor: { name: 'Wilsey', initials: 'W', color: '#3b82f6' },
    title: 'Wilsey assigned you to John doe',
  },
  {
    id: 5, type: 'mention', group: 'week', time: 'Feb 18',
    actor: { name: 'Julie', initials: 'J', color: '#ef4444', image: 'https://i.pravatar.cc/150?img=5' },
    title: 'Julie mentioned you on Sarah Connor',
  },
  {
    id: 6, type: 'followup', group: 'week', time: 'Feb 15', isFolk: true,
    title: 'Follow up with Marc Andreessen',
  },
  {
    id: 7, type: 'group-invite', group: 'week', time: 'Feb 12',
    actor: { name: 'Sarah', initials: 'S', color: '#10b981', image: 'https://i.pravatar.cc/150?img=9' },
    title: 'Sarah invited you to 🇩🇪 Berlin Dinner',
  },
  {
    id: 8, type: 'reminder', group: 'next', time: 'Mar 10',
    title: 'Call with Benjamin',
  },
  {
    id: 9, type: 'assignment', group: 'next', time: 'Mar 5',
    actor: { name: 'Tom', initials: 'T', color: '#f59e0b' },
    title: 'Tom assigned you to Kevin Park',
  },
  {
    id: 10, type: 'mention', group: 'completed', time: 'Feb 10',
    actor: { name: 'Leslie Alexander', initials: 'LA', color: '#7c6fcd', image: 'https://i.pravatar.cc/150?img=47' },
    title: 'Leslie mentioned you on Kate Williams',
  },
  {
    id: 11, type: 'reminder', group: 'completed', time: 'Feb 8',
    title: 'Call with Andrew',
  },
]

const TABS: { key: Tab; label: string; count: number }[] = [
  { key: 'today',     label: 'Today',      count: 4 },
  { key: 'week',      label: 'This week',  count: 3 },
  { key: 'next',      label: 'Next',       count: 2 },
  { key: 'completed', label: 'Completed',  count: 2 },
]

// ─── Item icon ────────────────────────────────────────────────────────────────

function ItemIcon({ item }: { item: InboxItem }) {
  const dim = 'rgba(0,0,0,0.35)'

  // Mention or assignment or group-invite → avatar
  if (item.actor && (item.type === 'mention' || item.type === 'assignment' || item.type === 'group-invite')) {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        background: item.actor.color, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 600, color: 'white',
      }}>
        {item.actor.image
          ? <img src={item.actor.image} alt={item.actor.initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : item.actor.initials
        }
      </div>
    )
  }

  // Follow-up suggestion → email icon
  if (item.type === 'followup') {
    return <Icon name="mail_outline" size={16} style={{ color: dim, flexShrink: 0 }} />
  }

  // Reminder / task → checkbox icon
  return <Icon name="check_box_outline_blank" size={16} style={{ color: dim, flexShrink: 0 }} />
}

// ─── Hover actions ────────────────────────────────────────────────────────────

function HoverActions({ type }: { type: ItemType }) {
  return (
    <div style={{
      position: 'absolute',
      right: 12, top: '50%', transform: 'translateY(-50%)',
      background: 'white',
      boxShadow: '0 1px 6px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.07)',
      borderRadius: 6,
      display: 'flex', alignItems: 'center',
      padding: 2, zIndex: 2,
    }}>
      {ACTIONS[type].map(action => (
        <button
          key={action.label}
          title={action.label}
          onClick={e => e.stopPropagation()}
          style={{
            width: 26, height: 26,
            border: 'none', background: 'none',
            cursor: 'pointer', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <Icon name={action.icon} size={14} style={{ color: 'rgba(0,0,0,0.55)' }} />
        </button>
      ))}
    </div>
  )
}

// ─── Item row ─────────────────────────────────────────────────────────────────

function InboxItemRow({ item, completed }: { item: InboxItem; completed?: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center',
        gap: 10, padding: '6px 16px',
        cursor: 'pointer',
        background: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ItemIcon item={item} />

      <span style={{
        flex: 1, minWidth: 0,
        fontSize: 13,
        color: completed ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.87)',
        letterSpacing: '-0.04px',
        lineHeight: '18px',
        fontWeight: item.unread && !completed ? 500 : 400,
        textDecoration: completed ? 'line-through' : 'none',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {item.title}
      </span>

      {/* Time + unread dot */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
        opacity: hovered ? 0 : 1, transition: 'opacity 0.1s',
      }}>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
          {item.time}
        </span>
        {item.unread && !completed && (
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />
        )}
      </div>

      {hovered && <HoverActions type={item.type} />}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('today')

  const filtered = ITEMS.filter(item => item.group === activeTab)

  return (
    <div className="flex flex-1 overflow-hidden" style={{ background: 'white' }}>
      {/* Left panel */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{ width: 420, borderRight: '1px solid rgba(0,0,0,0.08)' }}
      >
        {/* Header */}
        <div
          className="flex items-center flex-shrink-0"
          style={{ paddingLeft: 16, paddingRight: 8, borderBottom: '1px solid rgba(0,0,0,0.08)', height: 48 }}
        >
          <div className="flex items-center flex-1" style={{ height: '100%', gap: 0 }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  height: '100%', paddingLeft: 8, paddingRight: 8,
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: activeTab === tab.key ? '1.5px solid rgba(0,0,0,0.87)' : '1.5px solid transparent',
                  display: 'flex', alignItems: 'center', gap: 4, marginBottom: -1,
                }}
              >
                <span style={{
                  fontSize: 13, letterSpacing: '-0.04px', whiteSpace: 'nowrap',
                  color: activeTab === tab.key ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.45)',
                  fontWeight: activeTab === tab.key ? 500 : 400,
                }}>
                  {tab.label}
                </span>
                <span style={{
                  fontSize: 11,
                  color: activeTab === tab.key ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.3)',
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center" style={{ gap: 2 }}>
            <button
              style={{ width: 26, height: 26, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Icon name="tune" size={14} style={{ color: 'rgba(0,0,0,0.4)' }} />
            </button>
            <button
              style={{ width: 26, height: 26, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Icon name="more_horiz" size={14} style={{ color: 'rgba(0,0,0,0.4)' }} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col overflow-y-auto" style={{ paddingTop: 4, paddingBottom: 12 }}>
          {filtered.map(item => (
            <InboxItemRow key={item.id} item={item} completed={activeTab === 'completed'} />
          ))}
        </div>
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
