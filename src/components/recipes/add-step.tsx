import { useState, useEffect, useCallback } from 'react';
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
  // ✅ ÉP kiểu rõ ràng để tránh union type
  const [steps, setSteps] = useState<StepDraft[]>(() => {
    if (initialSteps && initialSteps.length > 0) {
      return initialSteps.map((s, idx) => ({
        stepNumber: s.stepNumber ?? idx + 1,
        instruction: s.instruction ?? '',
        file: s.file,
        imageUrl: s.imageUrl,
      })) as StepDraft[];
    }
    return [{ stepNumber: 1, instruction: '' }] as StepDraft[];
  });

  // Emit lên parent sau mỗi thay đổi
  const notifyParent = useCallback(
    (newSteps: StepDraft[]) => {
      const formatted = newSteps
        .map((s, idx) => ({
          ...s,
          stepNumber: idx + 1,
          instruction: (s.instruction ?? '').trim(),
        }))
        // ✅ Giữ step nếu có text HOẶC có file/preview
        .filter(s => s.instruction.length > 0 || s.file || s.imageUrl);
      onChange?.(formatted);
    },
    [onChange]
  );

  useEffect(() => {
    notifyParent(steps);
  }, [steps, notifyParent]);

  // Cleanup blob URLs khi unmount
  useEffect(() => {
    return () => {
      steps.forEach(s => {
        if (s.imageUrl && s.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(s.imageUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (i: number, value: string) => {
    setSteps(prev => {
      const next = [...prev];
      next[i] = { ...next[i], instruction: value };
      return next;
    });
  };

  const addStep = () => {
    setSteps(prev => [...prev, { stepNumber: prev.length + 1, instruction: '' }]);
  };

  const deleteStep = (i: number) => {
    setSteps(prev => {
      const next = [...prev];
      const url = next[i]?.imageUrl;
      if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
      next.splice(i, 1);
      return next.length ? next : [{ stepNumber: 1, instruction: '' }];
    });
  };

  const handleFileChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setSteps(prev => {
      const next = [...prev];
      // revoke preview cũ nếu có
      const oldUrl = next[i]?.imageUrl;
      if (oldUrl && oldUrl.startsWith('blob:')) URL.revokeObjectURL(oldUrl);
      next[i] = { ...next[i], file, imageUrl: preview };
      return next;
    });

    e.target.value = ''; // cho phép chọn lại cùng file
  };

  const removeFile = (i: number) => {
    setSteps(prev => {
      const next = [...prev];
      const oldUrl = next[i]?.imageUrl;
      if (oldUrl && oldUrl.startsWith('blob:')) URL.revokeObjectURL(oldUrl);
      next[i] = { ...next[i], file: undefined, imageUrl: undefined };
      return next;
    });
  };

  return (
    <Box>
      {steps.map((step, i) => {
        const inputId = `file-upload-${i}`;
        return (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 2 }}>
            <TextField
              value={step.instruction}
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
                    justifyContent: step.file || step.imageUrl ? 'flex-start' : 'center',
                    '&:hover': { backgroundColor: '#f0e4d3' },
                  }}
                >
                  {step.file ? (
                    <Typography variant="body2" sx={{ color: '#391F06', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {step.file.name}
                    </Typography>
                  ) : step.imageUrl ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: '#391F06', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        📷 Step image
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.preventDefault(); removeFile(i); }}
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
          mt: 0,
          fontSize: 16,
          color: '#391F06',
          textTransform: 'none',
          paddingBottom: 2,
          border: 'none',
          boxShadow: 'none',
          '&:hover': { background: '#e6d2b7', color: '#391F06', border: 'none', boxShadow: 'none' },
          '&:focus': { border: 'none', boxShadow: 'none', outline: 'none' },
        }}
        startIcon={<Add sx={{ color: '#391F06' }} />}
        onClick={addStep}
      >
        Add Step
      </Button>
    </Box>
  );
};

export default AddStep;
