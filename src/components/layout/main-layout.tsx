import { Sidebar } from './sidebar'
import { UserNav } from './user-nav'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-50 h-16 border-b bg-background">
          <div className="container h-full flex items-center justify-end">
            <UserNav />
          </div>
        </header>
        <main className="container py-8">
          {children}
        </main>
      </div>
    </div>
  )
}