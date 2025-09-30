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
    const searchCategoryType = tabContent.querySelector(".searchCategoryType");
    const searchMealPlan = tabContent.querySelector(".searchMealPlan");
    const searchAmenityName = tabContent.querySelector(".searchAmenityName");
    const searchAmenityType = tabContent.querySelector(".searchAmenityType");
    const searchPropertyType = tabContent.querySelector(".searchPropertyType");
    const searchFormulaName = tabContent.querySelector(".searchFormulaName");
    const searchFormulaType = tabContent.querySelector(".searchFormulaType");
    const searchHotelGroup = tabContent.querySelector(".searchHotelGroup");
    const searchDependantID = tabContent.querySelector(".searchDependantID");
    const searchPromotionID = tabContent.querySelector(".searchPromotionID");
    const searchCancelPolicyNo = tabContent.querySelector(
      ".searchCancelPolicyNo"
    );
    const searchTransfer = tabContent.querySelector(".searchTransfer");
    const searchAirportService = tabContent.querySelector(
      ".searchAirportService"
    );
    const searchOtherService = tabContent.querySelector(".searchOtherService");
    const searchVisa = tabContent.querySelector(".searchVisa");
    const searchTour = tabContent.querySelector(".searchTour");

    const searchPromotionName = tabContent.querySelector(
      ".searchPromotionName"
    );
    const searchApprovedStatus = tabContent.querySelector(
      ".searchApprovedStatus"
    );

    const searchHotels = tabContent.querySelector(".searchHotels");
    const searchHotelsGroup = tabContent.querySelector(".searchHotelsGroup");
    const searchAgentName = tabContent.querySelector(".searchAgentName");
    const searchRoomClassName = tabContent.querySelector(
      ".searchRoomClassName"
    );

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
      const agentNameValue = searchAgentName?.value.toLowerCase() || "";
      const roomClassValue = searchRoomClassName?.value.toLowerCase() || "";
      const categoryTypeValue = searchCategoryType?.value.toLowerCase() || "";
      const mealPlanValue = searchMealPlan?.value.toLowerCase() || "";
      const amenityNameValue = searchAmenityName?.value.toLowerCase() || "";
      const amenityTypeValue = searchAmenityType?.value.toLowerCase() || "";
      const propertyTypeValue = searchPropertyType?.value.toLowerCase() || "";
      const formulaNameValue = searchFormulaName?.value.toLowerCase() || "";
      const formulaTypeValue = searchFormulaType?.value.toLowerCase() || "";
      const hotelGroupValue = searchHotelGroup?.value.toLowerCase() || "";
      const dependantIDValue = searchDependantID?.value.toLowerCase() || "";
      const promotionIDValue = searchPromotionID?.value.toLowerCase() || "";
      const promotionNameValue = searchPromotionName?.value.toLowerCase() || "";
      const cancelPolicyNoValue =
        searchCancelPolicyNo?.value.toLowerCase() || "";
      const transferValue = searchTransfer?.value.toLowerCase() || "";
      const airportServiceValue =
        searchAirportService?.value.toLowerCase() || "";
      const otherServiceValue = searchOtherService?.value.toLowerCase() || "";
      const visaValue = searchVisa?.value.toLowerCase() || "";
      const tourValue = searchTour?.value.toLowerCase() || "";

      const approvedStatusValue =
        searchApprovedStatus?.value.toLowerCase() || "";

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
        const rowCity = getCellByHeader(row, "city");
        const rowProvider = getCellByHeader(row, "country provider");
        const rowSupplierType = getCellByHeader(row, "supplier type name");
        const rowCategoryName = getCellByHeader(row, "category");
        const rowCategoryType = getCellByHeader(row, "category type");
        const rowMealPlan = getCellByHeader(row, "meal plan");
        const rowPropertyType = getCellByHeader(row, "property type name");
        const rowFormulaName = getCellByHeader(row, "formula name");
        const rowFormulaType = getCellByHeader(row, "formula type");

        const rowHotels = getCellByHeader(row, "hotel name");
        const rowHotelsGroup = getCellByHeader(row, "hotel chain");
        const rowAgentName = getCellByHeader(row, "agent name");
        const rowCountryGroup = getCellByHeader(row, "country group");
        const rowHotelGroup = getCellByHeader(row, "hotel group");
        const rowDependantID = getCellByHeader(row, "dependantid");
        const rowPromotionID = getCellByHeader(row, "promotionid");
        const rowPromotionName = getCellByHeader(row, "promotion name");
        const rowApprovedStatus = getCellByHeader(row, "approved status");
        const rowCancelPolicyNo = getCellByHeader(
          row,
          "other cancel policy no"
        );
        const rowTransfer = getCellByHeader(row, "transfer");
        const rowAirportService = getCellByHeader(row, "airport service");
        const rowOtherService = getCellByHeader(row, "other service");
        const rowVisa = getCellByHeader(row, "visa");
        const rowTour = getCellByHeader(row, "tour");

        const rowText = row.innerText.toLowerCase();
        const rowDate = parseDate(getCellByHeader(row, "date created"));
        const rowRoomClassName = getCellByHeader(row, "room class name");
        const rowAmenityName = getCellByHeader(row, "amenity name");
        const rowAmenityType = getCellByHeader(row, "amenity type");
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
          (!agentNameValue || rowAgentName.includes(agentNameValue)) &&
          (!hotelsValue || rowHotels.includes(hotelsValue)) && // 👈 added
          (!hotelsGroupValue || rowHotelsGroup.includes(hotelsGroupValue)) &&
          (!roomClassValue || rowRoomClassName.includes(roomClassValue)) &&
          (!categoryTypeValue || rowCategoryType.includes(categoryTypeValue)) &&
          (!mealPlanValue || rowMealPlan.includes(mealPlanValue)) &&
          (!amenityNameValue || rowAmenityName.includes(amenityNameValue)) &&
          (!amenityTypeValue || rowAmenityType.includes(amenityTypeValue)) &&
          (!propertyTypeValue || rowPropertyType.includes(propertyTypeValue)) &&
          (!cancelPolicyNoValue ||
            rowCancelPolicyNo.includes(cancelPolicyNoValue)) &&
          (!transferValue || rowTransfer.includes(transferValue)) &&
          (!airportServiceValue ||
            rowAirportService.includes(airportServiceValue)) &&
          (!otherServiceValue || rowOtherService.includes(otherServiceValue)) &&
          (!visaValue || rowVisa.includes(visaValue)) &&
          (!tourValue || rowTour.includes(tourValue)) &&
          (!formulaNameValue || rowFormulaName.includes(formulaNameValue)) &&
          (!formulaTypeValue || rowFormulaType.includes(formulaTypeValue)) &&
          (!hotelGroupValue || rowHotelGroup.includes(hotelGroupValue)) &&
          (!dependantIDValue || rowDependantID.includes(dependantIDValue)) &&
          (!promotionIDValue || rowPromotionID.includes(promotionIDValue)) &&
          (!promotionNameValue ||
            rowPromotionName.includes(promotionNameValue)) &&
          (!approvedStatusValue ||
            rowApprovedStatus.includes(approvedStatusValue)) &&
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
      searchFormulaName,
      searchDependantID,
      searchPromotionID,
      searchPromotionName,
      searchApprovedStatus,
      searchCancelPolicyNo,
      searchTransfer,
      searchAirportService,
      searchOtherService,
      searchVisa,
      searchTour,

      searchFormulaType,
      searchHotelGroup,

      searchCountryGroup, // 👈 added
      fromCurrencySelect,
      searchCategoryName,
      searchRoomClassName,
      searchAmenityName,
      searchPropertyType,
      searchAmenityType,
      searchAgentName,
      searchCategoryType,
      searchDependantID,
      searchPromotionID,
      searchPromotionName,
      searchApprovedStatus,

      searchHotels, // 👈 added
      searchMealPlan,
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
          searchAgentName,
          searchAmenityName,
          searchAmenityType,
          searchFormulaName,
          searchFormulaType,
          searchHotelGroup,
          searchCancelPolicyNo,
          searchTransfer,
          searchAirportService,
          searchOtherService,
          searchVisa,
          searchTour,

          searchText,
          searchSectorName,
          searchSupplierType, // 👈 added
          searchSectorGroup,
          searchCountryGroup, // 👈 reset
          fromCurrencySelect,
          searchHotels, // 👈 added
          searchHotelsGroup,
          searchPropertyType,

          searchCategoryType,
          searchMealPlan,
          searchRoomClassName,
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
