import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Athletes from "./pages/Athletes";
import AddResult from "./pages/AddResult";
import NotFound from "./pages/NotFound";
import './App.css';

function App() {
    return (
        <>
            <Link to="/">
                <button>Avaleht</button>
            </Link>

            <Link to="/athletes">
                <button>Sportlased</button>
            </Link>

            <Link to="/add-result">
                <button>Lisa tulemus</button>
            </Link>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/athletes" element={<Athletes />} />
                <Route path="/add-result" element={<AddResult />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
