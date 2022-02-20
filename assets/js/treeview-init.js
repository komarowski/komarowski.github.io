// const treeView = document.getElementById("tree-view");

if (treeView && treeView != null){
  const file = treeView.dataset.file;
  const currentFile = document.getElementById(file);
  if (currentFile != null) {
    currentFile.classList.add("tree-view-item-current");
    const indexes = [...file.matchAll(new RegExp('__', 'gi'))].map(a => a.index);
    indexes.forEach(index => {
      const folder = file.slice(0, index + 2);
      let folderElement = document.getElementById(folder);
      if (folderElement != null) {
        folderElement.open = true;
      }
    });
  } else {
    const details = Array.from(treeView.querySelectorAll("details"))
    details.forEach(element => {
      element.open = true;
    });
  }
}

