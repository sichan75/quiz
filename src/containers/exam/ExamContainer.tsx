import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import sound from '../../assets/sound.mp3';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useNavigate, useParams } from 'react-router-dom';
import useSound from 'use-sound';
import { Button, TextField } from '@material-ui/core';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { questionsState, resultsState } from '../../recoil/states';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100vh;
`;

const Count = styled.p`
  font-size: 20px;
  margin: 10px;
  color: gray;
`;

const Question = styled.div`
  position: relative;
  width: 380px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  flex: 1;
  flex-grow: 1;
`;

interface ExamItem {
  value: string;
  right: string;
  src: string;
}

export const ExamContainer = () => {
  const { count: selectedCount, time: selectedTime } = useParams();
  const questions = useRecoilValue(questionsState);
  const setResults = useSetRecoilState(resultsState);
  const navigate = useNavigate();
  const [play] = useSound(sound, { volume: 0.3 });

  const textFieldRef = useRef<HTMLInputElement>(null);

  const [exams, setExams] = useState<ExamItem[]>([]);

  const [time, setTime] = useState(() => Number(selectedTime));
  const [cursor, setCursor] = useState(0);
  const [value, setValue] = useState('');

  const initExam = useCallback(
    () => {
      if (questions[0].right === '' && questions[0].src === '') {
        navigate('/');
      }

      const sanitizedLabels = questions.map((exam) => {
        return { src: exam.src, value: '', right: exam.right.replace(/-\d{1,2}/g, '') };
      });
      const uniques = [...new Map(sanitizedLabels.map((item) => [item.right, item])).values()];
      const shuffled = uniques.sort(() => Math.random() - 0.5);
      const limited = shuffled.slice(0, Number(selectedCount));

      const calculatedData = limited.map((item) => {
        return {
          value: '',
          right: item.right,
          src: item.src,
        };
      });
      setExams(calculatedData);
    },
    [questions, navigate, selectedCount],
  );

  useEffect(initExam, [initExam]);

  const handleSubmit = useCallback(
    () => {
      setResults(exams);
      navigate('/result');
    },
    [exams, navigate, setResults],
  );

  const handleNextQuestion = useCallback(
    () => {
      play();
      setValue('');
      exams[cursor].value = value;
      setTime(Number(selectedTime));

      if (exams.length - 1 === cursor) {
        // 마지막 문제면 제출
        handleSubmit();
      } else {
        setCursor((value) => value + 1);
        textFieldRef.current && textFieldRef.current.focus();
      }
    },
    [play, exams, cursor, value, selectedTime, handleSubmit],
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
        setTime((value) => {
          if (value === 0) {
            handleNextQuestion();
            return Number(selectedTime);
          }
          return value - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    },
    [handleNextQuestion, selectedTime],
  );

  if (exams.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <Question>
        <Count>
          {cursor + 1} / {exams.length}
        </Count>
        <p
          style={{
            fontSize: 30,
            margin: 10,
            color: time < 6 ? 'red' : 'black',
          }}
        >
          {time}초
        </p>

        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <OutsideClickHandler onOutsideClick={() => resetTransform()}>
              <div style={{ display: 'flex', justifyContent: 'center', border: '1px solid #eaeaea', borderRadius: 5 }}>
                <TransformComponent>
                  <img
                    className="hover-zoom"
                    src={exams[cursor].src}
                    alt=""
                    style={{
                      width: 380,
                      height: 250,
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
            flex: 1,
          }}
        >
          <TextField
            inputRef={textFieldRef}
            autoFocus
            style={{ width: 380, marginTop: 30 }}
            label="정답"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <ButtonWrapper>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
              style={{ width: 290, marginRight: 10, padding: 12 }}
            >
              {exams.length - 1 === cursor ? '제출' : '다음'}
            </Button>

            <Button variant="contained" color="secondary" onClick={handleSubmit} style={{ width: 55, padding: 12 }}>
              제출
            </Button>
          </ButtonWrapper>
        </div>
      </Question>
    </Wrapper>
  );
};
