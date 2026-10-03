import { apiClient, ApiResponse } from "./apiClient";
import { WorkoutVideo } from "@/types";

export interface VideoListResponse {
  items: WorkoutVideo[];
  total: number;
  bookmarkedIds: string[];
}

export interface VideoFilterParams {
  category?: string;
  difficulty?: string;
  search?: string;
  userId?: string;
}

export const videoService = {
  /**
   * Fetch list of videos with optional filtering
   */
  async getVideos(params: VideoFilterParams = {}): Promise<VideoListResponse> {
    const query = new URLSearchParams();
    if (params.category && params.category !== "all") query.append("category", params.category);
    if (params.difficulty && params.difficulty !== "all") query.append("difficulty", params.difficulty);
    if (params.search) query.append("search", params.search);
    if (params.userId) query.append("userId", params.userId);

    const qs = query.toString();
    const endpoint = qs ? `/videos?${qs}` : "/videos";
    const res = await apiClient.get<ApiResponse<VideoListResponse>>(endpoint);
    return res.data;
  },

  /**
   * Get single video by ID
   */
  async getVideoById(id: string): Promise<WorkoutVideo> {
    const res = await apiClient.get<ApiResponse<WorkoutVideo>>(`/videos/${id}`);
    return res.data;
  },

  /**
   * Toggle video bookmark for user
   */
  async toggleBookmark(
    videoId: string,
    userId: string
  ): Promise<{ videoId: string; isBookmarked: boolean }> {
    const res = await apiClient.post<ApiResponse<{ videoId: string; isBookmarked: boolean }>>(
      `/videos/${videoId}/bookmark`,
      { userId }
    );
    return res.data;
  },
};
