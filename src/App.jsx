import Juntarpdf from "./pages/juntar-pdf";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Topbar from "./components/top-bar";
import Footer from "./components/footer";
import Converteexcelpdf from "./pages/converte-excel-pdf";

function App() {


  return (
    <div className="app">
      <Topbar />
      <Routes>
        <Route path="/" element={<Juntarpdf />} />
        <Route path="/converte-excel-pdf" element={<Converteexcelpdf />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
