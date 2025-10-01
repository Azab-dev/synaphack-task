
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Event from '@/models/Event';
import { eventSchema } from '@/lib/validators';
import { getBearerToken, verifyAdminToken } from '@/lib/auth';

// Helper to get `id` from the request URL
function getIdFromRequest(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/');
  return segments[segments.length - 1]; // last segment = id
}

export async function GET(req: NextRequest) {
  const id = getIdFromRequest(req);
  await connectToDatabase();
  const event = await Event.findById(id).lean();
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event });
}

export async function PUT(req: NextRequest) {
  const id = getIdFromRequest(req);

  const token = getBearerToken(req.headers.get('authorization'));
  const admin = verifyAdminToken(token);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await req.json();
  const parsed = eventSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  await connectToDatabase();
  const updated = await Event.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event: updated });
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromRequest(req);

  const token = getBearerToken(req.headers.get('authorization'));
  const admin = verifyAdminToken(token);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  const deleted = await Event.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
