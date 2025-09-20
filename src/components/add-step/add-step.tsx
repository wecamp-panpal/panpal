import { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Button, Typography } from '@mui/material';
import { Add, Delete, Close } from '@mui/icons-material';

export interface StepDraft {
  stepNumber: number;
  instruction: string;
  file?: File;
  imageUrl?: string;
}

interface AddStepProps {
  initialSteps?: StepDraft[];
  onChange?: (steps: StepDraft[]) => void;
}

const AddStep = ({ initialSteps, onChange }: AddStepProps) => {
  const inited = useRef(false);
  const [rows, setRows] = useState<StepDraft[]>([{ stepNumber: 1, instruction: '' }]);

  useEffect(() => {
    if (initialSteps && initialSteps.length > 0 && !inited.current) {
      const norm = initialSteps.map((s, idx) => ({
        stepNumber: s.stepNumber ?? idx + 1,
        instruction: s.instruction ?? '',
        file: s.file,
        imageUrl: s.imageUrl,
      }));
      setRows(norm);
      inited.current = true;
    }
  }, [initialSteps]);

  const emit = (list: StepDraft[]) => {
    onChange?.(
      list
        .map((s, idx) => ({
          ...s,
          stepNumber: idx + 1,
          instruction: s.instruction.trim(),
        }))
        .filter(s => s.instruction)
    );
  };

  const addSteps = () => {
    setRows(prev => {
      const next = [...prev, { stepNumber: prev.length + 1, instruction: '' }];
      emit(next);
      return next;
    });
  };

  const deleteStep = (i: number) => {
    setRows(prev => {
      const next = prev.filter((_, idx) => idx !== i);
      const final = next.length ? next : [{ stepNumber: 1, instruction: '' }];
      emit(final);
      return final;
    });
  };

  const handleChange = (i: number, val: string) => {
    setRows(prev => {
      const next = [...prev];
      next[i] = { ...next[i], instruction: val };
      emit(next);
      return next;
    });
  };

  const handleFileChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const preview = URL.createObjectURL(f);
    setRows(prev => {
      const next = [...prev];
      next[i] = { ...next[i], file: f, imageUrl: preview };
      emit(next);
      return next;
    });
    e.target.value = '';
  };

  const removeFile = (i: number) => {
    setRows(prev => {
      const next = [...prev];
      next[i] = { ...next[i], file: undefined, imageUrl: undefined };
      emit(next);
      return next;
    });
  };

  return (
    <Box>
      {rows.map((row, i) => {
        const inputId = `file-upload-${i}`;
        return (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 2 }}>
            <TextField
              value={row.instruction}
              onChange={e => handleChange(i, e.target.value)}
              placeholder={`Step ${i + 1}...`}
              sx={{
                height: 60,
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
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
                    justifyContent: (row.file || row.imageUrl) ? 'flex-start' : 'center',
                    '&:hover': { backgroundColor: '#f0e4d3' },
                  }}
                >
                  {row.file ? (
                    <Typography variant="body2" sx={{ color: '#391F06', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.file.name}
                    </Typography>
                  ) : row.imageUrl ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: '#391F06', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        📷 Step image
                      </Typography>
                      <IconButton size="small" onClick={(e) => { e.preventDefault(); removeFile(i); }} sx={{ p: 0.25 }}>
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
