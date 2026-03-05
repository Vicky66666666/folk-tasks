import { useState } from 'react'
import { Icon } from '../folk'

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = 'mention' | 'assignment' | 'followup' | 'reminder' | 'group-invite'
type Tab = 'inbox' | 'upcoming'
type AgeGroup = 'today' | 'week' | 'older'
type UpcomingGroup = 'this-week' | 'next-week' | 'later'

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
  time: string       // display label: "11m", "Yesterday", "Mar 10"…
  daysAgo: number    // 0 = today, 1–6 = this week, 7+ = older; negative = days from now (upcoming)
  status: Tab
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
  // ── Inbox ──────────────────────────────────────────────────────────────────
  {
    id: 1, type: 'mention', status: 'inbox', daysAgo: 0, time: '11m',
    actor: { name: 'Leslie Alexander', initials: 'LA', color: '#7c6fcd', image: 'https://i.pravatar.cc/150?img=47' },
    title: 'Leslie mentioned you on Jane Cooper',
  },
  {
    id: 2, type: 'followup', status: 'inbox', daysAgo: 0, time: 'Now', isFolk: true,
    title: 'Follow up with Tim Berners-Lee',
  },
  {
    id: 3, type: 'reminder', status: 'inbox', daysAgo: 0, time: '10 PM',
    title: 'Call John · Due today',
  },
  {
    id: 4, type: 'assignment', status: 'inbox', daysAgo: 0, time: '2h',
    actor: { name: 'Wilsey', initials: 'W', color: '#3b82f6' },
    title: 'Wilsey assigned you to John doe',
  },
  {
    id: 5, type: 'mention', status: 'inbox', daysAgo: 2, time: 'Yesterday',
    actor: { name: 'Julie', initials: 'J', color: '#ef4444', image: 'https://i.pravatar.cc/150?img=5' },
    title: 'Julie mentioned you on Sarah Connor',
  },
  {
    id: 6, type: 'followup', status: 'inbox', daysAgo: 3, time: 'Feb 18', isFolk: true,
    title: 'Follow up with Marc Andreessen',
  },
  {
    id: 7, type: 'group-invite', status: 'inbox', daysAgo: 5, time: 'Feb 16',
    actor: { name: 'Sarah', initials: 'S', color: '#10b981', image: 'https://i.pravatar.cc/150?img=9' },
    title: 'Sarah invited you to 🇩🇪 Berlin Dinner',
  },
  {
    id: 8, type: 'followup', status: 'inbox', daysAgo: 12, time: 'Feb 9', isFolk: true,
    title: 'Follow up with Elon Musk',
  },
  {
    id: 9, type: 'mention', status: 'inbox', daysAgo: 14, time: 'Feb 7',
    actor: { name: 'Tom', initials: 'T', color: '#f59e0b' },
    title: 'Tom mentioned you on Kevin Park',
  },

  // ── Upcoming (reminders only) — daysAgo is negative: -N = N days from now ──
  { id: 10, type: 'reminder', status: 'upcoming', daysAgo: -2,  time: 'Mar 7',  title: 'Call with Benjamin' },
  { id: 11, type: 'reminder', status: 'upcoming', daysAgo: -3,  time: 'Mar 8',  title: 'Send NDA to Stripe' },
  { id: 15, type: 'reminder', status: 'upcoming', daysAgo: -5,  time: 'Mar 10', title: 'Intro call with Y Combinator' },
  { id: 16, type: 'reminder', status: 'upcoming', daysAgo: -8,  time: 'Mar 13', title: 'Follow up with Kevin Park' },
  { id: 17, type: 'reminder', status: 'upcoming', daysAgo: -9,  time: 'Mar 14', title: 'Review partnership proposal with Acme' },
  { id: 18, type: 'reminder', status: 'upcoming', daysAgo: -11, time: 'Mar 16', title: 'Prepare Q2 pipeline report' },
  { id: 19, type: 'reminder', status: 'upcoming', daysAgo: -13, time: 'Mar 18', title: 'Sync with Berlin Dinner attendees' },
  { id: 12, type: 'reminder', status: 'upcoming', daysAgo: -18, time: 'Mar 23', title: 'Quarterly review with Sarah' },
  { id: 20, type: 'reminder', status: 'upcoming', daysAgo: -22, time: 'Mar 27', title: 'Call with Series B investors' },
  { id: 21, type: 'reminder', status: 'upcoming', daysAgo: -35, time: 'Apr 9',  title: 'Update CRM with Hong Kong contacts' },
  { id: 22, type: 'reminder', status: 'upcoming', daysAgo: -42, time: 'Apr 16', title: 'Follow up with Marc Andreessen' },

  // ── Done ───────────────────────────────────────────────────────────────────
  {
    id: 13, type: 'mention', status: 'done', daysAgo: 18, time: 'Feb 3',
    actor: { name: 'Leslie Alexander', initials: 'LA', color: '#7c6fcd', image: 'https://i.pravatar.cc/150?img=47' },
    title: 'Leslie mentioned you on Kate Williams',
  },
  {
    id: 14, type: 'reminder', status: 'done', daysAgo: 20, time: 'Feb 1',
    title: 'Call with Andrew',
  },
]

