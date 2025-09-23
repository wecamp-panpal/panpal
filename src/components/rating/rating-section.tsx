// import { useState, useEffect } from 'react';
// import { Box, Typography, Button, Divider } from '@mui/material';
// import { Edit, Star } from '@mui/icons-material';
// import RatingDistribution from './rating-distribution';
// import RatingForm from './rating-form';
// import RatingList from './rating-list';
// import { getCurrentUser } from '@/services/auth';
// import type { User } from '@/types/user';
// import toast from 'react-hot-toast';

// interface RatingSectionProps {
//   recipeId: string;
//   recipeAuthorId?: string;
// }

// export default function RatingSection({ recipeId, recipeAuthorId }: RatingSectionProps) {
//   const [stats, setStats] = useState<RatingStats | null>(null);
//   const [userRating, setUserRating] = useState<Rating | null>(null);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [canRate, setCanRate] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [refreshKey, setRefreshKey] = useState(0);

//   useEffect(() => {
//     loadData();
//   }, [recipeId, refreshKey]);

//   const loadData = async () => {
//     try {
//       setLoading(true);

//       // Get current user
//       const user = await getCurrentUser().catch(() => null);
//       setCurrentUser(user);

//       // Load rating summary
//       // const summaryData = await getRatingSummary(recipeId);
//       // setStats(summaryData);

//       if (user) {
//         // Check if user can rate this recipe
//         const canRateData = await canUserRate(recipeId);
//         setCanRate(canRateData.canRate);

//         // Get user's existing rating
//         const userRatingData = await getUserRatingForRecipe(recipeId);
//         setUserRating(userRatingData);
//       } else {
//         setCanRate(false);
//         setUserRating(null);
//       }
//     } catch (error) {
//       console.error('Failed to load rating data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRatingSuccess = () => {
//     setShowForm(false);
//     setRefreshKey(prev => prev + 1); // Trigger refresh
//     toast.success('Thank you for your review!');
//   };

//   const handleDeleteRating = async () => {
//     if (!userRating) return;

//     const confirmed = window.confirm(
//       'Are you sure you want to delete your rating? This action cannot be undone.'
//     );
//     if (!confirmed) return;

//     try {
//       await deleteRating(recipeId);
//       setUserRating(null);
//       setRefreshKey(prev => prev + 1); // Trigger refresh
//       toast.success('Rating deleted successfully');
//     } catch (error) {
//       console.error('Failed to delete rating:', error);
//       toast.error('Failed to delete rating');
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ mb: 6 }}>
//         <Typography
//           variant="h2"
//           sx={{
//             fontFamily: '"Playfair Display", serif',
//             fontSize: { xs: '2rem', md: '2.5rem' },
//             fontWeight: 700,
//             color: '#1a202c',
//             mb: 4,
//             textAlign: 'center',
//             position: 'relative',
//             '&::after': {
//               content: '""',
//               position: 'absolute',
//               bottom: '-8px',
//               left: '50%',
//               transform: 'translateX(-50%)',
//               width: '60px',
//               height: '3px',
//               backgroundColor: '#D4A574',
//               borderRadius: '2px',
//             },
//           }}
//         >
//           Reviews & Ratings
//         </Typography>
//         <Typography sx={{ textAlign: 'center', color: '#64748b' }}>Loading reviews...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ mb: 6 }}>
//       {/* Section Header */}
//       <Typography
//         variant="h2"
//         sx={{
//           fontFamily: '"Playfair Display", serif',
//           fontSize: { xs: '2rem', md: '2.5rem' },
//           fontWeight: 700,
//           color: '#1a202c',
//           mb: 4,
//           textAlign: 'center',
//           position: 'relative',
//           '&::after': {
//             content: '""',
//             position: 'absolute',
//             bottom: '-8px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             width: '60px',
//             height: '3px',
//             backgroundColor: '#D4A574',
//             borderRadius: '2px',
//           },
//         }}
//       >
//         Reviews & Ratings
//       </Typography>

//       {/* Rating Distribution */}
//       {stats && <RatingDistribution stats={stats} />}

//       {/* User Rating Section */}
//       <Box sx={{ mb: 4 }}>
//         {!currentUser ? (
//           // Not logged in
//           <Box
//             sx={{
//               textAlign: 'center',
//               py: 6,
//               backgroundColor: '#f8fafc',
//               borderRadius: 3,
//               border: '1px solid #e2e8f0',
//             }}
//           >
//             <Star sx={{ fontSize: '3rem', color: '#D4A574', mb: 2 }} />
//             <Typography
//               sx={{
//                 fontSize: '1.25rem',
//                 color: '#64748b',
//                 mb: 3,
//                 fontWeight: 500,
//               }}
//             >
//               Share your experience with this recipe
//             </Typography>
//             <Button
//               href="/sign-in"
//               variant="contained"
//               sx={{
//                 backgroundColor: '#D4A574',
//                 color: '#fff',
//                 borderRadius: 2,
//                 px: 4,
//                 py: 1.5,
//                 textTransform: 'none',
//                 fontWeight: 600,
//                 fontSize: '1rem',
//                 '&:hover': {
//                   backgroundColor: '#c59660',
//                 },
//               }}
//             >
//               Sign In to Review
//             </Button>
//           </Box>
//         ) : !canRate ? (
//           // Cannot rate (own recipe)
//           <Box
//             sx={{
//               textAlign: 'center',
//               py: 4,
//               backgroundColor: '#fef3c7',
//               borderRadius: 3,
//               border: '1px solid #fbbf24',
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: '1rem',
//                 color: '#92400e',
//                 fontWeight: 500,
//               }}
//             >
//               You cannot rate your own recipe
//             </Typography>
//           </Box>
//         ) : userRating && !showForm ? (
//           // Show existing rating
//           <Box
//             sx={{
//               backgroundColor: '#f0fdf4',
//               borderRadius: 3,
//               border: '1px solid #bbf7d0',
//               p: 4,
//             }}
//           >
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 700,
//                 color: '#166534',
//                 mb: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1,
//               }}
//             >
//               <Star sx={{ color: '#D4A574' }} />
//               Your Review
//             </Typography>

