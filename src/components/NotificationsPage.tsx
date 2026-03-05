import { useState } from 'react'
import { Icon } from '../folk'

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = 'mention' | 'assignment' | 'followup' | 'reminder' | 'group-invite'
type Tab = 'all' | 'mentions' | 'assigned' | 'suggestions'

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
  subtitle?: string
  time: string
  unread?: boolean
  group: 'today' | 'week' | 'later'
}

// ─── Actions per type ─────────────────────────────────────────────────────────

const ACTIONS: Record<ItemType, Array<{ icon: string; label: string }>> = {
  mention:        [{ icon: 'reply', label: 'Reply' },       { icon: 'check', label: 'Done' },    { icon: 'close', label: 'Dismiss' }],
  assignment:     [{ icon: 'open_in_new', label: 'View' },  { icon: 'check', label: 'Done' },    { icon: 'close', label: 'Dismiss' }],
  followup:       [{ icon: 'reply', label: 'Reply' },       { icon: 'snooze', label: 'Snooze' }, { icon: 'close', label: 'Dismiss' }],
  reminder:       [{ icon: 'check', label: 'Done' },        { icon: 'snooze', label: 'Snooze' }, { icon: 'close', label: 'Dismiss' }],
  'group-invite': [{ icon: 'check', label: 'Accept' },      { icon: 'close', label: 'Decline' }],
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ITEMS: InboxItem[] = [
  {
    id: 1, type: 'mention', group: 'today', unread: true, time: '11m',
    actor: { name: 'Leslie Alexander', initials: 'LA', color: '#7c6fcd', image: 'https://i.pravatar.cc/150?img=47' },
    title: 'Leslie mentioned you on Jane Cooper',
    subtitle: '"Can you reach out to her this week?"',
  },
  {
    id: 2, type: 'followup', group: 'today', unread: true, time: '—', isFolk: true,
    title: 'Follow up with Tim Berners-Lee',
    subtitle: 'No reply in 3 days · Last contact Jan 28',
  },
  {
    id: 3, type: 'reminder', group: 'today', unread: true, time: '1h',
    title: 'Call John · Due today at 10 PM',
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
    subtitle: 'No reply in 5 days · Last contact Feb 15',
  },
  {
    id: 7, type: 'group-invite', group: 'week', time: 'Feb 12',
    actor: { name: 'Sarah', initials: 'S', color: '#10b981', image: 'https://i.pravatar.cc/150?img=9' },
    title: 'Sarah invited you to 🇩🇪 Berlin Dinner',
  },
  {
    id: 8, type: 'reminder', group: 'later', time: 'Mar 10',
    title: 'Call with Benjamin · Due Mar 10',
  },
  {
    id: 9, type: 'assignment', group: 'later', time: 'Mar 5',
    actor: { name: 'Tom', initials: 'T', color: '#f59e0b' },
    title: 'Tom assigned you to Kevin Park',
  },
]

const TABS: { key: Tab; label: string; count: number }[] = [
  { key: 'all',         label: 'All',         count: 9 },
  { key: 'mentions',    label: 'Mentions',    count: 2 },
  { key: 'assigned',    label: 'Assigned',    count: 2 },
  { key: 'suggestions', label: 'Suggestions', count: 2 },
]

const GROUPS: { key: InboxItem['group']; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'This week' },
  { key: 'later', label: 'Later' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActorIcon({ item }: { item: InboxItem }) {
  // Folk-suggested item
  if (item.isFolk) {
    return (
      <div style={{
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="auto_awesome" size={13} style={{ color: 'white' }} />
      </div>
    )
  }
  // Reminder (no actor)
  if (!item.actor) {
    return (
      <div style={{
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="notifications" size={14} style={{ color: 'rgba(0,0,0,0.45)' }} />
      </div>
    )
  }
  // Human actor
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
      background: item.actor.color,
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 600, color: 'white',
    }}>
      {item.actor.image
        ? <img src={item.actor.image} alt={item.actor.initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : item.actor.initials
      }
    </div>
  )
}

function HoverActions({ type }: { type: ItemType }) {
  return (
    <div style={{
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'white',
      boxShadow: '0 1px 6px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.07)',
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      padding: 2,
      zIndex: 2,
    }}>
      {ACTIONS[type].map(action => (
        <button
          key={action.label}
          title={action.label}
          style={{
            width: 26, height: 26,
            border: 'none', background: 'none',
            cursor: 'pointer', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          onClick={e => e.stopPropagation()}
        >
          <Icon name={action.icon} size={14} style={{ color: 'rgba(0,0,0,0.55)' }} />
        </button>
      ))}
    </div>
  )
}

function InboxItemRow({ item }: { item: InboxItem }) {
  const [hovered, setHovered] = useState(false)
  const hasSubtitle = !!item.subtitle

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: hasSubtitle ? 'flex-start' : 'center',
        gap: 10,
        padding: '7px 16px',
        cursor: 'pointer',
        background: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon / avatar */}
      <div style={hasSubtitle ? { marginTop: 3, flexShrink: 0 } : { flexShrink: 0 }}>
        <ActorIcon item={item} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{
          fontSize: 13,
          color: 'rgba(0,0,0,0.87)',
          lineHeight: '18px',
          letterSpacing: '-0.04px',
          fontWeight: item.unread ? 500 : 400,
        }}>
          {item.title}
        </span>
        {item.subtitle && (
          <span style={{
            fontSize: 12,
            color: 'rgba(0,0,0,0.45)',
            lineHeight: '16px',
            letterSpacing: '-0.04px',
          }}>
            {item.subtitle}
          </span>
        )}
      </div>

      {/* Time + unread dot — hidden on hover, action bar takes over */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
        alignSelf: hasSubtitle ? 'flex-start' : 'center',
        marginTop: hasSubtitle ? 3 : 0,
        opacity: hovered ? 0 : 1,
        transition: 'opacity 0.1s',
      }}>
        {item.time !== '—' && (
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
            {item.time}
          </span>
        )}
        {item.unread && (
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
        )}
      </div>

      {/* Floating action bar */}
      {hovered && <HoverActions type={item.type} />}
    </div>
  )
}

function GroupLabel({ label }: { label: string }) {
  return (
    <div style={{ padding: '8px 16px 2px' }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '-0.04px' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const TAB_FILTER: Record<Tab, (item: InboxItem) => boolean> = {
  all:         () => true,
  mentions:    item => item.type === 'mention',
  assigned:    item => item.type === 'assignment',
  suggestions: item => item.isFolk === true,
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const filtered = ITEMS.filter(TAB_FILTER[activeTab])

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
          style={{
            paddingLeft: 16, paddingRight: 8,
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            height: 48,
          }}
        >
          <div className="flex items-center flex-1" style={{ height: '100%', gap: 0 }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  height: '100%',
                  paddingLeft: 8, paddingRight: 8,
                  background: 'none', border: 'none',
                  borderBottom: activeTab === tab.key ? '1.5px solid rgba(0,0,0,0.87)' : '1.5px solid transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                  marginBottom: -1,
                }}
              >
                <span style={{
                  fontSize: 13,
                  color: activeTab === tab.key ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.45)',
                  fontWeight: activeTab === tab.key ? 500 : 400,
                  letterSpacing: '-0.04px',
                  whiteSpace: 'nowrap',
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
          {GROUPS.map(group => {
            const items = filtered.filter(i => i.group === group.key)
            if (!items.length) return null
            return (
              <div key={group.key}>
                <GroupLabel label={group.label} />
                {items.map(item => <InboxItemRow key={item.id} item={item} />)}
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel – empty state */}
      <div className="flex flex-1 items-center justify-center">
        <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.3)', letterSpacing: '-0.04px' }}>
          Select an item
        </span>
      </div>
    </div>
  )
}
