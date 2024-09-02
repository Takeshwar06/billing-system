import { deleteBill, getBills } from "@/api/ApiRoutes";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Report() {
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState(new Map());
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
      let tempBills = response.data.data;

      if (tempBills.length > 0) {
        const customerToBillMap = new Map();

        tempBills.forEach((tempBill) => {
          const key = `${tempBill.customer.name}-${tempBill.location.address}`;

          if (customerToBillMap.has(key)) {
            let customer = customerToBillMap.get(key);
            customer.billCount += 1; // Increment billCount
            customer.billAmount += tempBill.tax.netAmount; // Increment billAmount
          } else {
            customerToBillMap.set(key, {
              location: tempBill.location.address,
              billCount: 1,
              billAmount: tempBill.tax.netAmount,
            });
          }
        });
        setReports(customerToBillMap);
      }
      setIsFetched(true);
    } else if (!response.data.success) {
      alert(response.data.message);
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col items-center">
        <div className="my-4 ">
          <p className="mb-4 text-3xl bg-gray-400 text-slate-900 text-center p-2 rounded-md">
            *REPORTS*
          </p>
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
              GET REPORTS
            </Button>
          </form>
        </div>
        <div class="overflow-x-auto w-[90%]">
          <table class="min-w-full bg-white border border-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left text-gray-600">Customer Name</th>
                <th class="px-4 py-2 text-left text-gray-600">
                  Customer Location
                </th>
                <th class="px-4 py-2 text-left text-gray-600">Bill Count</th>
                <th class="px-4 py-2 text-left text-gray-600">Bill Amt</th>
              </tr>
            </thead>
            <tbody>
              {reports.size < 1 && isFetched && (
                <p className="text-center">you have {reports.size} entries </p>
              )}
              {Array.from(reports).map(([customer, value]) => {
                // [key,value]
                return (
                  <tr class="border-b">
                    <td class="px-4 py-2 text-gray-700">
                      {customer.split("-")[0].trim()}
                    </td>
                    <td class="px-4 py-2 text-gray-700">{value.location}</td>
                    <td class="px-4 py-2 text-gray-700">{value.billCount}</td>
                    <td class="px-4 py-2 text-gray-700">{value.billAmount}</td>
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
