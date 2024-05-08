import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Routing } from "./components/rootRoute";
import { useEffect } from "react";
import { connectWithSocketServer } from "./utils/socketio";

function App() {
    useEffect(() => {
        // connectWithSocketServer();
    }, []);
    return <RouterProvider router={Routing}></RouterProvider>;
}

export default App;
