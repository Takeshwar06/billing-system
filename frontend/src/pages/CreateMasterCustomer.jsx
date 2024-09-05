import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { createCustomers, createItems, getCustomers, getItems } from "@/api/ApiRoutes";
import { toast } from "react-toastify";
export default function CreateMasterCustomer() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [refreshCustomersLocations,setRefreshCustomersLocations]=useState(false);
  const [items, setItems] = useState([
    { name: "Laptop", brand: "Dell", unit: "piece", defaultRate: 750 },
    { name: "Mouse", brand: "Logitech", unit: "piece", defaultRate: 25 },
    { name: "Milk", brand: "Amul", unit: "liter", defaultRate: 50 },
    { name: "Keyboard", brand: "Corsair", unit: "piece", defaultRate: 100 },
    { name: "Desk Chair", brand: "Herman Miller", unit: "piece", defaultRate: 500 }
  ]);
const fetchItems = ()=>{
  
}
  useEffect(() => {
    (async () => {
      const response = await axios.get(getCustomers);
      if (response.data.success) {
        console.log(response.data.data);
        setCustomers(response.data.data.customers);
        setLocations(response.data.data.locations);
      }
    })();
  }, [refreshCustomersLocations]);
  // State to manage multiple rows of form data
  const [rows, setRows] = useState([
    { customerName: "", customerLocation: "" },
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const addNewRow = () => {
    setRows([
      ...rows,
      { customerName: "", customerLocation: "" },
    ]);
  };

  const removeRow = (index) => {
    const newRows = rows.filter((row, i) => i !== index);
    setRows(newRows);
  };

  const handleGetBill = async(e) => {
    e.preventDefault();

    if (rows.length < 1) {
      toast.info("add at least one item");
      return;
    }
    const existingItems = customers.map((customer) => customer.name.toLowerCase()); // Convert item names to lowercase for comparison
    const existingbrands = locations.map((location) => location.address.toLowerCase());
    let alreadyPresentCustomers = [];

    rows.forEach((row) => {
      if (
        existingItems.includes(row.customerName.toLowerCase()) &&
        existingbrands.includes(row.customerLocation.toLowerCase())
      ) {
        alreadyPresentCustomers.push(`${row.customerName} -> ${row.customerLocation}`);
      }
    });

    if (alreadyPresentCustomers.length > 0) {
      toast.info( `These customer are already present: ${alreadyPresentCustomers.join(", ")}`)
    } else {
      console.log("No duplicates found. Proceeding with submission.");
      // Proceed with form submission logic here
      const newCustomers = [];
      rows.forEach((row) => {
        newCustomers.push({
          name: row.customerName,
          location: row.customerLocation,
        });
      });

      // backend
      console.log(newCustomers);
      const response = await axios.post(createCustomers,{customers:newCustomers})
      console.log(response);
      if(response.data.success){
        toast.success(response.data.message);
        setRefreshCustomersLocations(!refreshCustomersLocations)
        setRows([
            { customerName: "", customerLocation: "" },
          ]);
      }else{
        toast.error(response.data.message);
      }
    }
  };   

  return (
    <div className="w-full flex flex-col items-center">
      <div className="my-4">
        <div className="flex justify-center items-center">
          <Button
            onClick={() => navigate("/")}
            size="medium"
            variant="contained"
            color="primary"
          >
            HOME
          </Button>
        </div>
      </div>
      <form onSubmit={handleGetBill}>
        <div className="overflow-x-auto w-[90%]">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">
                  Customer Name
                </th>
                <th className="px-4 py-2 text-left text-gray-600">
                  Customer Location
                </th>
                <th className="px-4 py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr className="border-b" key={index}>
                  <td className="px-4 py-2 text-gray-700">
                    <input
                      type="text"
                      name="customerName"
                      required
                      minLength={4}
                      value={row.customerName}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter customer name"
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    <input
                      type="text"
                      name="customerLocation"
                      value={row.customerLocation}
                      required
                      minLength={4}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter customer location"
                    />
                  </td>
                  
                  <td className="px-4 py-2 text-gray-700">
                    <Button
                      onClick={() => removeRow(index)}
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Button
              onClick={addNewRow}
              size="medium"
              variant="contained"
              color="secondary"
            >
              Add New
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Button
              type="submit"
              size="medium"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>

      {/* New Section to Fetch and Display Items */}
      <div className="my-4 w-[90%]">
        <div className="flex justify-center">
          <Button
            onClick={fetchItems}
            size="medium"
            variant="contained"
            color="secondary"
          >
            Get Items
          </Button>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Item Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Brand Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Unit</th>
                <th className="px-4 py-2 text-left text-gray-600">Default Rate</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr className="border-b" key={index}>
                  <td className="px-4 py-2 text-gray-700">{item.name}</td>
                  <td className="px-4 py-2 text-gray-700">{item.brand}</td>
                  <td className="px-4 py-2 text-gray-700">{item.unit}</td>
                  <td className="px-4 py-2 text-gray-700">{item.defaultRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
