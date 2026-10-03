import { Request, Response } from 'express';
import { HabitModel } from './habits.model.js';
import { DEFAULT_HABITS, SeedHabit } from './habits.seed.js';
import { getDbStatus } from '../../database/db.js';

const memoryHabits: Map<string, SeedHabit[]> = new Map();

function getMemoryStore(userId: string): SeedHabit[] {
  if (!memoryHabits.has(userId)) {
    memoryHabits.set(userId, JSON.parse(JSON.stringify(DEFAULT_HABITS)));
  }
  return memoryHabits.get(userId)!;
}

export const getHabits = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.query.userId as string) || 'default_user';
    const isConnected = getDbStatus() === 'connected';

    if (isConnected) {
      let habits = await HabitModel.find({ userId }).sort({ createdAt: 1 });

      if (habits.length === 0) {
        // Seed default habits for user
        const toInsert = DEFAULT_HABITS.map((h) => ({
          ...h,
          userId,
          lastUpdatedDate: new Date().toISOString().split('T')[0],
          history: [],
        }));
        await HabitModel.insertMany(toInsert);
        habits = await HabitModel.find({ userId }).sort({ createdAt: 1 });
      }

      res.json({
        success: true,
        source: 'mongodb',
        data: habits,
      });
      return;
    }

    const fallbackHabits = getMemoryStore(userId);
    res.json({
      success: true,
      source: 'in-memory',
      data: fallbackHabits,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch habits',
      error: error.message,
    });
  }
};

export const updateHabitProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.body.userId as string) || 'default_user';
    const { habitId, delta, value } = req.body;

    if (!habitId) {
      res.status(400).json({ success: false, message: 'habitId is required' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const isConnected = getDbStatus() === 'connected';

    if (isConnected) {
      let habit = await HabitModel.findOne({ userId, habitId });

      if (!habit) {
        // If not found, check if it's in default habits and create it
        const seed = DEFAULT_HABITS.find((h) => h.habitId === habitId);
        if (seed) {
          habit = await HabitModel.create({
            ...seed,
            userId,
            lastUpdatedDate: today,
            history: [],
          });
        } else {
          res.status(404).json({ success: false, message: 'Habit not found' });
          return;
        }
      }

      let newCurrent = habit.current;
      if (typeof value === 'number') {
        newCurrent = Math.max(0, value);
      } else if (typeof delta === 'number') {
        newCurrent = Math.max(0, habit.current + delta);
      }

      habit.current = newCurrent;
      habit.lastUpdatedDate = today;

      // Update history and streak if completed
      const existingHistoryIdx = habit.history.findIndex((h) => h.date === today);
      const isCompleted = habit.current >= habit.target;

      if (existingHistoryIdx >= 0) {
        habit.history[existingHistoryIdx].value = habit.current;
        habit.history[existingHistoryIdx].completed = isCompleted;
      } else {
        habit.history.push({
          date: today,
          value: habit.current,
          completed: isCompleted,
        });
      }

      await habit.save();

      res.json({
        success: true,
        source: 'mongodb',
        data: habit,
      });
      return;
    }

    // In-memory fallback
    const store = getMemoryStore(userId);
    const habit = store.find((h) => h.habitId === habitId);
    if (!habit) {
      res.status(404).json({ success: false, message: 'Habit not found in memory' });
      return;
    }

    if (typeof value === 'number') {
      habit.current = Math.max(0, value);
    } else if (typeof delta === 'number') {
      habit.current = Math.max(0, habit.current + delta);
    }

    res.json({
      success: true,
      source: 'in-memory',
      data: habit,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update habit progress',
      error: error.message,
    });
  }
};

export const addCustomHabit = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.body.userId as string) || 'default_user';
    const { name, target, unit, color, iconKey, step, category } = req.body;

    if (!name || !target) {
      res.status(400).json({ success: false, message: 'name and target are required' });
      return;
    }

    const habitId = `custom_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const isConnected = getDbStatus() === 'connected';

    const newHabitData = {
      userId,
      habitId,
      name,
      current: 0,
      target: Number(target),
      unit: unit || 'times',
      color: color || '#C8FF47',
      iconKey: iconKey || 'Sparkles',
      step: Number(step) || 1,
      streak: 0,
      category: category || 'custom',
      lastUpdatedDate: today,
      history: [],
    };

    if (isConnected) {
      const created = await HabitModel.create(newHabitData);
      res.status(201).json({
        success: true,
        source: 'mongodb',
        data: created,
      });
      return;
    }

    const store = getMemoryStore(userId);
    store.push({
      habitId,
      name,
      current: 0,
      target: Number(target),
      unit: unit || 'times',
      color: color || '#C8FF47',
      iconKey: iconKey || 'Sparkles',
      step: Number(step) || 1,
      streak: 0,
      category: (category as any) || 'custom',
    });

    res.status(201).json({
      success: true,
      source: 'in-memory',
      data: newHabitData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to add custom habit',
      error: error.message,
    });
  }
};

export const deleteHabit = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.query.userId as string) || 'default_user';
    const { id } = req.params;
    const isConnected = getDbStatus() === 'connected';

    if (isConnected) {
      const deleted = await HabitModel.findOneAndDelete({ userId, habitId: id });
      res.json({
        success: true,
        source: 'mongodb',
        message: deleted ? 'Habit deleted' : 'Habit not found',
      });
      return;
    }

    const store = getMemoryStore(userId);
    const idx = store.findIndex((h) => h.habitId === id);
    if (idx !== -1) {
      store.splice(idx, 1);
    }
    res.json({
      success: true,
      source: 'in-memory',
      message: 'Habit deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete habit',
      error: error.message,
    });
  }
};
