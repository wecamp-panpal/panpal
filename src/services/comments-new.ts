import axiosClient from '@/lib/axiosClient';
import config from '@/lib/config';

// Interfaces matching the new API structure
export interface CommentUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  rating?: number;
  imageUrls: string[];
  helpfulCount: number;
  isHelpful: boolean;
  user: CommentUser;
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  items: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    ratingsCount: number;
    commentsCount: number;
  };
}

export interface RatingSummary {
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

export interface CreateCommentRequest {
  recipeId: string;
  content: string;
  rating?: number;
  imageUrls?: string[];
}

export interface UpdateCommentRequest {
  content?: string;
  rating?: number;
  imageUrls?: string[];
}

export interface CommentFilter {
  recipeId: string;
  type?: 'all' | 'ratings' | 'comments';
  sortBy?: 'newest' | 'oldest' | 'most_helpful' | 'highest_rated';
  page?: number;
  limit?: number;
}

export interface ImageUploadResponse {
  success: boolean;
  images: Array<{
    url: string;
    filePath: string;
    originalName: string;
    size: number;
    mimeType: string;
  }>;
}

// Get comments and ratings for a recipe
export async function getComments(filter: CommentFilter): Promise<CommentListResponse> {
  try {
    const response = await axiosClient.get(config.ENDPOINTS.COMMENTS.LIST, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw new Error('Failed to fetch comments');
  }
}

// Create a new comment or rating
export async function createComment(data: CreateCommentRequest): Promise<Comment> {
  try {
    const response = await axiosClient.post(config.ENDPOINTS.COMMENTS.CREATE, data);
    return response.data;
  } catch (error) {
    console.error('Failed to create comment:', error);
    throw new Error('Failed to create comment');
  }
}

// Update a comment or rating
export async function updateComment(id: string, data: UpdateCommentRequest): Promise<Comment> {
  try {
    const response = await axiosClient.patch(config.ENDPOINTS.COMMENTS.UPDATE(id), data);
    return response.data;
  } catch (error) {
    console.error('Failed to update comment:', error);
    throw new Error('Failed to update comment');
  }
}

// Delete a comment or rating
export async function deleteComment(id: string): Promise<void> {
  try {
    await axiosClient.delete(config.ENDPOINTS.COMMENTS.DELETE(id));
  } catch (error) {
    console.error('Failed to delete comment:', error);
    throw new Error('Failed to delete comment');
  }
}

// Toggle helpful status for a comment
export async function toggleHelpful(
  commentId: string
): Promise<{ helpful: boolean; helpfulCount: number }> {
  try {
    const response = await axiosClient.post(config.ENDPOINTS.COMMENTS.TOGGLE_HELPFUL(commentId));
    return response.data;
  } catch (error) {
    console.error('Failed to toggle helpful:', error);
    throw new Error('Failed to toggle helpful');
  }
}

// Upload images for comments
export async function uploadCommentImages(
  commentId: string,
  files: File[]
): Promise<ImageUploadResponse> {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('commentImage', file);
    });

    const response = await axiosClient.post(
      config.ENDPOINTS.COMMENTS.UPLOAD_IMAGES(commentId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to upload images:', error);
    throw new Error('Failed to upload images');
  }
}

// Get rating statistics for a recipe
export async function getRatingSummary(recipeId: string): Promise<RatingSummary> {
  try {
    const response = await axiosClient.get(config.ENDPOINTS.COMMENTS.RATINGS_SUMMARY, {
      params: { recipeId },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch rating summary:', error);
    throw new Error('Failed to fetch rating summary');
  }
}

// Check if user can rate this recipe
export async function canUserRate(recipeId: string): Promise<{ canRate: boolean }> {
  try {
    const response = await axiosClient.get(config.ENDPOINTS.COMMENTS.CAN_RATE, {
      params: { recipeId },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to check if user can rate:', error);
    return { canRate: false };
  }
}

// Get current user's rating for a recipe
export async function getUserRating(recipeId: string): Promise<Comment | null> {
  try {
    const response = await axiosClient.get(config.ENDPOINTS.COMMENTS.MY_RATING, {
      params: { recipeId },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get user rating:', error);
    return null;
  }
}

// Create comment with images (helper function)
export async function createCommentWithImages(
  data: CreateCommentRequest,
  images?: File[]
): Promise<Comment> {
  try {
    // First create the comment
    const comment = await createComment(data);

    // Then upload images if provided
    if (images && images.length > 0) {
      await uploadCommentImages(comment.id, images);
      // Re-fetch the comment to get updated image URLs
      // Note: This might need adjustment based on actual API behavior
    }

    return comment;
  } catch (error) {
    console.error('Failed to create comment with images:', error);
    throw new Error('Failed to create comment with images');
  }
}
