import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalogue from "./pages/Catalogue";
import UserLibrary from "./pages/UserLibrary";
import AddSystem from "./pages/AddSystem";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/library" element={<UserLibrary />} />
        <Route path="/add-system" element={<AddSystem />} />
        <Route path='/admin' element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;