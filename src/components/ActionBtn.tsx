import { Icon } from '../folk'

/** Shared pill button — matches the ContactPanel design language */
export function ActionBtn({
  icon, label, onClick,
}: {
  icon?: string
  label?: string
  onClick?: () => void
}) {
  const isIconOnly = !!icon && !label
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        border: '1px solid rgba(0,0,0,0.27)',
        background: 'white',
        color: 'rgba(0,0,0,0.87)',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '-0.04px',
        borderRadius: 100,
        boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.06)',
        height: 28,
        paddingLeft:  isIconOnly ? 7 : 10,
        paddingRight: isIconOnly ? 7 : 10,
        cursor: 'pointer',
        fontFamily: 'inherit',
        flexShrink: 0,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
    >
      {icon  && <Icon name={icon}  size={14} style={{ color: 'rgba(0,0,0,0.61)' }} />}
      {label && <span>{label}</span>}
    </button>
  )
}
