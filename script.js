// Tabber
const tabs = document.querySelectorAll("#menuTabs li, .submenu li");
const contents = document.querySelectorAll(".tab-content");

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

// Table Search, Filter, Export
document.querySelectorAll(".tab-content").forEach((tabContent) => {
  const table = tabContent.querySelector("table");
  if (!table) return;

  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
    th.innerText.trim().toLowerCase()
  );

  // Inputs
  const searchRegion = tabContent.querySelector(".searchRegion");
  const searchCountry = tabContent.querySelector(".searchCountry");
  const searchCurrency = tabContent.querySelector(".searchCurrency");
  const searchProvider = tabContent.querySelector(".searchProvider");
  const searchText = tabContent.querySelector(".searchText");
  const dateFromInput = tabContent.querySelector(".dateFrom");
  const dateToInput = tabContent.querySelector(".dateTo");
  const rowsPerPageSelect = tabContent.querySelector(".rowsPerPage");
  const searchByDateBtn = tabContent.querySelector(".searchByDate");
  const resetDatesBtn = tabContent.querySelector(".resetDates");
  const resetSearchBtn = tabContent.querySelector(".resetSearch");
  const exportBtn = tabContent.querySelector(".exportExcelBtn");

  function getCellByHeader(row, headerName) {
    const index = headers.indexOf(headerName.toLowerCase());
    if (index === -1) return "";
    return row.querySelectorAll("td")[index]?.innerText.toLowerCase() || "";
  }

  function parseDate(dateStr) {
    // Convert dd/mm/yyyy or yyyy-mm-dd to yyyy-mm-dd for comparison
    if (!dateStr) return "";
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }

  function filterTable() {
    const regionValue = searchRegion?.value.toLowerCase() || "";
    const countryValue = searchCountry?.value.toLowerCase() || "";
    const currencyValue = searchCurrency?.value.toLowerCase() || "";
    const providerValue = searchProvider?.value.toLowerCase() || "";
    const textValue = searchText?.value.toLowerCase() || "";
    const dateFrom = parseDate(dateFromInput?.value);
    const dateTo = parseDate(dateToInput?.value);
    const limit = parseInt(rowsPerPageSelect?.value) || rows.length;

    let visibleCount = 0;

    rows.forEach((row) => {
      const rowRegion = getCellByHeader(row, "Region Name");
      const rowCountry = getCellByHeader(row, "Country Name");
      const rowCurrencyCode = getCellByHeader(row, "Currency Code");
      const rowCurrencyName = getCellByHeader(row, "Currency Name");
      const rowProvider = getCellByHeader(row, "Country Provider");
      const rowText = row.innerText.toLowerCase();
      const rowDate = parseDate(getCellByHeader(row, "Date Created"));

      // Match currency code OR currency name
      const currencyMatch =
        !currencyValue ||
        rowCurrencyCode.includes(currencyValue) ||
        rowCurrencyName.includes(currencyValue);

      let match =
        (!regionValue || rowRegion.includes(regionValue)) &&
        (!countryValue || rowCountry.includes(countryValue)) &&
        currencyMatch &&
        (!providerValue || rowProvider.includes(providerValue)) &&
        (!textValue || rowText.includes(textValue));

      if (match && dateFrom) match = rowDate >= dateFrom;
      if (match && dateTo) match = rowDate <= dateTo;
      if (match && visibleCount >= limit) match = false;

      row.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });
  }

  // Add input listeners
  [
    searchRegion,
    searchCountry,
    searchCurrency,
    searchProvider,
    searchText,
  ].forEach((input) => {
    if (input) input.addEventListener("input", filterTable);
  });

  if (rowsPerPageSelect)
    rowsPerPageSelect.addEventListener("change", filterTable);
  if (searchByDateBtn) searchByDateBtn.addEventListener("click", filterTable);

  // Reset search button
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", () => {
      [
        searchRegion,
        searchCountry,
        searchCurrency,
        searchProvider,
        searchText,
      ].forEach((input) => {
        if (input) input.value = "";
      });
      filterTable();
    });
  }

  // Reset dates button
  if (resetDatesBtn) {
    resetDatesBtn.addEventListener("click", () => {
      if (dateFromInput) dateFromInput.value = "";
      if (dateToInput) dateToInput.value = "";
      filterTable();
    });
  }

  // Export button
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const headersText = Array.from(table.querySelectorAll("thead th")).map(
        (th) => th.innerText.replace(/\s+/g, " ").trim()
      );
      const csv = [headersText.join(",")];

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
      a.download = `${table.id || "TableExport"}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // Initial filter
  filterTable();
});
