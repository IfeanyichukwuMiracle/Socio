import { Banner } from "../../Components/SecBanner";
import { Post } from "../../Components/Post";
import { Link } from "react-router-dom";
import "./profile.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import img from "../../assets/blank-profile-picture-973460_1280.png";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${userId}`,
          {
            headers: {
              Authorization: window.localStorage.getItem("token"),
            },
          },
        );
        setUser(response.data);
      } catch (error) {
        console.log(error.message);
      }
    }

    async function getPosts() {
      try {
        const posts = await axios.get(`http://localhost:5000/posts/${userId}`, {
          headers: {
            Authorization: window.localStorage.getItem("token"),
          },
        });

        setPosts(posts.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getUser();
    getPosts();

    async function checkFollowing() {
      try {
        const follower = await axios.get(
          `http://localhost:5000/follow/followers/${userId}`,
          { headers: { Authorization: window.localStorage.getItem("token") } },
        );

        const { data } = follower;
        const follow = data.find(
          (item) => item.follower === window.localStorage.getItem("id"),
        );

        if (follow) {
          setIsFollowing(true);
          // console.log(`You're following already`);
          return;
        }

        setIsFollowing(false);
        return;
      } catch (error) {
        console.log(error);
      }
    }

    const getFollowers = async () => {
      try {
        const followers = await axios.get(
          `http://localhost:5000/follow/followers/${userId}`,
          {
            headers: {
              Authorization: window.localStorage.getItem("token"),
            },
          },
        );
        setFollowers(followers.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    const getFollowing = async () => {
      try {
        const following = await axios.get(
          `http://localhost:5000/follow/following/${userId}`,
          {
            headers: {
              Authorization: window.localStorage.getItem("token"),
            },
          },
        );
        setFollowing(following.data.length);
      } catch (error) {
        console.log(error);
      }
    };

    getFollowers();
    getFollowing();
    checkFollowing();
  }, [userId, isFollowing]);
  return (
    <>
      <Banner userId={window.localStorage.getItem("id")} />
      <section className="profile-content">
        <div
          className="profile-info"
          style={{ padding: ".7rem .6rem", borderBottom: "10px solid #f8f8f8" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img
              style={{
                display: "block",
                width: "7rem",
                height: "7rem",
                borderRadius: "100%",
              }}
              src={user.profileImg || img}
              alt="profile_pic"
            />
            {window.localStorage.getItem("id") == userId ? (
              <></>
            ) : (
              <button
                type="button"
                className="btn profile-btn"
                style={{ display: "flex", alignItems: "center", gap: ".3rem" }}
                onClick={
                  !(window.localStorage.getItem("id") == userId)
                    ? async () => {
                        try {
                          if (isFollowing) {
                            await axios.delete(
                              `http://localhost:5000/follow/${userId}/${window.localStorage.getItem(
                                "id",
                              )}`,
                              {
                                headers: {
                                  Authorization:
                                    window.localStorage.getItem("token"),
                                },
                              },
                            );

                            setIsFollowing(false);
                            return;
                          } else {
                            await axios.post(
                              `http://localhost:5000/follow/${userId}`,
                              {
                                follower: window.localStorage.getItem("id"),
                              },
                              {
                                headers: {
                                  Authorization:
                                    window.localStorage.getItem("token"),
                                },
                              },
                            );

                            setIsFollowing(true);
                          }
                        } catch (error) {
                          console.log(error);
                          return;
                        }
                      }
                    : () => {
                        // alert("Goodbye");
                        return;
                      }
                }
              >
                {isFollowing ? `Following` : `Follow`}
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
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="profile-text">
            <div style={{ marginTop: ".7rem" }}>
              <h2>{user.username || `@username`}</h2>
              <p>{user.bio || `@bio`}</p>
            </div>
            {window.localStorage.getItem("id") == userId ? (
              <Link to={`/edit/${userId}`}>
                <button
                  type="button"
                  className="btn profile-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".3rem",
                    marginTop: ".8rem",
                  }}
                >
                  Edit bio
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
              </Link>
            ) : (
              <></>
            )}

            <div
              className="following"
              style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}
            >
              <div className="followers">
                <span style={{ fontWeight: "700" }}>{followers}</span> followers
              </div>
              <div className="following">
                <span style={{ fontWeight: "700" }}>{following}</span> following
              </div>
            </div>
          </div>
        </div>
        <div className="profile-posts" style={{ marginTop: ".6rem" }}>
          <h2
            style={{
              padding: ".6rem",
              marginBottom: ".6rem",
              fontFamily: "var(--heading-font)",
            }}
          >
            Your posts
          </h2>
          {posts[0] ? (
            posts
              .map((post) => {
                const { _id, body, image, from } = post;
                return (
                  <>
                    <Post
                      key={_id}
                      body={body}
                      image={image}
                      id={from}
                      date={post.createdAt}
                      to={post._id}
                    />
                  </>
                );
              })
              .reverse()
          ) : (
            <h3 style={{ margin: ".6rem" }}>{`No posts!`}</h3>
          )}
        </div>
      </section>
    </>
  );
};

export default Profile;
