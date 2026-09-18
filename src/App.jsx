import { useState } from 'react'
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  Zap,
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
    <div className="bg-white rounded-2xl p-4 md:p-5 flex flex-col h-full shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-surface-100 group relative">
      <div className="relative h-40 md:h-44 mb-4 bg-white rounded-xl flex items-center justify-center p-2 overflow-hidden">
        {product.promotion && (
          <div className="absolute top-0 left-0 bg-brand-magenta text-white text-[10px] uppercase font-bold px-2 py-1 rounded-br-lg rounded-tl-lg z-10 tracking-wider">
            Oferta
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <button className="absolute top-2 right-2 text-gray-300 hover:text-brand-magenta transition-colors bg-white/80 p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100" aria-label="Favoritar">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-gray-800 font-semibold text-[13px] md:text-sm mb-2 line-clamp-2 leading-snug group-hover:text-brand-purple transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              {formatPrice(product.priceCents)}
            </span>
            <span className="text-[10px] md:text-xs text-gray-500 font-medium">à vista</span>
          </div>

          {product.installment && (
            <div className="text-[11px] md:text-xs text-gray-500 font-medium mt-0.5 mb-4">
              ou {product.installment.count}x de {formatPrice(product.installment.amountCents)}
            </div>
          )}

          <button className="w-full bg-brand-purple hover:bg-brand-purpleHover text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-sm">
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
    <a href={`#${category.id}`} className="flex flex-col items-center gap-3 group min-w-[90px] md:min-w-[110px] cursor-pointer">
      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-b from-[#1C1C28] to-brand-navyLight flex items-center justify-center p-4 shadow-card group-hover:shadow-premium group-hover:-translate-y-1 transition-all duration-300 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <img
          src={category.image}
          alt={category.name}
          className="object-contain w-full h-full drop-shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10"
          loading="lazy"
        />
      </div>
      <span className="text-xs md:text-[13px] font-extrabold text-gray-800 text-center leading-tight group-hover:text-brand-purple transition-colors tracking-tight">
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
    <div className="min-h-screen flex flex-col font-sans bg-surface-50">
      {/* Header Top */}
      <header className="bg-brand-navy text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4 md:gap-8">
            {/* Logo */}
            <a href="#" className="flex-shrink-0">
              <img src="/images/brand/logo.jpg" alt="JC Informática" className="h-8 md:h-10 w-auto object-contain rounded" />
            </a>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-magenta transition-colors" />
                <input
                  type="text"
                  placeholder="Busque por produtos, marcas ou categorias..."
                  className="w-full bg-white text-gray-900 rounded-full py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-magenta transition-all shadow-inner placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5 md:gap-7">
              <a href="#" className="hidden md:flex flex-col items-center text-gray-300 hover:text-white transition-colors group">
                <User className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">Minha conta</span>
              </a>
              <a href="#" className="hidden md:flex flex-col items-center text-gray-300 hover:text-brand-magenta transition-colors group">
                <Heart className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">Favoritos</span>
              </a>
              <a href="#" className="flex flex-col items-center text-brand-neon hover:text-white transition-colors relative group">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 md:mb-1 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="absolute -top-1.5 -right-2 bg-brand-magenta text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">0</span>
                </div>
                <span className="hidden md:inline text-[9px] font-bold uppercase tracking-widest opacity-90 group-hover:opacity-100">Meu carrinho</span>
              </a>
              <button className="md:hidden text-white p-2 -mr-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Search Bar - Mobile */}
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Busque por produtos..."
                className="w-full bg-white text-gray-900 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-magenta text-sm font-medium shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-brand-navyLight text-gray-300 hidden md:block border-b border-white/5 relative z-40">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-8">
              <button className="flex items-center gap-2 text-white text-sm font-extrabold hover:text-brand-magenta transition-colors group">
                <Menu className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Todas as categorias
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              
              <div className="flex items-center gap-6 text-[13px] font-bold tracking-wide">
                {categoriesData.slice(0, 6).map(cat => (
                  <a key={cat.id} href={`#${cat.id}`} className="hover:text-white transition-colors relative after:absolute after:bottom-[-14px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-magenta hover:after:w-full after:transition-all after:duration-300">
                    {cat.name}
                  </a>
                ))}
                <a href="#promocoes" className="hover:text-brand-neon transition-colors text-brand-neon">Promoções</a>
              </div>
            </div>

            <a href="#ofertas" className="flex items-center gap-1.5 text-brand-neon text-[11px] uppercase tracking-wider font-extrabold border border-brand-neon/30 bg-brand-neon/5 px-3 py-1.5 rounded-full hover:bg-brand-neon/20 hover:border-brand-neon transition-all">
              <Zap className="w-3.5 h-3.5 fill-brand-neon" />
              Ofertas especiais
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-brand-navy overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center md:object-right opacity-[0.65] mix-blend-screen scale-105"
            poster="/images/products/pc-gamer-core-i5-13400f-32gb-ram-ddr4-rtx-5060-8gb.webp"
          >
            <source src="/video_banner.mp4" type="video/mp4" />
          </video>
          {/* Smoother Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-80"></div>
        </div>

        <div className="relative z-10 max-w-container mx-auto px-4 lg:px-8 py-16 md:py-24 flex flex-col justify-center min-h-[450px] md:min-h-[550px]">
          <div className="max-w-2xl">
            <h2 className="text-brand-neon text-[10px] md:text-xs font-extrabold tracking-[0.2em] uppercase mb-4 md:mb-5 flex items-center gap-2">
              <span className="w-6 h-[2px] bg-brand-neon rounded-full"></span>
              {homepageData.hero.eyebrow}
            </h2>
            <h1 className="text-4xl md:text-[4rem] font-extrabold text-white leading-[1.05] mb-5 md:mb-6 tracking-tight">
              TECNOLOGIA<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-magenta to-brand-neon">SEM LIMITES</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-lg leading-relaxed font-medium">
              {homepageData.hero.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href={homepageData.hero.primaryCta.href} className="bg-brand-purple hover:bg-brand-purpleHover text-white font-extrabold py-3.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm shadow-premium">
                {homepageData.hero.primaryCta.label}
                <span className="text-lg leading-none ml-1">&rarr;</span>
              </a>
              <a href={homepageData.hero.secondaryCta.href} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3.5 px-8 rounded-full transition-all backdrop-blur-md text-sm">
                {homepageData.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Benefits Bar */}
      <div className="bg-brand-navyLight border-b border-brand-dark relative z-20 shadow-sm">
        <div className="max-w-container mx-auto px-4 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-white divide-x divide-white/5">
            <div className="flex items-center gap-3 md:gap-4 pl-0">
              <Truck className="w-6 h-6 md:w-8 md:h-8 text-brand-magenta shrink-0" />
              <div>
                <div className="text-xs md:text-sm font-extrabold tracking-tight">Entrega Brasil</div>
                <div className="text-[10px] md:text-xs text-gray-400 font-medium">Rastreamento real</div>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6">
              <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-brand-magenta shrink-0" />
              <div>
                <div className="text-xs md:text-sm font-extrabold tracking-tight">Compra segura</div>
                <div className="text-[10px] md:text-xs text-gray-400 font-medium">Ambiente protegido</div>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6">
              <Headset className="w-6 h-6 md:w-8 md:h-8 text-brand-magenta shrink-0" />
              <div>
                <div className="text-xs md:text-sm font-extrabold tracking-tight">Suporte 24/7</div>
                <div className="text-[10px] md:text-xs text-gray-400 font-medium">Especializado</div>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6">
              <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-brand-magenta shrink-0" />
              <div>
                <div className="text-xs md:text-sm font-extrabold tracking-tight">Até 12x</div>
                <div className="text-[10px] md:text-xs text-gray-400 font-medium">No cartão</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12 md:py-16">
        {/* Produtos em destaque */}
        <section className="max-w-container mx-auto px-4 lg:px-8 mb-16 md:mb-20">
          <div className="flex items-end justify-between mb-8 border-b border-surface-200 pb-4">
            <div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-gray-900 mb-1.5 tracking-tight">Produtos em destaque</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium">Os mais vendidos, com a qualidade da JC Informática.</p>
            </div>
            <a href="#destaques" className="hidden md:flex items-center gap-1 text-brand-purple font-extrabold text-sm hover:text-brand-purpleHover transition-colors group">
              Ver todos
              <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">&rarr;</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.slice(0,4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categorias */}
        <section className="max-w-container mx-auto px-4 lg:px-8 mb-16 md:mb-20">
          <div className="flex items-end justify-between mb-8 border-b border-surface-200 pb-4">
            <div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-gray-900 mb-1.5 tracking-tight">Compre por Categoria</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium">Encontre exatamente o que você precisa para o seu setup.</p>
            </div>
            <a href="#categorias" className="hidden md:flex items-center gap-1 text-brand-purple font-extrabold text-sm hover:text-brand-purpleHover transition-colors group">
              Ver todas
              <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">&rarr;</span>
            </a>
          </div>

          <div className="flex overflow-x-auto gap-4 md:gap-8 pb-6 pt-2 scrollbar-hide md:grid md:grid-cols-8 snap-x snap-mandatory">
            {categoriesData.map(cat => (
              <div className="snap-start" key={cat.id}>
                 <CategoryItem category={cat} />
              </div>
            ))}
          </div>
        </section>

        {/* Produtos (Catálogo geral) */}
        <section className="max-w-container mx-auto px-4 lg:px-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-surface-200 pb-4 gap-4">
            <div>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-gray-900 mb-1.5 tracking-tight">Catálogo de Produtos</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium">Qualidade, desempenho e os melhores preços para você.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <label htmlFor="sort" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ordenar por</label>
              <select id="sort" className="bg-white border border-surface-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-brand-purple block py-2 px-3 font-semibold outline-none shadow-sm transition-shadow cursor-pointer">
                <option defaultValue>Mais recentes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name-asc">Nome A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {allProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer Trust Bar */}
      <footer className="bg-brand-navy text-white pt-16 pb-12 border-t-[4px] border-brand-purple">
        <div className="max-w-container mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-neon shrink-0" />
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-widest mb-1.5">Compra segura</div>
                <div className="text-xs text-gray-400 font-medium leading-relaxed">Ambiente 100% seguro, auditado e criptografado.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Truck className="w-8 h-8 text-brand-neon shrink-0" />
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-widest mb-1.5">Entrega rápida</div>
                <div className="text-xs text-gray-400 font-medium leading-relaxed">Enviamos para todo o Brasil com rastreamento em tempo real.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CreditCard className="w-8 h-8 text-brand-neon shrink-0" />
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-widest mb-1.5">Até 12x no cartão</div>
                <div className="text-xs text-gray-400 font-medium leading-relaxed">Condições especiais de parcelamento nas principais bandeiras.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Headset className="w-8 h-8 text-brand-neon shrink-0" />
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-widest mb-1.5">Atendimento premium</div>
                <div className="text-xs text-gray-400 font-medium leading-relaxed">Suporte especializado antes, durante e após a sua compra.</div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
             <p>© 2026 JC Informática. Todos os direitos reservados.</p>
             <div className="flex items-center gap-4">
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
