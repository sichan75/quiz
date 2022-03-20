import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { useRecoilState } from 'recoil';
import { questionsState } from '../../recoil/states';
import { VerticalSpacer } from '../../components/common/VerticalSpacer';
import { OptionsSelectorModal } from '../../components/home/OptionsSelectorModal';
import { deleteImage, LocalQuestionItem, uploadImage } from '../../helpers/image';
import { getSampleQuestions } from '../../helpers/questions';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const HomeWrapper = styled.div`
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

const ItemButton =styled.button<{ isSelected: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 5px 0px;
  border-bottom: 1px solid #eaeaea;
  background-color: ${(props) => (props.isSelected ? '#f0f0f0' : 'white')};

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
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

export const HomeContainer = () => {
  const [questions, setQuestions] = useRecoilState(questionsState);
  const [cursor, setCursor] = useState<number | null>(null);
  const [isOptionsSelectorModalOpened, setIsOptionsSelectorModalOpened] = useState(false);

  const { getRootProps } = useDropzone({
    accept: ['image/png', 'image/jpeg'],
    onDrop: (acceptedFiles) => {
      uploadImage(acceptedFiles);
      setTimeout(() => {
        initQuestions();
      }, 100);
    },
  });

  const initQuestions = useCallback(
    () => {
      const sampleQuestions = getSampleQuestions();
      const calculatedSample = sampleQuestions.map((item, index) => {
        return {
          id: `sample-${index}`,
          right: item[0],
          src: item[1],
        };
      });

      const localQuestions = localStorage.getItem('data');
      const calculatedLocal = JSON.parse(localQuestions || '[]').map((item: LocalQuestionItem) => {
        return {
          id: item.id,
          right: item.right,
          src: item.src,
        };
      });

      setQuestions([...calculatedLocal, ...calculatedSample]);
    },
    [setQuestions],
  );

  useEffect(initQuestions, [initQuestions]);

  const handleRequestShowOptionsSelectorModal = () => {
    setIsOptionsSelectorModalOpened(true);
  };

  const handleRequestCloseOptionsSelectorModal = () => {
    setIsOptionsSelectorModalOpened(false);
  };

  return (
    <Wrapper>
      <HomeWrapper>
        <Exam style={{ backgroundColor: cursor !== null ? 'white' : '#eaeaea' }}>
          {cursor !== null && (
            <React.Fragment>
              <img src={questions[cursor].src} alt="" style={{ maxWidth: 380, maxHeight: 210, marginBottom: 8 }} />
              <Typography variant="body1">정답: {questions[cursor].right}</Typography>
            </React.Fragment>
          )}
        </Exam>
        <VerticalSpacer size={20} />
        <ExamList>
          {questions.map((exam, index) => {
            return (
              <ItemButton key={index.toString()} onClick={() => setCursor(index)} isSelected={cursor === index}>
                <Typography variant="h6">{exam.right}</Typography>
              </ItemButton>
            );
          })}
        </ExamList>

        <ButtonWrapper>
          <div {...getRootProps({ className: 'dropzone' })}>
            <Button variant="contained" color="primary" style={{ width: 150, padding: 12 }}>
              <Typography variant="body1">추가하기</Typography>
            </Button>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestShowOptionsSelectorModal}
            style={{ width: 150, padding: 12 }}
          >
            <Typography variant="body1">시험보기</Typography>
          </Button>
        </ButtonWrapper>
      </HomeWrapper>
      <OptionsSelectorModal
        isOpen={isOptionsSelectorModalOpened}
        onRequestClose={handleRequestCloseOptionsSelectorModal}
      />
    </Wrapper>
  );
};
