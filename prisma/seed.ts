import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.admin.create({
    data: {
      id: uuidv4(),
      username: 'dendyuz',
      password: 'parolyoq', // In production, this should be hashed
    },
  });

  // Create categories
  const hotdogCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Hotdogs',
      nameUz: 'Hotdoglar',
      nameRu: 'Хотдоги',
    },
  });

  const burgerCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Burgers',
      nameUz: 'Gamburgerlar',
      nameRu: 'Бургеры',
    },
  });

  const sidesCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Sides',
      nameUz: 'Qo\'shimchalar',
      nameRu: 'Гарниры',
    },
  });

  const drinksCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Drinks',
      nameUz: 'Ichimliklar',
      nameRu: 'Напитки',
    },
  });

  const combosCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Combos',
      nameUz: 'Kombo\'lar',
      nameRu: 'Комбо',
    },
  });

  // Create food items
  const foodItems = [
    {
      id: uuidv4(),
      name: 'Hotdog 5 tasi 1 da',
      nameUz: 'Hotdog 5 tasi 1 da',
      nameRu: 'Хотдог 5 штук за 1',
      price: 15000,
      discountedPrice: 12000,
      categoryId: hotdogCategory.id,
      isSpecial: true,
    },
    {
      id: uuidv4(),
      name: 'Hotdog 5 tasi 1 da (Big)',
      nameUz: 'Hotdog 5 tasi 1 da (Katta)',
      nameRu: 'Хотдог 5 штук за 1 (Большой)',
      price: 20000,
      discountedPrice: 17000,
      categoryId: hotdogCategory.id,
      isSpecial: true,
    },
    {
      id: uuidv4(),
      name: 'Gamburger 5 tasi 1 da',
      nameUz: 'Gamburger 5 tasi 1 da',
      nameRu: 'Гамбургер 5 штук за 1',
      price: 18000,
      discountedPrice: 15000,
      categoryId: burgerCategory.id,
      isSpecial: true,
    },
    {
      id: uuidv4(),
      name: 'Chicken Burger 5 tasi 1 da',
      nameUz: 'Chicken Burger 5 tasi 1 da',
      nameRu: 'Чикен Бургер 5 штук за 1',
      price: 19000,
      discountedPrice: 16000,
      categoryId: burgerCategory.id,
      isSpecial: true,
    },
    {
      id: uuidv4(),
      name: 'Gamburger',
      nameUz: 'Gamburger',
      nameRu: 'Гамбургер',
      price: 12000,
      categoryId: burgerCategory.id,
    },
    {
      id: uuidv4(),
      name: 'DablBurger',
      nameUz: 'DablBurger',
      nameRu: 'ДаблБургер',
      price: 15000,
      categoryId: burgerCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Chizburger',
      nameUz: 'Chizburger',
      nameRu: 'Чизбургер',
      price: 13000,
      categoryId: burgerCategory.id,
    },
    {
      id: uuidv4(),
      name: 'DablChizburger',
      nameUz: 'DablChizburger',
      nameRu: 'ДаблЧизбургер',
      price: 16000,
      categoryId: burgerCategory.id,
    },
    {
      id: uuidv4(),
      name: 'ChickenDog 5 tasi 1 da',
      nameUz: 'ChickenDog 5 tasi 1 da',
      nameRu: 'ЧикенДог 5 штук за 1',
      price: 17000,
      discountedPrice: 14000,
      categoryId: hotdogCategory.id,
      isSpecial: true,
    },
    {
      id: uuidv4(),
      name: 'Hot-Dog',
      nameUz: 'Hot-Dog',
      nameRu: 'Хот-Дог',
      price: 8000,
      categoryId: hotdogCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Hot-Dog (big)',
      nameUz: 'Hot-Dog (katta)',
      nameRu: 'Хот-Дог (большой)',
      price: 10000,
      categoryId: hotdogCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Kartoshka Fri',
      nameUz: 'Kartoshka Fri',
      nameRu: 'Картошка Фри',
      price: 6000,
      categoryId: sidesCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Coca Cola 0.5',
      nameUz: 'Coca Cola 0.5',
      nameRu: 'Кока Кола 0.5',
      price: 5000,
      categoryId: drinksCategory.id,
    },
    {
      id: uuidv4(),
      name: 'ChickenBurger',
      nameUz: 'ChickenBurger',
      nameRu: 'ЧикенБургер',
      price: 14000,
      categoryId: burgerCategory.id,
    },
    {
      id: uuidv4(),
      name: 'IceCoffee',
      nameUz: 'IceCoffee',
      nameRu: 'АйсКофе',
      price: 7000,
      categoryId: drinksCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Klab Sendwich',
      nameUz: 'Klab Sendwich',
      nameRu: 'Клаб Сэндвич',
      price: 16000,
      categoryId: burgerCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Klab Sendwich Fri bilan',
      nameUz: 'Klab Sendwich Fri bilan',
      nameRu: 'Клаб Сэндвич с Фри',
      price: 20000,
      categoryId: combosCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Fri va Cola',
      nameUz: 'Fri va Cola',
      nameRu: 'Фри и Кола',
      price: 10000,
      categoryId: combosCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Naggets 4',
      nameUz: 'Naggets 4',
      nameRu: 'Наггетсы 4',
      price: 12000,
      categoryId: sidesCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Naggets 8',
      nameUz: 'Naggets 8',
      nameRu: 'Наггетсы 8',
      price: 20000,
      categoryId: sidesCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Strips',
      nameUz: 'Strips',
      nameRu: 'Стрипсы',
      price: 15000,
      categoryId: sidesCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Moxito Classic',
      nameUz: 'Moxito Classic',
      nameRu: 'Мохито Классик',
      price: 8000,
      categoryId: drinksCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Combo 2',
      nameUz: 'Combo 2',
      nameRu: 'Комбо 2',
      price: 25000,
      categoryId: combosCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Chizburger set 4',
      nameUz: 'Chizburger set 4',
      nameRu: 'Чизбургер сет 4',
      price: 30000,
      categoryId: combosCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Gigant Hot-Dog',
      nameUz: 'Gigant Hot-Dog',
      nameRu: 'Гигант Хот-Дог',
      price: 18000,
      categoryId: hotdogCategory.id,
    },
    {
      id: uuidv4(),
      name: 'Ice-Tea',
      nameUz: 'Ice-Tea',
      nameRu: 'Айс-Ти',
      price: 6000,
      categoryId: drinksCategory.id,
    },
  ];

  for (const item of foodItems) {
    await prisma.foodItem.create({
      data: item,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });