import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, nameUz, nameRu, price, discountedPrice, categoryId, image, description, isAvailable, isSpecial } = body;

    const foodItem = await db.foodItem.update({
      where: { id: params.id },
      data: {
        name,
        nameUz,
        nameRu,
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        categoryId,
        image,
        description,
        isAvailable,
        isSpecial,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(foodItem);
  } catch (error) {
    console.error('Error updating food item:', error);
    return NextResponse.json(
      { error: 'Failed to update food item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.foodItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting food item:', error);
    return NextResponse.json(
      { error: 'Failed to delete food item' },
      { status: 500 }
    );
  }
}