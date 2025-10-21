import { showResidents, handleResidents } from "./residents.js";
import { inputEnabled } from "./index.js";
import { paginate } from "./paginate.js";

let filterStatusDiv = null;
let activeResidentsBtn = null;
let dischargedResidentsBtn = null;
let allResidentsBtn = null;
let query = "";

export const showFilteredResidents = () => {
  filterStatusDiv = document.getElementById("filter-status-div");
  activeResidentsBtn = document.getElementById("active-residents-btn");
  dischargedResidentsBtn = document.getElementById("discharged-residents-btn");
  allResidentsBtn = document.getElementById("all-residents-btn");

  filterStatusDiv.addEventListener("click", (e) => {
    if(inputEnabled && e.target.nodeName === "BUTTON") {
      if(e.target.id === "discharged-residents-btn") {
        query = "discharged";
        dischargedResidentsBtn.disabled = true;
        allResidentsBtn.disabled = false;      
        activeResidentsBtn.disabled = false;
        localStorage.setItem("savedFilter", query);
        showResidents(query).then(()=>paginate());
      } else if(e.target.id === "active-residents-btn") {
        query = "active";
        dischargedResidentsBtn.disabled = false;
        allResidentsBtn.disabled = false;    
        activeResidentsBtn.disabled = true;
        localStorage.setItem("savedFilter", query);
        showResidents(query).then(()=>paginate());
      } else {
        query = "all";
        dischargedResidentsBtn.disabled = false;
        allResidentsBtn.disabled = true;    
        activeResidentsBtn.disabled = false;
        localStorage.setItem("savedFilter", "all");
        showResidents(query).then(()=>paginate());
      }
    }
  })
}
