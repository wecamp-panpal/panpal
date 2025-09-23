import { useState, useRef } from 'react';
import { Box, Typography, Rating, Button, IconButton, Chip, CircularProgress } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { upsertRating, uploadRatingImages } from '@/services/ratings';
import toast from 'react-hot-toast';

interface RatingFormProps {
  recipeId: string;
  onSuccess: () => void;
  onCancel?: () => void;
  initialRating?: {
    score: number;
    comment?: string;
    imageUrls?: string[];
  };
}

export default function RatingForm({
  recipeId,
  onSuccess,
  onCancel,
  initialRating,
}: RatingFormProps) {
  const [score, setScore] = useState<number | null>(initialRating?.score || null);
  const [comment, setComment] = useState(initialRating?.comment || '');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialRating?.imageUrls || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImages = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    const totalImages = selectedImages.length + existingImages.length + validImages.length;
    if (totalImages > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setSelectedImages(prev => [...prev, ...validImages]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageSelect(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files) {
      handleImageSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!score) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.length > 2000) {
      toast.error('Comment must be less than 2000 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls = [...existingImages];

      // Upload new images if any
      if (selectedImages.length > 0) {
        const uploadResult = await uploadRatingImages(selectedImages);
        imageUrls = [...imageUrls, ...uploadResult.imageUrls];
      }

      // Submit rating
      await upsertRating({
        recipeId,
        score,
        comment: comment.trim() || undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      });

      toast.success(
        initialRating ? 'Rating updated successfully!' : 'Rating submitted successfully!'
      );
      onSuccess();
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        }}
      >
        {initialRating ? 'Update Your Review' : 'Share Your Experience'}
      </Typography>

      {/* Rating */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#374151',
            mb: 1.5,
          }}
        >
          Your Rating *
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Rating
            value={score}
            precision={1}
            onChange={(_, value) => setScore(value)}
            size="large"
            sx={{
              '& .MuiRating-iconEmpty': {
                color: '#e2e8f0',
              },
              '& .MuiRating-iconFilled': {
                color: '#D4A574',
              },
              '& .MuiRating-iconHover': {
                color: '#c59660',
              },
            }}
          />
          {score && (
            <Chip
              label={`${score} star${score > 1 ? 's' : ''}`}
              size="small"
              sx={{
                backgroundColor: '#D4A574',
                color: '#fff',
                fontWeight: 500,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Comment */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#374151',
            mb: 1.5,
          }}
        >
          Your Review (Optional)
        </Typography>

        <Box
          component="textarea"
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder="Share your thoughts about this recipe... What did you like? Any tips for other cooks?"
          sx={{
            width: '100%',
            minHeight: 120,
            p: 2,
            border: '1px solid #d1d5db',
            borderRadius: 2,
            fontSize: '1rem',
            fontFamily: 'Georgia, serif',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            '&:focus': {
              borderColor: '#D4A574',
            },
            '&::placeholder': {
              color: '#9ca3af',
              fontStyle: 'italic',
            },
          }}
        />

        <Typography
          sx={{
            fontSize: '0.75rem',
            color: comment.length > 1800 ? '#dc3545' : '#64748b',
            textAlign: 'right',
            mt: 0.5,
          }}
        >
          {comment.length}/2000 characters
        </Typography>
      </Box>

      {/* Image Upload */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#374151',
            mb: 1.5,
          }}
        >
          Add Photos (Optional)
        </Typography>

        {/* Drag & Drop Zone */}
        <Box
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          sx={{
            border: `2px dashed ${isDragOver ? '#D4A574' : '#d1d5db'}`,
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragOver ? 'rgba(212, 165, 116, 0.05)' : '#f8fafc',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#D4A574',
              backgroundColor: 'rgba(212, 165, 116, 0.05)',
            },
          }}
        >
          <CloudUpload sx={{ fontSize: '2rem', color: '#64748b', mb: 1 }} />
          <Typography sx={{ color: '#64748b', mb: 0.5 }}>
            Click to upload or drag and drop
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            JPG, PNG, WebP (max 5MB each, 10 images total)
          </Typography>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {/* Image Previews */}
        {(existingImages.length > 0 || selectedImages.length > 0) && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 1 }}>
              Images ({existingImages.length + selectedImages.length}/10)
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {/* Existing images */}
              {existingImages.map((imageUrl, index) => (
                <Box
                  key={`existing-${index}`}
                  sx={{
                    position: 'relative',
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={`Existing ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      removeExistingImage(index);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      width: 20,
                      height: 20,
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                      },
                    }}
                  >
                    <Close sx={{ fontSize: '0.75rem' }} />
                  </IconButton>
                </Box>
              ))}

              {/* New images */}
              {selectedImages.map((file, index) => (
                <Box
                  key={`new-${index}`}
                  sx={{
                    position: 'relative',
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Box
                    component="img"
                    src={URL.createObjectURL(file)}
                    alt={`New ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      removeSelectedImage(index);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      width: 20,
                      height: 20,
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                      },
                    }}
                  >
                    <Close sx={{ fontSize: '0.75rem' }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outlined"
            disabled={isSubmitting}
            sx={{
              borderColor: '#d1d5db',
              color: '#64748b',
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={!score || isSubmitting}
          sx={{
            backgroundColor: '#D4A574',
            color: '#fff',
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#c59660',
            },
            '&:disabled': {
              backgroundColor: '#d1d5db',
            },
          }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1, color: '#fff' }} />
              {initialRating ? 'Updating...' : 'Submitting...'}
            </>
          ) : initialRating ? (
            'Update Review'
          ) : (
            'Submit Review'
          )}
        </Button>
      </Box>
    </Box>
  );
}
