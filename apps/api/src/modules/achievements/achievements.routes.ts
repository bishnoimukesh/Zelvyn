import { Router } from 'express';
import {
  getGamification,
  unlockAchievement,
  addXp,
} from './achievements.controller.js';

const router = Router();

router.get('/:userId', getGamification);
router.post('/:userId/unlock', unlockAchievement);
router.post('/:userId/xp', addXp);

export default router;
