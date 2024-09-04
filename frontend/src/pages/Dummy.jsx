import React from 'react'

export default function Dummy() {
  return (
    <form
    onSubmit={handleSubmit}
    className="w-full mb-10 flex justify-center"
  >
    <div className="w-full flex justify-between">
      {/* left side */}
      <div className="w-[35%] sticky top-0">
        <h1 className="text-center text-lg">Bill Details:</h1>
        <div className="mx-auto p-2 mb-4 bg-white shadow-md rounded-lg">
          <label
            htmlFor="customer"
            className="block text-sm font-medium text-gray-700"
          >
            Customer:
          </label>
          <input
            type="text"
            id="customer"
            value={customerSearch}
            onChange={handleCustomerChange}
            onFocus={() => setIsCustomerFocused(true)}
            onBlur={() => setIsCustomerFocused(false)}
            placeholder="Search customer..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength="4"
            required
          />
          {isCustomerFocused && filteredCustomers.length > 0 && (
            <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
              {filteredCustomers.map((customer, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onMouseDown={() => setCustomerSearch(customer.name)}
                >
                  {customer.name}
                </li>
              ))}
            </ul>
          )}
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location:
          </label>
          <input
            type="text"
            id="location"
            value={locationSearch}
            onChange={handleLocationChange}
            onFocus={() => setIsLocationFocused(true)}
            onBlur={() => setIsLocationFocused(false)}
            placeholder="Search location..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength="4"
            required
          />
          {isLocationFocused && filteredLocations.length > 0 && (
            <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
              {filteredLocations.map((location, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onMouseDown={() => setLocationSearch(location.address)}
                >
                  {location.address}
                </li>
              ))}
            </ul>
          )}

          <label
            htmlFor="bill-number"
            className="block text-sm font-medium text-gray-700"
          >
            Bill No:
          </label>
          <input
            type="text"
            id="bill-number"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            placeholder="Enter bill number"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength="4"
            maxLength="30"
            required
          />

          <label
            htmlFor="bill-date"
            className="block text-sm font-medium text-gray-700"
          >
            Bill Date:
          </label>
          <input
            type="date"
            id="bill-date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            placeholder="Enter bill date"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Taxes */}
        <div className="mx-auto p-2 mb-5 bg-gray-50 shadow-md rounded-lg">
          <div className="flex justify-center mb-2">
            <p className=" px-2 bg-lime-300 rounded-md">TAX</p>
          </div>
          <div className="flex items-center mb-1">
            <label
              htmlFor="tax-basic"
              className="block  text-sm font-medium text-gray-700"
            >
              Basic:
            </label>
            <input
              type="number"
              id="tax-basic"
              value={parseFloat(tax.basic.toFixed(2))}
              onChange={(e) => setTax({ ...tax, basic: e.target.value })}
              placeholder="Enter basic tax"
              className=" p-1 w-1/2  mx-3 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
          <div className="flex items-center mb-1">
            <label
              htmlFor="tax-CGST"
              className="block text-sm font-medium text-gray-700"
            >
              CGST(%):
            </label>
            <input
              type="number"
              id="tax-CGST"
              value={tax.CGST}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  setTax({ ...tax, CGST: e.target.value });
                }
              }}
              placeholder="Enter CGST"
              className="p-1 w-1/3 mx-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={"0"}
            />
            <input
              type="number"
              id=""
              value={parseFloat(((tax.basic * tax.CGST) / 100).toFixed(2))}
              className="p-1  w-1/3 mx-3 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
          <div className="flex items-center mb-1">
            <label
              htmlFor="tax-SGST"
              className="block text-sm font-medium text-gray-700"
            >
              SGST(%):
            </label>
            <input
              type="number"
              id="tax-SGST"
              value={tax.SGST}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  setTax({ ...tax, SGST: e.target.value });
                }
              }}
              placeholder="Enter SGST"
              className=" p-1 w-1/3 mx-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={"0"}
            />
            <input
              type="number"
              id=""
              value={parseFloat(((tax.basic * tax.SGST) / 100).toFixed(2))}
              className="p-1 w-1/3 mx-3 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
          <div className="flex items-center mb-1">
            <label
              htmlFor="tax-IGST"
              className="block text-sm font-medium text-gray-700"
            >
              IGST(%):
            </label>
            <input
              type="number"
              id="tax-IGST"
              value={tax.IGST}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  setTax({ ...tax, IGST: e.target.value });
                }
              }}
              placeholder="Enter IGST"
              className=" p-1 w-1/3 mx-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={"0"}
            />
            <input
              type="number"
              id=""
              value={parseFloat(((tax.basic * tax.IGST) / 100).toFixed(2))}
              className="p-1 w-1/3 mx-3 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
          <div className="flex items-center mb-1">
            <label
              htmlFor="tax-net"
              className="block text-sm font-medium text-gray-700"
            >
              Net Amount:
            </label>
            <input
              type="text"
              id="tax-net"
              value={parseFloat(
                (
                  tax.basic +
                  (tax.basic * tax.CGST) / 100 +
                  (tax.basic * tax.SGST) / 100 +
                  (tax.basic * tax.IGST) / 100
                ).toFixed(2)
              )}
              placeholder="Net Amount"
              className="p-1 w-1/2 mx-3 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <div>
            <Button
              onClick={() => navigate("/reports")}
              variant="contained"
              color="info"
              className="mt-4"
            >
              REPORTS
            </Button>&nbsp;&nbsp;
            <Button
              onClick={() => navigate("/bills")}
              variant="contained"
              color="info"
              className="mt-4"
            >
              SHOW BILLS
            </Button>
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="success"
            className="mt-4"
          >
            {isLoading ? "Loading..." : "SAVE"}
          </Button>
        </div>
      </div>

     {/* right side */}
     <div className="w-[60%]">
       {/* create new item table */}
       <div className="flex justify-center">
        <Button
          onClick={handleAddNewComponent}
          size="small"
          variant="contained"
          color="info"
        >
          Create New Item Table
        </Button>
      </div>

      {/* Multiple items */}

      {searchComponents.map((component, index) => {
        const filteredItems = items.filter((item) => {
          const matchesName = item.name
            .toLowerCase()
            .includes(component.itemSearch.toLowerCase());
          const matchesBrand =
            component.brandSearch === "" ||
            item.brand.some((brand) =>
              brand.name
                .toLowerCase()
                .includes(component.brandSearch.toLowerCase())
            );
          return matchesName && matchesBrand;
        });

        const filteredBrands = brands.filter((brandItem) => {
          const matchesName = brandItem.name
            .toLowerCase()
            .includes(component.brandSearch.toLowerCase());
          const matchesItem =
            component.itemSearch === "" ||
            brandItem.item.some((item) =>
              item.name
                .toLowerCase()
                .includes(component.itemSearch.toLowerCase())
            );
          return matchesName && matchesItem;
        });

        return (
          <div
            key={index}
            className="mx-auto mb-1 p-2 bg-white shadow-md rounded-lg"
          >
            <div className="flex justify-between mb-1">
              <p className=" px-2 bg-red-400 rounded-md">Table - {index}</p>
              <DeleteIcon
                onClick={() => handleDeleteComponent(index)}
                className="cursor-pointer"
                color="warning"
              />
            </div>

            <div className="">
              <label
                htmlFor={`item-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Item:
              </label>
              <input
                type="text"
                id={`item-${index}`}
                minLength="4"
                required
                value={component.itemSearch}
                onChange={(event) => handleItemChange(index, event)}
                onFocus={() => {
                  const newSearchComponents = [...searchComponents];
                  newSearchComponents[index].isItemFocused = true;
                  setSearchComponents(newSearchComponents);
                }}
                onBlur={() => {
                  const newSearchComponents = [...searchComponents];
                  newSearchComponents[index].isItemFocused = false;
                  setSearchComponents(newSearchComponents);
                }}
                placeholder="Search item..."
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {component.isItemFocused && filteredItems.length > 0 && (
                <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
                  {filteredItems.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onMouseDown={() =>
                        handleItemChange(index, {
                          target: { value: item.name },
                        })
                      }
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="">
              <label
                htmlFor={`brand-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Brand:
              </label>
              <input
                type="text"
                id={`brand-${index}`}
                minLength="4"
                required
                value={component.brandSearch}
                onChange={(event) => handleBrandChange(index, event)}
                onFocus={() => {
                  const newSearchComponents = [...searchComponents];
                  newSearchComponents[index].isBrandFocused = true;
                  setSearchComponents(newSearchComponents);
                }}
                onBlur={() => {
                  const newSearchComponents = [...searchComponents];
                  newSearchComponents[index].isBrandFocused = false;
                  setSearchComponents(newSearchComponents);
                }}
                placeholder="Search brand..."
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {component.isBrandFocused && filteredBrands.length > 0 && (
                <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
                  {filteredBrands.map((brand, brandIndex) => (
                    <li
                      key={brandIndex}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onMouseDown={() =>
                        handleBrandChange(index, {
                          target: { value: brand.name },
                        })
                      }
                    >
                      {brand.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <label
              htmlFor={`qty-${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Quantity:
            </label>
            <div className="flex">
              <input
                type="number"
                id={`qty-${index}`}
                value={component.qty}
                onChange={(event) => {
                  const newSearchComponents = [...searchComponents];
                  newSearchComponents[index].qty = event.target.value;
                  newSearchComponents[index].amount =
                    newSearchComponents[index].qty *
                    newSearchComponents[index].rate;
                  setSearchComponents(newSearchComponents);
                }}
                placeholder="Enter quantity"
                className="w-full p-2 mr-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={"1"}
                required
              />

              <select
                id="unit"
                name="unit"
                required
                onChange={(e) => {
                  component.unit = e.target.value
                  // component.isUnitDisable=false
                }}
                class="block  p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              // value={component.unit}
              // disabled={component.isUnitDisable}
              >
                <option value="">unit</option>
                <option value="kg">kg</option>
                <option value="litre">litre</option>
                <option value="piece">piece</option>
                <option value="meter">meter</option>
              </select>
            </div>
            <div>
              <label
                htmlFor={`rate-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Rate:
              </label>
              <input
                type="number"
                id={`rate-${index}`}
                value={component.rate}
                onChange={(event) => {
                  const newSearchComponents = [...searchComponents];
                  newSearchComponents[index].rate = event.target.value;
                  newSearchComponents[index].amount =
                    newSearchComponents[index].qty *
                    newSearchComponents[index].rate;
                  setSearchComponents(newSearchComponents);
                }}
                placeholder="Enter rate"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={"1"}
                required
              />
            </div>
            <label
              htmlFor={`amount-${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Amount:
            </label>
            <input
              type="text"
              id={`amount-${index}`}
              value={parseFloat(component.amount.toFixed())}
              placeholder="Amount"
              className="w-full p-1 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
        );
      })}

     </div>

    </div>
  </form>
  )
}
