import { Minus, Settings, X } from 'lucide-react'

interface HeaderProps {
  onCollapse: () => void
  onSettings: () => void
  onClose: () => void
}

// `-webkit-app-region` is Electron-specific and not in the standard CSS types,
// so cast it. (The `no-drag` class in main.css also sets it.)
const NO_DRAG = { WebkitAppRegion: 'no-drag' } as React.CSSProperties

export default function Header({ onCollapse, onSettings, onClose }: HeaderProps): React.JSX.Element {
  return (
    <div className="drag-region flex items-center justify-between px-3 py-2 select-none">
      <div className="flex items-center gap-1 text-white/90 font-semibold tracking-tight">
        <span className="text-[15px]">smog</span>
        <span className="text-accent leading-none">.</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Collapse to tray"
          onClick={onCollapse}
          style={NO_DRAG}
          className="no-drag rounded-md p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          title="Settings"
          onClick={onSettings}
          style={NO_DRAG}
          className="no-drag rounded-md p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Settings size={16} />
        </button>
        <button
          type="button"
          title="Quit"
          onClick={onClose}
          style={NO_DRAG}
          className="no-drag rounded-md p-1.5 text-white/70 hover:text-red-300 hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
