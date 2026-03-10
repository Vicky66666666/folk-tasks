import { useState } from 'react'
import { Icon } from '../folk'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'notifications' | 'upcoming'
type Group = 'today' | 'week' | 'older'

interface Actor {
  name: string
  initials: string
  color: string
  image?: string
}

interface Item {
  id: number
  tab: Tab
  actor?: Actor
  icon?: 'bell' | 'mail'
  title: string
  time: string
  group: Group
  unread?: boolean
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ITEMS: Item[] = [
  // ── Notifications ──
  { id: 1,  tab: 'notifications', group: 'today', unread: true,  time: '11m',    actor: { name: 'Leslie Alexander', initials: 'LA', color: '#7c6fcd', image: 'https://i.pravatar.cc/150?img=47' }, title: 'Leslie Alexander mentioned you on Jane Cooper' },
  { id: 2,  tab: 'notifications', group: 'week',  unread: true,  time: '2h',     actor: { name: 'Wilsey', initials: 'W', color: 'rgba(199,0,126,0.75)' }, title: 'Wilsey assigned you to John doe' },
  { id: 3,  tab: 'notifications', group: 'week',  unread: false, time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },
  { id: 4,  tab: 'notifications', group: 'week',  unread: true,  time: '2h',     actor: { name: 'Wilsey', initials: 'W', color: 'rgba(199,0,126,0.75)' }, title: 'Wilsey assigned you to John doe' },
  { id: 5,  tab: 'notifications', group: 'week',  unread: true,  time: '2h',     actor: { name: 'Wilsey', initials: 'W', color: 'rgba(199,0,126,0.75)' }, title: 'Wilsey assigned you to John doe' },
  { id: 6,  tab: 'notifications', group: 'week',  unread: true,  time: '2h',     actor: { name: 'Wilsey', initials: 'W', color: 'rgba(199,0,126,0.75)' }, title: 'Wilsey assigned you to John doe' },
  { id: 7,  tab: 'notifications', group: 'older', time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },
  { id: 8,  tab: 'notifications', group: 'older', time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },
  { id: 9,  tab: 'notifications', group: 'older', time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },
  { id: 10, tab: 'notifications', group: 'older', time: 'Feb 18', actor: { name: 'Julie', initials: 'J', color: '#f76808', image: 'https://i.pravatar.cc/150?img=5' }, title: 'Julie mentioned you' },

  // ── Upcoming ──
  { id: 20, tab: 'upcoming', group: 'today', unread: true, time: '1h', icon: 'bell', title: 'Call Priya about the new product' },
  { id: 21, tab: 'upcoming', group: 'today', unread: true, time: '1h', icon: 'bell', title: 'Draft contract for Wayne Ind.' },
  { id: 22, tab: 'upcoming', group: 'today', unread: true, time: '1h', icon: 'bell', title: 'Schedule demo with Globex Corp' },
  { id: 23, tab: 'upcoming', group: 'today', unread: true, time: '1h', icon: 'bell', title: 'Research prospects in new region' },
  { id: 24, tab: 'upcoming', group: 'today', unread: true, time: '1h', icon: 'bell', title: 'Send proposal to the Dunder Co.' },
  { id: 25, tab: 'upcoming', group: 'week', time: '1h', icon: 'bell', title: 'Follow up with Schmidt group' },
  { id: 26, tab: 'upcoming', group: 'week', time: '1h', icon: 'bell', title: 'Finalize Q3 sales report' },
  { id: 27, tab: 'upcoming', group: 'week', time: '1h', icon: 'bell', title: 'Check in with Sarah from Widget Corp' },
  { id: 28, tab: 'upcoming', group: 'week', time: '1h', icon: 'bell', title: 'Send thank you email to client' },
  { id: 29, tab: 'upcoming', group: 'week', time: '1h', icon: 'bell', title: 'Review feedback from last call' },
  { id: 30, tab: 'upcoming', group: 'week', time: '1h', icon: 'bell', title: 'Connect with new lead on LinkedIn' },
  { id: 31, tab: 'upcoming', group: 'week', time: '1h', icon: 'bell', title: 'Reach out to potential partners' },
  { id: 32, tab: 'upcoming', group: 'older', time: '1h', icon: 'bell', title: 'Send reminder about the event' },
  { id: 33, tab: 'upcoming', group: 'older', time: '1h', icon: 'bell', title: 'Send invoice to Tyrell Corp' },
  { id: 34, tab: 'upcoming', group: 'older', time: '1h', icon: 'bell', title: 'Update leads in the CRM system' },
  { id: 35, tab: 'upcoming', group: 'older', time: '1h', icon: 'bell', title: 'Prepare presentation for next week' },
  { id: 36, tab: 'upcoming', group: 'older', time: '1h', icon: 'bell', title: 'Confirm meeting with LexCorp' },
  { id: 37, tab: 'upcoming', group: 'older', time: '1h', icon: 'mail', title: "You didn't reply to benjamin since 1 week" },
  { id: 38, tab: 'upcoming', group: 'older', time: '1h', icon: 'mail', title: "You didn't reply to benjamin since 1 week" },
]

const TABS: { key: Tab; label: string }[] = [
  { key: 'notifications', label: 'Notifications' },
  { key: 'upcoming',      label: 'Upcoming task' },
]

const GROUP_LABELS: Record<Group, string> = {
  today: 'Today',
  week:  'This week',
  older: 'Older',
}

const MUTED = 'rgba(0,0,0,0.61)'
const DOT_COLOR = '#0090ff'

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ actor }: { actor: Actor }) {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
      background: actor.color, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 600, color: 'white', letterSpacing: '0.5px',
    }}>
      {actor.image
        ? <img src={actor.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : actor.initials}
    </div>
  )
}

