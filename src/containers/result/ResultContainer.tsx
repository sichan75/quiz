import { Button, Typography } from '@material-ui/core';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { rightIcon, wrongIcon } from '../../assets/icons';
import { VerticalSpacer } from '../../components/common/VerticalSpacer';
import { resultsState } from '../../recoil/states';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ResultWrapper = styled.div`
  max-width: 380px;
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const ExamList = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  overflow-y: scroll;
  border: 1px solid #eaeaea;
`;

const AnswerButton = styled.button`
  width: 100%;
  border: 1px solid #eaeaea;
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const AnswerNumber = styled.div`
  display: flex;
  border-right: 1px solid #eaeaea;
  min-height: 40px;
  width: 35px;
  justify-content: center;
  align-items: center;
`;

const BottomWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 50px;
`;

const Exam = styled.div`
  width: 100%;
  height: 260px;
  margin: auto auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #eaeaea;
`;

export const ResultContainer = () => {
  const results = useRecoilValue(resultsState);
  const [cursor, setCursor] = useState<number | null>(null);
  const navigate = useNavigate();

  const rightNumber = useMemo(
    () => {
      let cnt = 0;
      results.forEach((item) => {
        cnt = item.right === item.value ? cnt + 1 : cnt;
      });
      return cnt;
    },
    [results],
  );

  const handleClickAnswerButton = useCallback(
    (i: number) => {
      if (i === cursor) {
        setCursor(null);
        return;
      }
      setCursor(i);
    },
    [cursor],
  );

  return (
    <Wrapper>
      <ResultWrapper>
        <Exam style={{ backgroundColor: cursor !== null ? 'white' : '#eaeaea' }}>
          {cursor !== null && (
            <React.Fragment>
              <img src={results[cursor].src} alt="" style={{ maxWidth: 380, maxHeight: 220, marginBottom: 8 }} />
              <Typography variant="body1">정답: {results[cursor].right}</Typography>
            </React.Fragment>
          )}
        </Exam>
        <VerticalSpacer size={20} />
        <ExamList>
          {results.map((item, i) => {
            const isRight = item.right === item.value;
            return (
              <AnswerButton
                key={i.toString()}
                onClick={() => handleClickAnswerButton(i)}
                style={{ backgroundColor: cursor === i ? '#eaeaea' : 'white' }}
              >
                <AnswerNumber>{i + 1}</AnswerNumber>
                <img src={isRight ? rightIcon : wrongIcon} alt="" style={{ width: 18, margin: '0 8px' }} />
                <p style={{ fontSize: 16, flex: 1, textAlign: 'left' }}>{item.value}</p>
                {!isRight && (
                  <Button color="secondary">
                    <Typography>보기</Typography>
                  </Button>
                )}
              </AnswerButton>
            );
          })}
        </ExamList>

        <BottomWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
            <span style={{ margin: 4 }}>
              맞은 개수: <span style={{ fontWeight: 'bold' }}>{rightNumber}</span>
            </span>
            <span style={{ margin: 4 }}>총 개수: {results.length}</span>
          </div>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: 90, padding: 12, marginTop: 0 }}
            onClick={() => navigate('/')}
          >
            다시하기
          </Button>
        </BottomWrapper>
      </ResultWrapper>
    </Wrapper>
  );
};
