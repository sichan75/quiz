import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { HomePage } from './pages/HomePage';
import { ExamPage } from './pages/ExamPage';
import { ResultPage } from './pages/ResultPage';

export const App = () => {
  return (
    <Router>
      <RecoilRoot>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/test/count=:count/time=:time" element={<ExamPage />} />
          <Route exact path="/result" element={<ResultPage />} />
        </Routes>
      </RecoilRoot>
    </Router>
  );
};
