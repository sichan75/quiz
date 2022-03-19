import { atom } from 'recoil';

export const examsState = atom({
  key: 'examsState',
  default: [{ right: '', src: '' }],
});

export const resultsState = atom({
  key: 'resultsState',
  default: [{ value: '', right: '', src: '' }],
});
