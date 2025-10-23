// app/api/items/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const items = await db.collection('items').find({}).toArray();

    if (items.length === 0) {
      const defaultItems = [
        { text: 'Товар 1' },
        { text: 'Товар 2' },
        { text: 'Товар 3' },
      ];
      const result = await db.collection('items').insertMany(defaultItems);
      // Возвращаем с _id как строки
      return NextResponse.json(
        defaultItems.map((item, i) => ({
          id: result.insertedIds[i].toString(),
          text: item.text,
        }))
      );
    }

    return NextResponse.json(
      items.map(item => ({
        id: item._id.toString(),
        text: item.text,
      }))
    );
  } catch (e) {
    console.error('DB Error:', e);
    // ❗ Возвращаем пустой массив вместо объекта с ошибкой
    return NextResponse.json([]);
  }
}
