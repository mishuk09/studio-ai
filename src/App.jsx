import { Route, Routes } from "react-router-dom";

import Profile from "./components/users/Profile";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/loginform ";
import Note from "./pages/Note";
import RegisterForm from "./pages/RegisterForm";
import Rewrite from "./pages/Rewrite";
import ProtectedRoute from "./utills/ProtectedRoute";
import Layout from "./components/Home/Layout";
import Allnews from "./pages/Allnews";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<LoginForm />} />
        <Route path="/user-register" element={<RegisterForm />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/new" element={<Home />} />
            <Route path="/note" element={<Note />} />
            <Route path="/notes" element={<Note />} />
            <Route path="/rewrite" element={<Rewrite />} />
            <Route path="/all-news" element={<Allnews />} />
            <Route path="/profile" element={<Profile />} />

          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
