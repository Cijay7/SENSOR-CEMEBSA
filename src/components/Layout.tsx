import { NavLink, Outlet } from 'react-router-dom'
import { Home, Activity, Settings, Database, Info, Gauge } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/realtime', icon: Activity, label: 'Realtime Data' },
  { to: '/calibration', icon: Settings, label: 'Calibration' },
  { to: '/datalog', icon: Database, label: 'Data Log' },
  { to: '/about', icon: Info, label: 'About' },
]

export function Layout() {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    handleSwipe()
  }

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50 // minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - next item
        setActiveIndex((prev) => (prev + 1) % navItems.length)
      } else {
        // Swipe right - previous item
        setActiveIndex((prev) => (prev - 1 + navItems.length) % navItems.length)
      }
    }
  }

  // Auto navigate when clicking
  const handleNavClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header - Hidden on Mobile, Visible on Desktop */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
                <Gauge className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Dashboard Sensor
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Header - Mobile with Logo only */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Dashboard Sensor
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:pt-16 pt-16 pb-24 md:pb-8 flex-1 min-h-screen" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700">
        <div className="flex justify-around items-center">
          {navItems.map(({ to, icon: Icon, label }, index) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => handleNavClick(index)}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-3 px-4 flex-1 transition-all duration-200 ${
                  isActive
                    ? 'text-blue-400 border-t-2 border-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`
              }
              title={label}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-slate-800 border-t border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm">
            {/* © 2024 Dashboard Sensor. Powered by Supabase & React. */}
            Taroh apaan yak
          </p>
        </div>
      </footer>
    </div>
  )
}
