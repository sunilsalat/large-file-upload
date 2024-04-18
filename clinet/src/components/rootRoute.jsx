import { Listing } from "../pages/listing/listing.jsx";
import { Detail } from "../pages/detail/detail.jsx";
import { MainLayout } from "../pages/mainLayout/mainLayout.jsx";
import { AuthWrapper } from "./authWrapper.jsx";
import { createBrowserRouter } from "react-router-dom";
import { VideoUpload } from "../pages/videoUpload/videoUpload.jsx";

const routeData = [
    {
        path: "/",
        element: (
            <AuthWrapper>
                <MainLayout />
            </AuthWrapper>
        ),
        children: [
            {
                path: "",
                element: <Listing />,
                children: [],
                Header: "Listing Page",
            },
            {
                path: "/detail/:filename",
                element: <Detail />,
                children: [],
                Header: "Detail Page",
            },
            {
                path: "/upload",
                element: <VideoUpload />,
                children: [],
                Header: "Detail Page",
            },
            {
                path: "*",
                element: <h1>Not found</h1>,
                children: [],
                Header: "Not found page",
            },
        ],
    },
];

export const Routing = createBrowserRouter(routeData);
