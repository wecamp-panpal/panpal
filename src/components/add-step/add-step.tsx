import { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Button, Typography, Chip } from '@mui/material';
import { Add, Delete, Close } from '@mui/icons-material';

interface AddStepProps {
  initialSteps?: {  stepNumber: number; instruction: string;  imageUrl?: string }[];
  onChange?: (steps: {  stepNumber: number; instruction: string;  imageUrl?: string }[]) => void;
}

const AddStep = ({ initialSteps, onChange }: AddStepProps) => {
  const hasInitializedRef = useRef(false);
  
  const [steps, setSteps] = useState<string[]>(['']);
  
  const [stepsFiles, setStepsFiles] = useState<(File | null)[]>([null]);
  
  const [existingImages, setExistingImages] = useState<(string | null)[]>([null]);

 
  useEffect(() => {
    console.log('🔄 Props changed:', initialSteps, 'Already initialized:', hasInitializedRef.current);
    
    // Initialize only once when we first get initial steps
    if (initialSteps && initialSteps.length > 0 && !hasInitializedRef.current) {
      const instructions = initialSteps.map(step => step.instruction);
      const files = initialSteps.map(() => null);
      const images = initialSteps.map(step => step.imageUrl || null);
      
      console.log('🎯 First-time initialization:', { instructions, files, images });
      
      setSteps(instructions);
      setStepsFiles(files);
      setExistingImages(images);
      hasInitializedRef.current = true;
    }
  }, [initialSteps]);

  const addSteps = () => {
    setSteps(prev => [...prev, '']);
    setStepsFiles(prev => [...prev, null]);
    setExistingImages(prev => [...prev, null]);
  };

  const deleteStep = (i: number) => {
    console.log('🗑️ Delete step clicked:', i, 'Current steps:', steps);
    
    const newSteps = steps.filter((_, idx) => idx !== i);
    const newFiles = stepsFiles.filter((_, idx) => idx !== i);
    const newImages = existingImages.filter((_, idx) => idx !== i);
    
    console.log('After filter:', { newSteps, newFiles, newImages });
    
    // Ensure at least one empty step exists
    const finalSteps = newSteps.length ? newSteps : [''];
    const finalFiles = newFiles.length ? newFiles : [null];
    const finalImages = newImages.length ? newImages : [null];
    
    setSteps(finalSteps);
    setStepsFiles(finalFiles);
    setExistingImages(finalImages);
    
    // Send formatted data to parent (only non-empty steps)
    const formatted = finalSteps
      .map((instruction, idx) => ({
         stepNumber: idx + 1,
        instruction: instruction.trim(),
         imageUrl: finalImages[idx] || undefined
      }))
      .filter(step => step.instruction); 
    
    console.log('Sending to parent:', formatted);
    onChange?.(formatted);
  };

  const handleChange = (i: number, step: string) => {
    const update = [...steps];
    update[i] = step;
    setSteps(update);
    
    // CRITICAL FIX: Don't filter while typing! 
    // Send ALL steps with their original indices to maintain React key consistency
    const formatted = update
      .map((instruction, idx) => ({
         stepNumber: idx + 1,
        instruction: instruction.trim(), 
         imageUrl: existingImages[idx] || undefined
      }))
      .filter(step => step.instruction); // Only filter non-empty for parent
    
    onChange?.(formatted);
  };

  const handleFileChange = (i: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const chosen = event.target.files[0];
    setStepsFiles(prev => {
      const copy = [...prev];
      copy[i] = chosen;
      return copy;
    });
    
    setExistingImages(prev => {
      const copy = [...prev];
      copy[i] = URL.createObjectURL(chosen);
      return copy;
    });
    

    const formatted = steps
      .map((instruction, idx) => ({
         stepNumber: idx + 1,
        instruction: instruction.trim(),
         imageUrl: idx === i ? URL.createObjectURL(chosen) : existingImages[idx] || undefined
      }))
      .filter(step => step.instruction); // Filter only for parent
    onChange?.(formatted);
    
    event.target.value = '';
  };

  const removeFile = (i: number) => {
    setStepsFiles(prev => {
      const copy = [...prev];
      copy[i] = null;
      return copy;
    });
    
    setExistingImages(prev => {
      const copy = [...prev];
      copy[i] = null;
      return copy;
    });
    
    const formatted = steps
      .map((instruction, idx) => ({
         stepNumber: idx + 1,
        instruction: instruction.trim(),
         imageUrl: idx === i ? undefined : existingImages[idx] || undefined
      }))
      .filter(step => step.instruction); // Filter only for parent  
    onChange?.(formatted);
  };

  return (
    <Box>
      {steps.map((step, i) => {
        const inputId = `file-upload-${i}`;
        const file = stepsFiles[i];
        return (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 2 }}>
            <TextField
              value={step}
              onChange={e => handleChange(i, e.target.value)}
              placeholder={`Step ${i + 1}...`}
              sx={{
                height: 60,
                flex: 1,
                '& .MuiInputBase-root': { borderRadius: 2 },
                '& .MuiOutlinedInput-root': {
                  boxShadow: 'none',
                  '& fieldset': { borderColor: 'secondary.main' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
                '& .MuiInputBase-input': {
                  color: '#391F06',
                  '&::placeholder': { color: '#BFA980', fontSize: 16, opacity: 1 },
                },
              }}
            />

            <Box sx={{ width: 220 }}>
              <input
                id={inputId}
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(i, e)}
                style={{ display: 'none' }}
              />
              <label htmlFor={inputId} style={{ display: 'block' }}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: 'secondary.main',
                    borderRadius: 1.5,
                    height: 60,
                    px: 1.5,
                    py: 1,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: (file || existingImages[i]) ? 'flex-start' : 'center',
                    '&:hover': { backgroundColor: '#f0e4d3' },
                  }}
                >
                  {file ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#391F06',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {file.name}
                    </Typography>
                  ) : existingImages[i] ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#391F06',
                          maxWidth: '70%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        📷 Step image
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.preventDefault();
                          removeFile(i);
                        }}
                        sx={{ p: 0.25 }}
                      >
                        <Close sx={{ fontSize: 16, color: '#8c7a55' }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#8c7a55' }}>
                      choose image for step
                    </Typography>
                  )}
                </Box>
              </label>
            </Box>

            <IconButton sx={{ color: '#391F06', mt: 0.5 }} onClick={() => deleteStep(i)}>
              <Delete />
            </IconButton>
          </Box>
        );
      })}

      <Button
        sx={{
          fontSize: 16,
          color: '#391F06',
          textTransform: 'none',
          '&:hover': { background: '#e6d2b7', color: '#391F06' },
        }}
        startIcon={<Add sx={{ color: '#391F06' }} />}
        onClick={addSteps}
      >
        Add Step
      </Button>
    </Box>
  );
};

export default AddStep;
