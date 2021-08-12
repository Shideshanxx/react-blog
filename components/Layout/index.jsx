import React, { Component } from "react";
import Head from "next/head";
import Header from "../Header";
import Footer from "../Footer";
import Side from "../Side";
// import dynamic from "next/dynamic";
import { connect } from "react-redux";
// const Aplayer = dynamic(import("../Aplayer"), { ssr: false });
import "./style.less";

const Layout = (props) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=device-dpi"
        />
      </Head>

      <div id="box">
        <Header />
        <div id="content" className="wrap">
          {props.children}
          <Side />
          {/* id 是歌单的id */}
          {/* <Aplayer
            // id={
            //   props.userInfo && props.userInfo.songsId
            //     ? props.userInfo.songsId
            //     : 6654107223
            // }
            id={6654107223}
          /> */}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default connect(({ userInfo }) => ({ userInfo }))(Layout);