const TABS: { key: Tab; label: string }[] = [
  { key: 'inbox',    label: 'Inbox' },
  { key: 'upcoming', label: 'Upcoming' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAgeGroup(daysAgo: number): AgeGroup {
  if (daysAgo === 0) return 'today'
  if (daysAgo < 7)  return 'week'
  return 'older'
}

function getUpcomingGroup(daysAgo: number): UpcomingGroup {
  const n = -daysAgo // positive days from now
  if (n <= 6)  return 'this-week'
  if (n <= 13) return 'next-week'
  return 'later'
}

const AGE_LABELS: Record<AgeGroup, string> = {
  today: 'Today',
  week:  'This week',
  older: 'Older',
}

const UPCOMING_LABELS: Record<UpcomingGroup, string> = {
  'this-week': 'This week',
  'next-week': 'Next week',
  'later':     'Later',
}

// ─── Shared color ─────────────────────────────────────────────────────────────

const MUTED = 'rgba(0,0,0,0.61)'

// ─── Item icon ────────────────────────────────────────────────────────────────

function ItemIcon({ item }: { item: InboxItem }) {
  const dim = MUTED
  if (item.actor && (item.type === 'mention' || item.type === 'assignment' || item.type === 'group-invite')) {
    return (
      <div style={{
        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
        background: item.actor.color, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 8, fontWeight: 600, color: 'white',
      }}>
        {item.actor.image
          ? <img src={item.actor.image} alt={item.actor.initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : item.actor.initials}
      </div>
    )
  }
  if (item.type === 'followup') {
    return <Icon name="mail_outline" size={16} style={{ color: dim, flexShrink: 0 }} />
  }
  return <Icon name="check_box" size={16} style={{ color: dim, flexShrink: 0 }} />
}

// ─── Hover actions ────────────────────────────────────────────────────────────

function HoverActions({ type }: { type: ItemType }) {
  return (
    <div style={{
      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
      background: 'white',
      boxShadow: '0 1px 6px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.07)',
      borderRadius: 6, display: 'flex', alignItems: 'center', padding: 2, zIndex: 2,
    }}>
      {ACTIONS[type].map(action => (
        <button
          key={action.label} title={action.label}
          onClick={e => e.stopPropagation()}
          style={{ width: 26, height: 26, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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

function InboxItemRow({ item }: { item: InboxItem }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        gap: 10, padding: '6px 16px', cursor: 'pointer',
        background: hovered ? 'rgba(0,0,0,0.02)' : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ItemIcon item={item} />
      <span style={{
        flex: 1, minWidth: 0, fontSize: 13,
        color: 'rgba(0,0,0,0.87)',
        letterSpacing: '-0.04px', lineHeight: '18px',
        fontWeight: 400,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {item.title}
      </span>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
        opacity: hovered ? 0 : 1, transition: 'opacity 0.1s',
      }}>
        <span style={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap' }}>
          {item.time}
        </span>
      </div>
      {hovered && <HoverActions type={item.type} />}
    </div>
  )
}

// ─── Group label ──────────────────────────────────────────────────────────────

function GroupLabel({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px 4px' }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: MUTED, letterSpacing: '-0.04px' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('inbox')

  const tabItems = ITEMS.filter(i => {
    if (i.status !== activeTab) return false
    if (activeTab === 'upcoming') return i.type === 'reminder'
    return true
  })

  // Group items by tab
  const grouped: { key: string; label: string; items: InboxItem[] }[] =
    activeTab === 'inbox'
      ? (['today', 'week', 'older'] as AgeGroup[])
          .map(key => ({ key, label: AGE_LABELS[key], items: tabItems.filter(i => getAgeGroup(i.daysAgo) === key) }))
          .filter(g => g.items.length > 0)
      : (['this-week', 'next-week', 'later'] as UpcomingGroup[])
          .map(key => ({ key, label: UPCOMING_LABELS[key], items: tabItems.filter(i => getUpcomingGroup(i.daysAgo) === key) }))
          .filter(g => g.items.length > 0)

  const inboxCount = ITEMS.filter(i => i.status === 'inbox').length

  return (
    <div className="flex flex-1 overflow-hidden" style={{ background: 'white' }}>
      {/* Left panel */}
      <div className="flex flex-col flex-shrink-0" style={{ width: 420, borderRight: '1px solid rgba(0,0,0,0.08)' }}>

        {/* Header */}
        <div className="flex items-center flex-shrink-0" style={{ paddingLeft: 16, paddingRight: 8, borderBottom: '1px solid rgba(0,0,0,0.08)', height: 48 }}>
          <div className="flex items-center flex-1" style={{ height: '100%', gap: 0 }}>
            {TABS.map(tab => {
              const count = tab.key === 'inbox' ? inboxCount : ITEMS.filter(i => i.status === tab.key && i.type === 'reminder').length
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
              {group.label && <GroupLabel label={group.label} />}
              {group.items.map(item => (
                <InboxItemRow key={item.id} item={item} />
              ))}
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
