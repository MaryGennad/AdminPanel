// app/api/items/update/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { id, text } = await request.json();
    const db = await connectToDatabase();
    await db.collection('items').updateOne(
      { _id: new ObjectId(id) },
      { $set: { text } }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}