import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { HomePage } from './pages/HomePage';
import { ExamPage } from './pages/ExamPage';
import { ResultPage } from './pages/ResultPage';


export const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test/count=:count&time=:time" element={<ExamPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </RecoilRoot>
    </Router>
  );
};
