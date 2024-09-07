import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import {
  createCustomers,
  createItems,
  getCustomers,
  getItems,
} from "@/api/ApiRoutes";
import { toast } from "react-toastify";
export default function CreateMasterCustomer() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [refreshCustomersLocations, setRefreshCustomersLocations] =
    useState(false);
  const fetchItems = () => {};
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
    setRows([...rows, { customerName: "", customerLocation: "" }]);
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
    const existingCustomer = customers.find(
      (customer) =>
        customer.name.toLowerCase() === rows[0].customerName.toLocaleLowerCase()
    );

    let isCustomerExist;
    if (existingCustomer) {
      isCustomerExist = existingCustomer.location.some(
        (lcn) =>
          lcn.address.toLocaleLowerCase() ===
          rows[0].customerLocation.toLocaleLowerCase()
      );
    }

    if (isCustomerExist) {
      toast.info("customer with the give location already exist");
      return;
    }
    // backend
    const response = await axios.post(createCustomers, {
      customers: [
        { name: rows[0].customerName, location: rows[0].customerLocation },
      ],
    });
    console.log(response);
    if (response.data.success) {
      toast.success(response.data.message);
      setRefreshCustomersLocations(!refreshCustomersLocations);
      setRows([{ customerName: "", customerLocation: "" }]);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="w-full mt-[70px] flex flex-col items-center">
      <form onSubmit={handleGetBill}>
        <div className="mt-8 mb-2">
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
                      size="small"
                      type="submit"
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
            onClick={() =>
              setRefreshCustomersLocations(refreshCustomersLocations)
            }
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
                <th className="px-4 py-2 text-left text-gray-600">
                  Customer Name
                </th>
                <th className="px-4 py-2 text-left text-gray-600">Locations</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr className="border-b" key={index}>
                  <td className="px-4 py-2 text-gray-700">{customer.name}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {
                      <select
                        name="locations"
                        className=" border-none border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="" disabled>
                          Locations
                        </option>
                        {customer.location.map((lcn) => {
                          return (
                            <option value={`${lcn.address}`}>
                              {lcn.address}
                            </option>
                          );
                        })}
                      </select>
                    }
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
