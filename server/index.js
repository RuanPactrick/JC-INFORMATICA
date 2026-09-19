import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// ============================================
// PUBLIC ENDPOINTS (Only published data)
// ============================================

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

app.get('/api/products', async (req, res) => {
  try {
    const { category, sort } = req.query
    const where = { status: 'PUBLISHED' }

    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } })
      if (cat) where.categoryId = cat.id
    }

    let orderBy = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { priceCents: 'asc' }
    if (sort === 'price-desc') orderBy = { priceCents: 'desc' }
    if (sort === 'name-asc') orderBy = { name: 'asc' }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy
    })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

app.get('/api/homepage', async (req, res) => {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    
    const heroSlides = await prisma.carouselSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })

    const featuredProducts = await prisma.product.findMany({
      where: { status: 'PUBLISHED', promotion: true },
      include: { category: true },
      take: 8
    })

    // If no promo products, fallback to latest published
    const fallbackFeatured = featuredProducts.length > 0 
      ? featuredProducts 
      : await prisma.product.findMany({
          where: { status: 'PUBLISHED' },
          include: { category: true },
          take: 8
        })

    res.json({
      sections,
      heroSlides,
      featuredProducts: fallbackFeatured
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch homepage data' })
  }
})

// ============================================
// ADMIN ENDPOINTS (Product & Catalog Management)
// ============================================

// Admin Dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [publishedCount, reviewCount, draftCount, archivedCount, categoriesCount] = await Promise.all([
      prisma.product.count({ where: { status: 'PUBLISHED' } }),
      prisma.product.count({ where: { status: 'REVIEW' } }),
      prisma.product.count({ where: { status: 'DRAFT' } }),
      prisma.product.count({ where: { status: 'ARCHIVED' } }),
      prisma.category.count({ where: { active: true } })
    ])
    res.json({
      publishedCount,
      reviewCount,
      draftCount,
      archivedCount,
      totalProducts: publishedCount + reviewCount + draftCount + archivedCount,
      categoriesCount
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Admin categories list for dropdowns
app.get('/api/admin/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// List products with filters
app.get('/api/admin/products', async (req, res) => {
  try {
    const { status, categoryId, search } = req.query
    const where = {}

    if (status && status !== 'ALL') {
      where.status = status
    }
    if (categoryId && categoryId !== 'ALL') {
      where.categoryId = categoryId
    }
    if (search && search.trim()) {
      where.name = {
        contains: search.trim()
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { updatedAt: 'desc' }
    })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin products' })
  }
})

// Get single product
app.get('/api/admin/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// Create product
app.post('/api/admin/products', async (req, res) => {
  try {
    const {
      name,
      slug: customSlug,
      priceCents,
      description,
      image,
      images,
      promotion,
      isNew,
      installmentCount,
      installmentAmount,
      status = 'DRAFT',
      categoryId
    } = req.body

    if (!name || priceCents === undefined || priceCents === null) {
      return res.status(400).json({ error: 'Name and price are required' })
    }

    let slug = customSlug ? slugify(customSlug) : slugify(name)
    // Check if slug exists, append random suffix if collision
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        priceCents: parseInt(priceCents, 10),
        description: description || null,
        image: image || null,
        images: images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null,
        promotion: Boolean(promotion),
        isNew: Boolean(isNew),
        installmentCount: installmentCount ? parseInt(installmentCount, 10) : null,
        installmentAmount: installmentAmount ? parseInt(installmentAmount, 10) : null,
        status: status || 'DRAFT',
        categoryId: categoryId || null
      },
      include: { category: true }
    })

    res.status(201).json(product)
  } catch (err) {
    console.error('Error creating product:', err)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Update product
app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      slug: customSlug,
      priceCents,
      description,
      image,
      images,
      promotion,
      isNew,
      installmentCount,
      installmentAmount,
      status,
      categoryId
    } = req.body

    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) return res.status(404).json({ error: 'Product not found' })

    let slug = existingProduct.slug
    if (customSlug && customSlug !== existingProduct.slug) {
      slug = slugify(customSlug)
      const slugCollision = await prisma.product.findUnique({ where: { slug } })
      if (slugCollision && slugCollision.id !== id) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`
      }
    } else if (name && !customSlug && name !== existingProduct.name) {
      slug = slugify(name)
      const slugCollision = await prisma.product.findUnique({ where: { slug } })
      if (slugCollision && slugCollision.id !== id) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        slug,
        priceCents: priceCents !== undefined ? parseInt(priceCents, 10) : undefined,
        description: description !== undefined ? description : undefined,
        image: image !== undefined ? image : undefined,
        images: images !== undefined ? (typeof images === 'string' ? images : JSON.stringify(images)) : undefined,
        promotion: promotion !== undefined ? Boolean(promotion) : undefined,
        isNew: isNew !== undefined ? Boolean(isNew) : undefined,
        installmentCount: installmentCount !== undefined ? (installmentCount ? parseInt(installmentCount, 10) : null) : undefined,
        installmentAmount: installmentAmount !== undefined ? (installmentAmount ? parseInt(installmentAmount, 10) : null) : undefined,
        status: status !== undefined ? status : undefined,
        categoryId: categoryId !== undefined ? (categoryId || null) : undefined
      },
      include: { category: true }
    })

    res.json(updated)
  } catch (err) {
    console.error('Error updating product:', err)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// Quick status toggle
app.patch('/api/admin/products/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    if (!['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: { status },
      include: { category: true }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product status' })
  }
})

// Delete product
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.product.delete({ where: { id } })
    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (err) {
    console.error('Error deleting product:', err)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

const PORT = process.env.PORT || 3001
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`)
  })
}

export default app

