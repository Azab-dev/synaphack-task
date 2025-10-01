import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  date: z.string().or(z.date()).transform((v) => (typeof v === 'string' ? new Date(v) : v)),
  location: z.string().min(2).max(200).optional(),
});

export type EventInput = z.infer<typeof eventSchema>;

export const registrationSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  college: z.string().min(2).max(200),
  phone: z.string().min(7).max(20),
  teamName: z.string().max(100).optional().or(z.literal('').transform(() => undefined)),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
