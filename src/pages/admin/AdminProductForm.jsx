import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Layers,
  DollarSign,
  Heart,
  ShoppingCart
} from 'lucide-react'

function formatPrice(cents) {
  if (!cents || isNaN(cents)) return 'R$ 0,00'
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    priceInput: '', // In Reais (e.g. "1399.00" or "1399,00")
    priceCents: 0,
    installmentCount: 12,
    installmentAmountInput: '',
    installmentAmount: 0,
    image: '',
    description: '',
    status: 'PUBLISHED',
    promotion: false,
    isNew: false
  })

  // Load Categories & Product (if editing)
  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await fetch('/api/admin/categories')
        if (catRes.ok) {
          const cats = await catRes.json()
          setCategories(cats)
          if (!isEditing && cats.length > 0 && !formData.categoryId) {
            setFormData(prev => ({ ...prev, categoryId: cats[0].id }))
          }
        }

        if (isEditing) {
          const prodRes = await fetch(`/api/admin/products/${id}`)
          if (!prodRes.ok) throw new Error('Produto não encontrado')
          const prod = await prodRes.json()

          setFormData({
            name: prod.name || '',
            slug: prod.slug || '',
            categoryId: prod.categoryId || '',
            priceInput: (prod.priceCents / 100).toFixed(2).replace('.', ','),
            priceCents: prod.priceCents || 0,
            installmentCount: prod.installmentCount || 12,
            installmentAmountInput: prod.installmentAmount
              ? (prod.installmentAmount / 100).toFixed(2).replace('.', ',')
              : '',
            installmentAmount: prod.installmentAmount || 0,
            image: prod.image || '',
            description: prod.description || '',
            status: prod.status || 'PUBLISHED',
            promotion: Boolean(prod.promotion),
            isNew: Boolean(prod.isNew)
          })
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  // Helper to parse currency string into integer cents
  const parseCurrencyToCents = val => {
    if (!val) return 0
    const clean = val.replace(/\s+/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.')
    const num = parseFloat(clean)
    if (isNaN(num)) return 0
    return Math.round(num * 100)
  }

  const handlePriceChange = e => {
    const val = e.target.value
    const cents = parseCurrencyToCents(val)
    // Auto calculate installments estimate if count is set
    const count = parseInt(formData.installmentCount, 10) || 12
    const estInstallment = Math.round(cents / count)

    setFormData(prev => ({
      ...prev,
      priceInput: val,
      priceCents: cents,
      installmentAmount: prev.installmentAmountInput ? prev.installmentAmount : estInstallment,
      installmentAmountInput: prev.installmentAmountInput
        ? prev.installmentAmountInput
        : (estInstallment / 100).toFixed(2).replace('.', ',')
    }))
  }

  const handleInstallmentAmountChange = e => {
    const val = e.target.value
    const cents = parseCurrencyToCents(val)
    setFormData(prev => ({
      ...prev,
      installmentAmountInput: val,
      installmentAmount: cents
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!formData.name.trim()) {
      setError('O nome do produto é obrigatório.')
      return
    }
    if (formData.priceCents <= 0) {
      setError('Informe um preço à vista válido maior que zero.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        categoryId: formData.categoryId || null,
        priceCents: formData.priceCents,
        installmentCount: parseInt(formData.installmentCount, 10) || null,
        installmentAmount: formData.installmentAmount || null,
        image: formData.image.trim() || null,
        description: formData.description.trim() || null,
        status: formData.status,
        promotion: formData.promotion,
        isNew: formData.isNew
      }

      const url = isEditing ? `/api/admin/products/${id}` : '/api/admin/products'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Falha ao salvar produto')
      }

      const saved = await res.json()
      setSuccessMsg(isEditing ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!')

      setTimeout(() => {
        navigate('/admin/products')
      }, 1200)
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja remover este produto definitivamente?')) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao excluir produto')
      navigate('/admin/products')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium text-gray-500">Carregando informações do produto...</p>
      </div>
    )
  }

  const selectedCategoryName = categories.find(c => c.id === formData.categoryId)?.name

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? 'Atualize as especificações, valores ou visibilidade deste item.'
                : 'Preencha os dados abaixo para adicionar um novo item ao catálogo.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 bg-brand-purple hover:bg-brand-purpleHover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg} Redirecionando...</span>
        </div>
      )}

      {/* Main Grid: Form (2 cols) & Live Preview (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* 1. Basic Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Layers className="w-4 h-4 text-brand-purple" />
              Informações Principais
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Placa de Vídeo RTX 4060 Dual OC 8GB"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
                  >
                    <option value="">Sem categoria vinculada</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Slug URL (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: placa-de-video-rtx-4060"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple font-mono text-xs"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Deixe em branco para gerar automaticamente a partir do nome.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Pricing & Installments */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <DollarSign className="w-4 h-4 text-brand-purple" />
              Preço & Condições de Pagamento
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Preço à Vista (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">
                    R$
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="1.399,00"
                    value={formData.priceInput}
                    onChange={handlePriceChange}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Gravado: {formatPrice(formData.priceCents)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Máx. Parcelas
                </label>
                <select
                  value={formData.installmentCount}
                  onChange={e => {
                    const count = parseInt(e.target.value, 10)
                    const est = Math.round(formData.priceCents / count)
                    setFormData({
                      ...formData,
                      installmentCount: count,
                      installmentAmount: est,
                      installmentAmountInput: (est / 100).toFixed(2).replace('.', ',')
                    })
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
                >
                  <option value="1">1x (à vista)</option>
                  <option value="3">3x</option>
                  <option value="6">6x</option>
                  <option value="10">10x</option>
                  <option value="12">12x</option>
                  <option value="18">18x</option>
                  <option value="24">24x</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Valor da Parcela (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">
                    R$
                  </span>
                  <input
                    type="text"
                    placeholder="131,45"
                    value={formData.installmentAmountInput}
                    onChange={handleInstallmentAmountChange}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Gravado: {formatPrice(formData.installmentAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Image URL */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ImageIcon className="w-4 h-4 text-brand-purple" />
              Imagem do Produto
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                URL da Imagem Principal
              </label>
              <input
                type="text"
                placeholder="https://res.cloudinary.com/... ou /images/products/..."
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple font-mono text-xs"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Cole a URL hospedada (ex: Cloudinary ou caminho em /public). Veja o preview ao lado.
              </p>
            </div>
          </div>

          {/* 4. Publication & Highlights */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              Visibilidade & Destaques
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Status de Publicação *
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer"
                >
                  <option value="PUBLISHED">🟢 Publicado (Visível na loja pública)</option>
                  <option value="REVIEW">🟡 Em Revisão (Apenas no Admin)</option>
                  <option value="DRAFT">⚪ Rascunho (Não visível)</option>
                  <option value="ARCHIVED">🔴 Arquivado</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Apenas produtos com status <strong>Publicado</strong> aparecem para os clientes.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.promotion}
                    onChange={e => setFormData({ ...formData, promotion: e.target.checked })}
                    className="w-4 h-4 text-brand-purple rounded border-gray-300 focus:ring-brand-purple"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Em Promoção</span>
                    <p className="text-xs text-gray-500">Exibe o selo "Oferta" e entra em Destaques</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 text-brand-purple rounded border-gray-300 focus:ring-brand-purple"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Lançamento</span>
                    <p className="text-xs text-gray-500">Exibe o selo "Lançamento" no card</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 5. Description */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Descrição & Ficha Técnica
            </h2>
            <div>
              <textarea
                rows={4}
                placeholder="Detalhes sobre o produto, garantia, especificações técnicas..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
              ></textarea>
            </div>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-1 sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-brand-purple" />
              Pré-visualização na Loja
            </h3>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                formData.status === 'PUBLISHED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {formData.status === 'PUBLISHED' ? 'Ficará público' : 'Invisível ao cliente'}
            </span>
          </div>

          {/* Render real Product Card simulation */}
          <div className="bg-white rounded-[12px] flex flex-col border border-surface-200 shadow-card-hover transition-all duration-300 group overflow-hidden max-w-[320px] mx-auto">
            {/* Image Stage: full bleed */}
            <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                {formData.promotion && (
                  <span className="bg-brand-magenta text-white text-[10px] uppercase font-bold px-2 py-1 rounded-[4px] tracking-wide shadow-sm">
                    Oferta
                  </span>
                )}
                {formData.isNew && (
                  <span className="bg-brand-neon text-brand-navy text-[10px] uppercase font-bold px-2 py-1 rounded-[4px] tracking-wide shadow-sm">
                    Lançamento
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button
                type="button"
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 bg-white/50 backdrop-blur-sm"
              >
                <Heart className="w-[18px] h-[18px]" />
              </button>

              {formData.image ? (
                <img
                  src={formData.image}
                  alt={formData.name || 'Preview'}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 z-10"
                  onError={e => {
                    e.target.onerror = null
                    e.target.src = 'https://placehold.co/400x400?text=Imagem+Inválida'
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2 bg-gray-50">
                  <ImageIcon className="w-10 h-10" />
                  <span className="text-xs font-semibold">Sem imagem</span>
                </div>
              )}
            </div>

            {/* Info Area */}
            <div className="p-4 md:p-5 flex flex-col flex-1">
              <h3 className="text-[#1C1C28] font-semibold text-[13px] md:text-[14px] leading-[1.35] line-clamp-2 min-h-[2.7em] mb-4">
                {formData.name || 'Título do produto aparecerá aqui...'}
              </h3>

              <div className="mt-auto">
                <div className="flex items-baseline gap-1">
                  <span className="text-[24px] md:text-[26px] font-extrabold text-[#0B0A1A] tracking-tight leading-none">
                    {formatPrice(formData.priceCents)}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium ml-1">à vista</span>
                </div>

                <div className="text-[11px] md:text-[12px] text-gray-500 font-medium mt-1.5 mb-5 h-[18px]">
                  {formData.installmentCount && formData.installmentAmount ? (
                    <>
                      ou {formData.installmentCount}x de {formatPrice(formData.installmentAmount)}
                    </>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="w-full bg-brand-purple text-white font-bold h-10 rounded-[6px] flex items-center justify-center gap-2 text-[13px]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
