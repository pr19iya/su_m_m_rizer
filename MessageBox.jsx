import React, { useEffect, useState } from "react";
import { roles } from "../constants";
import { Button, Card, Tooltip } from "antd";
import { Typewriter } from "react-simple-typewriter";
import { CheckCircleOutlined, CopyOutlined } from "@ant-design/icons";

let boxStyle = {};

const messageBoxStyle = {
  background: "rgb(124 101 227)",
  marginBottom: "10px",
  maxWidth: "80%",
  textAlign: "left",
};
const leftBoxStyle = {
  ...messageBoxStyle,
  float: "left",
  background: "#F5F5F5",
  color: "black",
  borderRadius: "1px 12px 12px 12px",
};
const rightBoxStyle = {
  ...messageBoxStyle,
  float: "right",
  background: "#9769ec",
  color: "#fff",
  borderRadius: "12px 2px 12px 12px",
};
const centerBoxStyle = {
  margin: "auto",
  width: "60%",
  clear: "both",
  color: "grey",
};
const errorBoxStyle = {
  margin: "auto",
  width: "60%",
  clear: "both",
  color: "red",
  border: "1px dashed red",
  borderRadius: "12px",
};
export default function MessageBox({
  message,
  role,
  actions,
  setGenerating,
  loading,
  typing = true,
}) {
  const [speed, setSpeed] = useState(10);
  const [isCopied, setIsCopied] = useState(false);

  switch (role) {
    case roles.ASSISTANT:
      boxStyle = leftBoxStyle;
      break;
    case roles.USER:
      boxStyle = rightBoxStyle;
      break;
    case roles.ERROR:
      boxStyle = errorBoxStyle;
      break;
    default:
      //center
      boxStyle = centerBoxStyle;
      break;
  }

  // methods
  let wordCount = 0;
  const onType = () => {
    wordCount++;
    if (wordCount === message.length) {
      setGenerating(false);
    }
  };
  const stopAnimation = () => {
    setSpeed(0);
    setGenerating(false);
  };
  useEffect(() => {
    window.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && !loading) {
          stopAnimation();
        }
      },
      true
    );
  }, []);
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  };
  return (
    <Tooltip
      zIndex={0}
      placement="rightBottom"
      title={
        <Button
          onClick={() => handleCopy()}
          size="small"
          type="link"
          icon={
            isCopied ? (
              <CheckCircleOutlined style={{ color: "#fff" }} />
            ) : (
              <CopyOutlined style={{ color: "#fff" }} />
            )
          }
        />
      }
      arrow={false}
    >
      <Card
        style={boxStyle}
        bodyStyle={{ padding: "10px 15px", whiteSpace: "pre-line" }}
        actions={actions}
      >
        {typing ? (
          <Typewriter words={[message]} typeSpeed={speed} onType={onType} />
        ) : (
          message
        )}
      </Card>
    </Tooltip>
  );
}
