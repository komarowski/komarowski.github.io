
class PhraseBook {
  async init() {
    this.dialogElement = document.getElementById("dialog");
    this.audioElement = document.getElementById("audio");
    this.dialogRowTemplate = document.getElementById("dialog-row");
    this.selectDialog = document.getElementById("select-dialog");
    this.selectLangFirst = document.getElementById("select-lang-first");
    this.selectLangSecond = document.getElementById("select-lang-second");

    this.langFirst = this.getFieldFromLocalStorage("langFirst", "sr-lat");
    this.langSecond = this.getFieldFromLocalStorage("langSecond", "en");
    this.dialogIndex = this.getFieldFromLocalStorage("dialogIndex", 0);

    if (this.checkElementsExist){
      await this.initData();
      this.selectLangFirst.value = this.langFirst;
      this.selectLangSecond.value = this.langSecond;
      this.selectDialog.value = this.dialogIndex;
      this.generateChat();
      this.generateMedia(this.data[this.dialogIndex].mp3[this.langFirst]);
    } 
  }

  async initData() {
    // this.data = JSON.parse(data);
    const response = await fetch('https://komarowski.github.io/assets/data/data.json');
    this.data = await response.json();

    for (let i = 0; i < this.data.length; i++){
      const option = document.createElement('option');
      option.value = i;
      option.innerText = this.data[i].title;
      this.selectDialog.appendChild(option);
    }
  }

  getFieldFromLocalStorage(localField, defaultValue) {
    const localValue = localStorage.getItem(localField);
    return localValue ? localValue : defaultValue;
  }

  checkElementExist(element, name, result) {
    if (element == null) {
      console.log(`Element "${name}" not found`);
      result = false;
    }
    return result;
  }

  checkElementsExist() {
    let result = true;
    result = this.isElementExist(this.dialogElement, "dialog", result);
    result = this.isElementExist(this.audioElement, "audio", result);
    result = this.isElementExist(this.dialogRowTemplate, "dialog-row", result);
    result = this.isElementExist(this.selectDialog, "select-dialog", result);
    result = this.isElementExist(this.selectLangFirst, "select-lang-first", result);
    result = this.isElementExist(this.selectLangSecond, "select-lang-second", result);
    return result;
  }

  generate(){
    if (this.selectDialog.value !== this.dialogIndex){
      this.dialogIndex = this.selectDialog.value;
      this.generateChat();
      this.generateMedia();
      localStorage.setItem("dialogIndex", this.selectDialog.value);
    }

    if (this.selectLangFirst.value !== this.langFirst){
      this.langFirst = this.selectLangFirst.value;
      this.generateChatColumn(0, this.langFirst, true);
      this.generateMedia();
      localStorage.setItem("langFirst", this.selectLangFirst.value);
    }

    if (this.selectLangSecond.value !== this.langSecond){
      this.langSecond = this.selectLangSecond.value;
      this.generateChatColumn(1, this.langSecond, false);
      localStorage.setItem("langSecond", this.selectLangSecond.value);
    }
  }

  generateMedia(){
    this.audioElement.innerHTML = `
<audio controls="controls">
  <source src="${this.data[this.dialogIndex].mp3[this.langFirst]}" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>`;
  }

  generateChat(){
    this.dialogElement.innerHTML = "";
    for (let i = 0; i < this.data[this.dialogIndex].dialogue.length; i++) {
      const chatRowElement = this.dialogRowTemplate.content.cloneNode(true);
      const p = chatRowElement.querySelectorAll("p");
      p[0].innerHTML = this.replaceSelects(i, this.langFirst, true);
      p[1].innerHTML = this.replaceSelects(i, this.langSecond, false);
      if (i % 2 === 1){
        const div = chatRowElement.querySelectorAll("div");
        div[2].classList.add("w5-flex-end");
        div[4].classList.add("w5-flex-end");
      }
      this.dialogElement.appendChild(chatRowElement);
    }
    this.bindTextSelects();
  }

  generateChatColumn(gap, lang, isFirstColumn){
    const p = this.dialogElement.querySelectorAll("p");
    for (let i = 0; i < this.data[this.dialogIndex].dialogue.length; i++) {
      p[i*2 + gap].innerHTML = this.replaceSelects(i, lang, isFirstColumn);
    }
    this.bindTextSelects();
  }

  replaceSelects(index, lang, isFirstLang){
    let text = this.data[this.dialogIndex].dialogue[index][lang];
    const selectArray = text.match(/<select>(.*?)<\/select>/g);
    if (selectArray) {
      for (let i = 0; i < selectArray.length; i++){
        const selectID = selectArray[i].replace("<select>", "").replace("</select>", "");
        const selectJson = this.data[this.dialogIndex].selects[selectID];
        if (selectJson){
          const select = this.generateSelect(selectJson, selectID, lang, isFirstLang);      
          text = text.replace(selectArray[i], select);
        }
      }
    }
    return text;
  }

  generateSelect(selectJson, selectID, lang, isFirstLang){
    const id = `select-${isFirstLang ? "first" : "second"}-${selectID}`;
    const bindSelectId = `select-${isFirstLang ? "second" : "first"}-${selectID}`;
    let result = `<select class="w5-select-text" data-bindselect="${bindSelectId}" id="${id}">`;
    for (let i = 0; i < selectJson.options.length; i++){
      result += `<option value="${i}">${selectJson.options[i][lang]}</option>`;
    }
    return result + "</select>";
  }

  bindTextSelects(){
    const selects = document.querySelectorAll("select");
    selects.forEach(select => {
      const selectSecond = document.getElementById(select.dataset.bindselect);
      if (selectSecond) {
        if (select.dataset.listener === "true") {
          // remove all listeners by cloning the element
          const newSelect = select.cloneNode(true);
          select.parentNode.replaceChild(newSelect, select);
          PhraseBook.addEventListenerToSelect(newSelect, selectSecond)
        }
        else{
          PhraseBook.addEventListenerToSelect(select, selectSecond)
        }      
      }     
    });
  }

  static addEventListenerToSelect(selectFirst, selectSecond) {
    selectFirst.addEventListener("change", function() {
      if (selectFirst.value !== selectSecond.value){
        selectSecond.value = selectFirst.value;
      }
    });
    selectFirst.dataset.listener = "true";
  }
}