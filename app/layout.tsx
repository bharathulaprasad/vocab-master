import './globals.css'
import { Providers } from './providers'
import ThemeToggle from '../components/ThemeToggle'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {/* Top Navigation Bar containing the Theme Button */}
          <nav className="w-full p-4 flex justify-end">
            <ThemeToggle />
          </nav>
          
          {children}
        </Providers>
      </body>
    </html>
  )
}