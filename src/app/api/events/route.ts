import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Event from '@/models/Event';
import { eventSchema } from '@/lib/validators';
import { getBearerToken, verifyAdminToken } from '@/lib/auth';

export async function GET() {
  await connectToDatabase();
  const events = await Event.find().sort({ date: 1 }).lean();
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const token = getBearerToken(req.headers.get('authorization'));
  const admin = verifyAdminToken(token);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await req.json();
  const parsed = eventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }
  await connectToDatabase();
  const created = await Event.create(parsed.data);
  return NextResponse.json({ event: created }, { status: 201 });
}
