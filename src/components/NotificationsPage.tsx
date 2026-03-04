import { useState } from 'react'
import { Icon } from '../folk'

type Tab = 'all' | 'followups' | 'reminders' | 'mention'

interface Notification {
  id: number
  type: 'bell' | 'avatar'
  avatar?: { initials: string; color: string; image?: string }
  title: string
  subtitle?: string
  time: string
  unread?: boolean
}

const GROUPS: { label: string; items: Notification[] }[] = [
  {
    label: 'Today',
    items: [
      {
        id: 1, type: 'bell',
        title: 'Reminder in 📞 Call John',
        subtitle: 'Due Jan 4, 2026 10 PM',
        time: 'Just now', unread: true,
      },
      {
        id: 2, type: 'avatar',
        avatar: { initials: 'LA', color: '#7c6fcd', image: 'https://i.pravatar.cc/150?img=47' },
        title: 'Leslie Alexander mentioned you on Jane Cooper',
        time: '11m', unread: true,
      },
      {
        id: 3, type: 'bell',
        title: 'Call with Benjamin',
        time: '1h', unread: true,
      },
      {
        id: 4, type: 'avatar',
        avatar: { initials: 'W', color: '#3b82f6' },
        title: 'Wilsey assigned you to John doe',
        time: '2h', unread: true,
      },
    ],
  },
  {
    label: 'This week',
    items: [
      {
        id: 5, type: 'avatar',
        avatar: { initials: 'J', color: '#ef4444', image: 'https://i.pravatar.cc/150?img=5' },
        title: 'Julie mentioned you',
        time: 'Feb 18',
      },
      {
        id: 6, type: 'avatar',
        avatar: { initials: 'J', color: '#ef4444', image: 'https://i.pravatar.cc/150?img=5' },
        title: 'Julie mentioned you',
        time: 'Feb 20',
      },
    ],
  },
  {
    label: 'Older',
    items: [
      {
        id: 7, type: 'bell',
        title: 'Reminder in 📞 Call John',
        subtitle: 'Due Jan 4, 2026 10 PM',
        time: 'Jan 12',
      },
      {
        id: 8, type: 'avatar',
        avatar: { initials: 'LA', color: '#7c6fcd', image: 'https://i.pravatar.cc/150?img=47' },
        title: 'Leslie Alexander mentioned you on Jane Cooper',
        time: 'Jan 9',
      },
      {
        id: 9, type: 'bell',
        title: 'Call with Benjamin',
        time: 'Dec 30 2025',
      },
      {
        id: 10, type: 'avatar',
        avatar: { initials: 'W', color: '#3b82f6' },
        title: 'Wilsey assigned you to John doe',
        time: 'Dec 30 2025',
      },
    ],
  },
]

const TABS: { key: Tab; label: string; count: number }[] = [
  { key: 'all', label: 'All', count: 1 },
  { key: 'followups', label: 'Follow-ups', count: 1 },
  { key: 'reminders', label: 'Reminders', count: 1 },
  { key: 'mention', label: 'Mention', count: 1 },
]

function Avatar({ avatar }: { avatar: NonNullable<Notification['avatar']> }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: 24, height: 24, borderRadius: '50%',
        background: avatar.color,
        overflow: 'hidden',
        fontSize: 10, fontWeight: 600, color: 'white',
      }}
    >
      {avatar.image ? (
        <img src={avatar.image} alt={avatar.initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        avatar.initials
      )}
    </div>
  )
}

function BellIcon() {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{ width: 24, height: 24 }}
    >
      <Icon name="notifications" size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
    </div>
  )
}

function NotifItem({ item }: { item: Notification }) {
  const hasSubtitle = !!item.subtitle
  return (
    <div
      className="flex items-center"
      style={{
        gap: 10,
        padding: '6px 16px',
        cursor: 'pointer',
        alignItems: hasSubtitle ? 'flex-start' : 'center',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={hasSubtitle ? { marginTop: 3, flexShrink: 0 } : { flexShrink: 0 }}>
        {item.type === 'avatar' && item.avatar ? <Avatar avatar={item.avatar} /> : <BellIcon />}
      </div>
      <div className="flex flex-col flex-1 min-w-0" style={{ gap: 1 }}>
        <span
          style={{
            fontSize: 13,
            color: 'rgba(0,0,0,0.87)',
            lineHeight: '18px',
            letterSpacing: '-0.04px',
            fontWeight: item.unread ? 500 : 400,
          }}
        >
          {item.title}
        </span>
        {item.subtitle && (
          <span style={{ fontSize: 12, color: '#e54d2e', lineHeight: '16px' }}>
            {item.subtitle}
          </span>
        )}
      </div>
      <div
        className="flex items-center flex-shrink-0"
        style={{ gap: 6, alignSelf: hasSubtitle ? 'flex-start' : 'center', marginTop: hasSubtitle ? 3 : 0 }}
      >
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>{item.time}</span>
        {item.unread && (
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
        )}
      </div>
    </div>
  )
}

function GroupLabel({ label }: { label: string }) {
  return (
    <div style={{ padding: '8px 16px 4px' }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.04px' }}>
        {label}
      </span>
    </div>
  )
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all')

  return (
    <div className="flex flex-1 overflow-hidden" style={{ background: 'white' }}>
      {/* Left panel */}
      <div
        className="flex flex-col flex-shrink-0 overflow-hidden"
        style={{ width: 420, borderRight: '1px solid rgba(0,0,0,0.08)' }}
      >
        {/* Tabs */}
        <div
          className="flex items-center flex-shrink-0"
          style={{
            paddingLeft: 16, paddingRight: 8,
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            gap: 0,
            height: 48,
          }}
        >
          <div className="flex items-center flex-1" style={{ gap: 0, height: '100%' }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  height: '100%',
                  paddingLeft: 8,
                  paddingRight: 8,
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '1.5px solid rgba(0,0,0,0.87)' : '1.5px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: -1,
                }}
              >
                <span style={{
                  fontSize: 13,
                  color: activeTab === tab.key ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.5)',
                  fontWeight: activeTab === tab.key ? 500 : 400,
                  letterSpacing: '-0.04px',
                  whiteSpace: 'nowrap',
                }}>
                  {tab.label}
                </span>
                <span style={{
                  fontSize: 11,
                  color: activeTab === tab.key ? 'rgba(0,0,0,0.61)' : 'rgba(0,0,0,0.35)',
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center" style={{ gap: 2 }}>
            <button
              style={{ width: 24, height: 24, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Icon name="tune" size={14} style={{ color: 'rgba(0,0,0,0.4)' }} />
            </button>
            <button
              style={{ width: 24, height: 24, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Icon name="more_horiz" size={14} style={{ color: 'rgba(0,0,0,0.4)' }} />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex flex-col overflow-y-auto" style={{ paddingTop: 4, paddingBottom: 8 }}>
          {GROUPS.map(group => (
            <div key={group.label}>
              <GroupLabel label={group.label} />
              {group.items.map(item => <NotifItem key={item.id} item={item} />)}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center">
        <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.04px' }}>
          6 unread notifications
        </span>
      </div>
    </div>
  )
}
