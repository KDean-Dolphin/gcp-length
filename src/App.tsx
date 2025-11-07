import { useState } from 'react'
import './App.css'
import { getGCPLength, normalizeGTIN } from "./gcp-length.ts";

function toEPC(gtin: string, serial: string): string {
    let epc: string;

    const normalizedGTIN = normalizeGTIN(gtin);

    if (normalizedGTIN !== "") {
        const gcpLength = getGCPLength(normalizedGTIN);

        if (gcpLength !== 0) {
            epc = `urn:epc:id:sgtin:${normalizedGTIN.substring(1, gcpLength + 1)}.${normalizedGTIN.charAt(0)}${normalizedGTIN.substring(gcpLength + 1, 13)}.${serial}`;
        } else {
            epc = "GCP not found";
        }
    } else {
        epc = "Invalid GTIN";
    }

    return epc;
}

function App() {
    const [gtin, setGTIN] = useState("")
    const [serial, setSerial] = useState("")
    const [epc, setEPC] = useState("")

    return (
      <>
          <h1>SGTIN Demo</h1>
          <div className="card">
              <label>
                  GTIN: <input name="gtin" onChange={(e) => {
                      setGTIN(e.target.value);
                  }} />
              </label>
              <hr />
              <label>
                  Serial: <input name="serial" onChange={(e) => {
                  setSerial(e.target.value);
              }} />
              </label>
              <hr />
              <button onClick={() => {
                  setEPC(toEPC(gtin, serial));
              }}>
                  Generate EPC
              </button>
              <hr />
              <label>
                  {epc}
              </label>
          </div>
      </>
    )
}

export default App;
