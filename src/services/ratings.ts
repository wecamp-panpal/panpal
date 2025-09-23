import axiosClient from '@/lib/axiosClient';
import config from '@/lib/config';

// User interface for ratings
export interface RatingUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

// Reply interface
export interface RatingReply {
  id: string;
  content: string;
  user: RatingUser;
  createdAt: string;
  updatedAt: string;
}

// Rating interface matching backend response
export interface Rating {
  id: string;
  score: number;
  comment?: string;
  imageUrls: string[];
  isHelpful: number;
  user: RatingUser;
  replies: RatingReply[];
  createdAt: string;
  updatedAt: string;
  // Legacy support
  user_id?: string;
  recipe_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Rating statistics
export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

// Rating list response with pagination
export interface RatingListResponse {
  items: Rating[];
  stats: RatingStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter options for ratings
export interface RatingFilter {
  recipeId: string;
  page?: number;
  limit?: number;
  stars?: string; // '1', '2', '3', '4', '5'
  filter?: 'all' | 'with_images' | 'with_comments';
  sortBy?: 'newest' | 'oldest' | 'helpful' | 'rating_high' | 'rating_low';
}

// Create rating request
export interface CreateRatingRequest {
  recipeId: string;
  score: number;
  comment?: string;
  imageUrls?: string[];
}

// Create rating reply request
export interface CreateRatingReplyRequest {
  ratingId: string;
  content: string;
}

// Image upload response
export interface ImageUploadResponse {
  success: boolean;
  images: Array<{
    url: string;
    filePath: string;
    originalName: string;
    size: number;
    mimeType: string;
  }>;
  imageUrls: string[];
}

// Generic success response
export interface SuccessResponse {
  success: boolean;
}

// Can rate response
export interface CanRateResponse {
  canRate: boolean;
  reason?: string;
}

// Get ratings by recipe ID with filters and pagination
export async function getRatingsByRecipeId(filter: RatingFilter): Promise<RatingListResponse> {
  try {
    const response = await axiosClient.get(config.ENDPOINTS.RATINGS.LIST, {
      params: filter,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch ratings:', error);
    throw new Error('Failed to fetch ratings');
  }
}

// Get rating summary for a recipe
export async function getRatingSummary(recipeId: string): Promise<RatingStats> {
  try {
    const response = await axiosClient.get(config.ENDPOINTS.RATINGS.SUMMARY(recipeId));
    return response.data;
  } catch (error) {
    console.error('Failed to fetch rating summary:', error);
    throw new Error('Failed to fetch rating summary');
  }
}

// Upload images for rating
export async function uploadRatingImages(images: File[]): Promise<ImageUploadResponse> {
  try {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    const response = await axiosClient.post(config.ENDPOINTS.RATINGS.UPLOAD_IMAGES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload rating images:', error);
    throw new Error('Failed to upload rating images');
  }
}

// Create or update a rating
export async function upsertRating(ratingData: CreateRatingRequest): Promise<SuccessResponse> {
  try {
    const response = await axiosClient.post(config.ENDPOINTS.RATINGS.CREATE, ratingData);
    return response.data;
  } catch (error) {
    console.error('Failed to create/update rating:', error);
    throw new Error('Failed to post rating');
  }
}

// Delete a rating
export async function deleteRating(recipeId: string): Promise<SuccessResponse> {
  try {
    const response = await axiosClient.delete(config.ENDPOINTS.RATINGS.DELETE(recipeId));
    return response.data;
  } catch (error) {
    console.error('Failed to delete rating:', error);
    throw new Error('Failed to delete rating');
  }
}

// Get user's rating for a specific recipe
export async function getUserRatingForRecipe(recipeId: string): Promise<Rating | null> {
  try {
    const response = await axiosClient.get(config.ENDPOINTS.RATINGS.USER_RATING(recipeId));
    return response.data;
  } catch (error) {
    console.error('Failed to get user rating:', error);
    return null;
  }
}

// Check if user can rate a recipe
export async function canUserRate(recipeId: string): Promise<CanRateResponse> {
  try {
    const response = await axiosClient.get(config.ENDPOINTS.RATINGS.CAN_RATE(recipeId));
    return response.data;
  } catch (error) {
    console.error('Failed to check if user can rate:', error);
    return { canRate: false, reason: 'Error checking permissions' };
  }
}

// Create a reply to a rating (author only)
export async function createRatingReply(
  replyData: CreateRatingReplyRequest
): Promise<{ success: boolean; reply: RatingReply }> {
  try {
    const response = await axiosClient.post(config.ENDPOINTS.RATINGS.REPLY, replyData);
    return response.data;
  } catch (error) {
    console.error('Failed to create rating reply:', error);
    throw new Error('Failed to create reply');
  }
}

// Mark a rating as helpful
export async function markRatingHelpful(ratingId: string): Promise<SuccessResponse> {
  try {
    const response = await axiosClient.post(config.ENDPOINTS.RATINGS.MARK_HELPFUL(ratingId));
    return response.data;
  } catch (error) {
    console.error('Failed to mark rating as helpful:', error);
    throw new Error('Failed to mark rating as helpful');
  }
}

// Legacy support functions
export async function createRating(ratingData: CreateRatingRequest): Promise<Rating> {
  await upsertRating(ratingData);
  // Return a mock rating object for compatibility
  return {
    id: 'temp-id',
    score: ratingData.score,
    comment: ratingData.comment,
    imageUrls: ratingData.imageUrls || [],
    isHelpful: 0,
    user: { id: 'temp-user', name: 'Current User' },
    replies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function createRatingWithImages(formData: FormData): Promise<Rating> {
  // Extract data from FormData
  const recipeId = formData.get('recipeId') as string;
  const score = parseInt(formData.get('score') as string);
  const comment = formData.get('comment') as string;

  // Upload images first
  const images = formData.getAll('images') as File[];
  let imageUrls: string[] = [];

  if (images.length > 0) {
    const uploadResult = await uploadRatingImages(images);
    imageUrls = uploadResult.imageUrls;
  }

  // Create rating with image URLs
  await upsertRating({
    recipeId,
    score,
    comment: comment || undefined,
    imageUrls,
  });

  // Return a mock rating object for compatibility
  return {
    id: 'temp-id',
    score,
    comment: comment || undefined,
    imageUrls,
    isHelpful: 0,
    user: { id: 'temp-user', name: 'Current User' },
    replies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Legacy function for backward compatibility
export interface DeleteRatingRequest {
  recipeId: string;
}

export async function deleteRatingLegacy(deleteData: DeleteRatingRequest): Promise<void> {
  await deleteRating(deleteData.recipeId);
}
