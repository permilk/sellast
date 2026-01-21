
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Create Default User (Super Admin)
    const adminEmail = 'admin@sellast.com'
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
        },
    })
    console.log('👤 Admin user created/found:', admin.email)

    // 2. Create Default Warehouse
    const warehouse = await prisma.warehouse.upsert({
        where: { id: 'default-warehouse' }, // Using fixed ID for simplicity or uuid
        update: {},
        create: {
            id: 'default-warehouse',
            name: 'Tienda Principal',
            address: 'Calle Principal 123'
        }
    })
    console.log('🏭 Warehouse created/found:', warehouse.name)

    // 3. Create Default Category
    const category = await prisma.category.create({
        data: {
            name: 'General',
            description: 'Productos generales'
        }
    })

    // 4. Create Sample Product
    const product = await prisma.product.create({
        data: {
            name: 'Camiseta Básica',
            description: 'Camiseta de algodón 100%',
            categoryId: category.id,
            price: 250,
            stock: 100,
            variants: {
                create: {
                    name: 'Blanca / M',
                    sku: 'CAM-BLA-M',
                    costPrice: 100,
                    salePrice: 250,
                    barcode: '75010000001',
                    inventory: {
                        create: {
                            warehouseId: warehouse.id,
                            quantity: 50,
                            minStock: 5
                        }
                    }
                }
            }
        }
    })
    console.log('👕 Product created:', product.name)

    console.log('✅ Seed finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
