const selects = document.querySelectorAll("select");
selects.forEach(selectFirst => {
  const selectSecond = document.getElementById(selectFirst.dataset.bindselect);
  if (selectSecond) {
    selectFirst.addEventListener("change", function() {
      if (selectFirst.value !== selectSecond.value){
        selectSecond.value = selectFirst.value;
      }
    });
  }     
});