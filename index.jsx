import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Divider, Layout, Spin, Tag, Tooltip, Typography } from "antd";
import { Helmet } from "react-helmet";
import { Typewriter } from "react-simple-typewriter";

import ContentArea from "./components/ContentArea";
import InputArea from "./components/InputArea";

import "./styles/index.css";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { roles } from "./constants";
import { getSummarizeData, postChat, summarizeWebpage } from "../services";
const { Content, Footer, Header } = Layout;
const { Text } = Typography;

const headerStyle = {
  display: "flex",
  alignItems: "center",
  color: "#fff",
  height: 50,
  backgroundColor: "#fff",
  paddingLeft: 20,
  boxShadow: "0 4px 2px -2px rgba(0, 0, 0, 0.2)",
  zIndex: 1,
};
const contentStyle = {
  textAlign: "center",
  background: "#fff",
  padding: "20px 10px",
  overflowY: "auto",
  overflowX: "hidden",
  flexGrow: 1,
  scrollbarWidth: "thin",
  scrollbarColor: "#888 #f1f1f1",
};

const footerStyle = {
  width: "100%",
  background: "#fff",
  textAlign: "center",
  padding: "1.5rem",
  boxShadow: " rgba(0, 0, 0, 0.2) 0px -1px 5px",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  zIndex: 10,
};
const loadingDiv = {
  padding: "0 0 8px 8px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
};
function SidePanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    (async () => {
      const port = chrome.runtime.connect({ name: "sidePanel" });

      port.onMessage.addListener((msg) => {
        if (msg.from === "background" && msg.subject === "textSelected") {
          setSelectedText(msg.body);
        }
      });
    })();
  }, []);

  const handleActionsSubmit = async ({ type, selectedText }) => {
    try {
      const content = selectedText;
      setGenerating(true);
      setLoading(true);
      setSelectedText("");
      setError("");
      const newMessages = [
        ...messages,
        { role: roles.USER, content: selectedText, typing: false },
      ];
      setMessages(newMessages);
      const data = await getSummarizeData({
        type: type,
        content: content,
      });

      if (data.status === "success") {
        // doing something
        setMessages([
          ...newMessages,
          { role: roles.ASSISTANT, content: data.data.content },
        ]);
      } else {
        throw new Error(data.message);
      }
      setLoading(false);
    } catch (error) {
      setGenerating(false);
      setError(error.message);
    }
  };
  const handleSummarizeWeb = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        currentWindow: true,
        active: true,
      });
      setGenerating(true);
      setLoading(true);
      setError("");
      const data = await summarizeWebpage({ url: tab.url });

      if (data.status === "success") {
        setMessages((prev) => [...prev, data.data]);
      } else {
        throw new Error(data.message);
      }
      setLoading(false);
    } catch (error) {
      setGenerating(false);
      setError(error.message);
    }
  };
  const onSubmit = async (value) => {
    try {
      if (value && value.length) {
        setGenerating(true);
        setLoading(true);
        setError("");
        const type = messages.length === 0 ? "NEW" : "";
        const newMessages = [
          ...messages,
          { role: roles.USER, content: value, typing: false },
        ];
        setMessages(newMessages);
        const data = await postChat({
          type,
          messages: newMessages.map((msg) => ({
            content: msg.content,
            role: msg.role,
          })),
        });
        setLoading(false);
        if (data.status === "success") {
          // doing something
          setMessages([...newMessages, data.data]);
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      setGenerating(false);
      setError(error.message);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setError("");
  };
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@800&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Layout style={{ height: "100vh" }}>
        <Header style={headerStyle}>
          <img
            src="images/icon-16.png"
            style={{
              width: "40px",
              height: "43px",
              margin: 0,
              cursor: "pointer",
            }}
          />
          <Divider
            type="vertical"
            style={{ height: "1.9em", margin: "0 5px" }}
          />
          <Text className="app-title" level={3}>
            <Typewriter words={["Summarizer"]} />
            <span className="dots">...</span>
          </Text>
        </Header>
        <Content style={contentStyle}>
          <ContentArea
            messages={messages}
            onSubmit={handleActionsSubmit}
            setGenerating={setGenerating}
            selectedText={selectedText}
            loading={loading}
            error={error}
          />
        </Content>
        <Footer style={footerStyle}>
          <div style={loadingDiv}>
            {generating ? (
              <>
                <div>
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: "24px", marginRight: "8px" }}
                        spin
                      />
                    }
                  />
                  <Typography.Text
                    style={{ fontSize: "12px", fontWeight: "bold" }}
                  >
                    {loading ? "AI is working" : "AI is generating"}
                  </Typography.Text>
                </div>
                {!loading ? (
                  <div>
                    <Typography.Text
                      style={{ fontSize: "8px", fontWeight: "bold" }}
                    >
                      Press
                      <Tag style={{ marginLeft: "8px" }}>Esc</Tag>
                      to Stop
                    </Typography.Text>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              <Tooltip title="New Chat">
                <Button
                  type="link"
                  style={{
                    background: "#504099",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                  }}
                  onClick={() => handleNewChat()}
                  icon={<PlusOutlined />}
                />
              </Tooltip>
            )}
          </div>

          <InputArea
            disabled={generating}
            onSubmit={onSubmit}
            handleSummarizeWeb={handleSummarizeWeb}
          />
        </Footer>
      </Layout>
    </>
  );
}
(() => {
  const container = document.createElement("div");
  if (!container) {
    throw new Error("Container not found");
  }
  document.body.appendChild(container);

  const root = createRoot(container);

  root.render(<SidePanel />);
})();
