import { Banner } from "../../Components/SecBanner";
import { Post } from "../../Components/Post";
import "./home.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "../../Components/Loader";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const getAllPosts = async function () {
      try {
        const response = await axios.get(
          "https://socio-app-xe9r.onrender.com/posts/",
          {
            headers: { Authorization: window.localStorage.getItem("token") },
          },
        );
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllPosts();

    setInterval(async function () {
      try {
        const response = await axios.get(
          "https://socio-app-xe9r.onrender.com/posts/",
          {
            headers: { Authorization: window.localStorage.getItem("token") },
          },
        );
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    }, 2000);

    // console.log(posts);
  }, [userId]);
  return (
    <>
      <Banner userId={userId} />

      <h1
        id="feed"
        style={{
          fontFamily: "var(--heading-font)",
          marginBottom: "-.5rem",
          fontWeight: "900",
          border: "none",
          fontSize: "1.7rem",
        }}
      >
        Feed
      </h1>
      <section className="posts">
        {posts.length > 0 ? (
          posts
            .map((post) => {
              const { body, image, from } = post;
              return (
                <Post
                  key={post._id}
                  body={body}
                  image={image}
                  id={from}
                  date={post.createdAt}
                  to={post._id}
                />
              );
            })
            .reverse()
        ) : (
          <>
            {/* <h3 style={{ padding: ".6rem" }}>No posts!</h3> */}
            <Loader color={`var(--blue)`} />
          </>
        )}
      </section>
    </>
  );
};

export default Home;
