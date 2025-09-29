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
document
  .querySelectorAll(".tab-content, .page-wrapper")
  .forEach((tabContent) => {
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
    const searchCity = tabContent.querySelector(".searchCity");
    const searchText = tabContent.querySelector(".searchText");
    const dateFromInput = tabContent.querySelector(".dateFrom");
    const dateToInput = tabContent.querySelector(".dateTo");
    const rowsPerPageSelect = tabContent.querySelector(".rowsPerPage");
    const searchByDateBtn = tabContent.querySelector(".searchByDate");
    const resetDatesBtn = tabContent.querySelector(".resetDates");
    const resetSearchBtn = tabContent.querySelector(".resetSearch");
    const exportBtn = tabContent.querySelector(".exportExcelBtn");
    const searchSectorName = tabContent.querySelector(".searchSectorName");
    const searchSectorGroup = tabContent.querySelector(".searchSectorGroup");
    const searchSupplierType = tabContent.querySelector(".searchSupplierType");
    const searchCategoryName = tabContent.querySelector(".searchCategoryName");
    const searchHotels = tabContent.querySelector(".searchHotels");
    const searchHotelsGroup = tabContent.querySelector(".searchHotelsGroup");

    // New filters
    const fromCurrencySelect = tabContent.querySelector("#fromCurrency");
    const toCurrencySelect = tabContent.querySelector("#toCurrency");
    const fillBtn = tabContent.querySelector("#fillBtn");

    // New Country Group filter
    const searchCountryGroup = tabContent.querySelector(".searchCountryGroup");

    function getCellByHeader(row, headerName) {
      // normalize header
      headerName = headerName.toLowerCase();
      const index = headers.findIndex(
        (h) => h.includes(headerName) // "region" matches "region name"
      );
      if (index === -1) return "";
      return row.querySelectorAll("td")[index]?.innerText.toLowerCase() || "";
    }

    function parseDate(dateStr) {
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
      const cityValue = searchCity?.value.toLowerCase() || "";
      const textValue = searchText?.value.toLowerCase() || "";
      const sectorValue = searchSectorName?.value.toLowerCase() || "";
      const sectorGroupValue = searchSectorGroup?.value.toLowerCase() || "";
      const countryGroupValue = searchCountryGroup?.value.toLowerCase() || "";
      const supplierTypeValue = searchSupplierType?.value.toLowerCase() || "";
      const categoryValue = searchCategoryName?.value.toLowerCase() || "";
      const hotelsValue = searchHotels?.value.toLowerCase() || "";
      const hotelsGroupValue = searchHotelsGroup?.value.toLowerCase() || "";

      const dateFrom = parseDate(dateFromInput?.value);
      const dateTo = parseDate(dateToInput?.value);
      const fromCurrency = fromCurrencySelect?.value.toLowerCase() || "";
      const toCurrency = toCurrencySelect?.value.toLowerCase() || "";
      const limit = parseInt(rowsPerPageSelect?.value) || rows.length;

      let visibleCount = 0;

      rows.forEach((row) => {
        const rowRegion = getCellByHeader(row, "region");
        const rowCountry = getCellByHeader(row, "country name");
        const rowCurrencyCode = getCellByHeader(row, "currency code");
        const rowCurrencyName = getCellByHeader(row, "currency name");
        const rowSectorName = getCellByHeader(row, "sector name");
        const rowSectorGroup = getCellByHeader(row, "sector group name");
        const rowCity = getCellByHeader(row, "city name");
        const rowProvider = getCellByHeader(row, "country provider");
        const rowSupplierType = getCellByHeader(row, "supplier type name");
        const rowCategoryName = getCellByHeader(row, "category name");
        const rowHotels = getCellByHeader(row, "hotel name");
        const rowHotelsGroup = getCellByHeader(row, "hotel chain");

        const rowCountryGroup = getCellByHeader(row, "country group");
        const rowText = row.innerText.toLowerCase();
        const rowDate = parseDate(getCellByHeader(row, "date created"));

        // For new table (Currencies Conversion Rate)
        const rowFromCurrency = getCellByHeader(row, "from currency");
        const rowToCurrency = getCellByHeader(row, "to currency");

        // Match currency code OR currency name
        const currencyMatch =
          !currencyValue ||
          rowCurrencyCode.includes(currencyValue) ||
          rowCurrencyName.includes(currencyValue);

        let match =
          (!regionValue || rowRegion.includes(regionValue)) &&
          (!countryValue || rowCountry.includes(countryValue)) &&
          (!cityValue || rowCity.includes(cityValue)) &&
          currencyMatch &&
          (!providerValue || rowProvider.includes(providerValue)) &&
          (!textValue || rowText.includes(textValue)) &&
          (!countryGroupValue || rowCountryGroup.includes(countryGroupValue)) &&
          (!fromCurrency || rowFromCurrency.includes(fromCurrency)) &&
          (!sectorValue || rowSectorName.includes(sectorValue)) && // 👈 added
          (!categoryValue || rowCategoryName.includes(categoryValue)) &&
          (!sectorGroupValue || rowSectorGroup.includes(sectorGroupValue)) &&
          (!supplierTypeValue || rowSupplierType.includes(supplierTypeValue)) &&
          (!hotelsValue || rowHotels.includes(hotelsValue)) && // 👈 added
          (!hotelsGroupValue || rowHotelsGroup.includes(hotelsGroupValue)) &&
          (!toCurrency || rowToCurrency.includes(toCurrency));

        if (match && dateFrom) match = rowDate >= dateFrom;
        if (match && dateTo) match = rowDate <= dateTo;
        if (match && visibleCount >= limit) match = false;

        row.style.display = match ? "" : "none";
        if (match) visibleCount++;
      });
    }

    // Input listeners
    [
      searchRegion,
      searchCountry,
      searchCity,
      searchCurrency,
      searchProvider,
      searchText,
      searchSupplierType,
      searchSectorName, // 👈 added
      searchSectorGroup,
      searchCountryGroup, // 👈 added
      fromCurrencySelect,
      searchCategoryName,
      searchHotels, // 👈 added
      searchHotelsGroup,
      toCurrencySelect,
    ].forEach((input) => {
      if (input) input.addEventListener("input", filterTable);
    });

    if (rowsPerPageSelect)
      rowsPerPageSelect.addEventListener("change", filterTable);
    if (searchByDateBtn) searchByDateBtn.addEventListener("click", filterTable);
    if (fillBtn) fillBtn.addEventListener("click", filterTable);

    // Reset search button
    if (resetSearchBtn) {
      resetSearchBtn.addEventListener("click", () => {
        [
          searchRegion,
          searchCountry,
          searchCurrency,
          searchProvider,
          searchText,
          searchSectorName,
          searchSupplierType, // 👈 added
          searchSectorGroup,
          searchCountryGroup, // 👈 reset
          fromCurrencySelect,
          searchHotels, // 👈 added
          searchHotelsGroup,
          searchCategoryName,
          toCurrencySelect,
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

    // Populate dropdowns dynamically
    if (fromCurrencySelect) {
      const uniqueFrom = [
        ...new Set(
          rows.map((r) => getCellByHeader(r, "from currency").toUpperCase())
        ),
      ];
      uniqueFrom.forEach((val) => {
        if (val) {
          const opt = document.createElement("option");
          opt.value = val;
          opt.textContent = val;
          fromCurrencySelect.appendChild(opt);
        }
      });
    }

    if (toCurrencySelect) {
      const uniqueTo = [
        ...new Set(
          rows.map((r) => getCellByHeader(r, "to currency").toUpperCase())
        ),
      ];
      uniqueTo.forEach((val) => {
        if (val) {
          const opt = document.createElement("option");
          opt.value = val;
          opt.textContent = val;
          toCurrencySelect.appendChild(opt);
        }
      });
    }

    // Populate Country Group dropdown
    if (searchCountryGroup) {
      const uniqueGroups = [
        ...new Set(
          rows.map((r) => getCellByHeader(r, "country group").toUpperCase())
        ),
      ];
      uniqueGroups.forEach((val) => {
        if (val) {
          const opt = document.createElement("option");
          opt.value = val;
          opt.textContent = val;
          searchCountryGroup.appendChild(opt);
        }
      });
    }

    // Initial filter
    filterTable();
  });
