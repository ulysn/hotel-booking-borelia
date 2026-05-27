import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

const reservationSchema = z.object({
  roomId: z.number().int().positive(),
  checkInDate: z.string().datetime(),
  checkOutDate: z.string().datetime(),
});

// POST /api/reservations  (auth required)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const result = reservationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { roomId, checkInDate, checkOutDate } = result.data;
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkOut <= checkIn) {
    res.status(400).json({ error: 'checkOutDate must be after checkInDate' });
    return;
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  // Check for overlapping reservations
  const conflict = await prisma.reservation.findFirst({
    where: {
      roomId,
      status: { not: 'CANCELLED' },
      AND: [
        { checkInDate: { lt: checkOut } },
        { checkOutDate: { gt: checkIn } },
      ],
    },
  });

  if (conflict) {
    res.status(409).json({ error: 'Room is not available for the selected dates' });
    return;
  }

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * room.pricePerNight;

  const reservation = await prisma.reservation.create({
    data: {
      userId: req.userId as number,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      status: 'CONFIRMED',
    },
    include: { room: { include: { hotel: true } } },
  });

  res.status(201).json({ reservation });
});

// GET /api/reservations/me  (auth required)
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const reservations = await prisma.reservation.findMany({
    where: { userId: req.userId as number },
    include: { room: { include: { hotel: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ reservations });
});

export default router;
