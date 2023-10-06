import { useState } from "react";
import "./reset.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Reset = () => {
  const [details, setDetails] = useState({ newPassword: "", otp: "" });
  const [verifyPwd, setVerifyPwd] = useState("");
  const { userEmail } = useParams();
  const navigate = useNavigate();

  function handleOnChange(e) {
    setDetails((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      details.newPassword &&
      details.otp &&
      details.newPassword === verifyPwd
    ) {
      try {
        await axios.post(`http://localhost:5000/users/reset/${userEmail}`, {
          otp: details.otp,
          newPassword: details.newPassword,
        });

        navigate("/");
        return;
      } catch (error) {
        // console.log(error);
        return;
      }
    }
  }
  return (
    <>
      <section className="reset">
        <form action="#" method="post" onSubmit={handleSubmit}>
          <h2
            style={{
              fontFamily: "var(--heading-font)",
              marginBottom: "1.5rem",
              fontWeight: "900",
            }}
          >
            Reset Password
          </h2>
          <div>
            <input
              type="text"
              name="otp"
              id="otp"
              placeholder="Enter OTP"
              value={details.otp}
              onChange={handleOnChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="newPassword"
              id="password"
              placeholder="New Password"
              value={details.newPassword}
              onChange={handleOnChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="verify-password"
              placeholder="Verify new Password"
              value={verifyPwd}
              onChange={(e) => setVerifyPwd(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="btn">
              Reset
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Reset;
