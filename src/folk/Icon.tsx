interface IconProps {
  /** Material Symbols Sharp icon name, e.g. "check", "arrow_forward", "close" */
  name: string
  /** Size in px — also controls optical size (opsz). Default: 16 */
  size?: number
  /** Weight 100–700. Default: 400 */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  /** Fill: 0 = outlined, 1 = filled. Default: 0 */
  fill?: 0 | 1
  /** Extra Tailwind classes, e.g. "text-gray-11 hover:text-gray-12" */
  className?: string
}

export function Icon({ name, size = 16, weight = 400, fill = 0, className }: IconProps) {
  return (
    <span
      className={`folk-icon${className ? ` ${className}` : ''}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
