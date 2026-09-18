import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const prisma = new PrismaClient()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDataPath = path.join(__dirname, '../src/data')

async function main() {
  console.log('Reading JSON data...')
  
  // 1. Load Categories
  const categoriesData = JSON.parse(fs.readFileSync(path.join(srcDataPath, 'categories.json'), 'utf8'))
  
  // 2. Load Products
  const productsData = JSON.parse(fs.readFileSync(path.join(srcDataPath, 'products.json'), 'utf8'))
  
  // 3. Load Homepage structure
  const homepageData = JSON.parse(fs.readFileSync(path.join(srcDataPath, 'homepage.json'), 'utf8'))

  console.log('Seeding Categories...')
  for (const [index, cat] of categoriesData.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.id },
      update: {
        name: cat.name,
        image: cat.image,
        order: index
      },
      create: {
        name: cat.name,
        slug: cat.id,
        image: cat.image,
        order: index
      }
    })
  }

  console.log('Seeding Products...')
  for (const prod of productsData) {
    // Basic mapping
    const status = "PUBLISHED" 
    const images = prod.images ? JSON.stringify(prod.images) : null
    
    // Attempt to map category. The old JSON had a category ID string. 
    // We'll link it if it exists
    let categoryId = null
    if (prod.category) {
      const cat = await prisma.category.findUnique({ where: { slug: prod.category } })
      if (cat) categoryId = cat.id
    }

    await prisma.product.upsert({
      where: { slug: prod.id },
      update: {
        name: prod.name,
        priceCents: prod.priceCents,
        image: prod.image,
        images,
        description: prod.description || null,
        promotion: !!prod.promotion,
        isNew: !!prod.isNew,
        installmentCount: prod.installment?.count || null,
        installmentAmount: prod.installment?.amountCents || null,
        status,
        categoryId
      },
      create: {
        name: prod.name,
        slug: prod.id,
        priceCents: prod.priceCents,
        image: prod.image,
        images,
        description: prod.description || null,
        promotion: !!prod.promotion,
        isNew: !!prod.isNew,
        installmentCount: prod.installment?.count || null,
        installmentAmount: prod.installment?.amountCents || null,
        status,
        categoryId
      }
    })
  }

  console.log('Seeding Homepage Sections & Carousel...')
  
  // Create Hero Carousel Slide
  await prisma.carouselSlide.create({
    data: {
      image: "/images/hero/slide-1.png",
      eyebrow: "PARA O SEU SETUP",
      titleLine1: "Tecnologia",
      titleLine2: "para seu setup",
      description: "Computadores, periféricos e componentes com qualidade e garantia.",
      order: 0
    }
  })

  // Create Homepage Sections
  await prisma.homepageSection.create({
    data: { type: "CATEGORIES", title: "Categorias", subtitle: "Encontre exatamente o que você precisa para o seu setup.", order: 0 }
  })
  await prisma.homepageSection.create({
    data: { type: "FEATURED_PRODUCTS", title: "Produtos em destaque", subtitle: "Nossa seleção especial para você.", order: 1 }
  })

  // Create an Admin User
  console.log('Creating Admin User...')
  // Using a hardcoded bcrypt hash for "admin123" for development purposes
  // Password: admin123 => bcrypt hash: $2b$10$X8aL6Y5G9Gg0C/gqA8a9FOb/QvQp9.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q. (dummy, we should use real bcrypt)
  
  // Actually I can just import bcrypt, but maybe not installed. Let's install bcryptjs.
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
