export const getSampleQuestions = () => {
  const data = require.context('../sampleData/', false, /\.(png|jpe?g|svg)$/) as any;
  const images = data.keys().reduce((acc: { [x: string]: any }, next: string) => {
    acc[next.replace('./', '')] = require.context('../sampleData/', false, /\.(png|jpe?g|svg)$/)(next);
    return acc;
  }, {});
  const questions = Object.keys(images).map((key) => [key, images[key]]);
  const sanitizedExtension = questions.map((e) => [e[0].replace(/\.(png|jpe?g|svg)$/, ''), e[1]]);
  const sanitizedUnderbar = sanitizedExtension.map((e) => [e[0].replace(/_/g, ' '), e[1]]);
  return sanitizedUnderbar;
};
