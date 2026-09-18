import { useState } from 'react'
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  Monitor,
  Cpu,
  Cpu as CpuIcon, // alias
  Mouse,
  Tv,
  Gamepad2,
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
    <div className="bg-white rounded-2xl p-4 flex flex-col h-full hover:shadow-lg transition-shadow border border-gray-100">
      <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl flex items-center justify-center p-4">
        {product.promotion && (
          <div className="absolute top-2 left-2 bg-brand-magenta text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            Oferta
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full mix-blend-multiply"
          loading="lazy"
        />
        <button className="absolute top-2 right-2 text-gray-400 hover:text-brand-magenta transition-colors" aria-label="Favoritar">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-gray-900 font-semibold text-sm mb-1 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Mockup shows a static 5 star on the image, but instructions said:
            "Não mostrar avaliações fictícias. Se os dados não contiverem avaliação real, não inventar estrelas ou número de reviews."
            Since products.json doesn't have review data, I will NOT show stars. */}

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.priceCents)}
            </span>
            <span className="text-xs text-gray-500 font-medium">à vista</span>
          </div>

          {product.installment && (
            <div className="text-xs text-gray-500 font-medium mt-0.5">
              ou {product.installment.count}x de {formatPrice(product.installment.amountCents)}
            </div>
          )}

          <button className="w-full mt-4 bg-brand-purple hover:bg-brand-purpleHover text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
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
    <a href={`#${category.id}`} className="flex flex-col items-center gap-3 group min-w-[90px]">
      <div className="w-20 h-20 rounded-full bg-brand-purple/10 flex items-center justify-center p-3 border-2 border-transparent group-hover:border-brand-purple transition-all">
        <img
          src={category.image}
          alt={category.name}
          className="object-contain w-full h-full rounded-full mix-blend-multiply"
          loading="lazy"
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-brand-purple transition-colors">
        {category.name}
      </span>
    </a>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  const featuredProducts = productsData.filter(p => homepageData.featuredProductIds.includes(p.id))

  // In the mockup, there's a big "Produtos" section at the bottom. We'll use all products.
  const allProducts = productsData.slice(0, 8) // limiting to 8 for the grid to look nice, as mockup shows 4 per row.

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header Top */}
      <header className="bg-[#0A0A14] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
            {/* Logo */}
            <a href="#" className="flex-shrink-0">
              <img src="/images/brand/logo.jpg" alt="JC Informática" className="h-10 md:h-12 w-auto object-contain rounded-md" />
            </a>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Faça sua busca..."
                  className="w-full bg-white text-gray-900 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-magenta transition-shadow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 md:gap-6">
              <a href="#" className="hidden md:flex flex-col items-center text-gray-300 hover:text-white transition-colors">
                <User className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Minha conta</span>
              </a>
              <a href="#" className="hidden md:flex flex-col items-center text-gray-300 hover:text-white transition-colors">
                <Heart className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Favoritos</span>
              </a>
              <a href="#" className="flex flex-col items-center text-brand-neon hover:text-white transition-colors relative">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 md:mb-1" />
                  <span className="absolute -top-1 -right-2 bg-brand-magenta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                </div>
                <span className="hidden md:inline text-[10px] font-semibold uppercase tracking-wider">Meu carrinho</span>
              </a>
              <button className="md:hidden text-white p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Search Bar - Mobile */}
          <div className="pb-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Faça sua busca..."
                className="w-full bg-white text-gray-900 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-magenta text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#12121D] text-gray-300 hidden md:block border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <button className="flex items-center gap-2 text-white font-semibold hover:text-brand-magenta transition-colors">
                <Menu className="w-5 h-5" />
                Todas as categorias
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-6 text-sm font-medium">
                {categoriesData.slice(0, 6).map(cat => (
                  <a key={cat.id} href={`#${cat.id}`} className="hover:text-white transition-colors">{cat.name}</a>
                ))}
                <a href="#promocoes" className="hover:text-white transition-colors">Promoções</a>
              </div>
            </div>

            <a href="#ofertas" className="flex items-center gap-2 text-brand-neon text-sm font-bold border border-brand-neon/30 bg-brand-neon/10 px-4 py-1.5 rounded-full hover:bg-brand-neon/20 transition-colors">
              <Zap className="w-4 h-4" />
              Ofertas especiais
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[#0A0A14] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-right opacity-60 mix-blend-screen"
            poster="/images/products/pc-gamer-core-i5-13400f-32gb-ram-ddr4-rtx-5060-8gb.webp"
          >
            <source src="/video_banner.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlay to ensure text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A14] via-[#0A0A14]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 flex flex-col justify-center min-h-[500px]">
          <div className="max-w-2xl">
            <h2 className="text-brand-neon text-sm md:text-base font-bold tracking-widest uppercase mb-4">
              {homepageData.hero.eyebrow}
            </h2>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6">
              TECNOLOGIA<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-magenta to-brand-neon">SEM LIMITES</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              {homepageData.hero.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href={homepageData.hero.primaryCta.href} className="bg-brand-purple hover:bg-brand-purpleHover text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                {homepageData.hero.primaryCta.label}
                <span className="text-xl leading-none">&rarr;</span>
              </a>
              <a href={homepageData.hero.secondaryCta.href} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-4 px-8 rounded-full transition-all backdrop-blur-sm">
                {homepageData.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Benefits Bar */}
      <div className="bg-[#12121D] border-b border-[#2A2A3A]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-brand-magenta" />
              <div>
                <div className="text-sm font-bold">Entrega para todo o Brasil</div>
                <div className="text-xs text-gray-400">Rastreamento em tempo real</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-magenta" />
              <div>
                <div className="text-sm font-bold">Compra segura</div>
                <div className="text-xs text-gray-400">Ambiente 100% protegido</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Headset className="w-8 h-8 text-brand-magenta" />
              <div>
                <div className="text-sm font-bold">Suporte especializado</div>
                <div className="text-xs text-gray-400">Antes e depois da compra</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreditCard className="w-8 h-8 text-brand-magenta" />
              <div>
                <div className="text-sm font-bold">Parcele em até 12x</div>
                <div className="text-xs text-gray-400">No cartão de crédito</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-[#F5F5F7] py-12">
        {/* Produtos em destaque */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Produtos em destaque</h2>
              <p className="text-gray-500 font-medium">Os mais vendidos, com a qualidade e confiança da JC Informática.</p>
            </div>
            <a href="#destaques" className="hidden md:flex items-center gap-1 text-brand-purple font-bold hover:text-brand-purpleHover transition-colors">
              Ver todos
              <span className="text-xl leading-none">&rarr;</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0,4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categorias */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Categorias</h2>
              <p className="text-gray-500 font-medium">Encontre exatamente o que você precisa para o seu setup.</p>
            </div>
            <a href="#categorias" className="hidden md:flex items-center gap-1 text-brand-purple font-bold hover:text-brand-purpleHover transition-colors">
              Ver todas
              <span className="text-xl leading-none">&rarr;</span>
            </a>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide md:grid md:grid-cols-8 md:gap-6">
            {categoriesData.map(cat => (
              <CategoryItem key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* Produtos (Catálogo geral) */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Produtos</h2>
              <p className="text-gray-500 font-medium">Qualidade, desempenho e os melhores preços para você.</p>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm font-semibold text-gray-700">Ordenar por:</label>
              <select id="sort" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-purple focus:border-brand-purple block p-2.5 font-medium outline-none">
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

      {/* Footer Trust Bar */}
      <footer className="bg-[#0B0A1A] text-white py-12 border-t-[4px] border-brand-purple">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-10 h-10 text-brand-neon shrink-0" />
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-1">Sua compra mais segura</div>
                <div className="text-sm text-gray-400">Ambiente 100% seguro e criptografado</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Truck className="w-10 h-10 text-brand-neon shrink-0" />
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-1">Entrega para todo o Brasil</div>
                <div className="text-sm text-gray-400">Com rastreamento em tempo real</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CreditCard className="w-10 h-10 text-brand-neon shrink-0" />
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-1">Parcele em até 12x</div>
                <div className="text-sm text-gray-400">No cartão de crédito</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Headset className="w-10 h-10 text-brand-neon shrink-0" />
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-1">Atendimento especializado</div>
                <div className="text-sm text-gray-400">Antes e depois da sua compra</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
