import { Sidebar } from './components/Sidebar'
import { ContactPanel } from './components/ContactPanel'
import { TasksPanel } from './components/TasksPanel'
import { Icon } from './folk'

function TopBar() {
  return (
    <div
      className="flex items-center flex-shrink-0"
      style={{
        height: 48,
        paddingLeft: 16,
        paddingRight: 12,
        gap: 6,
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        background: 'white',
      }}
    >
      <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.61)', cursor: 'pointer' }}>🟡 Leads</span>
      <Icon name="chevron_right" size={12} style={{ color: 'rgba(0,0,0,0.3)' }} />
      <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.87)', fontWeight: 500, letterSpacing: '-0.04px' }}>
        Jane Cooper
      </span>
      <div className="ml-auto flex items-center" style={{ gap: 4 }}>
        <button
          className="flex items-center"
          style={{
            gap: 4,
            height: 24,
            paddingLeft: 8,
            paddingRight: 8,
            border: '1px solid rgba(0,0,0,0.12)',
            background: 'white',
            borderRadius: 100,
            fontSize: 11,
            color: 'rgba(0,0,0,0.61)',
            cursor: 'pointer',
            boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.04)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'white')}
        >
          <Icon name="link" size={11} style={{ color: 'rgba(0,0,0,0.61)' }} />
          <span>Copy link</span>
        </button>
        <button
          className="flex items-center justify-center"
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Icon name="more_horiz" size={15} style={{ color: 'rgba(0,0,0,0.61)' }} />
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <ContactPanel />
          <TasksPanel />
        </div>
      </div>
    </div>
  )
}

export default App
