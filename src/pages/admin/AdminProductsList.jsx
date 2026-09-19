import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  Archive,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from 'lucide-react'

import categoriesData from '../../data/categories.json'
import productsData from '../../data/products.json'

function formatPrice(cents) {
  if (cents == null) return 'R$ 0,00'
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const STATUS_CONFIG = {
  PUBLISHED: {
    label: 'Publicado',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2
  },
  REVIEW: {
    label: 'Em Revisão',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock
  },
  DRAFT: {
    label: 'Rascunho',
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: FileText
  },
  ARCHIVED: {
    label: 'Arquivado',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: Archive
  }
}

export default function AdminProductsList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [deletingId, setDeletingId] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (categoryFilter !== 'ALL') params.append('categoryId', categoryFilter)
      if (searchTerm) params.append('search', searchTerm)

      const [prodsRes, catsRes] = await Promise.all([
        fetch(`/api/admin/products?${params.toString()}`),
        fetch('/api/admin/categories')
      ])

      let liveSuccess = false
      if (prodsRes.ok && catsRes.ok) {
        try {
          const prods = await prodsRes.json()
          const cats = await catsRes.json()
          if (Array.isArray(prods) && Array.isArray(cats)) {
            setProducts(prods)
            setCategories(cats)
            liveSuccess = true
            setIsDemoMode(false)
          }
        } catch {
          // Response wasn't JSON
        }
      }

      if (!liveSuccess) {
        setIsDemoMode(true)
        let filtered = productsData.map(p => ({
          ...p,
          status: p.status || 'PUBLISHED',
          category: categoriesData.find(c => c.id === p.category) || null,
          installmentCount: p.installmentCount || p.installment?.count || 12,
          installmentAmount: p.installmentAmount || p.installment?.amountCents || Math.round(p.priceCents / 12)
        }))
        if (statusFilter !== 'ALL') filtered = filtered.filter(p => p.status === statusFilter)
        if (categoryFilter !== 'ALL') filtered = filtered.filter(p => (p.category?.id === categoryFilter || p.category === categoryFilter))
        if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setProducts(filtered)
        setCategories(categoriesData)
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
      setIsDemoMode(true)
      setProducts(productsData.map(p => ({
        ...p,
        status: 'PUBLISHED',
        category: categoriesData.find(c => c.id === p.category) || null
      })))
      setCategories(categoriesData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [statusFilter, categoryFilter])

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const showFeedback = (msg, type = 'success') => {
    setFeedbackMessage({ text: msg, type })
    setTimeout(() => setFeedbackMessage(null), 4000)
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setProducts(prev =>
          prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
        )
        showFeedback(`Status atualizado para ${STATUS_CONFIG[newStatus]?.label || newStatus}!`)
      } else {
        showFeedback('Falha ao atualizar status', 'error')
      }
    } catch (err) {
      showFeedback('Erro de conexão ao alterar status', 'error')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${name}"? Esta ação removerá o produto do banco de dados.`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id))
        showFeedback(`Produto "${name}" excluído com sucesso!`)
      } else {
        showFeedback('Falha ao excluir produto', 'error')
      }
    } catch (err) {
      showFeedback('Erro de conexão ao excluir', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Produtos do Catálogo</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie itens, preços, fotos, disponibilidade e publicação imediata na loja pública.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-brand-purple transition-colors shadow-sm"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-purple hover:bg-brand-purpleHover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Produto
          </Link>
        </div>
      </div>

      {/* Demo Mode Notice if running on Vercel without cloud DB */}
      {isDemoMode && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-900 text-sm shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Aviso: Acesso pelo Vercel (Modo Visualização)</span>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              O catálogo abaixo está em modo de leitura a partir dos dados do projeto. Para criar, editar e excluir produtos no banco de dados SQLite persistente, inicie o projeto no seu computador com <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-900">npm run dev</code> e acesse <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-900">http://localhost:5173/admin</code>.
            </p>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between text-sm font-medium border ${
            feedbackMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 underline ml-4"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome do produto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
            >
              <option value="ALL">Todos os status</option>
              <option value="PUBLISHED">Publicados</option>
              <option value="REVIEW">Em Revisão</option>
              <option value="DRAFT">Rascunho</option>
              <option value="ARCHIVED">Arquivados</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer max-w-[200px]"
            >
              <option value="ALL">Todas as categorias</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-purple mb-3" />
            <p className="text-sm font-medium">Carregando catálogo...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Nenhum produto encontrado</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
                ? 'Tente ajustar os filtros ou o termo de busca para encontrar itens.'
                : 'Você ainda não cadastrou nenhum produto no banco de dados.'}
            </p>
            <div className="mt-5">
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-lg hover:bg-brand-purpleHover transition-colors"
              >
                <Plus className="w-4 h-4" />
                Criar primeiro produto
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-20">Foto</th>
                  <th className="py-3.5 px-4">Produto & Slug</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4">Preço à Vista</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Selos</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {products.map(product => {
                  const statusConf = STATUS_CONFIG[product.status] || STATUS_CONFIG.DRAFT
                  const StatusIcon = statusConf.icon

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/75 transition-colors">
                      {/* Product Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={e => {
                                e.target.onerror = null
                                e.target.src = 'https://placehold.co/100x100?text=Sem+Foto'
                              }}
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold">Sem foto</span>
                          )}
                        </div>
                      </td>

                      {/* Name & Slug */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-md">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="font-semibold text-gray-900 hover:text-brand-purple transition-colors line-clamp-1 text-sm"
                            title={product.name}
                          >
                            {product.name}
                          </Link>
                          <div className="text-xs text-gray-500 font-mono mt-0.5 truncate">
                            /{product.slug}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        {product.category ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            {product.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Sem categoria</span>
                        )}
                      </td>

                      {/* Price & Installments */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">
                          {formatPrice(product.priceCents)}
                        </div>
                        {product.installmentCount && product.installmentAmount ? (
                          <div className="text-xs text-gray-500 font-medium">
                            {product.installmentCount}x de {formatPrice(product.installmentAmount)}
                          </div>
                        ) : null}
                      </td>

                      {/* Status + Quick Switch */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            value={product.status}
                            onChange={e => handleStatusChange(product.id, e.target.value)}
                            className={`text-xs font-semibold py-1 px-2 rounded-md border shadow-sm cursor-pointer outline-none ${statusConf.bg}`}
                          >
                            <option value="PUBLISHED">Publicado</option>
                            <option value="REVIEW">Em Revisão</option>
                            <option value="DRAFT">Rascunho</option>
                            <option value="ARCHIVED">Arquivado</option>
                          </select>
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {product.promotion && (
                            <span className="bg-brand-magenta/10 text-brand-magenta text-[11px] font-bold px-2 py-0.5 rounded">
                              Oferta
                            </span>
                          )}
                          {product.isNew && (
                            <span className="bg-brand-neon/20 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
                              Novo
                            </span>
                          )}
                          {!product.promotion && !product.isNew && (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-gray-600 hover:text-brand-purple hover:bg-gray-100 rounded-md transition-colors"
                            title="Editar produto"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deletingId === product.id}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

