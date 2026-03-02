import { Icon } from '../folk'

function Field({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>{label}</span>
      <span
        className="text-xs"
        style={{
          color: isLink ? 'var(--folk-text-link)' : 'var(--folk-text-primary)',
          fontSize: 13,
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
      className="flex items-center gap-1 px-2 h-7 rounded text-xs cursor-pointer"
      style={{
        border: '1px solid var(--folk-btn-neutral-border)',
        background: 'var(--folk-btn-neutral-bg)',
        color: 'var(--folk-btn-neutral-text)',
        fontSize: 12,
        fontWeight: 500,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-btn-neutral-bg-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--folk-btn-neutral-bg)')}
    >
      {icon && <Icon name={icon} size={13} className="text-gray-11" />}
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
      {/* Header */}
      <div
        className="flex items-center gap-1 px-4 h-12"
        style={{ borderBottom: '1px solid var(--folk-separator)', flexShrink: 0 }}
      >
        <span className="text-xs" style={{ color: 'var(--folk-text-muted)' }}>🟡 Leads</span>
        <Icon name="chevron_right" size={13} className="text-gray-8" />
        <span className="text-xs" style={{ color: 'var(--folk-text-primary)', fontWeight: 500 }}>Jane Cooper</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            className="flex items-center gap-1 px-2 h-6 rounded text-xs"
            style={{
              color: 'var(--folk-text-muted)',
              border: '1px solid var(--folk-separator)',
              background: 'transparent',
              fontSize: 11,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--folk-bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Icon name="link" size={12} className="text-gray-9" />
            <span>Copy link</span>
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center rounded"
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
          <div
            className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-lg font-semibold flex-shrink-0"
            style={{
              background: 'var(--folk-bg-selected)',
              color: 'var(--folk-text-primary)',
              border: '1px solid var(--folk-separator)',
            }}
          >
            JC
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold" style={{ color: 'var(--folk-text-primary)', fontSize: 15 }}>Jane Cooper</span>
            <div className="flex items-center gap-1">
              <span className="text-xs">🍎</span>
              <span className="text-xs" style={{ color: 'var(--folk-text-muted)' }}>Apple</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-wrap">
          <ActionBtn icon="bolt" label="Enrich" />
          <ActionBtn icon="mail" label="Email" />
          <ActionBtn icon="chat" />
          <ActionBtn icon="more_horiz" />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--folk-separator)' }} />

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>Status</span>
            <div>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--folk-bg-selected)',
                  color: 'var(--folk-text-primary)',
                  fontSize: 11,
                }}
              >
                Qualified
              </span>
            </div>
          </div>
          <Field label="Email" value="jane@acme.com" isLink />
          <Field label="Phone" value="(684) 555-0102" />
          <Field label="Address" value="4517 Washington Ave. Manchester, Kentucky 39245" />
          <Field label="Job title" value="CEO" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: 'var(--folk-text-muted)', fontSize: 11 }}>URL</span>
            <div className="flex items-center gap-1">
              <span className="text-xs">🍎</span>
              <span className="text-xs font-medium" style={{ color: 'var(--folk-text-primary)' }}>Apple</span>
              <span className="text-xs" style={{ color: 'var(--folk-text-link)', cursor: 'pointer' }}>Apple.co</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
