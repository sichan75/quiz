import { Button, DialogTitle } from '@material-ui/core';
import { useMemo, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { rightIcon, wrongIcon } from '../../assets/icons';
import { resultsState } from '../../recoil/states';

export const ResultContainer = () => {
  const results = useRecoilValue(resultsState);
  const [cursor, setCursor] = useState(null);

  const sum = useMemo(
    () => {
      let cnt = 0;
      results.forEach((item) => {
        cnt = item.right === item.value ? cnt + 1 : cnt;
      });
      return cnt;
    },
    [results],
  );

  const handleClickAnswer = (i) => {
    if (i === cursor) {
      setCursor(null);
      return;
    }
    setCursor(i);
  };

  return (
    <div>
      <Wrapper>
        {results.map((item, i) => {
          const right = item.right === item.value;
          return (
            <div style={{ display: 'flex', alignItems: 'center' }} key={i.toString()}>
              <AnswerButton
                key={i}
                onClick={() => handleClickAnswer(i)}
                style={{ backgroundColor: cursor === i ? '#eaeaea' : 'white' }}
              >
                <AnswerNumber>{i + 1}</AnswerNumber>
                <img src={right ? rightIcon : wrongIcon} alt="" style={{ width: 18, margin: '0 8px' }} />
                <p style={{ fontSize: 16 }}>{item.value}</p>
              </AnswerButton>
              {!right && <p style={{ fontSize: 18, margin: '0 10px' }}> {item.right}</p>}
            </div>
          );
        })}

        <span style={{ margin: 4 }}>
          맞은 개수: <span style={{ fontWeight: 'bold' }}>{sum}</span>
        </span>
        <span style={{ margin: 4, marginBottom: 50 }}>총 개수: {results.length}</span>
      </Wrapper>
      {cursor !== null && (
        <div style={{ position: 'fixed', top: 20, right: 20, maxWidth: '50%' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setCursor(null)}>
              닫기
            </Button>
          </div>
          <TransformWrapper>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <OutsideClickHandler onOutsideClick={() => resetTransform()}>
                <TransformComponent>
                  <img src={results[cursor].src} alt="" style={{ maxWidth: '35vw', width: '100%', maxHeight: 500 }} />
                </TransformComponent>
                <div className="tools" style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
          <DialogTitle style={{ backgroundColor: 'white', marginLeft: -10, maxWidth: '20vw', width: '100%' }}>
            {results[cursor].right}
          </DialogTitle>
        </div>
      )}
    </div>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px;
`;

const AnswerButton = styled.button`
  width: 350px;
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
