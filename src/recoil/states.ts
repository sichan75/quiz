import { atom } from 'recoil';

export interface ResultItem {
  value: string;
  right: string;
  src: string;
}

export const examsState = atom({
  key: 'examsState',
  default: [{ right: '', src: '' }],
});

export const resultsState = atom<ResultItem[]>({
  key: 'resultsState',
  default: [{ value: '', right: '', src: '' }],
});
