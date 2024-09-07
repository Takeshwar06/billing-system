import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { createItems, getItems } from "@/api/ApiRoutes";
import { toast } from "react-toastify";

export default function CreateMasterItem() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [refreshItemsBrands, setRefreshItemsBrands] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await axios.get(getItems);
      if (response.data.success) {
        console.log(response.data.data);
        setItems(response.data.data.items);
        setBrands(response.data.data.brands);
      }
    })();
  }, [refreshItemsBrands]);
  // State to manage multiple rows of form data
  const [rows, setRows] = useState([
    { itemName: "", brandName: "", unit: "", defaultRate: 0 },
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

  const handleGetBill = async (e) => {
    e.preventDefault();

    if (rows.length < 1) {
      toast.info("add at least one item");
      return;
    }
    const existingItems = items.find(
      (item) => item.name.toLowerCase() === rows[0].itemName.toLocaleLowerCase()
    );
  
    let isItemExist;
    if(existingItems){
         isItemExist = existingItems.brand.some(
          (bnd) =>
            bnd.name.toLocaleLowerCase() ===
            rows[0].brandName.toLocaleLowerCase()
        );
    }

    if (isItemExist) {
      toast.info("Item with the give Brand already exist");
      return;
    }
    if (
      !["kg", "liter", "piece", "meter"].some((itm) => itm === rows[0].unit)
    ) {
      toast.info('unit should be taken from ["kg", "liter", "piece", "meter"]');
      return;
    }

    // backend
    const response = await axios.post(createItems, {
      items: [
        {
          name: rows[0].itemName,
          brand: rows[0].brandName,
          unit: rows[0].unit,
          defaultRate: rows[0].defaultRate,
        },
      ],
    });
    console.log(response);
    if (response.data.success) {
      toast.success(response.data.message);
      setRefreshItemsBrands(!refreshItemsBrands);
      setRows([{ itemName: "", brandName: "", unit: "", defaultRate: "" }]);
    } else {
      toast.error(response.data.message);
    }
  };
  const fetchItems = () => {};
  return (
    <div className="w-full mt-[70px] flex flex-col items-center">
      <form onSubmit={handleGetBill}>
        <div className=" mt-8 mb-2">
          {/* <Button
            onClick={addNewRow}
            size="small"
            variant="contained"
            color="secondary"
          >
            Add New
          </Button> */}
        </div>
        <div className="overflow-x-auto w-[90%]">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Item Name</th>
                <th className="px-4 py-2 text-left text-gray-600">
                  Brand Name
                </th>
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
                    {/* <input
                    type="text"
                    name="unit"
                    value={row.unit}
                    required
                    onChange={(e) => handleChange(index, e)}
                    className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter unit"
                  /> */}
                    <select
                      name="unit"
                      value={row.unit}
                      required
                      onChange={(e) => handleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="" disabled>
                        Select unit
                      </option>
                      <option value="kg">kg</option>
                      <option value="liter">liter</option>
                      <option value="piece">piece</option>
                      <option value="meter">meter</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    <input
                      type="number"
                      name="defaultRate"
                      required
                      min="0"
                      value={row.defaultRate}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter default rate"
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    <Button
                      type="submit"
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      Submit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <div className="flex justify-end mt-2">
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div> */}
        </div>
      </form>

      {/* New Section to Fetch and Display Items */}
      <div className="my-4 w-[90%]">
        <div className="flex justify-center">
          <Button
            onClick={() => setRefreshItemsBrands(!refreshItemsBrands)}
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
                <th className="px-4 py-2 text-left text-gray-600">
                  Brand Name
                </th>
                <th className="px-4 py-2 text-left text-gray-600">Unit</th>
                <th className="px-4 py-2 text-left text-gray-600">
                  Default Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr className="border-b" key={index}>
                  <td className="px-4 py-2 text-gray-700">{item.name}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {
                      <select
                        name="brands"
                        className=" border-none border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="" disabled>
                          Brands
                        </option>
                        {item.brand.map((brn) => {
                          return (
                            <option value={`${brn.name}`}>{brn.name}</option>
                          );
                        })}
                      </select>
                    }
                  </td>
                  <td className="px-4 py-2 text-gray-700">{item.unit}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {item.defaultRate} Rs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
