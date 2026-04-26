import { db } from './features/inventory/services/db';

async function seed() {
  const count = await db.inventory.count();
  if (count > 0) return;

  const items = [];
  for (let i = 1; i <= 20; i++) {
    items.push({
      designNo: `DESIGN-${String(i).padStart(3, '0')}`,
      image: 'https://placehold.co/600x400?text=Design+' + i,
      quantity: Math.floor(Math.random() * 100),
      price: Math.floor(Math.random() * 1000) + 100,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });
  }
  await db.inventory.bulkAdd(items);
  // eslint-disable-next-line no-console
  console.log('Seeded 20 items');
}

seed();
