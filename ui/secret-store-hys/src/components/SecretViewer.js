import { Button } from "primereact/button";
import { useParams } from "react-router";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";
import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SecretViewer() {
  const { id } = useParams();
  const toast = useRef(null);

  const [content, setContent] = useState("");
  const [pinCode, setPinCode] = useState("");

  function open() {
    if (pinCode === null || pinCode.length === 0) {
      showError("Password can not be empty.");
      return;
    }

    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios
    .get(process.env.REACT_APP_BACKEND_HOST + "/Secret/" + id + "?pin=" + pinCode)
      .then((response) => {
        if (response.status !== 200) {
          if (response.status === 404) {
            showError("Secret is not found", "Error");
            return;
          }

          showError("Test", "Failed to get a secret");
          return;
        }

        setContent(response.data.secret);
        setPinCode("");
      })
      .catch((e) => {
        let errorMessage = "Something went wrong";

        if (e?.response?.data !== null) {
          errorMessage = e.response.data;
        }
        showError(errorMessage, "Failed to get a secret");
      });
  }

  const showError = (message, summary = "Validation error") => {
    toast.current.show({
      severity: "error",
      summary: summary,
      detail: message,
    });
  };

  return (
    <div className="flex flex-column">
      <Toast ref={toast} />

      <div className="flex align-items-center justify-content-center font-bold m-2">
        <h2 className="text-4xl">Secret store HYS</h2>
      </div>

      <div className="flex align-items-center justify-content-center h-8rem font-bold m-2">
        <div className="flex align-items-stretch flex-wrap">
          <div className="flex align-items-center justify-content-center font-bold border-round m-2">
            <div className="flex flex-column gap-2">
              <label htmlFor="pwd1">Password</label>
              <Password
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                feedback={false}
                tabIndex={1}
                maxLength={6}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex align-items-center justify-content-center font-bold m-2">
        <Button label="Open" onClick={open} />
      </div>
      {content !== null && content.length !== 0 && (
        <div className="flex align-items-center justify-content-center font-bold m-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="username">Secret content</label>
            <InputTextarea
              id="username"
              aria-describedby="username-help"
              rows={10}
              cols={100}
              style={{ resize: "none" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      )}
      <div className="flex align-items-center justify-content-center h-4rem font-bold m-2">
        <Link className="p-button font-bold" id="home-link" to="/">
          Home
        </Link>
      </div>
    </div>
  );
}
