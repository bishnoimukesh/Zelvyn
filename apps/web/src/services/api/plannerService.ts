import { apiClient, ApiResponse } from "./apiClient";
import { CalendarDayEntry, ReminderConfig, SplitTemplate } from "@/types";
import { DaySchedule } from "@/features/planner/plannerSlice";

export interface PlannerResponseData {
  userId: string;
  schedule: DaySchedule[];
  monthDays: CalendarDayEntry[];
  reminderSettings: ReminderConfig;
  updatedAt?: string;
}

export const plannerService = {
  /**
   * Fetch complete planner data for a user
   */
  async getPlanner(userId: string): Promise<PlannerResponseData> {
    const res = await apiClient.get<ApiResponse<PlannerResponseData>>(`/planner/${userId}`);
    return res.data;
  },

  /**
   * Save / update the full 7-day microcycle schedule
   */
  async updateSchedule(
    userId: string,
    schedule: DaySchedule[]
  ): Promise<PlannerResponseData> {
    const res = await apiClient.put<ApiResponse<PlannerResponseData>>(
      `/planner/${userId}/schedule`,
      { schedule }
    );
    return res.data;
  },

  /**
   * Update a specific month calendar day entry
   */
  async updateMonthDay(
    userId: string,
    dayData: Partial<CalendarDayEntry> & { dateString: string }
  ): Promise<PlannerResponseData> {
    const res = await apiClient.put<ApiResponse<PlannerResponseData>>(
      `/planner/${userId}/month-day`,
      dayData
    );
    return res.data;
  },

  /**
   * Update reminder notification settings
   */
  async updateReminderSettings(
    userId: string,
    settings: Partial<ReminderConfig>
  ): Promise<ReminderConfig> {
    const res = await apiClient.put<ApiResponse<ReminderConfig>>(
      `/planner/${userId}/reminders`,
      settings
    );
    return res.data;
  },

  /**
   * Apply a predefined workout split template to the weekly schedule
   */
  async applySplitTemplate(
    userId: string,
    template: SplitTemplate
  ): Promise<PlannerResponseData> {
    const res = await apiClient.post<ApiResponse<PlannerResponseData>>(
      `/planner/${userId}/apply-template`,
      {
        templateId: template.id,
        scheduleMap: template.scheduleMap,
      }
    );
    return res.data;
  },
};
