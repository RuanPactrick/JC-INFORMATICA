import { useState } from 'react'
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  Truck,
  ShieldCheck,
  Headset,
  CreditCard
} from 'lucide-react'
import homepageData from './data/homepage.json'
import categoriesData from './data/categories.json'
import productsData from './data/products.json'

function formatPrice(cents) {
  if (cents == null) return ''
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-[16px] flex flex-col h-full border border-surface-200 hover:shadow-card-hover transition-shadow group overflow-hidden">
      {/* Image Stage: neutral light gray, occupies 60-65% visually via aspect ratio */}
      <div className="relative w-full aspect-[4/3] bg-surface-50 flex items-center justify-center p-6 md:p-8 border-b border-surface-100">
        {product.promotion && (
          <div className="absolute top-3 left-3 bg-brand-magenta text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide z-10">
            Oferta
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info Area */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="text-gray-900 font-semibold text-[14px] leading-[1.35] line-clamp-2 mb-4">
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] md:text-[28px] font-extrabold text-gray-900 tracking-tight leading-none">
              {formatPrice(product.priceCents)}
            </span>
          </div>

          {product.installment && (
            <div className="text-[12px] md:text-[13px] text-gray-500 font-medium mt-1.5 mb-5">
              ou {product.installment.count}x de {formatPrice(product.installment.amountCents)}
            </div>
          )}

          <button className="w-full bg-brand-purple hover:bg-brand-purpleHover text-white font-bold h-11 rounded-[8px] flex items-center justify-center gap-2 text-[14px] transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Comprar
          </button>
        </div>
      </div>
    </div>
  )
}

