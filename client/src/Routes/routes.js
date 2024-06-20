import {
    createBrowserRouter
} from "react-router-dom";

import StudentList from '../Components/StudentList';
import ParentList from '../Components/ParentList';
import Dashboard from '../Components/DashBoard';
const router = createBrowserRouter(
    [

        {
            path: "/",
            element: <Dashboard />
        },
        {
            path: "/students",
            element: <StudentList />
        },
        {
            path: "/parents",
            element: <ParentList />
        }
    ]




)

export default router