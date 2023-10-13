import React, { useState } from "react";
import PrintPdf from "./components/PrintPdf";
import "./components/Button.css";

import printicon from "./Images/printer.png";
const App = () => {
  const [showPdf, setShowpdf] = useState(false);
  return (
    <div>
      {showPdf?<PrintPdf />:
      <button className="button-container" onClick={() => setShowpdf(true)}>
        <div className="print-container">
          <img className="icon" alt="print-icon" src={printicon} />
          <div className="print-label">Print</div>
        </div>
      </button>}
    </div>
  );
};

export default App;
