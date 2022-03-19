import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const buttonStyle = {
  width: '100%',
  display: 'flex',
  marginTop: 100,
  padding: 12,
};

const SelectorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

interface ExamModalProps {
  isOpen: boolean;
  onRequestClose(): void;
}

export const OptionsSelectorModal: React.FC<ExamModalProps> = ({ isOpen, onRequestClose }) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);

  const handleClickStartButton = () => {
    navigate(`/test/count=${count}/time=${time}`);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyles}>
        <SelectorWrapper>
          <FormControl style={{ width: 120 }}>
            <InputLabel id="demo-customized-select-label">문제 수</InputLabel>
            <Select value={count} onChange={(event) => setCount(Number(event.target.value))}>
              <MenuItem value={10}>10개</MenuItem>
              <MenuItem value={20}>20개</MenuItem>
              <MenuItem value={30}>30개</MenuItem>
              <MenuItem value={40}>40개</MenuItem>
              <MenuItem value={50}>50개</MenuItem>
              <MenuItem value={60}>60개</MenuItem>
              <MenuItem value={70}>70개</MenuItem>
              <MenuItem value={80}>80개</MenuItem>
              <MenuItem value={90}>90개</MenuItem>
              <MenuItem value={100}>100개</MenuItem>
            </Select>
          </FormControl>

          <FormControl style={{ width: 120 }}>
            <InputLabel id="demo-customized-select-label">문제당 시간</InputLabel>
            <Select value={time} onChange={(event) => setTime(Number(event.target.value))}>
              <MenuItem value={10}>10초</MenuItem>
              <MenuItem value={15}>15초</MenuItem>
              <MenuItem value={20}>20초</MenuItem>
              <MenuItem value={25}>25초</MenuItem>
              <MenuItem value={30}>30초</MenuItem>
              <MenuItem value={35}>35초</MenuItem>
              <MenuItem value={40}>40초</MenuItem>
              <MenuItem value={45}>45초</MenuItem>
              <MenuItem value={50}>50초</MenuItem>
              <MenuItem value={55}>55초</MenuItem>
            </Select>
          </FormControl>
        </SelectorWrapper>

        <Button
          variant="contained"
          color="primary"
          onClick={handleClickStartButton}
          style={buttonStyle}
          disabled={!count || !time}
        >
          <Typography variant="body1">시작하기</Typography>
        </Button>
      </Box>
    </Modal>
  );
};
