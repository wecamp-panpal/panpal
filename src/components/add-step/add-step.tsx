import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';


const AddStep = () =>{
    const [steps, setSteps] = useState([""])
    
    const addSteps = () =>{
        setSteps([...steps,""])
    }

    const deleteStep = (i:number) =>{
        const updated = steps.filter((_,index)=> index!==i)
        setSteps(updated.length ? updated : [""])
    }

    const handleChange = (i:number, step: string) =>{
        const update = [...steps]
        update[i] = step
        setSteps(update)

    }
    return (
        
        <Box >
            {steps.map((step,i) => (
                <Box sx={{display:'flex'}}>
                    <TextField
            value={step}
            onChange={e => handleChange(i, e.target.value)}
            sx={{
             
            flex : 1,
              paddingBottom: 2,
              justifyContent: 'center',
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
              '& .MuiOutlinedInput-root': {
                border: '1.5px solid #391F06',
                boxShadow: 'none',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
              '& .MuiInputBase-input': {
                color: '#391F06',
           

                '&::placeholder': {
                  color: '#BFA980',
             
                  fontSize: 16,
                  opacity: 1,
                },
              },
            }}
          />  <IconButton sx={{ color: '#391F06',   }} onClick={() => deleteStep(i)}>
            <Delete />
          </IconButton>
                    </Box>
            ))}
            <Button
                    sx={{
                    
                      fontSize: 16,
                      color: '#391F06',
                      textTransform: 'none',
                      '&:hover': {
                        background: '#e6d2b7',
                        color: '#391F06',
                      },
                    }}
                    startIcon={<Add sx={{ color: '#391F06', '&:hover': { color: '#fff' } }} />}
                    onClick={addSteps}
                  >
                    Add Step
                  </Button>
            
        </Box>
        
    )
}
export default AddStep