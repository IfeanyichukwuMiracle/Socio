import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./post.css";
import img from "../../assets/blank-profile-picture-973460_1280.png";

const Post = ({ body, image, id, date, to }) => {
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`, {
          headers: { Authorization: window.localStorage.getItem("token") },
        });
        setUser(response.data);
        return;
      } catch (error) {
        console.log(error);
        return;
      }
    }

    async function getComments() {
      try {
        const comments = await axios.get(
          `http://localhost:5000/comment/${to}`,
          { headers: { Authorization: window.localStorage.getItem("token") } },
        );

        setComments(comments.data);
        return;
      } catch (error) {
        console.log(error);
        return;
      }
    }
    getComments();
    getUser();
  }, []);
  return (
    <section className="post">
      <div className="header">
        <Link to={`/profile/${id}`}>
          <h4 style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <img
              src={user.profileImg || img}
              alt="profile_img"
              style={{ width: "3rem", height: "3rem", borderRadius: "100%" }}
            />
            {user.username || "--"}
          </h4>
        </Link>
        <p style={{ fontSize: ".9rem", fontWeight: "800" }}>{date}</p>
      </div>
      <div className="body">
        <p className="text">{body}</p>
        {image ? (
          <>
            <img
              src={image}
              alt="post_img"
              style={{
                display: "block",
                width: "70%",
                maxHeight: "25rem",
                margin: ".5rem auto",
                borderRadius: ".3rem",
              }}
            />
          </>
        ) : (
          ""
        )}
      </div>
      <div className="comment">
        <div
          className="comment-header"
          style={{ display: "flex" }}
          onClick={() => setToggle(!toggle)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <h4
              style={{ fontWeight: "900", fontFamily: "var(--heading-font)" }}
            >
              Comments
            </h4>
            <p style={{ fontSize: ".87rem" }}>
              {comments.length ? comments.length : 0}
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
            className="w-6 h-6"
            style={{ width: "1.5rem" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
        {toggle ? (
          <>
            <form
              action="#"
              className="comment-input"
              style={{ padding: ".5rem .6rem" }}
              id="comment-input"
            >
              <input
                type="text"
                name="comment"
                id="comment"
                placeholder="Say something"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                type="submit"
                className="btn"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const user = await axios.get(
                      `http://localhost:5000/users/${window.localStorage.getItem(
                        "id",
                      )}`,
                      {
                        headers: {
                          Authorization: window.localStorage.getItem("token"),
                        },
                      },
                    );
                    await axios.post(
                      `http://localhost:5000/comment/${to}`,
                      {
                        from: window.localStorage.getItem("id"),
                        body: comment,
                        username: user.data.username,
                      },
                      {
                        headers: {
                          Authorization: window.localStorage.getItem("token"),
                        },
                      },
                    );

                    const comments = await axios.get(
                      `http://localhost:5000/comment/${to}`,
                      {
                        headers: {
                          Authorization: window.localStorage.getItem("token"),
                        },
                      },
                    );
                    setComments(comments.data);

                    setComment("");
                    return;
                  } catch (error) {
                    console.log(error);
                    setComment("");
                    return;
                  }
                }}
              >
                Comment
              </button>
            </form>
            <div
              className="comment-section"
              style={{ padding: ".6rem .6rem 0 .6rem " }}
            >
              {comments[0] ? (
                comments.map((comment) => {
                  return (
                    <section key={comment._id}>
                      <div
                        className="comment-head"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Link
                          to={`/profile/${comment.from}`}
                          style={{ color: "var(--blue)" }}
                        >
                          <h4 style={{ fontSize: "1.1rem" }}>
                            {comment.username}
                          </h4>
                        </Link>
                        <p style={{ fontSize: ".84rem" }}>
                          {comment.createdAt || `@date`}
                        </p>
                      </div>
                      <div
                        className="comment-body"
                        style={{
                          fontSize: ".9rem",
                          margin: ".3rem 0 .5rem 0",
                        }}
                      >
                        {comment.body}
                      </div>
                    </section>
                  );
                })
              ) : (
                <h4 style={{ paddingBottom: ".5rem" }}>No Comments!</h4>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
};

export default Post;
