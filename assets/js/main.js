const main = function () {
  const phraseBook = new PhraseBook();
  phraseBook.init();
  phraseBook.selectLangFirst.addEventListener("change", function() {
    phraseBook.generate();
  });
  phraseBook.selectLangSecond.addEventListener("change", function() {
    phraseBook.generate();
  });
  phraseBook.selectDialog.addEventListener("change", function() {
    phraseBook.generate();
  });
};
main();