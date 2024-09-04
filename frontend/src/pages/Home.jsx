import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import {
  createBill,
  getCustomersLocationsItemsBrands,
  updateBill,
} from "@/api/ApiRoutes";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Home = () => {
  const [customerSearch, setCustomerSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [billDate, setBillDate] = useState("");
  const [isCustomerFocused, setIsCustomerFocused] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isDialogOpen, setIsDialogOpne] = useState({
    isOpne: false,
    index: null,
  });
  const [localItems, setLocalItems] = useState([]);
  const [
    refreshItemBrandCustomerLocation,
    setRefreshItemBrandCustomerLocation,
  ] = useState(false);
  const [searchComponent, setSearchComponent] = useState({
    itemSearch: "",
    brandSearch: "",
    qty: 0,
    rate: 0,
    unit: "",
    isUnitDisable: false,
    amount: 0,
    isItemFocused: false,
    isBrandFocused: false,
  });
  const [tax, setTax] = useState({
    basic: 0,
    CGST: 0,
    SGST: 0,
    IGST: 0,
    netAmount: 0,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // brands=[
  //   {name:"hp",item:["laptop","mouse","speaker"]}
  // ]
  // items=[
  //   {name:"mouse",item:["dell","hp","lenovo"]}
  // ]

  useEffect(() => {
    (async () => {
      const billForEdit = JSON.parse(localStorage.getItem("billForEdit"));
      if (billForEdit) {
        setCustomerSearch(billForEdit.customer.name);
        setLocationSearch(billForEdit.location.address);
        setBillNumber(billForEdit.number);
        setBillDate(billForEdit.data);

        const { items, tax } = billForEdit;
        const newLocalItems = [];
        items.forEach((item) => {
          newLocalItems.push({
            itemSearch: item.name,
            brandSearch: item.brand,
            qty: item.qty,
            rate: item.rate,
            unit: item.unit,
            isUnitDisable: false,
            amount: item.amount,
            isItemFocused: false,
            isBrandFocused: false,
          });
        });
        setLocalItems(newLocalItems);
        setTax({
          basic: tax.basic,
          CGST: tax.CGST.percent,
          SGST: tax.SGST.percent,
          IGST: tax.IGST.percent,
          netAmount: tax.netAmount,
        });
      }

      localStorage.removeItem("billForEdit");
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const response = await axios.get(getCustomersLocationsItemsBrands);
      console.log(response.data.data);
      setCustomers(response.data.data.customers);
      setLocations(response.data.data.locations);
      setItems(response.data.data.items);
      setBrands(response.data.data.brands);
    })();
  }, [refreshItemBrandCustomerLocation]);

  const handleCustomerChange = (event) => {
    setCustomerSearch(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocationSearch(event.target.value);
  };

  // Filter customers based on search terms
  const filteredCustomers = customers.filter((customer) => {
    const matchesName = customer.name
      .toLowerCase()
      .includes(customerSearch.toLowerCase());
    const matchesLocation =
      locationSearch === "" ||
      customer.location.some((loc) =>
        loc.address.toLowerCase().includes(locationSearch.toLowerCase())
      );
    return matchesName && matchesLocation;
  });

  // Filter locations based on search terms
  const filteredLocations = locations.filter((location) => {
    const matchesAddress = location.address
      .toLowerCase()
      .includes(locationSearch.toLowerCase());
    const matchesCustomer =
      customerSearch === "" ||
      location.customer.some((cust) =>
        cust.name.toLowerCase().includes(customerSearch.toLowerCase())
      );
    return matchesAddress && matchesCustomer;
  });
  const filteredItems = items.filter((item) => {
    const matchesName = item.name
      .toLowerCase()
      .includes(searchComponent.itemSearch.toLowerCase());
    const matchesBrand =
      searchComponent.brandSearch === "" ||
      item.brand.some((brand) =>
        brand.name
          .toLowerCase()
          .includes(searchComponent.brandSearch.toLowerCase())
      );
    return matchesName && matchesBrand;
  });

  const filteredBrands = brands.filter((brandItem) => {
    const matchesName = brandItem.name
      .toLowerCase()
      .includes(searchComponent.brandSearch.toLowerCase());
    const matchesItem =
      searchComponent.itemSearch === "" ||
      brandItem.item.some((item) =>
        item.name
          .toLowerCase()
          .includes(searchComponent.itemSearch.toLowerCase())
      );
    return matchesName && matchesItem;
  });
  // const handleItemChange = ( event) => {
  //   const newLocalItems = [...searchComponent];
  //   newSearchComponents[index].itemSearch = event.target.value;
  //   setSearchComponents(newSearchComponents);
  // };

  // const handleBrandChange = (index, event) => {
  //   const newSearchComponents = [...searchComponents];
  //   newSearchComponents[index].brandSearch = event.target.value;
  //   setSearchComponents(newSearchComponents);
  // };

  useEffect(() => {
    const basic = localItems.reduce(
      (acc, localItem) => acc + (parseFloat(localItem.amount) || 0),
      0
    );
    setTax((preTax) => ({ ...preTax, basic: basic }));
  }, [localItems]);

  const handleDeleteComponent = (index) => {
    const newLocalItems = [...localItems];
    newLocalItems.splice(index, 1);
    setLocalItems(newLocalItems);
  };

  function resetInputField() {
    setLocalItems([]);
    setCustomerSearch("");
    setLocationSearch("");
    setTax({
      basic: 0,
      CGST: 0,
      SGST: 0,
      IGST: 0,
      netAmount: 0,
    });
    setBillNumber("");
    setSearchComponent({
      itemSearch: "",
      brandSearch: "",
      qty: 0,
      rate: 0,
      unit: "",
      isUnitDisable: false,
      amount: 0,
      isItemFocused: false,
      isBrandFocused: false,
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(customers, customerSearch);
    if (!customers.some((customer) => customer.name === customerSearch)) {
      alert(`${customerSearch} is not in master customer please add first`);
      return;
    }
    if (localItems.length < 1) {
      alert("please add at least one item");
      return;
    }
    setIsLoading(true);
    console.log("handleSubmit");
    let newItems = [];
    let notExistedItem=null;
    localItems.forEach((itm) => {
      if (!items.some((i) => i.name === itm.itemSearch)) {
         notExistedItem=itm.itemSearch;
      }
      const item = {
        name: itm.itemSearch,
        brand: itm.brandSearch,
        qty: itm.qty,
        rate: itm.rate,
        amount: itm.amount,
        unit: itm.unit || "kg", // need to fix it
      };
      newItems.push(item);
    });

    if(notExistedItem!==null){
      alert(`${notExistedItem} is not in master item please first add`)
      setIsLoading(false);
      return;
    }
    const billDetail = {
      customerName: customerSearch,
      customerLocation: locationSearch,
      billNumber: billNumber,
      billDate: billDate,
      items: newItems,
      tax: {
        basic: parseFloat(tax.basic.toFixed(2)),
        netAmount: parseFloat(tax.netAmount.toFixed(2)),
        SGST: {
          percent: tax.SGST,
        },
        CGST: {
          percent: tax.CGST,
        },
        IGST: {
          percent: tax.IGST,
        },
      },
    };
    const response = await axios.post(createBill, billDetail);
    console.log(response);
    if (response.data.success) {
      alert("bill is created successfully");
      setIsLoading(false);
      setRefreshItemBrandCustomerLocation(!refreshItemBrandCustomerLocation);
      resetInputField();
    } else if (response.data.billExist) {
      if (window.confirm(response.data.message)) {
        const updateRes = await axios.put(updateBill, billDetail);
        console.log(updateRes);
        if (updateRes.data.success) {
          setRefreshItemBrandCustomerLocation(
            !refreshItemBrandCustomerLocation
          );
          resetInputField();
          setIsLoading(false);
          alert(updateRes.data.message);
        } else {
          alert(updateRes.data.message);
        }
      }
    } else {
      alert(response.data.message);
    }
    setIsLoading(false);
  };

  const createOrUpdateItem = (e) => {
    e.preventDefault();
    console.log(isDialogOpen);
    if (isDialogOpen.index === null) {
      const newLocalItems = [...localItems];
      newLocalItems.push(searchComponent);
      setLocalItems(newLocalItems);
    } else {
      const newLocalItems = [...localItems];
      newLocalItems[isDialogOpen.index] = searchComponent;
      setLocalItems(newLocalItems);
    }

    setSearchComponent({
      itemSearch: "",
      brandSearch: "",
      qty: 0,
      rate: 0,
      unit: "",
      isUnitDisable: false,
      amount: 0,
      isItemFocused: false,
      isBrandFocused: false,
    });
  };
  return (
    <div className="flex flex-col h-screen">
      <form
        onSubmit={handleSubmit}
        className="fixed p-3 top-0 left-0 w-[400px] h-[calc(100vh)] overflow-y-auto bg-slate-50 z-10"
      >
        { /* <SideNav /> */ }
        <div className="flex justify-center mb-2">
          <p className=" px-2 bg-lime-300 rounded-md">Basic Details:</p>
        </div>
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
            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength="4"
            required
          />
          {isCustomerFocused && filteredCustomers.length > 0 && (
            <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
              {filteredCustomers.map((customer, index) => (
                <li
                  key={index}
                  className="p-1 hover:bg-blue-100 cursor-pointer"
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
            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength="4"
            required
          />
          {isLocationFocused && filteredLocations.length > 0 && (
            <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
              {filteredLocations.map((location, index) => (
                <li
                  key={index}
                  className="p-1 hover:bg-blue-100 cursor-pointer"
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
            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="flex justify-between mb-4">
          <div>
            <Button
              onClick={() => navigate("/reports")}
              // variant="contained"
              // color="info"
              className="mt-4"
            >
              REPORTS
            </Button>
            &nbsp;&nbsp;
            <Button
              onClick={() => navigate("/bills")}
              // variant="contained"
              // color="info"
              className="mt-4"
            >
              SHOW BILLS
            </Button>
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            // variant="contained"
            // color="success"
            className="mt-4"
          >
            {isLoading ? "Loading..." : "SAVE"}
          </Button>
        </div>
      </form>

      <div className="flex-1 ml-[400px] mt-0 px-5 py-2 overflow-y-auto">
        {/* <Outlet /> */}
        <div className="flex justify-start mb-2">
          <Button
            onClick={() =>
              setIsDialogOpne({
                isOpne: true,
                index: null,
              })
            }
            // variant="contained"
            // color="info"
          >
            Create New Item
          </Button>
        </div>

        {/*  new item box  */}
        <Dialog open={isDialogOpen.isOpne} onOpenChange={setIsDialogOpne}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="w-full flex items-center justify-between">
                <DialogTitle>
                  {!isDialogOpen.index ? "Create new Item" : "Update item"}
                </DialogTitle>
                {/* <Button variant="outline" onClick={() => setIsDialogOpne({
                  isOpne: false,
                  index: null
                })} >
                  Cancel
                </Button> */}
              </div>
            </DialogHeader>
            <form onSubmit={createOrUpdateItem}>
              <div className=" mb-1 p-2 bg-white shadow-md rounded-lg">
                <div className="">
                  <label
                    htmlFor={`item`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Item:
                  </label>
                  <input
                    type="text"
                    id={`item`}
                    minLength="4"
                    required
                    value={searchComponent.itemSearch}
                    onChange={(event) =>
                      setSearchComponent((prevSearh) => ({
                        ...prevSearh,
                        itemSearch: event.target.value,
                      }))
                    }
                    onFocus={(event) =>
                      setSearchComponent((prevSearh) => ({
                        ...prevSearh,
                        isItemFocused: true,
                      }))
                    }
                    onBlur={(event) =>
                      setSearchComponent((prevSearh) => ({
                        ...prevSearh,
                        isItemFocused: false,
                      }))
                    }
                    placeholder="Search item..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchComponent.isItemFocused &&
                    filteredItems.length > 0 && (
                      <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
                        {filteredItems.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onMouseDown={(event) =>
                              setSearchComponent((prevSearh) => ({
                                ...prevSearh,
                                itemSearch: item.name,
                              }))
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
                    htmlFor={`brand`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Brand:
                  </label>
                  <input
                    type="text"
                    id={`brand`}
                    minLength="4"
                    required
                    value={searchComponent.brandSearch}
                    onChange={(e) =>
                      setSearchComponent((prevSearch) => ({
                        ...prevSearch,
                        brandSearch: e.target.value,
                      }))
                    }
                    onFocus={(event) =>
                      setSearchComponent((prevSearch) => ({
                        ...prevSearch,
                        isBrandFocused: true,
                      }))
                    }
                    onBlur={(event) =>
                      setSearchComponent((prevSearch) => ({
                        ...prevSearch,
                        isBrandFocused: false,
                      }))
                    }
                    placeholder="Search brand..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchComponent.isBrandFocused &&
                    filteredBrands.length > 0 && (
                      <ul className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
                        {filteredBrands.map((brand, brandIndex) => (
                          <li
                            key={brandIndex}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onMouseDown={(event) =>
                              setSearchComponent((prevSearh) => ({
                                ...prevSearh,
                                brandSearch: brand.name,
                              }))
                            }
                          >
                            {brand.name}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
                <label
                  htmlFor={`qty`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity:
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id={`qty-`}
                    value={searchComponent.qty}
                    onChange={(e) =>
                      setSearchComponent((prevSearch) => ({
                        ...prevSearch,
                        qty: e.target.value,
                        amount: e.target.value * searchComponent.rate,
                      }))
                    }
                    placeholder="Enter quantity"
                    className="w-full p-2 mr-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={"1"}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`rate`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rate:
                  </label>
                  <input
                    type="number"
                    id={`rate`}
                    value={searchComponent.rate}
                    onChange={(e) =>
                      setSearchComponent((prevSearch) => ({
                        ...prevSearch,
                        rate: e.target.value,
                        amount: e.target.value * searchComponent.qty,
                      }))
                    }
                    placeholder="Enter rate"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={"1"}
                    required
                  />
                </div>
                <label
                  htmlFor={`amount`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount:
                </label>
                <input
                  type="text"
                  id={`amount`}
                  value={parseFloat(searchComponent.amount.toFixed())}
                  placeholder="Amount"
                  className="w-full p-1 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                  readOnly
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/*  item table */}
        <div className="w-full flex flex-col items-center">
          <div class="overflow-x-auto w-full">
            <table class="min-w-full bg-white border border-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left text-gray-600">Item</th>
                  <th class="px-4 py-2 text-left text-gray-600">Brand</th>
                  <th class="px-4 py-2 text-left text-gray-600">Quantity</th>
                  <th class="px-4 py-2 text-left text-gray-600">Unit</th>
                  <th class="px-4 py-2 text-left text-gray-600">Rate</th>
                  <th class="px-4 py-2 text-left text-gray-600">Amount</th>
                  <th class="px-4 py-2 text-left text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* {
                  bills.length<1 && isFetched &&
                  <p className="text-center">you have {bills.length} entries </p>
              
            } */}

                {localItems.map((localItem, index) => {
                  return (
                    <tr class="border-b">
                      <td class="px-4 py-2 text-gray-700">
                        {localItem.itemSearch}
                      </td>
                      <td class="px-4 py-2 text-gray-700">
                        {localItem.brandSearch}
                      </td>
                      <td class="px-4 py-2 text-gray-700">{localItem.qty}</td>
                      <td class="px-4 py-2 text-gray-700">{localItem.unit}</td>
                      <td class="px-4 py-2 text-gray-700">{localItem.rate}</td>
                      <td class="px-4 py-2 text-gray-700">
                        {localItem.amount}
                      </td>
                      <td class="px-4 py-2 text-gray-700">
                        <button
                          onClick={() => handleDeleteComponent(index)}
                          class=" text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            setSearchComponent({
                              itemSearch: localItem.itemSearch,
                              brandSearch: localItem.brandSearch,
                              qty: localItem.qty,
                              rate: localItem.rate,
                              unit: localItem.unit,
                              isUnitDisable: false,
                              amount: localItem.amount,
                              isItemFocused: false,
                              isBrandFocused: false,
                            });
                            setIsDialogOpne({ isOpne: true, index: index });
                          }}
                          class="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
