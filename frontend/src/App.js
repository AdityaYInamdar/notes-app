import React from "react";
import { Layout } from "antd";
import Notes from "./Notes";
import "./App.css";

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header className="header">
        <img
          style={{
            width: "5rem",
            height: "4rem",
            fontSize: "16px",
            marginRight: "10px",
          }}
          src="pi-labs-logo-transparent.png"
          alt="Logo"
          className="logo"
        />
        <h1 className="header-title">Notes App</h1>
      </Header>
      <Content className="content">
        <Notes />
      </Content>
    </Layout>
  );
}

export default App;
