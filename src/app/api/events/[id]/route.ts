import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Event from '@/models/Event';
import { eventSchema } from '@/lib/validators';
import { getBearerToken, verifyAdminToken } from '@/lib/auth';

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  await connectToDatabase();
  const event = await Event.findById(params.id).lean();
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const token = getBearerToken(req.headers.get('authorization'));
  const admin = verifyAdminToken(token);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await req.json();
  const parsed = eventSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }
  await connectToDatabase();
  const updated = await Event.findByIdAndUpdate(params.id, parsed.data, { new: true });
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event: updated });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const token = getBearerToken(req.headers.get('authorization'));
  const admin = verifyAdminToken(token);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();
  const deleted = await Event.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

