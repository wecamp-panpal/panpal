import { Box, Typography, LinearProgress } from '@mui/material';
import { Star } from '@mui/icons-material';
import type { RatingSummary } from '@/services/comments-new';

interface RatingDistributionProps {
  stats: RatingSummary;
}

export default function RatingDistribution({ stats }: RatingDistributionProps) {
  const { averageRating, totalRatings, ratingDistribution } = stats;

  // Calculate percentages for each star level
  const getPercentage = (count: number) => {
    return totalRatings > 0 ? (count / totalRatings) * 100 : 0;
  };

  return (
    <Box
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
        variant="h5"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          color: '#1a202c',
          mb: 3,
          textAlign: 'center',
        }}
      >
        Community Reviews
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        {/* Overall Rating */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 180,
            p: 3,
            backgroundColor: '#f8fafc',
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: '3rem',
              fontWeight: 700,
              color: '#1a202c',
              lineHeight: 1,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            {averageRating.toFixed(1)}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                sx={{
                  fontSize: '1.5rem',
                  color: star <= averageRating ? '#D4A574' : '#e2e8f0',
                }}
              />
            ))}
          </Box>

          <Typography
            sx={{
              color: '#64748b',
              fontSize: '0.875rem',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            Based on {totalRatings.toLocaleString()} reviews
          </Typography>
        </Box>

        {/* Rating Distribution */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: '#374151',
              mb: 2,
              fontSize: '1.125rem',
            }}
          >
            Rating Breakdown
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[5, 4, 3, 2, 1].map(starLevel => {
              const count =
                ratingDistribution[starLevel.toString() as keyof typeof ratingDistribution];
              const percentage = getPercentage(count);

              return (
                <Box
                  key={starLevel}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {/* Star label */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 60 }}>
                    <Typography sx={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                      {starLevel}
                    </Typography>
                    <Star sx={{ fontSize: '1rem', color: '#D4A574' }} />
                  </Box>

                  {/* Progress bar */}
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#D4A574',
                          borderRadius: 4,
                        },
                      }}
                    />

                    {/* Count and percentage */}
                    <Box sx={{ minWidth: 80, textAlign: 'right' }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: '#64748b',
                          fontWeight: 500,
                        }}
                      >
                        {count} ({percentage.toFixed(0)}%)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
