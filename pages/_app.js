/**
 * 入口页
 */

import App from "next/app";
import React from "react";
import "antd/dist/antd.css";
import "@/public/style/global.less";
import { memorial } from "@/public/utils/utils";
import { Provider } from "react-redux";
import store from "@/store";
import NProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";
import Layout from "@/components/Layout";
import request from "@/public/utils/request";
import serviceApi from "@/config/service";
import { isLogin } from "@/public/utils/utils";

//声明一个MyApp组件，然后这个组件用Provider进行包裹 react-redux。
export default class MyApp extends App {
  state = {};

  componentDidMount() {
    // 公祭日置灰
    memorial();

    // 轮询消息 头一次查的比较快，后面为一分钟查询一次
    setTimeout(() => {
      this.getMsg();
    }, 2000);

    setInterval(() => {
      this.getMsg();
    }, 60000);
  }

  getMsg = () => {
    if (isLogin()) {
      request(serviceApi.getMsg).then((res) => {
        // 存入react-redux
        store.dispatch({
          type: "changeMsg",
          payload: res && res.data,
        });
      });
    }
  };

  render() {
    // props中的Component和pageProps是nextjs定义的
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <Layout>
          {/* 展示子组件 */}
          <Component {...pageProps} />
        </Layout>
      </Provider>
    );
  }
}

Router.events.on("routeChangeStart", (...args) => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", (...args) => {
  NProgress.done();
});

Router.events.on("routeChangeError", (...args) => {
  NProgress.done();
});
