import { useCallback, useEffect, useRef, useState } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import useSound from 'use-sound';
import { Button, TextField } from '@material-ui/core';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import OutsideClickHandler from 'react-outside-click-handler';
import sound from '../../assets/sound.mp3';
import { examsState, resultsState } from '../../recoil/states';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 500px;
  flex: 1;
`;

const Question = styled.div`max-width: 35vw;`;

const MemoWrapper = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  overflow-y: scroll;
`;

const MemoTitle = styled.div`
  background-color: white;
  display: flex;
  flex: 1;
  justify-content: center;
`;

const Memo = styled.textarea`
  width: 200px;
  height: calc(100% - 60px);
  outline: none !important;
  font-size: 16px;
  line-height: 19px;
  font-family: 'Noto Sans Kr';
  resize: none !important;

  &:focus {
    background-color: #f8f8f8;
  }
`;

const FixedAnswers = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  overflow-y: scroll;
`;

const AnswerBox = styled.div`
  width: 300px;
  border: 1px solid #eaeaea;
  display: flex;
  align-items: center;
`;

const AnswerNumber = styled.div`
  display: flex;
  border-right: 1px solid #eaeaea;
  min-height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const FixedAnswerInput = styled.input`
  display: flex;
  flex: 1;
  width: 300px;
  min-height: 40px;
  border: none;
  outline: none !important;
  background-color: transparent;
`;

export const ExamContainer = () => {
  const { count: selectedCount, time: selectedTime } = useParams();
  const exams = useRecoilValue(examsState);
  const setAnswers = useSetRecoilState(resultsState);
  const [time, setTime] = useState(() => selectedTime);
  const [cursor, setCursor] = useState(0);
  const [play] = useSound(sound, { volume: 0.3 });
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [infos, setInfos] = useState([]);
  const textFieldRef = useRef(null);

  const initInfos = useCallback(
    () => {
      const sanitizedLabels = exams.map((exam) => {
        return { src: exam.src, value: '', right: exam.right.replace(/-\d{1,2}/g, '') };
      });
      const uniques = [...new Map(sanitizedLabels.map((item) => [item.right, item])).values()];
      const shuffled = uniques.sort(() => Math.random() - 0.5);
      const limited = shuffled.slice(0, selectedCount);

      const calculatedData = limited.map((item) => {
        return {
          value: '',
          right: item.right,
          src: item.src,
        };
      });
      setInfos(calculatedData);
    },
    [exams, selectedCount],
  );

  const handleChangeValue = useCallback(
    (index, value) => {
      infos[index].value = value;
    },
    [infos],
  );

  const handleSubmit = useCallback(
    () => {
      setAnswers(infos);
      navigate('/result');
    },
    [infos, navigate, setAnswers],
  );

  const handleNextQuestion = useCallback(
    () => {
      play();
      textFieldRef.current.focus();
      setValue('');
      setTime(selectedTime);
      infos[cursor].value = value;

      if (infos.length - 1 === cursor) {
        // 마지막 문제면 제출
        handleSubmit();
      } else {
        setCursor((value) => value + 1);
      }
    },
    [play, selectedTime, infos, cursor, value, handleSubmit],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        handleNextQuestion();
      }
    },
    [handleNextQuestion],
  );

  useEffect(
    () => {
      const timer = setInterval(() => {
        setTime((value) => (value === 0 ? handleNextQuestion() : value - 1));
      }, 1000);

      return () => clearInterval(timer);
    },
    [handleNextQuestion],
  );

  useEffect(
    () => {
      initInfos();
    },
    [initInfos],
  );

  if (infos.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <Question style={{ position: 'relative' }}>
        <p style={{ fontSize: 20, margin: 10, color: 'gray' }}>{cursor + 1}번</p>
        <p
          style={{
            fontSize: 30,
            margin: 10,
            color: time < 6 ? 'red' : 'black',
          }}
        >
          {time}
        </p>

        <TransformWrapper style={{ display: 'flex', alignItems: 'center' }}>
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <OutsideClickHandler onOutsideClick={() => resetTransform()}>
              <div style={{ display: 'flex', justifyContent: 'center', border: '1px solid #eaeaea', borderRadius: 5 }}>
                <TransformComponent>
                  <img
                    className="hover-zoom"
                    src={infos[cursor].src}
                    alt=""
                    style={{
                      width: '100%',
                      maxHeight: 500,
                      backgroundColor: 'red',
                    }}
                  />
                </TransformComponent>
              </div>
              <div style={{ position: 'absolute', bottom: 120, right: 0 }}>
                <Button variant="outlined" onClick={() => zoomIn()}>
                  +
                </Button>
                <Button variant="outlined" onClick={() => zoomOut()}>
                  -
                </Button>
                <Button variant="outlined" onClick={() => resetTransform()}>
                  reset
                </Button>
              </div>
            </OutsideClickHandler>
          )}
        </TransformWrapper>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: 30,
          }}
        >
          <TextField
            inputRef={textFieldRef}
            autoFocus
            style={{ width: 375, marginTop: 30 }}
            label="정답"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNextQuestion}
            style={{ marginTop: 20, width: 250 }}
          >
            {infos.length - 1 === cursor ? '제출' : '다음'}
          </Button>
        </div>
      </Question>
      <FixedAnswers style={{ marginRight: 210 }}>
        {infos.map((item, i) => (
          <AnswerBox key={i}>
            <AnswerNumber>{i + 1}</AnswerNumber>
            <FixedAnswerInput
              defaultValue={item.value}
              style={{ backgroundColor: cursor === i ? '#eaeaea' : '#fff' }}
              onChange={(e) => handleChangeValue(i, e.target.value)}
            />
          </AnswerBox>
        ))}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          style={{ width: '100%', marginBottom: 40 }}
        >
          제출하기
        </Button>
      </FixedAnswers>
      <MemoWrapper>
        <MemoTitle>
          <p style={{ fontSize: 15, fontWeight: 'bold' }}>메모</p>
        </MemoTitle>
        <Memo />
      </MemoWrapper>
    </Wrapper>
  );
};
