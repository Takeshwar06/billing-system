
import Home from '@/pages/Home'
import ShowBills from '@/pages/ShowBills'
import Report from '@/pages/Report'


import { Route, Routes,  } from 'react-router-dom'

export default function AppRoutes() {

    return (
        <Routes>
           <Route  path={"/"} element={<Home/>} />
           <Route  path={"/bills"} element={<ShowBills/>} />
           <Route  path={"/reports"} element={<Report/>} />
        </Routes>
    )
}
