interface SidebarHeaderProps {
  title: string
  description: string | null
  isPublished: boolean
}

export default function SidebarHeader({
  title,
  description,
  isPublished,
}: SidebarHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-xs text-white/40">
          {isPublished ? '✅ Published' : 'Unpublished'}
        </span>
      </div>
      {description && (
        <p className="text-sm text-white/50">{description}</p>
      )}
    </div>
  )
}
