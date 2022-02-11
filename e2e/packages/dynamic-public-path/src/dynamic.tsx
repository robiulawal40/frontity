import { useState } from "react";

const Dynamic: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <div data-test-id="dynamic-div">I am the Dynamic component</div>
      <button data-test-id="toggle-button" onClick={() => setToggle(!toggle)}>
        Toggle
      </button>
      <div data-test-id="toggle-div">{toggle ? "ON" : "OFF"}</div>
    </>
  );
};

export default Dynamic;
