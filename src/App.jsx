import './App.css';

import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import All from "./pages/All.jsx";

import { Route, Routes} from "react-router-dom";
import Overview from "./pages/Overview.jsx";
import Admin from "./pages/Admin.jsx";

function App() {

    return (
        <div className="App">
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/all" element={<All/>}/>
                <Route path="/overview" element={<Overview/>}/>
                <Route path="/admin" element={<Admin/>}/>
            </Routes>
        </div>
    );
}

export default App;