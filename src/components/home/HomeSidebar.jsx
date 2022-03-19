import React, { useState } from 'react';
import styled from 'styled-components';

export const HomeSidebar = ({ exams }) => {
  const [cursor, setCursor] = useState(null);

  console.log(exams);

  return (
    <div>
      {cursor !== null && (
        <ExamWrapper>
          <img src={exams[cursor].src} alt="" style={{ maxWidth: 300, maxHeight: 300 }} />
          <ItemTitle>정답: {exams[cursor].right}</ItemTitle>
        </ExamWrapper>
      )}
      <Title>문제 목록</Title>
      <SideBarWrapper>
        <ExamsWrapper>
          {exams.map((exam, index) => {
            return (
              <Item onMouseEnter={() => setCursor(index)} onMouseLeave={() => setCursor(null)}>
                <p>{index + 1}.</p>
                <ItemTitle>{exam.right}</ItemTitle>
              </Item>
            );
          })}
        </ExamsWrapper>
      </SideBarWrapper>
    </div>
  );
};

const ExamsWrapper = styled.div`
  position: relative;
  height: 100vh;
  overflow-y: scroll;
  border: 1px solid #eaeaea;
`;

const Item = styled.div`
  display: flex;
  padding: 5px 20px;
  border-bottom: 1px solid #eaeaea;
  width: 250px;

  &:hover {
    cursor: pointer;
  }
`;

const SideBarWrapper = styled.div`position: relative;`;
const Title = styled.h3``;

const ItemTitle = styled.p`
  margin-left: 5px;
  font-size: 15px;
  line-height: 20px;
`;

const ExamWrapper = styled.div`
  position: fixed;
  z-index: 1;
  width: 200px;
  height: 200px;
  margin: auto auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
