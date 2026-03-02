import { Icon } from '../folk'

function NavItem({
  icon, label, count, active, emoji
}: {
  icon?: string; label: string; count?: number; active?: boolean; emoji?: string
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 h-7 rounded cursor-pointer group"
      style={{
        background: active ? 'var(--folk-bg-selected)' : 'transparent',
        color: active ? 'var(--folk-text-primary)' : 'var(--folk-text-muted)',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--folk-bg-hover)' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {emoji && <span className="text-xs w-4 text-center leading-none">{emoji}</span>}
      {icon && !emoji && (
        <Icon name={icon} size={14} className={active ? 'text-gray-12' : 'text-gray-9'} />
      )}
      <span className="text-xs flex-1" style={{ fontWeight: active ? 500 : 400 }}>{label}</span>
      {count !== undefined && (
        <span
          className="text-xs px-1 rounded min-w-[18px] text-center"
          style={{
            background: count > 0 ? '#e5484d' : 'var(--folk-bg-selected)',
            color: count > 0 ? '#fff' : 'var(--folk-text-muted)',
            fontSize: 10,
            fontWeight: 500,
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
    <div className="px-3 pt-3 pb-1">
      <span className="text-xs font-medium" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{label}</span>
    </div>
  )
}

function Divider() {
  return <div className="mx-3 my-1" style={{ height: 1, background: 'var(--folk-separator)' }} />
}

export function Sidebar() {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        width: 176,
        background: 'var(--folk-surface-default)',
        borderRight: '1px solid var(--folk-separator)',
        flexShrink: 0,
      }}
    >
      {/* Workspace */}
      <div className="flex items-center gap-2 px-3 h-12" style={{ borderBottom: '1px solid var(--folk-separator)' }}>
        <div
          className="w-5 h-5 rounded flex items-center justify-center text-xs"
          style={{ background: 'var(--folk-bg-selected)' }}
        >
          <span>🍎</span>
        </div>
        <span className="text-sm font-medium flex-1" style={{ color: 'var(--folk-text-primary)' }}>Apple</span>
        <Icon name="expand_more" size={14} className="text-gray-9" />
      </div>

      {/* Main nav */}
      <div className="flex flex-col gap-0.5 py-2 px-1">
        <NavItem icon="search" label="Search" />
        <NavItem icon="notifications" label="Notifications" count={6} />
        <NavItem icon="mail" label="Messages" />
        <NavItem icon="check_box" label="Tasks" count={6} />
        <NavItem icon="bar_chart" label="Dashboards" />
        <NavItem icon="smart_toy" label="folk assistants" />
      </div>

      <Divider />

      {/* Lists */}
      <div className="flex flex-col gap-0.5 py-1 px-1">
        <NavItem emoji="🟡" label="Beta 2024: Attendees" />
        <NavItem icon="business" label="Companies" active emoji="🏢" />
        <div className="pl-4 flex flex-col gap-0.5">
          <NavItem emoji="🇩🇪" label="Hong Kong" />
          <NavItem emoji="🇬🇧" label="London" />
          <NavItem icon="flag" label="2024 followups" emoji="📋" />
        </div>
        <div className="px-3">
          <span className="text-xs cursor-pointer" style={{ color: 'var(--folk-text-muted)' }}>··· See all</span>
        </div>
      </div>

      <Divider />

      <SectionLabel label="Shared" />
      <div className="flex flex-col gap-0.5 py-1 px-1">
        <NavItem emoji="🟡" label="Suggestions: Berlin Dinner" />
      </div>

      <SectionLabel label="Private" />
      <div className="flex flex-col gap-0.5 py-1 px-1">
        <NavItem emoji="🇩🇪" label="Zurich Dinner, 27.02.25" />
        <NavItem emoji="🇸🇦" label="Riyadh-Dinner 27.01.2025" />
        <NavItem emoji="🏔️" label="Summit-Speakers (GP)" />
        <NavItem emoji="🇩🇪" label="Suggestions: Frankfurt" />
        <NavItem emoji="💰" label="All VCs" />
        <div className="px-3">
          <span className="text-xs cursor-pointer" style={{ color: 'var(--folk-text-muted)' }}>··· See all</span>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto">
        <Divider />
        <div className="flex flex-col gap-0.5 py-2 px-1">
          <NavItem icon="settings" label="Settings" />
          <NavItem icon="person_add" label="Invite members" />
        </div>
      </div>
    </div>
  )
}
