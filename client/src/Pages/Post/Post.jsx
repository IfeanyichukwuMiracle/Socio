// import { useState } from "react";
import "./post.css";
import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const Post = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [err, setErr] = useState(false);
  const [msg, setMsg] = useState("");

  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setIsFetching(true);
      await axios.post(`http://localhost:5000/posts/${userId}`, formData, {
        headers: { Authorization: window.localStorage.getItem("token") },
      });

      setErr(true);
      setIsFetching(false);
      navigate(`/feed/${window.localStorage.getItem("id")}`);
    } catch (error) {
      console.log(error);

      setIsFetching(false);
      setMsg(`Couldn't post:: Check network connection`);
      setTimeout(() => {
        setErr(false);
      }, 1000);
      return;
    }
  };
  return (
    <section className="post-form">
      <Link
        style={{
          color: "var(--blue)",
          position: "fixed",
          top: ".7rem",
          left: ".7rem",
        }}
        to={`/feed/${window.localStorage.getItem("id")}`}
      >
        Home
      </Link>
      <form
        method="post"
        encType="multipart/form-data"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <h2
          style={{
            fontFamily: "var(--heading-font)",
            fontWeight: "900",
            marginBottom: "1.7rem",
          }}
        >
          Post
        </h2>
        <div>
          <textarea
            name="body"
            id="body"
            cols="30"
            rows="10"
            placeholder="What's on your mind?"
          ></textarea>
        </div>
        <div>
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
                style={{ width: "1.3rem" }}
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
          style={{
            background: isFetching ? `var(--light-blue)` : `var(--blue)`,
          }}
        >
          Post
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

export default Post;
