import { Icon } from '../folk'

function Field({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="flex flex-col" style={{ gap: 2 }}>
      <span style={{ color: '#6f6f6f', fontSize: 12, fontWeight: 500, lineHeight: '16px' }}>{label}</span>
      <span
        style={{
          color: isLink ? '#0090ff' : 'rgba(0,0,0,0.87)',
          fontSize: 13,
          lineHeight: '18px',
          letterSpacing: '-0.04px',
          cursor: isLink ? 'pointer' : 'default',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function ActionBtn({ icon, label }: { icon?: string; label?: string }) {
  const isIconOnly = icon && !label
  return (
    <button
      className="flex items-center cursor-pointer flex-shrink-0"
      style={{
        gap: 6,
        border: '1px solid rgba(0,0,0,0.27)',
        background: 'white',
        color: 'rgba(0,0,0,0.87)',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '-0.04px',
        borderRadius: 100,
        boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.06)',
        height: 28,
        paddingLeft: isIconOnly ? 7 : 8,
        paddingRight: isIconOnly ? 7 : 10,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
    >
      {icon && <Icon name={icon} size={14} style={{ color: 'rgba(0,0,0,0.61)' }} />}
      {label && <span>{label}</span>}
    </button>
  )
}

export function ContactPanel() {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        width: 410,
        flexShrink: 0,
        background: 'white',
        borderRight: '1px solid rgba(0,0,0,0.12)',
      }}
    >
      <div className="flex flex-col" style={{ gap: 16, padding: 24 }}>

        {/* Avatar + name */}
        <div className="flex items-center" style={{ gap: 12 }}>
          <img
            src="https://i.pravatar.cc/150?img=47"
            alt="Jane Cooper"
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 56, height: 56 }}
          />
          <div className="flex flex-col" style={{ gap: 4 }}>
            <span
              style={{
                color: 'rgba(0,0,0,0.87)',
                fontSize: 20,
                fontWeight: 600,
                lineHeight: '24px',
                fontFamily: "'Uxum Grotesque', Inter, sans-serif",
              }}
            >
              Jane Cooper
            </span>
            <div className="flex items-center" style={{ gap: 4 }}>
              <span style={{ fontSize: 13 }}>🍎</span>
              <span style={{ fontSize: 13, color: '#646464', letterSpacing: '-0.04px' }}>Apple</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center flex-wrap" style={{ gap: 6 }}>
          <ActionBtn icon="bolt" label="Enrich" />
          <ActionBtn icon="mail" label="Email" />
          <ActionBtn icon="chat" />
          <ActionBtn icon="more_horiz" />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.12)' }} />

        {/* Status */}
        <div className="flex flex-col" style={{ gap: 4 }}>
          <span style={{ color: '#6f6f6f', fontSize: 12, fontWeight: 500, lineHeight: '16px' }}>Status</span>
          <div>
            <span
              className="inline-flex items-center"
              style={{
                background: 'rgba(0,0,0,0.12)',
                color: 'rgba(0,0,0,0.87)',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '-0.04px',
                borderRadius: 100,
                height: 20,
                paddingLeft: 6,
                paddingRight: 6,
              }}
            >
              Qualified
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col" style={{ gap: 20 }}>
          <Field label="Email" value="jane@acme.com" isLink />
          <Field label="Phone" value="(684) 555-0102" />
          <Field label="Address" value="4517 Washington Ave. Manchester, Kentucky 39295" />
          <Field label="Job title" value="CEO" />
          <div className="flex flex-col" style={{ gap: 2 }}>
            <span style={{ color: '#6f6f6f', fontSize: 12, fontWeight: 500, lineHeight: '16px' }}>URL</span>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span style={{ fontSize: 13 }}>🍎</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.04px' }}>
                Apple
              </span>
              <span style={{ fontSize: 13, color: '#0090ff', cursor: 'pointer', letterSpacing: '-0.04px' }}>
                Apple.co
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
