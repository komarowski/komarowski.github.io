const blog = document.getElementById("blog");
const tableOfContents = document.getElementById("table-of-content");

if (blog != null && tableOfContents != null){
  const headers = blog.querySelectorAll("h1, h2");

  for (let i = 0; i < headers.length; i++) {
    const li = document.createElement("li");
    const a = document.createElement('a');
    a.innerHTML = headers[i].textContent;
    a.href = `#${headers[i].id}`;
    li.appendChild(a);
    tableOfContents.appendChild(li);
  }
}
