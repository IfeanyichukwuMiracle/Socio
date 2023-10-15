import { useState } from "react";
import Banner from "../../Components/Banner/Banner";
import "./login.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Loader } from "../../Components/Loader";

const Login = () => {
  const [sign, setSign] = useState({ username: "", email: "", password: "" });
  const [login, setLogin] = useState({ username: "", password: "" });
  const [toggle, setToggle] = useState(true);
  const navigate = useNavigate();

  const [posting, setPosting] = useState(false);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);

  function handleChange(e) {
    setSign((preValue) => {
      return { ...preValue, [e.target.name]: e.target.value };
    });
  }

  function handleLogin(e) {
    setLogin((preValue) => {
      return { ...preValue, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmitLogin(e) {
    e.preventDefault();
    try {
      const { username, password } = login;

      if (username && password) {
        // submit form

        setPosting(true);
        const response = await axios.post(
          "https://socio-app-xe9r.onrender.com/users/login",
          {
            username,
            password,
          },
        );
        const { token, _id } = response.data;

        if (token) {
          window.localStorage.setItem("token", `${token}`);
          window.localStorage.setItem("id", `${_id}`);

          setPosting(false);
          setMsg("Logged In!");
          setErr(true);

          setTimeout(() => {
            setErr(false);
            navigate(`/feed/${window.localStorage.getItem("id")}`);
          }, 1000);
          setLogin({ username: "", email: "", password: "" });
          return;
        }
      }
      setMsg("Enter full details!");
      setPosting(false);
      setErr(true);

      setTimeout(() => {
        setErr(false);
      }, 1000);
    } catch (error) {
      setMsg("Wrong credentials!");
      setPosting(false);
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 1000);

      return;
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { username, password, email } = sign;

      if (username && password && email) {
        // submit form

        setPosting(true);
        await axios.post("https://socio-app-xe9r.onrender.com/users/register", {
          username,
          email,
          password,
        });
        setMsg("Signed up successfully!");
        setPosting(false);
        setErr(true);

        setTimeout(() => {
          setErr(false);
          setToggle(false);
        }, 1000);
        setSign({ username: "", email: "", password: "" });
        return;
      }

      setMsg("Enter full details!");
      setPosting(false);
      setErr(true);

      setTimeout(() => {
        setErr(false);
      }, 1000);
      return;
    } catch (error) {
      setMsg("Error signing up: Try again!");
      setPosting(false);
      setErr(true);

      setTimeout(() => {
        setErr(false);
      }, 1000);
    }
  }
  return (
    <>
      <Banner />

      {toggle ? (
        <section className="form">
          {/* Sign up form */}
          <form action="#" method="post" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="e.g john423"
                  onChange={handleChange}
                  value={sign.username}
                />
              </label>
            </div>
            <div>
              <label htmlFor="email">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="e.g john@gmail.com"
                  onChange={handleChange}
                  value={sign.email}
                />
              </label>
            </div>
            <div>
              <label htmlFor="password">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={sign.password}
                />
              </label>
            </div>
            <p style={{ fontSize: ".85rem" }}>
              Have an account?{" "}
              <span
                style={{
                  textDecoration: "underline",
                  color: "var(--blue)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setToggle(!toggle);
                }}
              >
                {toggle ? `Login` : `Sign up`}
              </span>
            </p>
            <button type="submit" className="btn">
              {posting ? <Loader color={`var(--light-blue)`} /> : `Sign up`}
            </button>
          </form>

          {err ? (
            <div
              style={{
                background: "var(--light-blue)",
                width: "max-content",
                padding: ".2rem .4rem",
                color: "var(--blue)",
                fontWeight: "900",
                borderRadius: ".3rem",
                border: "0px solid var(--blue)",
                margin: "auto",
                fontSize: ".9rem",
              }}
            >
              {msg}
            </div>
          ) : (
            ""
          )}
        </section>
      ) : (
        <section className="form">
          {/* Login form */}
          <form action="#" method="post" onSubmit={handleSubmitLogin}>
            <div>
              <label htmlFor="username">
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="e.g john423"
                  onChange={handleLogin}
                  value={login.username}
                />
              </label>
            </div>
            <div>
              <label htmlFor="password">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleLogin}
                  value={login.password}
                />
              </label>
            </div>
            <p
              style={{
                fontSize: ".85rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                {toggle ? `` : `Don't`} have an account?{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    color: "var(--blue)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setToggle(!toggle);
                  }}
                >
                  {toggle ? `Login` : `Sign up`}
                </span>
              </span>
              <Link to={`/forgot`}>
                <span
                  className="forgot-pwd"
                  style={{
                    textDecoration: "underline",
                    color: "var(--blue)",
                    cursor: "pointer",
                  }}
                >
                  Forgot Password
                </span>
              </Link>
            </p>
            <button type="submit" className="btn">
              {/* {toggle ? `Sign up` : `Login`} */}
              {posting ? <Loader color={`var(--light-blue)`} /> : `Login`}
            </button>
          </form>

          {err ? (
            <div
              style={{
                background: "var(--light-blue)",
                width: "max-content",
                padding: ".2rem .4rem",
                color: "var(--blue)",
                fontWeight: "900",
                borderRadius: ".3rem",
                border: "0px solid var(--blue)",
                margin: "auto",
                fontSize: ".9rem",
              }}
            >
              {msg}
            </div>
          ) : (
            ""
          )}
        </section>
      )}
    </>
  );
};

export default Login;
