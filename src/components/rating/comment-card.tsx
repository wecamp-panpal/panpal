import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  Chip,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
} from '@mui/material';
import { ThumbUp, ThumbUpOutlined, MoreVert, Star, Edit, Delete, Close } from '@mui/icons-material';
import type { Comment } from '@/services/comments-new';
import { formatDistanceToNow } from 'date-fns';

interface CommentCardProps {
  comment: Comment;
  currentUserId?: string;
  onToggleHelpful?: (commentId: string) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
  showImages?: boolean;
}

export default function CommentCard({
  comment,
  currentUserId,
  onToggleHelpful,
  onEdit,
  onDelete,
  showImages = true,
}: CommentCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);

  const isOwner = currentUserId === comment.user.id;
  const hasRating = comment.rating !== undefined && comment.rating !== null;
  const hasImages = comment.imageUrls && comment.imageUrls.length > 0;

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
      });
    } catch (error) {
      return 'Just now';
    }
  };

  const handleToggleHelpful = () => {
    if (onToggleHelpful) {
      onToggleHelpful(comment.id);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        p: 3,
        mb: 3,
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderColor: '#cbd5e0',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
        {/* Avatar */}
        <Avatar
          src={comment.user.avatarUrl}
          alt={comment.user.name}
          sx={{
            width: 48,
            height: 48,
            backgroundColor: '#D4A574',
            fontSize: '1.2rem',
            fontWeight: 600,
          }}
        >
          {comment.user.name.charAt(0).toUpperCase()}
        </Avatar>

        {/* User info and rating */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: '#1a202c',
                fontSize: '1rem',
              }}
            >
              {comment.user.name}
            </Typography>

            {hasRating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ display: 'flex' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      sx={{
                        fontSize: '1.2rem',
                        color: star <= comment.rating! ? '#D4A574' : '#e2e8f0',
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: '#D4A574',
                    fontSize: '0.875rem',
                    ml: 0.5,
                  }}
                >
                  {comment.rating}/5
                </Typography>
              </Box>
            )}

            {hasRating && (
              <Chip
                label="Review"
                size="small"
                sx={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            )}
          </Box>

          <Typography
            sx={{
              fontSize: '0.875rem',
              color: '#64748b',
              mt: 0.5,
            }}
          >
            {formatRelativeTime(comment.createdAt)}
          </Typography>
        </Box>

        {/* Actions menu */}
        {isOwner && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              size="small"
              onClick={() => setShowActions(!showActions)}
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              <MoreVert />
            </IconButton>

            {showActions && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#fff',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 10,
                  minWidth: 120,
                  py: 1,
                }}
              >
                {onEdit && (
                  <Button
                    onClick={() => {
                      onEdit(comment);
                      setShowActions(false);
                    }}
                    startIcon={<Edit />}
                    size="small"
                    sx={{
                      justifyContent: 'flex-start',
                      width: '100%',
                      color: '#374151',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                      },
                    }}
                  >
                    Edit
                  </Button>
                )}

                {onDelete && (
                  <Button
                    onClick={() => {
                      onDelete(comment.id);
                      setShowActions(false);
                    }}
                    startIcon={<Delete />}
                    size="small"
                    sx={{
                      justifyContent: 'flex-start',
                      width: '100%',
                      color: '#dc2626',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: '#fef2f2',
                      },
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Comment content */}
      <Typography
        sx={{
          fontSize: '1rem',
          lineHeight: 1.6,
          color: '#374151',
          mb: hasImages && showImages ? 3 : 2,
          whiteSpace: 'pre-wrap',
        }}
      >
        {comment.content}
      </Typography>

      {/* Images */}
      {hasImages && showImages && (
        <Box sx={{ mb: 3 }}>
          <ImageList
            cols={Math.min(comment.imageUrls.length, 4)}
            gap={8}
            sx={{
              mb: 0,
              maxHeight: 200,
              overflow: 'hidden',
            }}
          >
            {comment.imageUrls.map((imageUrl, index) => (
              <ImageListItem
                key={index}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  transition: 'transform 0.2s ease',
                }}
                onClick={() => setSelectedImage(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Comment image ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}

      {/* Footer actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {onToggleHelpful && (
          <Button
            onClick={handleToggleHelpful}
            startIcon={comment.isHelpful ? <ThumbUp /> : <ThumbUpOutlined />}
            size="small"
            sx={{
              color: comment.isHelpful ? '#2563eb' : '#64748b',
              backgroundColor: comment.isHelpful ? '#eff6ff' : 'transparent',
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: 2,
              px: 2,
              py: 0.5,
              '&:hover': {
                backgroundColor: comment.isHelpful ? '#dbeafe' : '#f1f5f9',
              },
            }}
          >
            Helpful ({comment.helpfulCount})
          </Button>
        )}

        {comment.updatedAt !== comment.createdAt && (
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              fontStyle: 'italic',
            }}
          >
            Edited
          </Typography>
        )}
      </Box>

      {/* Image preview dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Close />
          </IconButton>

          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 8,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
