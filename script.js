// Tabber
const tabs = document.querySelectorAll("#menuTabs li, .submenu li");
const contents = document.querySelectorAll(".tab-content");
const mainTabs = document.querySelectorAll("#menuTabs > li");

tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    contents.forEach((c) => c.classList.remove("active"));
    tabs.forEach((t) => t.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");

    let parentLi = tab.closest("#menuTabs > li");
    if (parentLi) parentLi.classList.add("active");
  });
});

// General → Currencies Search
const table = document.getElementById("currencyTable");
const rows = Array.from(table.querySelectorAll("tbody tr"));

function filterTable() {
  const currencySearch = document
    .getElementById("searchCurrency")
    .value.toLowerCase();
  const textSearch = document.getElementById("searchText").value.toLowerCase();
  const dateFrom = document.getElementById("dateFrom").value;
  const dateTo = document.getElementById("dateTo").value;

  if (!currencySearch && !textSearch && !dateFrom && !dateTo) return;

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const currencyCode = cells[0].innerText.toLowerCase();
    const currencyName = cells[1].innerText.toLowerCase();
    const allText = row.innerText.toLowerCase();
    const dateCreated = cells[5].innerText
      .split(" ")[0]
      .split("/")
      .reverse()
      .join("-");

    let match = true;

    if (
      currencySearch &&
      !currencyCode.includes(currencySearch) &&
      !currencyName.includes(currencySearch)
    )
      match = false;
    if (textSearch && !allText.includes(textSearch)) match = false;
    if (dateFrom && dateCreated < dateFrom) match = false;
    if (dateTo && dateCreated > dateTo) match = false;

    row.style.display = match ? "" : "none";
  });
}

document
  .getElementById("searchCurrency")
  .addEventListener("input", filterTable);
document.getElementById("searchText").addEventListener("input", filterTable);

document.getElementById("searchByDate").addEventListener("click", () => {
  if (
    document.getElementById("dateFrom").value ||
    document.getElementById("dateTo").value
  ) {
    filterTable();
  }
});

document.getElementById("resetSearch").addEventListener("click", () => {
  const currencyInput = document.getElementById("searchCurrency");
  const textInput = document.getElementById("searchText");

  if (currencyInput.value || textInput.value) {
    currencyInput.value = "";
    textInput.value = "";

    rows.forEach((row) => (row.style.display = ""));
  }
});

document.getElementById("resetDates").addEventListener("click", () => {
  const fromInput = document.getElementById("dateFrom");
  const toInput = document.getElementById("dateTo");

  if (fromInput.value || toInput.value) {
    fromInput.value = "";
    toInput.value = "";

    rows.forEach((row) => (row.style.display = ""));
  }
});

document.getElementById("rowsPerPage").addEventListener("change", function () {
  const limit = parseInt(this.value);
  rows.forEach((row, i) => {
    row.style.display = i < limit ? "" : "none";
  });
});
document.getElementById("rowsPerPage").dispatchEvent(new Event("change"));

document.getElementById("exportExcel").addEventListener("click", () => {
  let csv = [];
  const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
    th.innerText.replace(/\s+/g, " ").trim()
  );
  csv.push(headers.join(","));

  rows.forEach((row) => {
    if (row.style.display !== "none") {
      const cols = Array.from(row.querySelectorAll("td")).map(
        (td) => `"${td.innerText.trim()}"`
      );
      csv.push(cols.join(","));
    }
  });

  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "CurrencyTable.csv";
  a.click();
  window.URL.revokeObjectURL(url);
});
