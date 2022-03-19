import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { HomeSidebar } from '../../components/home/HomeSidebar';
import { useRecoilState } from 'recoil';
import { examsState } from '../../recoil/states';

const getSampleExam = () => {
  const data = require.context('../../sampleExams/', false, /\.(png|jpe?g|svg)$/);
  return data.keys().reduce((acc, next) => {
    acc[next.replace('./', '')] = require.context('../../sampleExams/', false, /\.(png|jpe?g|svg)$/)(next);
    return acc;
  }, {});
};

const uploadImage = (files) => {
  const results = [];
  files.forEach((file) => {
    const sanitizedFileName = file.name.replace(/\.(png|jpe?g|svg)$/, '');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      results.push({ name: sanitizedFileName, src: e.target.result });
    };
  });

  setTimeout(() => {
    const localExams = JSON.parse(localStorage.getItem('data'));
    const items = [...results, ...localExams];
    const uniques = [...new Map(items.map((item) => [item.name, item])).values()];
    localStorage.setItem('data', JSON.stringify(uniques));
  }, 100);
};

export const HomeContainer = () => {
  const [exams, setExams] = useRecoilState(examsState);

  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const navigate = useNavigate();

  const handleChangeCount = (event) => {
    setCount(event.target.value);
  };

  const handleChangeTime = (event) => {
    setTime(event.target.value);
  };

  const handleClickStartButton = () => {
    navigate(`/test/count=${count}/time=${time}`);
  };

  const initExams = useCallback(
    () => {
      const sampleExams = getSampleExam();
      const localExams = JSON.parse(localStorage.getItem('data'));
      const sampleData = Object.keys(sampleExams).map((key) => [key, sampleExams[key]]);
      const sanitizedExtension = sampleData.map((e) => [e[0].replace(/\.(png|jpe?g|svg)$/, ''), e[1]]);
      const sanitizedUnderbar = sanitizedExtension.map((e) => [e[0].replace(/_/g, ' '), e[1]]);

      const calculatedSample = sanitizedUnderbar.map((item) => {
        return {
          right: item[0],
          src: item[1],
        };
      });
      const calculatedLocal = localExams.map((item) => {
        return {
          right: item.name,
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
  const { getRootProps, getInputProps } = useDropzone({
    accepts: ['image/png', 'image/jpeg'],
    onDrop: (acceptedFiles) => {
      uploadImage(acceptedFiles);
      setTimeout(() => {
        initExams();
      }, 100);
    },
  });
  return (
    <Wrapper>
      <SideBarWrapper>
        <HomeSidebar exams={exams} />
      </SideBarWrapper>
      <HomeWrapper>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="inner">
            <Title>문제 수</Title>
            <RadioGroup name="questions" value={count} onChange={handleChangeCount}>
              <FormControlLabel value="40" control={<Radio />} label="40문제" />
              <FormControlLabel value="60" control={<Radio />} label="60문제" />
              <FormControlLabel value="80" control={<Radio />} label="80문제" />
              <FormControlLabel value="100" control={<Radio />} label="100문제" />
              <FormControlLabel value="120" control={<Radio />} label="120문제" />
            </RadioGroup>
          </div>
          <div className="inner">
            <Title>문제당 시간</Title>
            <RadioGroup name="time" value={time} onChange={handleChangeTime}>
              <FormControlLabel value="15" control={<Radio />} label="15초" />
              <FormControlLabel value="20" control={<Radio />} label="20초" />
              <FormControlLabel value="25" control={<Radio />} label="25초" />
              <FormControlLabel value="30" control={<Radio />} label="30초" />
              <FormControlLabel value="40" control={<Radio />} label="40초" />
            </RadioGroup>
          </div>
        </div>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>

        <div className="inner">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickStartButton}
            disabled={!count || !time}
            style={{ width: 250, padding: 12 }}
          >
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>시작</span>
          </Button>
        </div>
      </HomeWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .inner {
    margin: 10px 40px;
    display: flex;
    flex-direction: column;
  }
`;

const Title = styled.span`
  font-size: 22px;
  line-height: 44px;
  font-weight: bold;
  color: red;
`;

const SideBarWrapper = styled.div`
  right: 0;
  position: fixed;
  transition: right 0.5s;
  z-index: 99;
`;
