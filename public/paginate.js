import { showResidents, handleResidents } from "./residents.js";

export const paginate = () => {
  const savedFilter = localStorage.getItem("savedFilter");
  const totalResults = localStorage.getItem("currentTotalResults");
  const limit = 5;
  const totalPages = Math.ceil(totalResults / limit);

  let currentPage = 1;
  
  const paginateDiv = document.getElementById("pagination-div");
  paginateDiv.innerHTML = "";

  if(totalResults > limit) {
    const leftArrow = document.createElement('button');
    const rightArrow = document.createElement('button');

    rightArrow.classList.add("teal-button");
    rightArrow.classList.add("filter-button");
    rightArrow.textContent = ">";
    rightArrow.addEventListener("click", (e) => {
      if(currentPage < totalPages) {
        currentPage++;
        showResidents(savedFilter, currentPage);
      }
    })
    paginateDiv.appendChild(leftArrow);

    for(let i = 1; i <= totalPages; i++) {
      const pageNumberDiv = document.createElement('button');
      pageNumberDiv.classList.add("teal-button");
      pageNumberDiv.classList.add("filter-button");
      pageNumberDiv.textContent = i;
      pageNumberDiv.addEventListener("click", (e)=> {
        currentPage = i;
        showResidents(savedFilter, i);
      })
      paginateDiv.appendChild(pageNumberDiv);
    }
  
    leftArrow.classList.add("teal-button");
    leftArrow.classList.add("filter-button");
    leftArrow.textContent = "<";
    leftArrow.addEventListener("click", (e) => {
      if(currentPage - 1 > 0) {
        currentPage--;
        showResidents(savedFilter, currentPage);
      }
    })
    paginateDiv.appendChild(rightArrow);
  }
}
