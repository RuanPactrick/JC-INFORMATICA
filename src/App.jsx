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
    <div className="bg-white rounded-[12px] flex flex-col h-full border border-surface-200 hover:border-brand-purple/20 hover:shadow-card-hover transition-all duration-300 group overflow-hidden">
      {/* Image Stage: neutral light gray, occupies ~60% visually via aspect ratio */}
      <div className="relative w-full aspect-square md:aspect-[4/3] bg-[#F8F9FA] flex items-center justify-center p-6">
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.promotion && (
            <span className="bg-brand-magenta text-white text-[10px] uppercase font-bold px-2 py-1 rounded-[4px] tracking-wide shadow-sm">
              Oferta
            </span>
          )}
          {product.isNew && (
            <span className="bg-brand-neon text-brand-navy text-[10px] uppercase font-bold px-2 py-1 rounded-[4px] tracking-wide shadow-sm">
              Lançamento
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-magenta hover:bg-white/90 transition-colors" aria-label="Favoritar">
          <Heart className="w-[18px] h-[18px]" />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info Area */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <h3 className="text-[#1C1C28] font-semibold text-[13px] md:text-[14px] leading-[1.35] line-clamp-2 min-h-[2.7em] mb-4">
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] md:text-[26px] font-extrabold text-[#0B0A1A] tracking-tight leading-none">
              {formatPrice(product.priceCents)}
            </span>
            <span className="text-[11px] text-gray-500 font-medium ml-1">à vista</span>
          </div>

          <div className="text-[11px] md:text-[12px] text-gray-500 font-medium mt-1.5 mb-5 h-[18px]">
            {product.installment ? (
              <>ou {product.installment.count}x de {formatPrice(product.installment.amountCents)}</>
            ) : null}
          </div>

          <button className="w-full bg-brand-purple hover:bg-brand-purpleHover text-white font-bold h-10 rounded-[6px] flex items-center justify-center gap-2 text-[13px] transition-colors focus:ring-2 focus:ring-brand-purple focus:ring-offset-2">
            <ShoppingCart className="w-4 h-4" />
            Comprar
          </button>
        </div>
      </div>
    </div>
  )
}

