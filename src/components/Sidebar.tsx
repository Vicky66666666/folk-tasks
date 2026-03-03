import { Icon } from '../folk'

function NavItem({
  icon, label, count, active, emoji
}: {
  icon?: string; label: string; count?: number; active?: boolean; emoji?: string
}) {
  return (
    <div
      className="flex items-center cursor-pointer"
      style={{
        gap: 8,
        height: 28,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 6,
        background: active ? 'rgba(0,0,0,0.04)' : 'transparent',
      }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)'
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      {emoji && (
        <span className="flex-shrink-0" style={{ fontSize: 13, width: 16, textAlign: 'center', lineHeight: 1 }}>
          {emoji}
        </span>
      )}
      {icon && !emoji && (
        <Icon name={icon} size={14} style={{ color: active ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.61)', flexShrink: 0 }} />
      )}
      <span
        className="flex-1 truncate"
        style={{
          fontSize: 13,
          fontWeight: active ? 500 : 400,
          color: active ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.61)',
          letterSpacing: '-0.04px',
          lineHeight: '18px',
        }}
      >
        {label}
      </span>
      {count !== undefined && (
        <span
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            background: count > 0 ? '#e5484d' : 'rgba(0,0,0,0.08)',
            color: count > 0 ? '#fff' : 'rgba(0,0,0,0.61)',
            fontSize: 10,
            fontWeight: 500,
            borderRadius: 100,
            minWidth: 16,
            height: 16,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          {count}
        </span>
      )}
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.61)', lineHeight: '16px' }}>{label}</span>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '4px 0' }} />
}

export function Sidebar() {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        width: 240,
        flexShrink: 0,
        background: 'white',
        borderRight: '1px solid rgba(0,0,0,0.12)',
      }}
    >
      {/* Workspace header */}
      <div
        className="flex items-center"
        style={{
          gap: 8,
          height: 48,
          paddingLeft: 12,
          paddingRight: 12,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 20, height: 20, borderRadius: 6, background: '#283544', fontSize: 12 }}
        >
          <span>🍎</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px' }}>
          Apple
        </span>
        <Icon name="expand_more" size={14} style={{ color: 'rgba(0,0,0,0.61)' }} />
      </div>

      {/* Main nav */}
      <div className="flex flex-col" style={{ gap: 2, padding: '8px 8px 4px' }}>
        <NavItem icon="search" label="Search" />
        <NavItem icon="notifications" label="Notifications" count={6} />
        <NavItem icon="mail" label="Messages" />
        <NavItem icon="check_box" label="Tasks" count={6} />
        <NavItem icon="bar_chart" label="Dashboards" />
        <NavItem icon="smart_toy" label="folk assistants" />
      </div>

      <Divider />

      {/* Groups */}
      <SectionLabel label="Shared to everyone" />
      <div className="flex flex-col" style={{ gap: 2, padding: '0 8px 4px' }}>
        <NavItem emoji="🟡" label="Beta 2024: Attendees" />
        <NavItem emoji="🔎" label="Companies" active />
        <div className="flex flex-col" style={{ gap: 2, paddingLeft: 16 }}>
          <NavItem emoji="🇩🇪" label="Hong Kong" />
          <NavItem emoji="🇬🇧" label="London" />
          <NavItem emoji="📬" label="2024 followups" />
        </div>
        <div style={{ paddingLeft: 8, paddingTop: 2, paddingBottom: 2 }}>
          <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.61)', cursor: 'pointer', letterSpacing: '-0.04px' }}>
            ··· See all
          </span>
        </div>
      </div>

      <Divider />

      <SectionLabel label="Shared" />
      <div className="flex flex-col" style={{ gap: 2, padding: '0 8px 4px' }}>
        <NavItem emoji="🟡" label="Suggestions: Berlin Dinner" />
      </div>

      <SectionLabel label="Private" />
      <div className="flex flex-col" style={{ gap: 2, padding: '0 8px 4px' }}>
        <NavItem emoji="🇩🇪" label="Zurich Dinner, 27.02.25" />
        <NavItem emoji="🇸🇦" label="Riyadh-Dinner 27.01.2025" />
        <NavItem emoji="🏔️" label="Summit-Speakers (GP)" />
        <NavItem emoji="🇩🇪" label="Suggestions: Frankfurt" />
        <NavItem emoji="💰" label="All VCs" />
        <div style={{ paddingLeft: 8, paddingTop: 2, paddingBottom: 2 }}>
          <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.61)', cursor: 'pointer', letterSpacing: '-0.04px' }}>
            ··· See all
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto">
        <Divider />
        <div className="flex flex-col" style={{ gap: 2, padding: '8px 8px' }}>
          <NavItem icon="settings" label="Settings" />
          <NavItem icon="person_add" label="Invite members" />
        </div>
      </div>
    </div>
  )
}
