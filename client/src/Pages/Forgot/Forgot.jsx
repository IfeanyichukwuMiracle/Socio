import { useState } from "react";
import "./forgot.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);

  return (
    <>
      <section className="forgot">
        <form
          action="#"
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();
            if (email) {
              try {
                await axios.post(
                  `https://socio-app-xe9r.onrender.com/users/forgot`,
                  {
                    email,
                  },
                );

                setEmail("");
                setMsg("OTP Sent");
                setShow(true);
                setTimeout(() => {
                  setShow(false);
                  navigate(`/reset/${email}`);
                }, 1000);

                return;
              } catch (error) {
                console.log(error);
                setEmail("");
                setMsg("OTP Sent");
                setShow(true);
                setTimeout(() => {
                  setShow(false);
                  navigate(`/reset/${email}`);
                }, 1000);

                return;
              }
            }

            setMsg("Enter email");
            setShow(true);
            setTimeout(() => setShow(false), 1000);
          }}
        >
          <h2
            style={{
              fontFamily: "var(--heading-font)",
              marginBottom: "1.5rem",
              fontWeight: "900",
            }}
          >
            Get OTP
          </h2>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter valid email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>

        {show ? (
          <>
            <div
              style={{
                margin: "-7rem auto 1rem auto",
                width: "max-content",
                background: "var(--light-blue)",
                color: "var(--blue)",
                padding: ".2rem",
                borderRadius: ".3rem",
              }}
            >
              {msg}
            </div>
          </>
        ) : (
          <></>
        )}
      </section>
    </>
  );
};

export default Forgot;