//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//               <Box sx={{ display: 'flex' }}>
//                 {[1, 2, 3, 4, 5].map(star => (
//                   <Star
//                     key={star}
//                     sx={{
//                       fontSize: '1.5rem',
//                       color: star <= userRating.score ? '#D4A574' : '#e2e8f0',
//                     }}
//                   />
//                 ))}
//               </Box>
//               <Typography sx={{ fontWeight: 600, color: '#166534' }}>
//                 {userRating.score}/5 stars
//               </Typography>
//               <Typography sx={{ fontSize: '0.875rem', color: '#059669' }}>
//                 {new Date(userRating.createdAt).toLocaleDateString()}
//               </Typography>
//             </Box>

//             {userRating.comment && (
//               <Typography
//                 sx={{
//                   fontSize: '1rem',
//                   lineHeight: 1.6,
//                   color: '#166534',
//                   mb: 3,
//                   fontStyle: 'italic',
//                   p: 2,
//                   backgroundColor: '#dcfce7',
//                   borderRadius: 2,
//                   border: '1px solid #bbf7d0',
//                 }}
//               >
//                 "{userRating.comment}"
//               </Typography>
//             )}

//             {userRating.imageUrls && userRating.imageUrls.length > 0 && (
//               <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                 {userRating.imageUrls.map((imageUrl, index) => (
//                   <Box
//                     key={index}
//                     sx={{
//                       width: 80,
//                       height: 80,
//                       borderRadius: 2,
//                       overflow: 'hidden',
//                       border: '1px solid #bbf7d0',
//                     }}
//                   >
//                     <Box
//                       component="img"
//                       src={imageUrl}
//                       alt={`Your review image ${index + 1}`}
//                       sx={{
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'cover',
//                       }}
//                     />
//                   </Box>
//                 ))}
//               </Box>
//             )}

//             <Box sx={{ display: 'flex', gap: 2 }}>
//               <Button
//                 onClick={() => setShowForm(true)}
//                 variant="outlined"
//                 startIcon={<Edit />}
//                 sx={{
//                   borderColor: '#059669',
//                   color: '#059669',
//                   borderRadius: 2,
//                   textTransform: 'none',
//                   fontWeight: 500,
//                   '&:hover': {
//                     backgroundColor: '#f0fdf4',
//                     borderColor: '#047857',
//                   },
//                 }}
//               >
//                 Edit Review
//               </Button>

//               <Button
//                 onClick={handleDeleteRating}
//                 variant="outlined"
//                 color="error"
//                 sx={{
//                   borderRadius: 2,
//                   textTransform: 'none',
//                   fontWeight: 500,
//                 }}
//               >
//                 Delete Review
//               </Button>
//             </Box>
//           </Box>
//         ) : (
//           // Show form or call-to-action
//           <>
//             {!showForm ? (
//               <Box
//                 sx={{
//                   textAlign: 'center',
//                   py: 6,
//                   backgroundColor: '#f8fafc',
//                   borderRadius: 3,
//                   border: '1px solid #e2e8f0',
//                 }}
//               >
//                 <Star sx={{ fontSize: '3rem', color: '#D4A574', mb: 2 }} />
//                 <Typography
//                   sx={{
//                     fontSize: '1.25rem',
//                     color: '#374151',
//                     mb: 1,
//                     fontWeight: 600,
//                   }}
//                 >
//                   How was this recipe?
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontSize: '1rem',
//                     color: '#64748b',
//                     mb: 3,
//                   }}
//                 >
//                   Share your experience and help others discover great recipes
//                 </Typography>
//                 <Button
//                   onClick={() => setShowForm(true)}
//                   variant="contained"
//                   sx={{
//                     backgroundColor: '#D4A574',
//                     color: '#fff',
//                     borderRadius: 2,
//                     px: 4,
//                     py: 1.5,
//                     textTransform: 'none',
//                     fontWeight: 600,
//                     fontSize: '1rem',
//                     '&:hover': {
//                       backgroundColor: '#c59660',
//                     },
//                   }}
//                 >
//                   Write a Review
//                 </Button>
//               </Box>
//             ) : (
//               <RatingForm
//                 recipeId={recipeId}
//                 onSuccess={handleRatingSuccess}
//                 onCancel={() => setShowForm(false)}
//                 initialRating={userRating || undefined}
//               />
//             )}
//           </>
//         )}
//       </Box>

//       {/* Divider */}
//       <Divider sx={{ my: 4, borderColor: '#e2e8f0' }} />

//       {/* Rating List */}
//       <RatingList
//         recipeId={recipeId}
//         recipeAuthorId={recipeAuthorId}
//         onRatingUpdate={() => setRefreshKey(prev => prev + 1)}
//       />
//     </Box>
//   );
// }
