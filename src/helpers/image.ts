export const getSampleExam = () => {
  const data = require.context('../sampleExams/', false, /\.(png|jpe?g|svg)$/) as any;
  return data.keys().reduce((acc: { [x: string]: any }, next: string) => {
    acc[next.replace('./', '')] = require.context('../sampleExams/', false, /\.(png|jpe?g|svg)$/)(next);
    return acc;
  }, {});
};
