import { deleteBill, getBills } from "@/api/ApiRoutes";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ShowBills() {
  const [isLoading, setIsLoading] = useState(false);
  const [bills, setBills] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate();

  const handleGetBill = async (e) => {
    setIsFetched(false);
    setIsLoading(true);
    e.preventDefault();
    const response = await axios.post(getBills, {
      from,
      to,
    });
    console.log(response.data.data);
    setIsLoading(false);
    if (response.data.success) {
      setBills(response.data.data);
      setIsFetched(true);
    } else if (!response.data.success) {
      alert(response.data.message);
    }
  };

  const handleDelete = async (billNumber, index) => {
    console.log(billNumber);
    const response = await axios.delete(`${deleteBill}/${billNumber}`);
    console.log(response);
    if (response.data.success) {
      // Remove the bill from the state array
      setBills((prevBills) => prevBills.filter((_, i) => i !== index));
    } else {
      toast.error(response.data.message);
    }
  };
  return (
    <div>
      <div className="w-full mt-[70px] flex flex-col items-center">
        <div className="my-4 ">
          <form
            onSubmit={handleGetBill}
            className="flex justify-center items-center"
          >
            <Button
              onClick={() => navigate("/")}
              size="medium"
              variant="contained"
              color="primary"
            >
              HOME
            </Button>
            <input
              type="Date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From"
              className=" p-1 border mx-3 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />{" "}
            <span className="mr-3">to</span>
            <input
              type="Date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="From"
              className=" p-1 mr-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Button
              type="submit"
              size="medium"
              variant="contained"
              color="success"
            >
              GET BILLS
            </Button>
          </form>
        </div>
        <div class="overflow-x-auto w-[90%]">
          <table class="min-w-full bg-white border border-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left text-gray-600">Bill No</th>
                <th class="px-4 py-2 text-left text-gray-600">Bill Date</th>
                <th class="px-4 py-2 text-left text-gray-600">Customer Name</th>
                <th class="px-4 py-2 text-left text-gray-600">
                  Customer Location
                </th>
                <th class="px-4 py-2 text-left text-gray-600">Net Amount</th>
                <th class="px-4 py-2 text-left text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.length < 1 && isFetched && (
                <p className="text-center">you have {bills.length} entries </p>
              )}
              {bills.map((bill, index) => {
                return (
                  <tr class="border-b">
                    <td class="px-4 py-2 text-gray-700">{bill.number}</td>
                    <td class="px-4 py-2 text-gray-700">
                      {bill.date.substring(0, 10)}
                    </td>
                    <td class="px-4 py-2 text-gray-700">
                      {bill.customer.name}
                    </td>
                    <td class="px-4 py-2 text-gray-700">
                      {bill.location.address}
                    </td>
                    <td class="px-4 py-2 text-gray-700">
                      {parseFloat(bill.tax.netAmount.toFixed(2))}
                    </td>
                    <td class="px-4 py-2 text-gray-700">
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "billForEdit",
                            JSON.stringify(bill)
                          );
                          navigate("/");
                        }}
                        class="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bill.number, index)}
                        class="ml-2 text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {isLoading && <p className="text-center mt-6 text-xl">loding...</p>}
    </div>
  );
}
