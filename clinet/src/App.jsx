import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Routing } from "./components/rootRoute";

function App() {
    return <RouterProvider router={Routing}></RouterProvider>;
}

export default App;
