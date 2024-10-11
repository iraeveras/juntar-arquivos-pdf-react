import Juntarpdf from "./pages/juntar-pdf";

import "./App.css";
import Topbar from "./components/top-bar";
import Footer from "./components/footer";
import Converteexcelpdf from "./pages/converte-excel-pdf";

function App() {


  return (
    <div className="app">
      <Topbar />
      {/* <Juntarpdf /> */}
      <Converteexcelpdf/>
      <Footer/>
    </div>
  )
}

export default App;
