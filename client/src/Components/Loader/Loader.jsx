import "./loader.css";

const Loader = ({ color }) => {
  return (
    <div className="loader">
      <div style={{ background: color }}></div>
      <div style={{ background: color }} id="second"></div>
      <div style={{ background: color }} id="third"></div>
    </div>
  );
};

export default Loader;
