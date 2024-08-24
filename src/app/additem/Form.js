

import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';


import { MyContext } from './useContext';
import { styled } from '@mui/material';

const filter = createFilterOptions();

const topImages = [
  { title: 'Carousel Images' },
  { title: 'Trending Deals' },
  { title: 'Weekly Deals' },
  { title: 'Festival Special' },
  { title: 'Deal for Today' },
];

export default function Form() {
  const { typimg, settypimg, ctitle, setctitle, cdec, setcdec, coff, setcoff, cprice, setcprice } = useContext(MyContext);
  
  return (
    <Container>
      <Autocomplete
        value={typimg}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            settypimg({ title: newValue });
          } else if (newValue && newValue.inputValue) {
            settypimg({ title: newValue.inputValue });
          } else {
            settypimg(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;
          const isExisting = options.some((option) => inputValue === option.title);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              title: `Add "${inputValue}"`,
            });
          }
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={topImages}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.title;
        }}
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        sx={{ width: 300 }}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Type of Images" />
        )}
      />
      {typimg && typimg.title !== 'Carousel Images' && (
        <TextareaContainer>
          <TextareaLabel>Title:</TextareaLabel>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Enter Title of Images"
            value={ctitle}
            onChange={(e) => setctitle(e.target.value)}
          />
        </TextareaContainer>
      )}
      {typimg && typimg.title !== 'Carousel Images' && (
        <TextareaContainer>
          <TextareaLabel>Description:</TextareaLabel>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Enter Description of Images"
            value={cdec}
            onChange={(e) => setcdec(e.target.value)}
          />
        </TextareaContainer>
      )}
      {typimg && (
        <InputContainer>
          <UnstyledInputIntroduction
            label="Amount of Product"
            value={cprice}
            onChange={(e) => setcprice(e.target.value)}
          />
          <div style={{ marginTop: '10px' }}></div>
          <UnstyledInputIntroduction
            label="Percentage off Product"
            value={coff}
            onChange={(e) => setcoff(e.target.value)}
          />
        </InputContainer>
      )}
    </Container>
  );
}
const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

const TextareaContainer = styled('div')`
  width: 320px;
`;

const TextareaLabel = styled('div')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const TextareaAutosize = styled(BaseTextareaAutosize)(({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? '#ccc' : '#333'};
  background: ${theme.palette.mode === 'dark' ? '#333' : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? '#666' : '#ccc'};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? '#333' : '#ccc'};
  
  &:hover {
    border-color: #007FFF;
  }
  
  &:focus {
    border-color: #007FFF;
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? '#007FFF' : '#b6daff'};
  }
  
  &:focus-visible {
    outline: 0;
  }
`);

const InputContainer = styled('div')`
  width: 320px;
  margin-top: 10px;
`;

function UnstyledInputIntroduction(props) {
  return (
    <TextField
      {...props}
      fullWidth
      variant="outlined"
      type="number"
      InputProps={{
        inputProps: {
          min: 0,
        },
      }}
    />
  );
}

