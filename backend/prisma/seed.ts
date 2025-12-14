import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sweets = [
    // Indian Sweets - Updated with Generated Images
    { name: 'Gulab Jamun', category: 'Indian', price: 4.99, description: 'Soft, saffron-spiced jamuns fried to perfection.', imageUrl: '/gulab-jamun.png' },
    { name: 'Rasgulla', category: 'Indian', price: 4.50, description: 'Spongy cottage cheese balls in sugar syrup.', imageUrl: '/rasgulla.png' },
    { name: 'Kaju Katli', category: 'Indian', price: 8.99, description: 'Diamond-shaped cashew fudge, a festive favorite.', imageUrl: '/kaju-katli.png' },
    { name: 'Jalebi', category: 'Indian', price: 3.99, description: 'Crispy, orange spirals soaked in saffron syrup.', imageUrl: '/jalebi.png' },
    { name: 'Besan Laddoo', category: 'Indian', price: 5.50, description: 'Roasted gram flour balls with ghee and nuts.', imageUrl: '/besan-laddoo.png' },
    { name: 'Rasmalai', category: 'Indian', price: 6.99, description: 'Soft paneer discs immersed in chilled creamy milk.', imageUrl: '/rasmalai.png' },
    { name: 'Mysore Pak', category: 'Indian', price: 7.50, description: 'Rich, melt-in-your-mouth ghee and gram flour fudge.', imageUrl: '/mysore-pak.png' },
    { name: 'Barfi', category: 'Indian', price: 6.00, description: 'Classic milk-based fudge topped with pistachios.', imageUrl: '/barfi.png' },
    { name: 'Soan Papdi', category: 'Indian', price: 4.99, description: 'Flaky and crisp sweet made with gram flour and ghee.', imageUrl: '/soan-papdi.png' },
    { name: 'Peda', category: 'Indian', price: 5.00, description: 'Semisoft milk solids sweet, often flavored with cardamom.', imageUrl: '/peda.png' },

    // International Sweets
    { name: 'Macaron', category: 'French', price: 2.50, description: 'Delicate meringue-based cookies with ganache filling.', imageUrl: '/macaron.png' },
    { name: 'Chocolate Brownie', category: 'Bakery', price: 3.50, description: 'Fudgy, rich chocolate square with a crackly top.', imageUrl: '/chocolate-brownie.png' },
    { name: 'New York Cheesecake', category: 'Cake', price: 5.99, description: 'Classic creamy cheesecake with a graham cracker crust.', imageUrl: '/cheesecake.png' },
    { name: 'Tiramisu', category: 'Italian', price: 6.50, description: 'Coffee-flavoured Italian dessert with ladyfingers and mascarpone.', imageUrl: '/tiramisu.png' },
    { name: 'Red Velvet Cupcake', category: 'Bakery', price: 3.00, description: 'Soft red velvet cake topped with cream cheese frosting.', imageUrl: '/red-velvet-cupcake.png' },
    { name: 'Glazed Donut', category: 'Bakery', price: 1.99, description: 'Fluffy fried dough ring coated in a sweet sugar glaze.', imageUrl: '/glazed-donut.png' },
    { name: 'Eclair', category: 'French', price: 4.00, description: 'Choux pastry filled with cream and topped with chocolate icing.', imageUrl: '/eclair.png' },
    { name: 'Baklava', category: 'Middle Eastern', price: 5.50, description: 'Phyllo pastry filled with chopped nuts and sweetened with syrup.', imageUrl: '/baklava.png' },
    { name: 'Cannoli', category: 'Italian', price: 4.50, description: 'Fried pastry tubes filled with a sweet creamy ricotta filling.', imageUrl: '/cannoli.png' },
    { name: 'Mochi', category: 'Japanese', price: 2.99, description: 'Soft and chewy rice cake, often filled with sweet bean paste.', imageUrl: '/mochi.png' },
    { name: 'Apple Pie', category: 'Bakery', price: 12.99, description: 'Classic pie with a flaky crust and spiced apple filling.', imageUrl: '/apple-pie.png' },
    { name: 'Cinnamon Roll', category: 'Bakery', price: 3.99, description: 'Sweet roll served warm with a rich cream cheese glaze.', imageUrl: '/cinnamon-roll.png' },
    { name: 'Panna Cotta', category: 'Italian', price: 5.99, description: 'Silky smooth sweetened cream thickened with gelatin.', imageUrl: '/panna-cotta.png' },
    { name: 'Pavlova', category: 'Dessert', price: 6.50, description: 'Meringue-based dessert with a crisp crust and soft, light inside.', imageUrl: '/pavlova.png' },
    { name: 'Gelato', category: 'Italian', price: 4.50, description: 'Italian ice cream, richer and denser than regular ice cream.', imageUrl: '/gelato.png' },
    { name: 'Churros', category: 'Spanish', price: 4.00, description: 'Fried dough pastry dusted with cinnamon sugar.', imageUrl: '/churros.png' },
    { name: 'Belgian Waffle', category: 'Breakfast', price: 5.50, description: 'Light batter waffle with deep pockets, served with syrup.', imageUrl: '/belgian-waffle.png' },
    { name: 'Croissant', category: 'Bakery', price: 2.99, description: 'Buttery, flaky, viennoiserie pastry.', imageUrl: '/croissant.png' },
    { name: 'Truffles', category: 'Chocolate', price: 1.50, description: 'Rich chocolate ganache coated in cocoa powder or nuts.', imageUrl: '/truffles.png' },
    { name: 'Chocolate Fudge', category: 'Chocolate', price: 4.00, description: 'Rich, creamy chocolate fudge squares.', imageUrl: '/chocolate-fudge.png' },
    { name: 'Lemon Tart', category: 'Dessert', price: 4.50, description: 'Tangy lemon filling in a crisp pastry shell.', imageUrl: '/lemon-tart.png' }
];

async function main() {
    console.log('Seeding images...');

    for (const sweet of sweets) {
        // Find by name
        const existing = await prisma.sweet.findFirst({
            where: { name: sweet.name }
        });

        if (existing) {
            if (sweet.imageUrl) {
                await prisma.sweet.update({
                    where: { id: existing.id },
                    data: { imageUrl: sweet.imageUrl }
                });
                console.log(`Updated image for ${sweet.name}`);
            }
        } else {
            await prisma.sweet.create({
                data: {
                    name: sweet.name,
                    category: sweet.category,
                    price: sweet.price,
                    description: sweet.description,
                    quantity: 20, // default
                    imageUrl: sweet.imageUrl || null
                }
            });
            console.log(`Created ${sweet.name}`);
        }
    }
    console.log('Finalized seeding.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
