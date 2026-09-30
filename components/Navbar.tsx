import Link from 'next/link'
import { getRole } from '@/lib/getRole'
import LogoutButton from '@/components/LogoutButton'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/machines', label: 'เครื่องจักร' },
  { href: '/alarms', label: 'Alarm' },
  { href: '/maintenance', label: 'ซ่อมบำรุง' },
]

export default async function Navbar() {
  const role = await getRole()
  if (!role) return null

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="font-bold text-blue-400">🛠 Machine Maintenance</span>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-slate-300 hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
            {role}
          </span>
          <LogoutButton />
        </div>
      </nav>
    </header>
  )
}