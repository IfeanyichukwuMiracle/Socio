import { useState } from "react";
import "./edit.css";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const Edit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsFetching(true);
      const formdata = new FormData(e.target);
      await axios.put(
        `https://socio-app-xe9r.onrender.com/users/profile/${userId}`,
        formdata,
        {
          headers: {
            Authorization: window.localStorage.getItem("token"),
          },
        },
      );

      setMsg("Profile Edited!");
      setErr(true);
      setIsFetching(false);

      setTimeout(() => {
        setErr(false);
        navigate(`/profile/${userId}`);
      }, 500);

      return;
    } catch (error) {
      setMsg("Couldn't edit profile!");
      setErr(true);
      setIsFetching(false);

      setTimeout(() => {
        setErr(false);
      }, 500);
    }
  };

  return (
    <section className="edit-form">
      <Link
        style={{ color: "var(--blue)" }}
        to={`/profile/${window.localStorage.getItem("id")}`}
      >
        Back
      </Link>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <h2
          style={{
            fontFamily: "var(--heading-font)",
            marginBottom: "1.8rem",
            fontWeight: "900",
          }}
        >
          Edit
        </h2>
        <div>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
          />
        </div>
        <div>
          <input type="text" name="bio" id="bio" placeholder="Bio" />
        </div>
        <div style={{ marginTop: ".3rem" }}>
          <label htmlFor="image">
            <div
              className="btn"
              style={{ width: "max-content", padding: ".3rem .4rem 0 .4rem" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.9}
                stroke="currentColor"
                className="w-6 h-6"
                style={{ width: "1.2rem" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
          </label>
          <input
            type="file"
            name="image"
            id="image"
            style={{ display: "none" }}
          />
        </div>
        <button
          type="submit"
          className="btn"
          disabled={isFetching ? true : false}
          style={{ background: isFetching ? `var(--light-blue)` : `var(blue)` }}
        >
          Edit
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
  );
};

export default Edit;
