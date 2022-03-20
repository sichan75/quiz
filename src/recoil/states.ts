import { atom } from 'recoil';

export interface ResultItem {
  value: string;
  right: string;
  src: string;
}

export const questionsState = atom({
  key: 'questionsState',
  default: [{ id: '', right: '', src: '' }],
});

export const resultsState = atom<ResultItem[]>({
  key: 'resultsState',
  default: [{ value: '', right: '', src: '' }],
});
