import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/hotels
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const hotels = await prisma.hotel.findMany({
    include: { rooms: true, _count: { select: { rooms: true } } },
    orderBy: { id: 'asc' },
  });
  res.json({ hotels });
});

// GET /api/hotels/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params['id'] as string);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid hotel id' });
    return;
  }

  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: { rooms: true },
  });

  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }

  res.json({ hotel });
});

export default router;