function CategoryItem({ category }) {
  return (
    <a href={`#${category.id}`} className="flex flex-col items-center justify-center gap-4 bg-white border border-surface-200 rounded-[12px] p-4 w-[130px] md:w-[150px] aspect-square hover:shadow-card-hover hover:border-brand-purple/30 transition-all group shrink-0 cursor-pointer">
      <div className="w-14 h-14 md:w-[72px] md:h-[72px] flex items-center justify-center">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.05] transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <span className="text-[13px] font-bold text-gray-800 text-center leading-tight group-hover:text-brand-purple transition-colors">
        {category.name}
      </span>
    </a>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  const featuredProducts = productsData.filter(p => homepageData.featuredProductIds.includes(p.id))
  const allProducts = productsData.slice(0, 8)

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Header Top */}
      <header className="bg-brand-navy text-white sticky top-0 z-50">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24 gap-6">
            {/* Logo */}
            <a href="#" className="flex-shrink-0 flex items-center">
              <img src="/images/brand/logo.jpg" alt="JC Informática" className="h-10 md:h-12 w-auto object-contain" />
            </a>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-2xl hidden md:block px-4">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-purple transition-colors" />
                <input
                  type="text"
                  placeholder="Busque por produtos, marcas ou categorias..."
                  className="w-full bg-white text-gray-900 rounded-[8px] h-11 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all shadow-sm placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0">
              <a href="#" className="hidden lg:flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <User className="w-5 h-5" />
                <div className="text-[13px] font-bold leading-tight">
                  <span className="block text-gray-400 font-medium text-[11px]">Olá, visitante</span>
                  Minha conta
                </div>
              </a>
              
              <a href="#" className="hidden md:flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
                <div className="hidden lg:block text-[13px] font-bold leading-tight">
                  <span className="block text-gray-400 font-medium text-[11px]">Meus</span>
                  Favoritos
                </div>
              </a>
              
              <a href="#" className="flex items-center gap-3 text-white hover:text-brand-magenta transition-colors">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-2 bg-brand-magenta text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">0</span>
                </div>
                <div className="hidden lg:block text-[13px] font-bold leading-tight">
                  <span className="block text-brand-magenta font-medium text-[11px]">Meu</span>
                  Carrinho
                </div>
              </a>
              
              <button className="md:hidden text-white p-2 -mr-2 hover:text-brand-magenta transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Search Bar - Mobile */}
          <div className="pb-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Busque por produtos..."
                className="w-full bg-white text-gray-900 rounded-[8px] h-10 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-purple text-sm font-medium shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-brand-navyLight text-gray-300 hidden md:block border-b border-white/5">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="flex items-center h-12">
            <div className="flex items-center gap-6 lg:gap-8 text-[14px] font-bold tracking-wide flex-1">
              <button className="flex items-center gap-2 text-white hover:text-brand-magenta transition-colors">
                <Menu className="w-4 h-4" />
                Departamentos
                <ChevronDown className="w-4 h-4 opacity-50" />
              </button>
              
              <div className="h-4 w-px bg-white/10 mx-1"></div>

              {categoriesData.slice(0, 6).map(cat => (
                <a key={cat.id} href={`#${cat.id}`} className="hover:text-white transition-colors">
                  {cat.name}
                </a>
              ))}
            </div>

            <a href="#ofertas" className="flex items-center text-brand-magenta hover:text-white transition-colors text-[14px] font-bold shrink-0">
              Ofertas Especiais
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center md:object-right opacity-[0.60] mix-blend-screen"
            poster="/images/products/pc-gamer-core-i5-13400f-32gb-ram-ddr4-rtx-5060-8gb.webp"
          >
            <source src="/video_banner.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-container mx-auto px-4 lg:px-8 py-16 md:py-20 flex flex-col justify-center min-h-[400px] md:min-h-[500px]">
          <div className="max-w-2xl">
            <h2 className="text-brand-neon text-[11px] md:text-[13px] font-extrabold tracking-widest uppercase mb-4">
              {homepageData.hero.eyebrow}
            </h2>
            <h1 className="text-4xl md:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
              TECNOLOGIA SEM LIMITES
            </h1>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-lg leading-relaxed font-medium">
              {homepageData.hero.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href={homepageData.hero.primaryCta.href} className="bg-brand-purple hover:bg-brand-purpleHover text-white font-extrabold py-3.5 px-8 rounded-[8px] transition-colors text-sm">
                {homepageData.hero.primaryCta.label}
              </a>
              <a href={homepageData.hero.secondaryCta.href} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3.5 px-8 rounded-[8px] transition-colors text-sm">
                {homepageData.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Benefits Bar */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-container mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-800">
            <div className="flex items-center gap-4">
              <Truck className="w-7 h-7 text-brand-purple shrink-0" />
              <div>
                <div className="text-[13px] md:text-sm font-bold tracking-tight">Entrega Brasil</div>
                <div className="text-[11px] md:text-xs text-gray-500 font-medium">Rastreamento real</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-7 h-7 text-brand-purple shrink-0" />
              <div>
                <div className="text-[13px] md:text-sm font-bold tracking-tight">Compra segura</div>
                <div className="text-[11px] md:text-xs text-gray-500 font-medium">Ambiente protegido</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Headset className="w-7 h-7 text-brand-purple shrink-0" />
              <div>
                <div className="text-[13px] md:text-sm font-bold tracking-tight">Suporte 24/7</div>
                <div className="text-[11px] md:text-xs text-gray-500 font-medium">Especializado</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreditCard className="w-7 h-7 text-brand-purple shrink-0" />
              <div>
                <div className="text-[13px] md:text-sm font-bold tracking-tight">Até 12x</div>
                <div className="text-[11px] md:text-xs text-gray-500 font-medium">No cartão</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-14">
        {/* Produtos em destaque */}
        <section className="max-w-container mx-auto px-4 lg:px-8 mb-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-gray-900 mb-1 tracking-tight">Produtos em destaque</h2>
            </div>
            <a href="#destaques" className="hidden md:block text-brand-purple font-bold text-sm hover:text-brand-purpleHover transition-colors">
              Ver todos
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0,4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categorias */}
        <section className="max-w-container mx-auto px-4 lg:px-8 mb-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-gray-900 mb-1 tracking-tight">Compre por Categoria</h2>
            </div>
            <a href="#categorias" className="hidden md:block text-brand-purple font-bold text-sm hover:text-brand-purpleHover transition-colors">
              Ver todas
            </a>
          </div>

          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scrollbar-hide snap-x">
            {categoriesData.map(cat => (
              <div className="snap-start shrink-0" key={cat.id}>
                 <CategoryItem category={cat} />
              </div>
            ))}
          </div>
        </section>

        {/* Produtos (Catálogo geral) */}
        <section className="max-w-container mx-auto px-4 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-gray-900 mb-1 tracking-tight">Lançamentos</h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <label htmlFor="sort" className="text-[13px] font-semibold text-gray-600">Ordenar:</label>
              <select id="sort" className="bg-white border border-surface-200 text-gray-900 text-sm rounded-[8px] focus:ring-2 focus:ring-brand-purple focus:border-brand-purple block py-2 px-3 font-semibold outline-none cursor-pointer">
                <option defaultValue>Mais recentes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name-asc">Nome A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy text-white pt-16 pb-12 border-t-[4px] border-brand-purple">
        <div className="max-w-container mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-magenta shrink-0" />
              <div>
                <div className="text-[14px] font-bold mb-1.5">Compra segura</div>
                <div className="text-[13px] text-gray-400 font-medium leading-relaxed">Ambiente 100% seguro, auditado e criptografado.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Truck className="w-8 h-8 text-brand-magenta shrink-0" />
              <div>
                <div className="text-[14px] font-bold mb-1.5">Entrega rápida</div>
                <div className="text-[13px] text-gray-400 font-medium leading-relaxed">Enviamos para todo o Brasil com rastreamento em tempo real.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CreditCard className="w-8 h-8 text-brand-magenta shrink-0" />
              <div>
                <div className="text-[14px] font-bold mb-1.5">Até 12x no cartão</div>
                <div className="text-[13px] text-gray-400 font-medium leading-relaxed">Condições especiais de parcelamento nas principais bandeiras.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Headset className="w-8 h-8 text-brand-magenta shrink-0" />
              <div>
                <div className="text-[14px] font-bold mb-1.5">Atendimento premium</div>
                <div className="text-[13px] text-gray-400 font-medium leading-relaxed">Suporte especializado antes, durante e após a sua compra.</div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] font-medium text-gray-500">
             <p>© 2026 JC Informática. Todos os direitos reservados.</p>
             <div className="flex items-center gap-6">
               <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
               <a href="#" className="hover:text-white transition-colors">Privacidade</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
