import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { registrationSchema } from '@/lib/validators';
import Event from '@/models/Event';
import User from '@/models/User';
import Team from '@/models/Team';
import Registration from '@/models/Registration';

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = registrationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }
  const { eventId, name, email, college, phone, teamName } = parsed.data;

  await connectToDatabase();
  const event = await Event.findById(eventId);
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, college, phone });
  }

  let team = null as any;
  if (teamName) {
    team = await Team.findOne({ name: teamName });
    if (!team) team = await Team.create({ name: teamName, members: [user._id] });
    else if (!team.members.some((m: any) => String(m) === String(user._id))) {
      team.members.push(user._id);
      await team.save();
    }
  }

  try {
    const reg = await Registration.create({ event: event._id, user: user._id, team: team?._id });
    return NextResponse.json({ registration: reg }, { status: 201 });
  } catch (e: any) {
    if (e?.code === 11000) {
      return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const regs = await Registration.find()
      .populate('user')   
      .populate('event')   
      .populate('team');  

    return NextResponse.json({ registrations: regs }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
