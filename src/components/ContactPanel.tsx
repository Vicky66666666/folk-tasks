import { Icon } from '../folk'

function Field({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{label}</span>
      <span
        style={{
          color: isLink ? 'var(--folk-text-link)' : 'var(--folk-text-primary)',
          fontSize: 13,
          lineHeight: '18px',
          cursor: isLink ? 'pointer' : 'default',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function ActionBtn({ icon, label }: { icon?: string; label?: string }) {
  return (
    <button
      className="flex items-center gap-1 px-2 h-7 cursor-pointer"
      style={{
        border: '1px solid var(--folk-separator)',
        background: 'white',
        color: 'var(--folk-text-primary)',
        fontSize: 12,
        fontWeight: 500,
        borderRadius: 100,
        boxShadow: '0px 1px 1px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-bg-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
    >
      {icon && <Icon name={icon} size={13} className="text-gray-10" />}
      {label && <span>{label}</span>}
    </button>
  )
}

export function ContactPanel() {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        width: 272,
        background: 'var(--folk-surface-default)',
        borderRight: '1px solid var(--folk-separator)',
        flexShrink: 0,
      }}
    >
      {/* Header breadcrumb */}
      <div
        className="flex items-center gap-1.5 px-4 h-12"
        style={{ borderBottom: '1px solid var(--folk-separator)', flexShrink: 0 }}
      >
        <span style={{ fontSize: 12, color: 'var(--folk-text-muted)' }}>🟡 Leads</span>
        <Icon name="chevron_right" size={12} className="text-gray-7" />
        <span style={{ fontSize: 12, color: 'var(--folk-text-primary)', fontWeight: 500 }}>Jane Cooper</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            className="flex items-center gap-1 px-2 h-6 cursor-pointer"
            style={{
              color: 'var(--folk-text-muted)',
              border: '1px solid var(--folk-separator)',
              background: 'white',
              fontSize: 11,
              borderRadius: 100,
              boxShadow: '0px 1px 1px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          >
            <Icon name="link" size={11} className="text-gray-8" />
            <span>Copy link</span>
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center rounded-md"
            style={{ color: 'var(--folk-text-muted)', background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Icon name="more_horiz" size={15} className="text-gray-9" />
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col gap-4 p-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?img=47"
            alt="Jane Cooper"
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 56, height: 56 }}
          />
          <div className="flex flex-col gap-1">
            <span style={{ color: 'var(--folk-text-primary)', fontSize: 16, fontWeight: 600, lineHeight: '20px' }}>
              Jane Cooper
            </span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 13 }}>🍎</span>
              <span style={{ fontSize: 13, color: 'var(--folk-text-muted)' }}>Apple</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <ActionBtn icon="bolt" label="Enrich" />
          <ActionBtn icon="mail" label="Email" />
          <ActionBtn icon="chat" />
          <ActionBtn icon="more_horiz" />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--folk-separator)', marginTop: -4 }} />

        {/* Status */}
        <div className="flex flex-col gap-1">
          <span style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>Status</span>
          <div>
            <span
              className="inline-flex items-center px-2 py-0.5"
              style={{
                background: 'var(--color-gray-3)',
                color: 'var(--folk-text-primary)',
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 6,
              }}
            >
              Qualified
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <Field label="Email" value="jane@acme.com" isLink />
          <Field label="Phone" value="(684) 555-0102" />
          <Field label="Address" value="4517 Washington Ave. Manchester, Kentucky 39295" />
          <Field label="Job title" value="CEO" />
          <div className="flex flex-col gap-0.5">
            <span style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>URL</span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 13 }}>🍎</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--folk-text-primary)' }}>Apple</span>
              <span style={{ fontSize: 13, color: 'var(--folk-text-link)', cursor: 'pointer' }}>Apple.co</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
