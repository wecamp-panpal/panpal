import { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Button, Typography, Chip } from '@mui/material';
import { Add, Delete, Close } from '@mui/icons-material';

interface AddStepProps {
  initialSteps?: { step_number: number; instruction: string; image_url?: string }[];
  onChange?: (steps: { step_number: number; instruction: string; image_url?: string }[]) => void;
}

const AddStep = ({ initialSteps, onChange }: AddStepProps) => {
  const [steps, setSteps] = useState<string[]>(() => {
    if (initialSteps && initialSteps.length > 0) {
      return initialSteps.map(step => step.instruction);
    }
    return [''];
  });
  const [stepsFiles, setStepsFiles] = useState<(File | null)[]>(() => {
    if (initialSteps && initialSteps.length > 0) {
      return initialSteps.map(() => null); // Files will be null for existing steps
    }
    return [null];
  });
  const [existingImages, setExistingImages] = useState<(string | null)[]>(() => {
    if (initialSteps && initialSteps.length > 0) {
      return initialSteps.map(step => step.image_url || null);
    }
    return [null];
  });

  // Update steps when initialSteps prop changes
  useEffect(() => {
    if (initialSteps && initialSteps.length > 0) {
      setSteps(initialSteps.map(step => step.instruction));
      setStepsFiles(initialSteps.map(() => null));
      setExistingImages(initialSteps.map(step => step.image_url || null));
    }
  }, [initialSteps]);

  const addSteps = () => {
    setSteps(prev => [...prev, '']);
    setStepsFiles(prev => [...prev, null]);
    setExistingImages(prev => [...prev, null]);
  };

  const deleteStep = (i: number) => {
    const newSteps = steps.filter((_, idx) => idx !== i);
    const newFiles = stepsFiles.filter((_, idx) => idx !== i);
    const newImages = existingImages.filter((_, idx) => idx !== i);
    setSteps(newSteps.length ? newSteps : ['']);
    setStepsFiles(newFiles.length ? newFiles : [null]);
    setExistingImages(newImages.length ? newImages : [null]);
    
    // Call onChange with updated data
    const formatted = newSteps
      .filter(s => s.trim())
      .map((instruction, idx) => ({
        step_number: idx + 1,
        instruction: instruction.trim(),
        image_url: newImages[idx] || undefined
      }));
    onChange?.(formatted);
  };

  const handleChange = (i: number, step: string) => {
    const update = [...steps];
    update[i] = step;
    setSteps(update);
    
    // Call onChange with formatted data
    const formatted = update
      .filter(s => s.trim())
      .map((instruction, idx) => ({
        step_number: idx + 1,
        instruction: instruction.trim(),
        image_url: existingImages[idx] || undefined
      }));
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
    
    // Update existing images with file URL for preview
    setExistingImages(prev => {
      const copy = [...prev];
      copy[i] = URL.createObjectURL(chosen);
      return copy;
    });
    
    // Call onChange to notify parent
    const formatted = steps
      .filter(s => s.trim())
      .map((instruction, idx) => ({
        step_number: idx + 1,
        instruction: instruction.trim(),
        image_url: idx === i ? URL.createObjectURL(chosen) : existingImages[idx] || undefined
      }));
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
    
    // Call onChange to notify parent
    const formatted = steps
      .filter(s => s.trim())
      .map((instruction, idx) => ({
        step_number: idx + 1,
        instruction: instruction.trim(),
        image_url: idx === i ? undefined : existingImages[idx] || undefined
      }));
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
