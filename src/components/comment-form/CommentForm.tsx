import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  IconButton,
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Alert,
} from '@mui/material';
import { Star, StarBorder, CloudUpload, Close, PhotoCamera } from '@mui/icons-material';
import type { Comment, CreateCommentRequest } from '@/services/comments-new';
import toast from 'react-hot-toast';

interface CommentFormProps {
  recipeId: string;
  onSubmit: (data: CreateCommentRequest, images?: File[]) => Promise<void>;
  onCancel?: () => void;
  initialData?: Comment;
  isEdit?: boolean;
  showRating?: boolean;
  placeholder?: string;
}

export default function CommentForm({
  recipeId,
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
  showRating = true,
  placeholder = 'Share your experience with this recipe...',
}: CommentFormProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [rating, setRating] = useState<number | null>(initialData?.rating || null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.imageUrls || []);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Validate files
    const validImages: File[] = [];
    const newErrors: string[] = [];

    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        newErrors.push(`${file.name} is not a valid image format`);
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        newErrors.push(`${file.name} is too large (maximum 5MB)`);
        return;
      }

      validImages.push(file);
    });

    // Check total image count
    const totalImages = images.length + validImages.length;
    if (totalImages > 10) {
      newErrors.push('Maximum 10 images allowed');
      return;
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous errors
    setErrors([]);

    // Add valid images
    setImages(prev => [...prev, ...validImages]);

    // Create previews
    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setErrors(['Please enter your review content']);
      return;
    }

    if (showRating && !rating) {
      setErrors(['Please select a rating']);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const data: CreateCommentRequest = {
        recipeId,
        content: content.trim(),
        ...(showRating && rating ? { rating } : {}),
      };

      await onSubmit(data, images);

      // Reset form
      setContent('');
      setRating(null);
      setImages([]);
      setImagePreviews([]);

      toast.success(isEdit ? 'Review updated successfully!' : 'Review posted successfully!');
    } catch (error) {
      console.error('Failed to submit comment:', error);
      setErrors(['Something went wrong. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: '#fff',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        p: 4,
        mb: 4,
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          color: '#1a202c',
          mb: 3,
          fontSize: '1.375rem',
        }}
      >
        {isEdit ? 'Edit Your Review' : 'Share Your Review'}
      </Typography>

      {/* Rating */}
      {showRating && (
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              mb: 2,
            }}
          >
            Rate this recipe
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              icon={<Star fontSize="large" />}
              emptyIcon={<StarBorder fontSize="large" />}
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#D4A574',
                },
                '& .MuiRating-iconHover': {
                  color: '#D4A574',
                },
              }}
            />

            {rating && (
              <Chip
                label={`${rating}/5 stars`}
                sx={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Content input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          multiline
          rows={4}
          placeholder={placeholder}
          value={content}
          onChange={e => setContent(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#D4A574',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#D4A574',
              },
            },
            '& .MuiInputBase-input': {
              fontSize: '1rem',
              lineHeight: 1.6,
            },
          }}
        />
      </Box>

      {/* Image upload */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
            }}
          >
            Add images (optional)
          </Typography>

          <Button
            onClick={() => fileInputRef.current?.click()}
            startIcon={<PhotoCamera />}
            size="small"
            sx={{
              textTransform: 'none',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              borderRadius: 2,
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: '#e2e8f0',
              },
            }}
          >
            Choose Images
          </Button>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {/* Image previews */}
        {imagePreviews.length > 0 && (
          <ImageList cols={4} gap={8} sx={{ maxHeight: 200, mb: 2 }}>
            {imagePreviews.map((preview, index) => (
              <ImageListItem key={index} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <ImageListItemBar
                  sx={{
                    background:
                      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                  }}
                  position="top"
                  actionIcon={
                    <IconButton
                      onClick={() => removeImage(index)}
                      sx={{ color: '#fff' }}
                      size="small"
                    >
                      <Close />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}

        <Typography
          sx={{
            fontSize: '0.75rem',
            color: '#64748b',
            fontStyle: 'italic',
          }}
        >
          Maximum 10 images, each up to 5MB
        </Typography>
      </Box>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button
            onClick={onCancel}
            disabled={loading}
            sx={{
              textTransform: 'none',
              color: '#64748b',
              borderColor: '#e2e8f0',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#f8fafc',
                borderColor: '#cbd5e0',
              },
            }}
            variant="outlined"
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={loading || !content.trim() || (showRating && !rating)}
          sx={{
            backgroundColor: '#D4A574',
            color: '#fff',
            borderRadius: 2,
            px: 4,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#c59660',
            },
            '&:disabled': {
              backgroundColor: '#e2e8f0',
              color: '#9ca3af',
            },
          }}
          variant="contained"
        >
          {loading ? 'Submitting...' : isEdit ? 'Update' : 'Post Review'}
        </Button>
      </Box>
    </Box>
  );
}
