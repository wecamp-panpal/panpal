import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Rating,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Skeleton,
} from '@mui/material';
import { ThumbUp, FilterList, Reply, MoreVert } from '@mui/icons-material';
import {
  getRatingsByRecipeId,
  markRatingHelpful,
  createRatingReply,
  type Rating as RatingType,
  type RatingListResponse,
  type RatingFilter,
} from '@/services/ratings';
import { getCurrentUser } from '@/services/auth';
import type { User } from '@/types/user';
import toast from 'react-hot-toast';

interface RatingListProps {
  recipeId: string;
  recipeAuthorId?: string;
  onRatingUpdate?: () => void;
}

export default function RatingList({ recipeId, recipeAuthorId, onRatingUpdate }: RatingListProps) {
  const [data, setData] = useState<RatingListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Filters
  const [filter, setFilter] = useState<RatingFilter>({
    recipeId,
    page: 1,
    limit: 10,
    filter: 'all',
    sortBy: 'newest',
  });

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    loadRatings();
  }, [filter]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const result = await getRatingsByRecipeId(filter);
      setData(result);
    } catch (error) {
      console.error('Failed to load ratings:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof RatingFilter, value: any) => {
    setFilter(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset to page 1 when changing filters
    }));
  };

  const handleMarkHelpful = async (ratingId: string) => {
    if (!currentUser) {
      toast.error('Please sign in to mark reviews as helpful');
      return;
    }

    try {
      await markRatingHelpful(ratingId);
      toast.success('Marked as helpful');
      loadRatings(); // Refresh to show updated count
    } catch (error) {
      console.error('Failed to mark as helpful:', error);
      toast.error('Failed to mark as helpful');
    }
  };

  const handleSubmitReply = async (ratingId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmittingReply(true);
    try {
      await createRatingReply({
        ratingId,
        content: replyText.trim(),
      });

      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply posted successfully');
      loadRatings(); // Refresh to show new reply
    } catch (error) {
      console.error('Failed to submit reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const canReply = currentUser && recipeAuthorId && currentUser.id === recipeAuthorId;

  if (loading && !data) {
    return (
      <Box>
        {[1, 2, 3].map(i => (
          <Box key={i} sx={{ mb: 3 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          backgroundColor: '#f8fafc',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
        }}
      >
        <Typography
          sx={{
            fontSize: '1.25rem',
            color: '#64748b',
            fontStyle: 'italic',
          }}
        >
          No reviews yet. Be the first to share your experience!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          p: 3,
          backgroundColor: '#f8fafc',
          borderRadius: 2,
          border: '1px solid #e2e8f0',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList sx={{ color: '#64748b', fontSize: '1.25rem' }} />
          <Typography sx={{ fontWeight: 600, color: '#374151' }}>Filter Reviews</Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={filter.stars || 'all'}
            label="Rating"
            onChange={e =>
              handleFilterChange('stars', e.target.value === 'all' ? undefined : e.target.value)
            }
          >
            <MenuItem value="all">All Stars</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Content</InputLabel>
          <Select
            value={filter.filter || 'all'}
            label="Content"
            onChange={e => handleFilterChange('filter', e.target.value)}
          >
            <MenuItem value="all">All Reviews</MenuItem>
            <MenuItem value="with_images">With Photos</MenuItem>
            <MenuItem value="with_comments">With Comments</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filter.sortBy || 'newest'}
            label="Sort By"
            onChange={e => handleFilterChange('sortBy', e.target.value)}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="helpful">Most Helpful</MenuItem>
            <MenuItem value="rating_high">Highest Rating</MenuItem>
            <MenuItem value="rating_low">Lowest Rating</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Results count */}
      <Typography
        sx={{
          fontSize: '1rem',
          color: '#64748b',
          mb: 3,
          fontWeight: 500,
        }}
      >
        Showing {data.items.length} of {data.pagination.total} reviews
      </Typography>

      {/* Rating items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {data.items.map(rating => (
          <Box
            key={rating.id}
            sx={{
              backgroundColor: '#fff',
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              p: 4,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#D4A574',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              },
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={rating.user.avatarUrl}
                  alt={rating.user.name}
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#D4A574',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                  }}
                >
                  {rating.user.name[0].toUpperCase()}
                </Avatar>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '1.125rem',
                      color: '#1a202c',
                      mb: 0.5,
                    }}
                  >
                    {rating.user.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      value={rating.score}
                      precision={0.1}
                      size="small"
                      readOnly
                      sx={{ '& .MuiRating-iconFilled': { color: '#D4A574' } }}
                    />
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        fontWeight: 500,
                      }}
                    >
                      {rating.score}/5
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        ml: 1,
                      }}
                    >
                      {formatDate(rating.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <IconButton size="small" sx={{ color: '#64748b' }}>
                <MoreVert />
              </IconButton>
            </Box>

            {/* Comment */}
            {rating.comment && (
              <Typography
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#374151',
                  fontFamily: 'Georgia, serif',
                  mb: 3,
                }}
              >
                {rating.comment}
              </Typography>
            )}

            {/* Images */}
            {rating.imageUrls && rating.imageUrls.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {rating.imageUrls.map((imageUrl, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      alt={`Review image ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* Actions */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 2,
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  onClick={() => handleMarkHelpful(rating.id)}
                  disabled={!currentUser}
                  size="small"
                  sx={{
                    color: '#64748b',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(212, 165, 116, 0.1)',
                      color: '#D4A574',
                    },
                  }}
                >
                  <ThumbUp sx={{ fontSize: '1rem', mr: 0.5 }} />
                  Helpful ({rating.isHelpful})
                </Button>

                {canReply && (
                  <Button
                    onClick={() => setReplyingTo(rating.id)}
                    size="small"
                    sx={{
                      color: '#64748b',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(212, 165, 116, 0.1)',
                        color: '#D4A574',
                      },
                    }}
                  >
                    <Reply sx={{ fontSize: '1rem', mr: 0.5 }} />
                    Reply
                  </Button>
                )}
              </Box>

              {rating.replies.length > 0 && (
                <Chip
                  label={`${rating.replies.length} reply${rating.replies.length > 1 ? 'ies' : ''}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#D4A574',
                    color: '#D4A574',
                  }}
                />
              )}
            </Box>

            {/* Replies */}
            {rating.replies.length > 0 && (
              <Box sx={{ mt: 3, pl: 3, borderLeft: '3px solid #f1f5f9' }}>
                {rating.replies.map(reply => (
                  <Box key={reply.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Avatar
                        src={reply.user.avatarUrl}
                        alt={reply.user.name}
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: '#10b981',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {reply.user.name[0].toUpperCase()}
                      </Avatar>

                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: '#10b981',
                        }}
                      >
                        {reply.user.name}
                      </Typography>

                      <Chip
                        label="Author"
                        size="small"
                        sx={{
                          backgroundColor: '#10b981',
                          color: '#fff',
                          fontSize: '0.625rem',
                          height: 20,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                        }}
                      >
                        {formatDate(reply.createdAt)}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        lineHeight: 1.5,
                      }}
                    >
                      {reply.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Reply form */}
            {replyingTo === rating.id && (
              <Box sx={{ mt: 3, p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    mb: 2,
                  }}
                >
                  Reply as recipe author
                </Typography>

                <Box
                  component="textarea"
                  value={replyText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setReplyText(e.target.value)
                  }
                  placeholder="Thank your reviewer or provide helpful tips..."
                  sx={{
                    width: '100%',
                    minHeight: 80,
                    p: 2,
                    border: '1px solid #d1d5db',
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    mb: 2,
                    '&:focus': {
                      borderColor: '#D4A574',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    onClick={() => handleSubmitReply(rating.id)}
                    disabled={submittingReply || !replyText.trim()}
                    size="small"
                    variant="contained"
                    sx={{
                      backgroundColor: '#10b981',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#059669',
                      },
                    }}
                  >
                    {submittingReply ? 'Posting...' : 'Post Reply'}
                  </Button>

                  <Button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                    size="small"
                    sx={{
                      color: '#64748b',
                      textTransform: 'none',
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={data.pagination.totalPages}
            page={data.pagination.page}
            onChange={(_, page) => handleFilterChange('page', page)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  backgroundColor: '#D4A574',
                  '&:hover': {
                    backgroundColor: '#c59660',
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
