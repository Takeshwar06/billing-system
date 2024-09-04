
import Home from '@/pages/Home'
import ShowBills from '@/pages/ShowBills'
import Report from '@/pages/Report'


import { Route, Routes,  } from 'react-router-dom'
import CreateMasterItem from '@/pages/CreateMasterItem'

export default function AppRoutes() {

    return (
        <Routes>
           <Route  path={"/"} element={<Home/>} />
           <Route  path={"/bills"} element={<ShowBills/>} />
           <Route  path={"/reports"} element={<Report/>} />
           <Route  path={"/master-item"} element={<CreateMasterItem/>} />
        </Routes>
    )
}
