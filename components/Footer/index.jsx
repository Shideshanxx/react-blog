import React, { useEffect, useState } from "react";
import Link from "next/link";
import ifBottom from './ifBottom'
import "./style.less";

const toolsData = [
  {
    id: 3,
    name: "VsCode",
    describe: "我们现在主要开发工具，懂的都懂！",
    iocn: "http://cdn.zjutshideshan.cn/blog/vscode-1.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/vscode.png",
    bgColor: "#2C2C32",
    link: "https://code.visualstudio.com/",
  },
  {
    id: 9,
    name: "nextJs",
    describe: "目前网站主要前端框架 React和NextJS！",
    iocn: "http://cdn.zjutshideshan.cn/blog/next-1.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/next.png",
    bgColor: "#fff",
    link: "https://www.nextjs.cn/",
  },
  {
    id: 1,
    name: "PS",
    describe: "对，我就是在用ps，你打我呀！",
    iocn: "http://cdn.zjutshideshan.cn/blog/ps-1.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/ps.png",
    bgColor: "#38c8fe",
    link: "https://www.adobe.com/cn/products/photoshop.html",
  },
  {
    id: 4,
    name: "Ant Design",
    describe: "我们网站大量使用的UI库，Antd yyds！🙏",
    iocn: "http://cdn.zjutshideshan.cn/blog/antd-1.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/antd.png",
    bgColor: "#1890ff",
    link: "https://ant.design/index-cn",
  },
  {
    id: 5,
    name: "哔哩哔哩",
    describe: "我们文章中的所有视频都放在了B站！",
    iocn: "http://cdn.zjutshideshan.cn/blog/bilibili-1.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/bilibili.png",
    bgColor: "#fb7299",
    link: "https://www.bilibili.com/",
  },
  {
    id: 6,
    name: "网易云音乐",
    describe: "没错，左下角播放器的数据源来自网易云音乐！",
    iocn: "http://cdn.zjutshideshan.cn/blog/wyyyy-1.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/wyyyy.png",
    bgColor: "#fff",
    link: "https://music.163.com/",
  },
  {
    id: 2,
    name: "Github",
    describe: "你能看到的，我们都开源在Github上了！",
    iocn: "http://cdn.zjutshideshan.cn/blog/github.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/github-1.png",
    bgColor: "#000",
    link: "https://github.com/",
  },
  {
    id: 7,
    name: "码云",
    describe: "没有梯子，我们项目管理用的是码云，不是GitHub。",
    iocn: "http://cdn.zjutshideshan.cn/blog/mayun-1.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/mayun.png",
    bgColor: "#40485b",
    link: "https://gitee.com/",
  },
  {
    id: 8,
    name: "稿定设计",
    describe: "我们网站几乎所有作图都是出自稿定设计，稿定打钱！",
    iocn: "http://cdn.zjutshideshan.cn/blog/gaoding-1.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/gaoding.png",
    bgColor: "#3260f4",
    link: "https://gaoding.com/",
  },
  {
    id: 10,
    name: "和风天气",
    describe: "白嫖的天气数据，真香！感谢和风天气！🙏",
    iocn: "http://cdn.zjutshideshan.cn/blog/hftq.png",
    hoverIcon: "http://cdn.zjutshideshan.cn/blog/hftq.png",
    bgColor: "#fff",
    link: "https://www.qweather.com/",
  },
];

const Footer = () => {
  const [active, setActive] = useState(null);
  const [hide,setHide] = useState(true)
  const onMouseEnter = (id) => {
    setActive(id);
  };

  const listenScroll = () => {
    if (ifBottom.ifBottom()) {
      // 到底了
      setHide(false)
    } else {
      // 没到底
      setHide(true)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', listenScroll)
    return () => {
      window.removeEventListener('scroll', listenScroll)
    }
  },[])
  
  const onMouseLeave = () => {
    setActive(null);
  };
  return (
    <>
      <footer className="footer" style={{display: hide?"none":"block"}}>
        <div className="wrap" style={{ display: "flex", justifyContent: 'space-around'}}>
          <div className="footer-box">
            <div className="left-logo">
                <Link href="/">
                  <a>
                    <img className="logo" src="http://cdn.zjutshideshan.cn/blog/logo1.png"></img>
                  </a>
                </Link>
            </div>

            <div className="right-memu">
              <div>
                Copyright © 2021
                <Link href="/about">
                  <a>Asunarail</a>
                </Link>
              </div>
              <div>
                <a
                  className="beian-a"
                  target="_blank"
                  href="https://beian.miit.gov.cn/#/Integrated/index"
                >
                  鄂ICP备19016383号-1
                </a>
              </div>
            </div>
          </div>

          <div className="tools-box">
            <div className="inner">
              <div className="tool-list">
                {toolsData.map((item) => (
                  <a
                    href={item.link}
                    target="_blank"
                    className="tool-item tool-notion1"
                    data-color="red"
                    onMouseEnter={() => onMouseEnter(item.id)}
                    onMouseLeave={onMouseLeave}
                    key={item.id}
                    style={{
                      backgroundColor: `${
                        active === item.id ? item.bgColor : ""
                      }`,
                    }}
                  >
                    <i
                      className="tool-icon"
                      style={{
                        backgroundImage: `url(${
                          active === item.id ? item.hoverIcon : item.iocn
                        })`,
                      }}
                    />
                    <div className="tool-desc">
                      <div className="hide-desc" />
                      <div
                        className="inner"
                        style={item.bgColor === "#fff" ? { color: "#333" } : null}
                      >
                        <p className="name">{item.name}</p>
                        <p className="describe">{item.describe}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="xs-menu" id="xs-menu" style={{textAlign: 'center', fontSize: '12px'}}>
        <div>Copyright © 2021 Asunarail</div>
        <a
          className="beian-a"
          target="_blank"
          href="https://beian.miit.gov.cn/#/Integrated/index"
        >
          鄂ICP备19016383号-1
        </a>
      </div>
    </>
  )
}

export default Footer;