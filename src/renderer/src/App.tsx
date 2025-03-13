import "../src/assets/css/base.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./share/MainLayout/MainLayout";
import Monitor from "./pages/Security/Monitor";
import List from "./pages/Employees/Manage";
import Detail from "./pages/Employees/Detail";



function App(): JSX.Element {

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/security/monitor" element={<Monitor />} />
          <Route path="/employees/manage" element={<List />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App
