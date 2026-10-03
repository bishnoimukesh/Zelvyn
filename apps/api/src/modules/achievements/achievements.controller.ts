import { Request, Response } from 'express';
import { GamificationModel } from './achievements.model.js';
import { DEFAULT_GAMIFICATION, SeedGamification } from './achievements.seed.js';
import { getDbStatus } from '../../database/db.js';

const memoryGamification: Map<string, SeedGamification> = new Map();

function getMemoryStore(userId: string): SeedGamification {
  if (!memoryGamification.has(userId)) {
    const clone = JSON.parse(JSON.stringify(DEFAULT_GAMIFICATION));
    clone.userId = userId;
    memoryGamification.set(userId, clone);
  }
  return memoryGamification.get(userId)!;
}

function computeLevelAndTitle(totalXp: number): { level: number; title: string; nextLevelXp: number } {
  // 200 XP per level progression base
  const level = Math.max(1, Math.floor(totalXp / 200) + 1);
  const nextLevelXp = level * 200;

  let title = 'Fitness Novice';
  if (level >= 20) title = 'Apex Legend';
  else if (level >= 15) title = 'Iron Master';
  else if (level >= 12) title = 'Fitness Explorer';
  else if (level >= 8) title = 'Dedicated Athlete';
  else if (level >= 4) title = 'Rising Striver';

  return { level, title, nextLevelXp };
}

export const getGamification = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.params.userId as string) || (req.query.userId as string) || 'default_user';
    const isConnected = getDbStatus() === 'connected';

    if (isConnected) {
      let data = await GamificationModel.findOne({ userId });

      if (!data) {
        data = await GamificationModel.create({
          ...DEFAULT_GAMIFICATION,
          userId,
        });
      }

      res.json({
        success: true,
        source: 'mongodb',
        data,
      });
      return;
    }

    const fallback = getMemoryStore(userId);
    res.json({
      success: true,
      source: 'in-memory',
      data: fallback,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gamification data',
      error: error.message,
    });
  }
};

export const unlockAchievement = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.params.userId as string) || 'default_user';
    const { achievementId } = req.body;

    if (!achievementId) {
      res.status(400).json({ success: false, message: 'achievementId is required' });
      return;
    }

    const todayDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date());
    const isConnected = getDbStatus() === 'connected';

    if (isConnected) {
      let doc = await GamificationModel.findOne({ userId });
      if (!doc) {
        doc = await GamificationModel.create({
          ...DEFAULT_GAMIFICATION,
          userId,
        });
      }

      const achievement = doc.achievements.find((a) => a.id === achievementId);
      if (!achievement) {
        res.status(404).json({ success: false, message: 'Achievement not found' });
        return;
      }

      if (!achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedDate = todayDate;
        doc.currentXp += achievement.xp;

        const progression = computeLevelAndTitle(doc.currentXp);
        doc.level = progression.level;
        doc.title = progression.title;
        doc.nextLevelXp = progression.nextLevelXp;

        await doc.save();
      }

      res.json({
        success: true,
        source: 'mongodb',
        data: doc,
      });
      return;
    }

    // In-memory fallback
    const store = getMemoryStore(userId);
    const achievement = store.achievements.find((a) => a.id === achievementId);
    if (!achievement) {
      res.status(404).json({ success: false, message: 'Achievement not found' });
      return;
    }

    if (!achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedDate = todayDate;
      store.currentXp += achievement.xp;

      const progression = computeLevelAndTitle(store.currentXp);
      store.level = progression.level;
      store.title = progression.title;
      store.nextLevelXp = progression.nextLevelXp;
    }

    res.json({
      success: true,
      source: 'in-memory',
      data: store,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to unlock achievement',
      error: error.message,
    });
  }
};

export const addXp = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.params.userId as string) || 'default_user';
    const { xp } = req.body;

    const amount = Number(xp) || 0;
    if (amount <= 0) {
      res.status(400).json({ success: false, message: 'xp must be greater than 0' });
      return;
    }

    const isConnected = getDbStatus() === 'connected';

    if (isConnected) {
      let doc = await GamificationModel.findOne({ userId });
      if (!doc) {
        doc = await GamificationModel.create({
          ...DEFAULT_GAMIFICATION,
          userId,
        });
      }

      doc.currentXp += amount;
      const progression = computeLevelAndTitle(doc.currentXp);
      doc.level = progression.level;
      doc.title = progression.title;
      doc.nextLevelXp = progression.nextLevelXp;

      await doc.save();

      res.json({
        success: true,
        source: 'mongodb',
        data: doc,
      });
      return;
    }

    const store = getMemoryStore(userId);
    store.currentXp += amount;
    const progression = computeLevelAndTitle(store.currentXp);
    store.level = progression.level;
    store.title = progression.title;
    store.nextLevelXp = progression.nextLevelXp;

    res.json({
      success: true,
      source: 'in-memory',
      data: store,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to add XP',
      error: error.message,
    });
  }
};
