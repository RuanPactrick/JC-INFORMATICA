import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  CheckCircle2,
  Clock,
  FileText,
  Tags,
  Plus,
  ArrowRight,
  TrendingUp
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (err) {
        console.error('Falha ao carregar métricas:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-navy via-[#14122b] to-brand-navy p-6 md:p-8 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-white/10">
        <div>
          <span className="text-xs font-bold text-brand-purple tracking-widest uppercase mb-1 block">
            Painel Administrativo
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Bem-vindo ao Gerenciador JC Informática
          </h1>
          <p className="text-sm text-gray-300 mt-1 max-w-xl">
            Edite preços, lance produtos, altere visibilidade e veja o resultado na loja pública em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple hover:bg-brand-purpleHover text-white text-sm font-bold rounded-xl shadow-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Produto
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Publicados */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Na Loja (Publicados)
            </span>
            <div className="text-3xl font-extrabold text-gray-900 mt-1">
              {loading ? '--' : stats?.publishedCount || 0}
            </div>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">
              Visíveis aos clientes
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Em Revisão */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Em Revisão
            </span>
            <div className="text-3xl font-extrabold text-amber-600 mt-1">
              {loading ? '--' : stats?.reviewCount || 0}
            </div>
            <span className="text-xs text-amber-600 font-medium mt-1 inline-block">
              Aguardando aprovação
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Rascunhos */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Rascunhos / Arquivados
            </span>
            <div className="text-3xl font-extrabold text-gray-700 mt-1">
              {loading ? '--' : (stats?.draftCount || 0) + (stats?.archivedCount || 0)}
            </div>
            <span className="text-xs text-gray-500 font-medium mt-1 inline-block">
              Itens pausados
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Categorias */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Categorias Ativas
            </span>
            <div className="text-3xl font-extrabold text-brand-purple mt-1">
              {loading ? '--' : stats?.categoriesCount || 0}
            </div>
            <span className="text-xs text-gray-500 font-medium mt-1 inline-block">
              Departamentos da loja
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
            <Tags className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Access Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Catálogo de Produtos</h3>
            <p className="text-sm text-gray-500 mt-1">
              Veja a listagem completa, filtre por categoria, altere preços e ative ou desative itens instantaneamente.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-semibold">
              Total: {stats?.totalProducts || 0} produtos
            </span>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-purple hover:text-brand-purpleHover transition-colors"
            >
              Gerenciar Produtos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Adicionar Novo Item</h3>
            <p className="text-sm text-gray-500 mt-1">
              Cadastre peças, computadores prontos ou periféricos preenchendo valor à vista, parcelamento e foto.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-semibold">Publicação imediata</span>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-purple hover:text-brand-purpleHover transition-colors"
            >
              Abrir Formulário
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
