import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";
import React, { useState, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SecretCreator() {
  const toast = useRef(null);

  const [secretLink, setSecretLink] = useState("");
  const [content, setContent] = useState("");
  const [pinCode, setPinCode] = useState("");
  const cities = [
    { name: "Minutes", code: "M" },
    { name: "Hours", code: "H" },
    { name: "Days", code: "D" },
  ];
  const [selectedMeasurement, setSelectedMeasurement] = useState({
    name: "Minutes",
    code: "M",
  });

  const [measurementValue, setMeasurementValue] = useState(10);

  function create() {
    if (content === null || content.length === 0) {
      showError("Secret content can not be empty.");
      return;
    }

    if (pinCode === null || pinCode.length === 0) {
      showError("Password can not be empty.");
      return;
    }

    if (measurementValue <= 0) {
      showError("Expire in should be greater than zero.");
      return;
    }

    if (selectedMeasurement.code === "D" && measurementValue >= 99) {
      showError("Expiration date is too big.");
      return;
    }
    const currentDate = new Date();
    const expireDate = new Date();

    switch (selectedMeasurement.code) {
      case "M":
        expireDate.setMinutes(currentDate.getMinutes() + measurementValue);
        break;
      case "H":
        expireDate.setHours(currentDate.getHours() + measurementValue);
        break;
      case "D":
        expireDate.setDate(currentDate.getDate() + measurementValue);
        break;
    }

    console.log(expireDate);

    sendRequest(content, pinCode, expireDate);
  }

  function sendRequest(content, pinCode, expireDate) {
    const article = {
      Content: content,
      PublicPin: pinCode,
      ExpirationDate: expireDate,
    };
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios
    .post(process.env.REACT_APP_BACKEND_HOST + "/Secret", article)
      .then((response) => {
        if (response.status !== 200) {
          showError("Failed to create secret", "Error");
          return;
        }

        const hostName = window.location.origin;
        setSecretLink(hostName + "/Secret/" + response.data);

        showSuccess("Secret created");
      })
      .catch((_) => {
        showError("Failed to create secret", "Error");
      });
  }

  const showError = (message, summary = "Validation error") => {
    toast.current.show({
      severity: "error",
      summary: summary,
      detail: message,
    });
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  };

  return (
    <div className="flex flex-column">
      <Toast ref={toast} />

      <div className="flex align-items-center justify-content-center font-bold m-2">
        <h2 className="text-4xl">Secret store HYS</h2>
      </div>
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
          <div className="flex align-self-start align-items-center justify-content-center font-bold border-round m-2">
            <div className="flex flex-column gap-2">
              <label htmlFor="pwd1">Expire in</label>
              <Dropdown
                value={selectedMeasurement}
                onChange={(e) => setSelectedMeasurement(e.value)}
                options={cities}
                optionLabel="name"
                className="w-full md:w-10rem"
              />
            </div>
          </div>
          <div className="flex align-items-center justify-content-center font-bold border-round m-2">
            <div className="flex flex-column gap-2">
              <label htmlFor="pwd1">{selectedMeasurement.name}</label>
              <InputText
                value={measurementValue}
                onChange={(e) => setMeasurementValue(e.target.value)}
                keyfilter="int"
                maxLength={99}
                min={1}
                max={10}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex align-items-center justify-content-center font-bold m-2">
        <Button label="Create" onClick={create} />
      </div>
      {secretLink !== null && secretLink.length > 0 && (
        <div className="flex align-items-center justify-content-center font-bold m-2">
          <Link className="p-button font-bold" id="home-link" to={secretLink}>
            Secret link
          </Link>
        </div>
      )}
    </div>
  );
}
