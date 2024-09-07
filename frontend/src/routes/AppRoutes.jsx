import Home from "@/pages/Home";
import ShowBills from "@/pages/ShowBills";
import Report from "@/pages/Report";

import { Link, Route, Routes } from "react-router-dom";
import CreateMasterItem from "@/pages/CreateMasterItem";
import CreateMasterCustomer from "@/pages/CreateMasterCustomer";

export default function AppRoutes() {
  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 left-0 flex justify-between items-center w-full h-[70px] bg-gray-800 text-white z-10">
        {/* <Header /> */}
        <div className="ml-24">
          <Link to="/">
            <h1 className="text-2xl">Billing System</h1>
          </Link>
        </div>
        <div className="mr-24">
          <nav>
            <Link className="ml-10 text-sm uppercase" to="/">
              Home
            </Link>
            <Link className="ml-10 text-sm uppercase" to="/bills">
              Show Bills
            </Link>
            <Link className="ml-10 text-sm uppercase" to="/reports">
              Reports
            </Link>
            <Link className="ml-10 text-sm uppercase" to="/master-item">
              Master Item
            </Link>
            <Link className="ml-10 text-sm uppercase" to="/master-customer">
              Master Customer
            </Link>
          </nav>
        </div>
      </div>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/bills"} element={<ShowBills />} />
        <Route path={"/reports"} element={<Report />} />
        <Route path={"/master-item"} element={<CreateMasterItem />} />
        <Route path={"/master-customer"} element={<CreateMasterCustomer />} />
      </Routes>
    </div>
  );
}
