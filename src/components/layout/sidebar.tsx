import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Menu,
  ChevronLeft,
  BookOpen,
  UserCog,
  LogOut
} from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

const routes = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Patients', path: '/patients', icon: Users },
  { name: 'Appointments', path: '/appointments', icon: Calendar },
  { name: 'User Settings', path: '/settings', icon: UserCog },
]

export function Sidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [isCollapsed, isHovered])

  const isOpen = !isCollapsed || isHovered

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked')
  }

  return (
    <div
      className={cn(
        "relative h-full transition-all duration-200",
        isOpen ? "w-64" : "w-16"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn(
        "fixed h-full border-r bg-background transition-all duration-200",
        isOpen ? "w-64" : "w-16"
      )}>
        <div className="flex h-16 items-center justify-between px-4">
          {isOpen && (
            <Link to="/">
              <h2 className="text-lg font-semibold transition-opacity duration-200">MedVault</h2>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center transition-transform duration-200",
              !isOpen && "mx-auto"
            )}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <div className="space-y-2 py-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                location.pathname === route.path ? "bg-accent" : "transparent",
                !isOpen && "justify-center px-0"
              )}
            >
              <route.icon className={cn(
                "h-4 w-4 transition-all duration-200",
                isOpen && "mr-3"
              )} />
              {isOpen && (
                <span className="transition-opacity duration-200">
                  {route.name}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-32 w-full space-y-2">
          <Link
            to="/policies"
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              location.pathname === '/policies' ? "bg-accent" : "transparent",
              !isOpen && "justify-center px-0"
            )}
          >
            <BookOpen className={cn(
              "h-4 w-4 transition-all duration-200",
              isOpen && "mr-3"
            )} />
            {isOpen && (
              <span className="transition-opacity duration-200">
                Support & Policies
              </span>
            )}
          </Link>
        </div>

        <div className={cn(
          "absolute bottom-4 w-full space-y-5",
        )}>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center w-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-destructive",
              !isOpen && "justify-center px-0"
            )}
          >
            <LogOut className={cn(
              "h-4 w-4 transition-all duration-200",
              isOpen && "mr-3"
            )} />
            {isOpen && (
              <span className="transition-opacity duration-200">
                Logout
              </span>
            )}
          </button>

          <div className={cn(
            "flex items-center w-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            !isOpen && "justify-center px-0",
            isOpen && "justify-between"
          )}>
            <ThemeToggle />
            {isOpen && (
              <span className="text-sm text-muted-foreground transition-opacity duration-200">
                Toggle theme
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}