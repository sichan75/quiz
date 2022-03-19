import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { useRecoilState } from 'recoil';
import { examsState } from '../../recoil/states';
import { VerticalSpacer } from '../../components/common/VerticalSpacer';
import { OptionsSelectorModal } from '../../components/home/OptionsSelectorModal';
import { getSampleExam } from '../../helpers/image';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const HomeWrapper = styled.div`
  width: 380px;
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
  padding: 5px 20px;
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

interface LocalExamsItem {
  right: string;
  src: string | ArrayBuffer;
}

const uploadImage = (files: File[]) => {
  const results: LocalExamsItem[] = [];

  files.forEach((file) => {
    const sanitizedFileName = file.name.replace(/\.(png|jpe?g|svg)$/, '');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        results.push({ right: sanitizedFileName, src: e.target.result });
      }
    };
  });

  setTimeout(() => {
    const localExams = JSON.parse(localStorage.getItem('data') || '[]');
    const items: LocalExamsItem[] = [...results, ...localExams];
    const uniques: any = [...new Map(items.map((item) => [item.right, item])).values()] as any;
    localStorage.setItem('data', JSON.stringify(uniques));
  }, 100);
};

export const HomeContainer = () => {
  const [exams, setExams] = useRecoilState(examsState);
  const [cursor, setCursor] = useState<number | null>(null);
  const [isOptionsSelectorModalOpened, setIsOptionsSelectorModalOpened] = useState(false);

  const initExams = useCallback(
    () => {
      const sampleExams = getSampleExam();
      const localExams = localStorage.getItem('data');
      const sampleData = Object.keys(sampleExams).map((key) => [key, sampleExams[key]]);
      const sanitizedExtension = sampleData.map((e) => [e[0].replace(/\.(png|jpe?g|svg)$/, ''), e[1]]);
      const sanitizedUnderbar = sanitizedExtension.map((e) => [e[0].replace(/_/g, ' '), e[1]]);

      const calculatedSample = sanitizedUnderbar.map((item) => {
        return {
          right: item[0],
          src: item[1],
        };
      });
      const calculatedLocal = JSON.parse(localExams || '[]').map((item: { right: string; src: string }) => {
        return {
          right: item.right,
          src: item.src,
        };
      });

      setExams([...calculatedLocal, ...calculatedSample]);
    },
    [setExams],
  );

  useEffect(
    () => {
      initExams();
    },
    [initExams],
  );
  const { getRootProps } = useDropzone({
    accept: ['image/png', 'image/jpeg'],
    onDrop: (acceptedFiles) => {
      uploadImage(acceptedFiles);
      setTimeout(() => {
        initExams();
      }, 100);
    },
  });

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
              <img src={exams[cursor].src} alt="" style={{ maxWidth: 380, maxHeight: 220, marginBottom: 8 }} />
              <Typography variant="body1">정답: {exams[cursor].right}</Typography>
            </React.Fragment>
          )}
        </Exam>
        <VerticalSpacer size={40} />
        <ExamList>
          {exams.map((exam, index) => {
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