// ─── Notification row ─────────────────────────────────────────────────────────

function NotificationRow({ item }: { item: Item }) {
  const isOlder = item.group === 'older'
  const showDot = item.unread === true && !isOlder
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: 12, paddingLeft: 24, paddingRight: 16, paddingTop: 4, paddingBottom: 4,
      opacity: isOlder ? 0.5 : 1,
    }}>
      {item.actor && <Avatar actor={item.actor} />}
      <span style={{
        flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500,
        color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px', lineHeight: '18px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {item.title}
      </span>
      <span style={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>
        {item.time}
      </span>
      {showDot
        ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: DOT_COLOR, flexShrink: 0 }} />
        : <div style={{ width: 6, flexShrink: 0 }} />}
    </div>
  )
}

// ─── Upcoming row ─────────────────────────────────────────────────────────────

function UpcomingRow({ item }: { item: Item }) {
  const isToday = item.group === 'today'
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: 12, paddingLeft: 24, paddingRight: 16, paddingTop: 8, paddingBottom: 8,
      opacity: isToday ? 1 : 0.5,
    }}>
      <Icon
        name={item.icon === 'mail' ? 'mail_outline' : 'notifications'}
        size={16}
        style={{ color: 'rgba(0,0,0,0.87)', flexShrink: 0 }}
      />
      <span style={{
        flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500,
        color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px', lineHeight: '18px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {item.title}
      </span>
      <span style={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>
        {item.time}
      </span>
      {isToday
        ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: DOT_COLOR, flexShrink: 0 }} />
        : <div style={{ width: 6, flexShrink: 0 }} />}
    </div>
  )
}

// ─── Group label ──────────────────────────────────────────────────────────────

function GroupLabel({ label }: { label: string }) {
  return (
    <div style={{ paddingLeft: 24, paddingTop: 8, paddingBottom: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: MUTED, lineHeight: '16px' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('notifications')

  const tabItems = ITEMS.filter(i => i.tab === activeTab)

  const grouped = (['today', 'week', 'older'] as const)
    .map(g => ({ key: g, label: GROUP_LABELS[g], items: tabItems.filter(i => i.group === g) }))
    .filter(g => g.items.length > 0)

  const notifCount = ITEMS.filter(i => i.tab === 'notifications' && i.unread).length
  const upcomingCount = ITEMS.filter(i => i.tab === 'upcoming').length

  return (
    <div className="flex flex-1 overflow-hidden" style={{ background: 'white' }}>
      {/* Left panel */}
      <div className="flex flex-col flex-shrink-0" style={{ width: 420, borderRight: '1px solid rgba(0,0,0,0.08)' }}>

        {/* Header */}
        <div className="flex items-center flex-shrink-0" style={{ paddingLeft: 16, paddingRight: 8, borderBottom: '1px solid rgba(0,0,0,0.08)', height: 48 }}>
          <div className="flex items-center flex-1" style={{ height: '100%' }}>
            {TABS.map(tab => {
              const count = tab.key === 'notifications' ? notifCount : upcomingCount
              return (
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
                  <span style={{ fontSize: 11, color: activeTab === tab.key ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.3)' }}>
                    {count}
                  </span>
                </button>
              )
            })}
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
        <div className="flex flex-col overflow-y-auto" style={{ paddingBottom: 12 }}>
          {grouped.map(group => (
            <div key={group.key}>
              <GroupLabel label={group.label} />
              {group.items.map(item =>
                activeTab === 'notifications'
                  ? <NotificationRow key={item.id} item={item} />
                  : <UpcomingRow key={item.id} item={item} />
              )}
            </div>
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
