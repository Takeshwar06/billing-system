import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { getItems } from "@/api/ApiRoutes";

export default function CreateMasterItem() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(getItems);
      if (response.data.success) {
        console.log(response.data.data);
        setItems(response.data.data);
      }
    })();
  }, []);
  // State to manage multiple rows of form data
  const [rows, setRows] = useState([
    { itemName: "", brandName: "", unit: "", defaultRate: "" },
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
      { itemName: "", brandName: "", unit: "", defaultRate: "" },
    ]);
  };

  const removeRow = (index) => {
    const newRows = rows.filter((row, i) => i !== index);
    setRows(newRows);
  };

  const handleGetBill = (e) => {
    e.preventDefault();

    if(rows.length<1){
        alert("add at least one item");
        return;
    }
    const existingItems = items.map((item) => item.name.toLowerCase()); // Convert item names to lowercase for comparison
    let alreadyPresentItems = [];

    rows.forEach((row) => {
      if (existingItems.includes(row.itemName.toLowerCase())) {
        alreadyPresentItems.push(row.itemName);
      }
    });

    if (alreadyPresentItems.length > 0) {
      console.log(
        "These items are already present:",
        alreadyPresentItems.join(", ")
      );
    } else {
      console.log("No duplicates found. Proceeding with submission.");
      // Proceed with form submission logic here
      const newItems=[];
      const unitExecption = false;
      rows.forEach((row)=>{
        if(!['kg', 'litre', 'piece', 'meter'].some(itm=>itm===row.unit)){
           unitExecption=true;
        }
        newItems.push({
            name:row.itemName, 
            unit: row.unit,
            defaultRate:row.defaultRate,
            brand:row.brandName,
        })
      })
    if(unitExecption){
        alert("select unit from ['kg', 'litre', 'piece', 'meter']")
        return;
    }
      // backend
      
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="my-4">
        <p className="mb-4 text-3xl bg-gray-400 text-slate-900 text-center p-2 rounded-md">
          Create Master Items
        </p>
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
              <th className="px-4 py-2 text-left text-gray-600">Item Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Brand Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Unit</th>
              <th className="px-4 py-2 text-left text-gray-600">
                Default Rate
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
                    name="itemName"
                    required
                    minLength={4}
                    value={row.itemName}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter item name"
                  />
                </td>
                <td className="px-4 py-2 text-gray-700">
                  <input
                    type="text"
                    name="brandName"
                    value={row.brandName}
                    required
                    minLength={4}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter brand name"
                  />
                </td>
                <td className="px-4 py-2 text-gray-700">
                  <input
                    type="text"
                    name="unit"
                    value={row.unit}
                    required
                    onChange={(e) => handleChange(index, e)}
                    className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter unit"
                  />
                </td>
                <td className="px-4 py-2 text-gray-700">
                  <input
                    type="number"
                    name="defaultRate"
                    required
                    min={"0"}
                    value={row.defaultRate}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter default rate"
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
    </div>
  );
}
