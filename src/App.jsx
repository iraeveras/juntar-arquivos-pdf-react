import Juntarpdf from "./pages/juntar-pdf";

import "./App.css";
import Topbar from "./components/top-bar";
import Footer from "./components/footer";

function App() {


  return (
    <div className="app">
      <Topbar />
      <Juntarpdf />
      <Footer/>
    </div>
  )
}

export default App;
