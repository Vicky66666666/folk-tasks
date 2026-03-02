import { Sidebar } from './components/Sidebar'
import { ContactPanel } from './components/ContactPanel'
import { TasksPanel } from './components/TasksPanel'

function App() {
  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: 'var(--folk-surface-subdued)', fontFamily: 'Inter, sans-serif' }}
    >
      <Sidebar />
      <ContactPanel />
      <TasksPanel />
    </div>
  )
}

export default App
