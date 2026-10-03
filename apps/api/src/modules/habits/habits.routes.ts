import { Router } from 'express';
import {
  getHabits,
  updateHabitProgress,
  addCustomHabit,
  deleteHabit,
} from './habits.controller.js';

const router = Router();

router.get('/', getHabits);
router.post('/progress', updateHabitProgress);
router.post('/custom', addCustomHabit);
router.delete('/:id', deleteHabit);

export default router;
