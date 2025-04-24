import { ClearOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";
import React, { useState } from "react";
import "../styles/input-area.css";

const inputStyle = {
  width: "100%",
};
const containerStyle = {
  width: "100%",
  border: "1px solid #504099",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  padding: "12px",
};
const sendButtonStyle = {
  color: "#504099",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default function InputArea({ disabled, onSubmit, handleSummarizeWeb }) {
  const [isHovered, setIsHovered] = useState({
    send: false,
    summary: false,
  });
  const [inputText, setInputText] = useState("");

  const handleSubmit = () => {
    onSubmit(inputText);
    setInputText("");
  };

  return (
    <div className="input-container" style={containerStyle}>
      <Input.TextArea
        autoFocus
        disabled={disabled}
        value={inputText}
        autoSize={{
          minRows: 2,
          maxRows: 5,
        }}
        style={inputStyle}
        bordered={false}
        placeholder="Type a message"
        onChange={(e) => setInputText(e.target.value)}
        onPressEnter={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title="Summarize Web">
          <Button
            disabled={disabled}
            style={{
              ...sendButtonStyle,
              background: isHovered.summary ? "#504099" : "#fff",
            }}
            onMouseEnter={() =>
              setIsHovered((prev) => ({ ...prev, summary: true }))
            }
            onMouseLeave={() =>
              setIsHovered((prev) => ({ ...prev, summary: false }))
            }
            type={isHovered.summary ? "primary" : "link"}
            icon={
              <ClearOutlined
                style={{ color: isHovered.summary ? "white" : "" }}
              />
            }
            onClick={() => handleSummarizeWeb()}
          />
        </Tooltip>
        <Tooltip title="Send">
          <Button
            disabled={disabled}
            style={{
              ...sendButtonStyle,
              background: isHovered.send ? "#504099" : "#fff",
            }}
            onMouseEnter={() =>
              setIsHovered((prev) => ({ ...prev, send: true }))
            }
            onMouseLeave={() =>
              setIsHovered((prev) => ({ ...prev, send: true }))
            }
            type={isHovered.send ? "primary" : "link"}
            icon={
              <SendOutlined style={{ color: isHovered.send ? "white" : "" }} />
            }
            onClick={() => handleSubmit()}
          />
        </Tooltip>
      </div>
    </div>
  );
}
