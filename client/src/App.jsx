import Login from "./Pages/Login/Login";
import Post from "./Pages/Post/Post";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Feed";
import { Profile } from "./Pages/Profile";
import { Edit } from "./Pages/Edit";
import { Forgot } from "./Pages/Forgot";
import { Reset } from "./Pages/Reset";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/feed/:userId" element={<Home />} />
        <Route path="/write/:userId" element={<Post />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/edit/:userId" element={<Edit />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset/:userEmail" element={<Reset />} />
        <Route
          path="*"
          element={
            <>
              <div
                style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
              >
                <h1>Error:</h1>{" "}
                <h2 style={{ color: "var(--blue)" }}>Page not found !</h2>
              </div>
              <a
                href="/"
                style={{ textDecoration: "underline", color: "var(--blue)" }}
              >
                Get back to safety
              </a>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
