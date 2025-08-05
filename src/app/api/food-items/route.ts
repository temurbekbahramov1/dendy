import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const where = categoryId ? { categoryId } : {};

    const foodItems = await db.foodItem.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(foodItems);
  } catch (error) {
    console.error('Error fetching food items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameUz, nameRu, price, discountedPrice, categoryId, image, description, isAvailable, isSpecial } = body;

    const foodItem = await db.foodItem.create({
      data: {
        name,
        nameUz,
        nameRu,
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        categoryId,
        image,
        description,
        isAvailable: isAvailable ?? true,
        isSpecial: isSpecial ?? false,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(foodItem, { status: 201 });
  } catch (error) {
    console.error('Error creating food item:', error);
    return NextResponse.json(
      { error: 'Failed to create food item' },
      { status: 500 }
    );
  }
}