function CategoryItem({ category }) {
  // Specific object positioning tweaks for vertical posters to center the product inside the circle
  const getObjectPosition = (id) => {
    switch (id) {
      case 'gabinetes': return 'object-[center_30%]'
      case 'pc-gamer': return 'object-[center_40%]'
      case 'colecionaveis': return 'object-[center_30%]'
      default: return 'object-center'
    }
  }

  return (
    <a href={`#${category.id}`} className="group flex flex-col items-center gap-3 w-[88px] sm:w-[115px] shrink-0 cursor-pointer snap-start">
      
      {/* Circular Image Container */}
      <div className="w-[88px] h-[88px] sm:w-[112px] sm:h-[112px] rounded-full overflow-hidden bg-brand-purple flex items-center justify-center relative shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.03]">
        
        <img
          src={category.image}
          alt={category.name}
          className={`w-full h-full object-cover ${getObjectPosition(category.id)}`}
          loading="lazy"
        />
        
        {/* Subtle inner ring to separate the circle from white background */}
        <div className="absolute inset-0 rounded-full border border-black/5 pointer-events-none"></div>
      </div>

      {/* Category Label */}
      <span className="text-[12px] sm:text-[14px] font-semibold text-gray-800 text-center leading-tight group-hover:text-brand-purple transition-colors">
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
      <nav className="bg-brand-navy text-gray-300 hidden md:block border-t border-white/5">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="flex items-center h-[52px]">
            <div className="flex items-center gap-6 lg:gap-8 text-[13px] font-bold tracking-wide">
              <button className="flex items-center gap-2 text-white hover:text-brand-purple transition-colors">
                <Menu className="w-4 h-4" />
                Todos os Departamentos
              </button>
              
              <div className="h-4 w-px bg-white/10 mx-1"></div>

              {categoriesData.slice(0, 8).map(cat => (
                <a key={cat.id} href={`#${cat.id}`} className="hover:text-white transition-colors">
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[#050414] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center md:object-[center_35%] opacity-90"
            poster="/images/products/pc-gamer-core-i5-13400f-32gb-ram-ddr4-rtx-5060-8gb.webp"
          >
            <source src="/video_banner.mp4" type="video/mp4" />
          </video>
          {/* Minimum overlay for text legibility on the left, letting the right side shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050414] via-[#050414]/80 to-transparent w-full md:w-[75%] lg:w-[60%]"></div>
        </div>

        <div className="relative z-10 max-w-container mx-auto px-4 lg:px-8 py-20 md:py-32 flex flex-col justify-center min-h-[480px] md:min-h-[600px]">
          <div className="max-w-xl lg:max-w-2xl">
            <h2 className="text-brand-purple text-[12px] md:text-[14px] font-extrabold tracking-widest uppercase mb-4 drop-shadow-md">
              {homepageData.hero.eyebrow}
            </h2>
            <h1 className="text-4xl md:text-[4.5rem] font-black text-white leading-[1.05] mb-6 tracking-tight drop-shadow-xl">
              TECNOLOGIA <br className="hidden md:block" />SEM LIMITES
            </h1>
            <p className="text-gray-200 text-base md:text-xl mb-10 max-w-[500px] leading-relaxed font-medium drop-shadow-md">
              Computadores, periféricos, componentes e muito mais para elevar o seu nível. Qualidade, garantia e o melhor atendimento para você.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a href={homepageData.hero.primaryCta.href} className="bg-brand-purple hover:bg-brand-purpleHover text-white font-extrabold py-4 px-10 rounded-[8px] transition-all transform hover:scale-[1.02] shadow-lg text-[15px] w-full sm:w-auto text-center">
                {homepageData.hero.primaryCta.label}
              </a>
              <a href={homepageData.hero.secondaryCta.href} className="bg-white/5 hover:bg-white/15 text-white border border-white/20 font-bold py-4 px-10 rounded-[8px] transition-all text-[15px] w-full sm:w-auto text-center backdrop-blur-sm">
                {homepageData.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-14">
        {/* Categorias */}
        <section className="max-w-container mx-auto px-4 lg:px-8 mb-12 md:mb-16">
          <div className="flex items-end justify-between mb-5 md:mb-7">
            <div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-[#0B0A1A] mb-1 tracking-tight">Categorias</h2>
              <p className="text-[13px] md:text-sm text-gray-500 font-medium mt-1">Encontre exatamente o que você precisa para o seu setup.</p>
            </div>
            <a href="#categorias" className="hidden md:block text-brand-purple font-bold text-[14px] hover:text-brand-purpleHover transition-colors">
              Ver todas
            </a>
          </div>

          <div className="flex overflow-x-auto gap-4 md:gap-7 lg:justify-between pb-6 pt-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide snap-x">
            {categoriesData.map(cat => (
               <CategoryItem key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* Produtos em destaque */}
        <section className="max-w-container mx-auto px-4 lg:px-8 mb-14 md:mb-16">
          <div className="flex items-end justify-between mb-5 md:mb-6">
            <div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-[#0B0A1A] mb-1 tracking-tight">Produtos em destaque</h2>
              <p className="text-[13px] md:text-sm text-gray-500 font-medium mt-1">Nossa seleção especial para você.</p>
            </div>
            <a href="#destaques" className="hidden md:block text-brand-purple font-bold text-[14px] hover:text-brand-purpleHover transition-colors">
              Ver todos
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {featuredProducts.slice(0,4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Produtos (Catálogo geral) */}
        <section className="max-w-container mx-auto px-4 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 md:mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-[#0B0A1A] mb-1 tracking-tight">Catálogo</h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <label htmlFor="sort" className="text-[13px] font-semibold text-gray-600">Ordenar:</label>
              <select id="sort" className="bg-white border border-surface-200 text-gray-900 text-[13px] rounded-[6px] focus:ring-2 focus:ring-brand-purple focus:border-brand-purple block py-1.5 px-3 font-semibold outline-none cursor-pointer">
                <option defaultValue>Mais recentes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name-asc">Nome A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
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
