const main = async function () {
  const phraseBook = new PhraseBook();
  await phraseBook.init();
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