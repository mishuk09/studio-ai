import { Route, Routes } from "react-router-dom";

import Profile from "./components/users/profile";
import Home from "./pages/home";
import LandingPage from "./pages/landingpage";
import LoginForm from "./pages/loginform ";
import Note from "./pages/note";
import RegisterForm from "./pages/registerForm";
import Rewrite from "./pages/rewrite";
import ProtectedRoute from "./utills/protectedroute";
import Layout from "./components/Home/Layout";
import Allnews from "./pages/allnews";

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
