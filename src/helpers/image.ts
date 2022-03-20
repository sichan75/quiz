export interface LocalQuestionItem {
  id: string;
  right: string;
  src: string | ArrayBuffer;
}

export const uploadImage = (files: File[]) => {
  const results: LocalQuestionItem[] = [];

  files.forEach((file, index) => {
    const sanitizedFileName = file.name.replace(/\.(png|jpe?g|svg)$/, '');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        results.push({ id: `local-${index}${new Date().valueOf()}`, right: sanitizedFileName, src: e.target.result });
      }
    };
  });

  setTimeout(() => {
    const localQuestions = JSON.parse(localStorage.getItem('data') || '[]');
    const items: LocalQuestionItem[] = [...results, ...localQuestions];
    const uniques = [...new Map(items.map((item) => [item.right, item])).values()];
    localStorage.setItem('data', JSON.stringify(uniques));
  }, 100);
};

};
