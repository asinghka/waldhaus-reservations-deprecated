import './App.css';

import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import All from "./pages/All.jsx";

import { Route, Routes} from "react-router-dom";

function App() {

    return (
        <div className="App">
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/all" element={<All/>}/>
            </Routes>
        </div>
    );
}

export default App;