import { Outlet, NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  LayoutTemplate,
  ExternalLink,
  Store
} from 'lucide-react'

export default function AdminLayout() {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-navy text-white flex flex-col shrink-0 border-r border-white/5">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-purple flex items-center justify-center font-black text-white text-lg tracking-wider shadow-md">
              JC
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wide block leading-none text-white">
                ADMIN STORE
              </span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                Painel Interno
              </span>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Package className="w-4 h-4" />
            Produtos
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Tags className="w-4 h-4" />
            Categorias
          </NavLink>

          <NavLink
            to="/admin/homepage"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <LayoutTemplate className="w-4 h-4" />
            Página Inicial
          </NavLink>
        </nav>

        {/* Footer info & Storefront link */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-brand-purple" />
              Ver Loja Pública
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span>JC Informática</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Administração</span>
          </div>

          <div className="flex items-center gap-4">
            {isLocal ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● Servidor Local Ativo (SQLite)
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                ☁️ Vercel (Modo Visualização)
              </span>
            )}
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
