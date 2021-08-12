/**
 * 文章详情
 */
import React, { useState, useEffect } from 'react';
import Head from '@/components/Head'
import { Row, Col, Popover, Card, Avatar, Affix, Badge, Divider, Typography, message } from 'antd'
import classnames from 'classnames';
import { connect } from 'react-redux'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import Link from 'next/link'
import moment from 'moment'
import Cookies from 'js-cookie'
import { isLogin } from '@/public/utils/utils'
import Reward from "@/components/Reward"
import LazyImg from '@/components/LazyImg'
import Comment from '@/components/Comment'
import { PhotoSlider } from 'react-photo-view'
import Vditor from 'vditor'
import Router from 'next/router'
import {
  ProfileOutlined,
  QqOutlined,
  WeiboOutlined,
  LikeOutlined,
  ShareAltOutlined
} from '@ant-design/icons'
import './style.less'
import 'vditor/dist/index.css'
import 'react-photo-view/dist/index.css'

// 设置中文
moment.locale('zh-cn')

const { Title } = Typography

const Detail = (props) => {
  const [info, setInfo] = useState(props.articleInfo)
  const [likeCount, setLikeCount] = useState(props.articleInfo.count)
  const [likeState, setLikeState] = useState(false)  // 按赞状态
  const [locationUrl, setLocationUrl] = useState('') // 文章链接

  const [visible, setVisible] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [photoImages, setPhotoImages] = useState([])
  if(process.browser) {
    window.setVisible = setVisible
    window.setPhotoIndex = setPhotoIndex;
  }

  let markdown = info ? info.content : '没有数据~'

  useEffect(() => {
    console.log(info)
    // 将当前文章存入redux
    props.currentArticleInfoChange(info)
    setLocationUrl(location.url) // 获取当前url
    // 获取文章点赞
    if(isLogin()) {
      // 点赞状态
      getLikestatus(info.id)
    }

    // 设置markdown预览
    if (process.browser) {
      const previewElement = document.getElementById('preview')  // 内容
      const outlineElement = document.getElementById('outline')  // 目录

      // 大纲
      const initOutline = () => {
        const headingElements = []
        Array.from(previewElement.children).forEach(item => {
          if (item.tagName.length === 2 && item.tagName !== 'HR' && item.tagName.indexOf('H') === 0) {
            // 将h1、h2这种标题放入目录中
            headingElements.push(item)
          }
        })

        // 给目录初始化样式并添加title
        document.querySelector('#outline ul li > span').classList.add('vditor-outline__item--current')

        const arrayList = Array.from(document.querySelectorAll('#outline ul li > span'))
        // 设置title
        for(let i=0;i<arrayList.length;i++) {
          arrayList[i].setAttribute("title",arrayList[i].innerText)
        }

        let toc = []
        window.addEventListener('scroll', () => {
          const scrollTop = window.scrollY
          toc = []
          headingElements.forEach((item) => {
            toc.push({
              id: item.id,
              offsetTop: item.offsetTop
            })
          })
          let flag = 0
          if(toc.length!==0 && flag === 0) {
            flag++
            let flagHeigth = toc[toc.length-1].offsetTop*2
            let lastChildpro = {id: '尾部添加高度',offsetTop: flagHeigth}  // 尾部添加高度防止底部标签无法选取
            toc.push(lastChildpro)
          }

          const currentElement = document.querySelector('.vditor-outline__item--current')
          // 遍历toc
          for(let i=0,imax=toc.length;i<imax;i++) {
            if(scrollTop < toc[i].offsetTop - 30) {
              if(currentElement) {
                currentElement.classList.remove('vditor-outline__item--current')
              }
              let index = i > 0 ? i-1 : 0
              document.querySelector('span[data-target-id="' + toc[index].id + '"]')&&document.querySelector('span[data-target-id="' + toc[index].id + '"]').classList.add('vditor-outline__item--current')
              break
            }
          }
        })
      }

      Vditor.preview(previewElement, markdown, {
        speech: {
          enable: true, // 选中语言朗读
        },
        hljs: {
          lineNumber: true,
          style: "native",
        },
        anchor: 2, // // 为标题添加锚点 0：不渲染；1：渲染于标题前；2：渲染于标题后，默认 0
        lazyLoadImage: "//cdn.zjutshideshan.cn/blog_image/loading.gif?imageslim", // 懒加载
        after: async () => {
          // 大纲
          Vditor.outlineRender(previewElement, outlineElement)
          if (outlineElement.innerText.trim() !== '') {
            outlineElement.style.display = 'block'
            initOutline()
          }
          // 图片预览
          let imagesArr = []; // 预览图片的数组
          const imgs = previewElement.getElementsByTagName("img")

          for (let index = 0; index < imgs.length; index++) {
            imagesArr.push(imgs[index].getAttribute("data-src"))
            imgs[index].setAttribute("data-index", index)
            imgs[index].style.height = 'auto'

            imgs[index].onclick = () => {
              setVisible(true);
              setPhotoIndex(index)
            };
          }

          setPhotoImages(imagesArr); // 加载完成设置预览数组

          Vditor.codeRender(previewElement)
        },
      })
    }

    // 浏览量规则 
    // 1. 存cookie, 过期时间30分钟。 key为 文章id 唯一
    // 2. 检查cookie有没有 没有加一，有则不作处理
    if (!Cookies.get(info.id)) {
      request(serviceApi.readingVolume, {
        method: 'get',
        params: {
          id: info.id
        }
      }).then((res) => {
        if (res.code == 200) {
          Cookies.set(info.id, '123', { expires: new Date(new Date().getTime() + (60 * 60 * 1000) / 2) });
        }
      })
    }
  }, [])

  /**
   * 手动点赞
   * @param {*} id 
   */
  const clickLike = () => {
    if(!isLogin()) {
      message.warning('请先登录哦！')
      return false
    }
    request(serviceApi.articleClickLike, {
      method: 'get',
      params: {
        id: info.id
      }
    }).then((res) => {
      if(res && res.code===200) {
        getLikestatus(info.id)
        message.success(res.msg)
      }
    })
  }

  /**
   * 获取文章点赞数量及状态
   * @param {*} id 
   */
  const getLikestatus = (id) => {
    request(serviceApi.getLikeStatus, {
      method: 'get',
      params: {
        id
      }
    }).then((res) => {
      if(res && res.code === 200) {
        setLikeCount(res.data.count)
        if(res.data.status === '1') {
          setLikeState(true)
        } else {
          setLikeState(false)
        }   
      }
    })
  }

  return (
    <>
      <Head>
        <title>{info.title}-Asunarail_Blog</title>
      </Head>

      <div className="detail-box">
        {/* 封面 */}
        <div className="cover-box">
          <div className="b-cover">
            <LazyImg background={true} params="?imageslim" src={info?.cover} />
          </div>
          <div className="s-cover">
            <LazyImg background={true} params="?imageslim" src={info?.cover} />
          </div>
        </div>

        {/* 标题、avatar、发布时间、阅读量、点赞数 */}
        <div className="info">
          <Title>{info.title}</Title>
          <div className="user-nav">
            <Link href="/userCenter/[id]" as={`/userCenter/${info.userId}`}>
              <div style={{display: 'flex', alignItems:'center', cursor:'pointer'}}>
                <Avatar shape="square" src={info.avatar} style={{ marginRight:10 }} />
                {info.userName}
              </div>
            </Link>

            <Divider type="vertical" />
            {moment(info.createTime).startOf('hour').fromNow()} <Divider type="vertical" />
              阅读 {info.viewCount} 
            <Divider type="vertical" />
              点赞 {likeCount}
          </div>
        </div>

        <Divider />

        <Row type="flex" justify="center" id="content-box">
          {/* 点赞与分享 */}
          <Col lg={1} xl={1} className="left-side">
            <Affix offsetTop={120}>
              <Card bodyStyle={{padding:0}} title={null} bordered={false} className="left-card">
                <a onClick={clickLike} className={classnames({ "active": likeState })}>
                  <Badge count={likeCount}>
                    <Avatar shape="square" size={28} icon={<LikeOutlined />} style={likeState ? {backgroundColor: '#ffc7ba'} : null} className={classnames('contact-icon')} />
                  </Badge>
                </a>

                <Popover placement="right" title="分享到" content={(
                  <>
                    {/* 分享到QQ */}
                    <a href={`http://connect.qq.com/widget/shareqq/index.html?url=http://blog.zjutshideshan.cn${Router.router && Router.router.asPath}&sharesource=qzone&title=${info.title}&pics=${info.cover}&summary=${info.introduce}&desc=${info.title}`} target="_blank" style={{ marginRight: 10 }}>
                      <Avatar shape="square" size={28} icon={<QqOutlined />} style={{ backgroundColor: '#25c5fd' }} className={classnames("contact-icon")} title="分享到QQ" />
                    </a>
                    {/* 分享到微博 */}
                    <a href={`http://service.weibo.com/share/share.php?url=http://blog.zjutshideshan.cn${Router.router && Router.router.asPath}?sharesource=weibo&title=${info.title}&pic=${info.cover}&appkey=2706825840`} target="_blank" style={{ marginRight: 10 }}>
                      <Avatar shape="square" size={28} icon={<WeiboOutlined />} style={{ backgroundColor: '#f9752f' }} className={classnames("contact-icon")} title="分享到微博" />
                    </a>
                  </>
                )}>
                  <Avatar shape="square" size={28} icon={<ShareAltOutlined />} className={classnames("contact-icon share")}></Avatar>
                </Popover>
              </Card>
            </Affix>
          </Col>

          {/* 文章内容与评论 */}
          <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            <div className="content-box">
              <div className="detailed-content">
                {/* markdown渲染在该元素，通过id获取元素 */}
                <div id="preview"></div>
                
                {/* 打赏 */}
                <Reward userId={info && info.userId ? info.userId : null} />
              </div>
              
              {/* 评论 */}
              <Comment props={{auid:info.userId}} />
            </div>
          </Col>

          {/* 目录 */}
          <Col xs={0} sm={0} md={0} lg={5} xl={5} style={{paddingRight: 10}}>
            <Affix offsetTop={120}>
              <div className="detailed-nav comm-box">
                <div className="nav-title">
                  <ProfileOutlined type="read" style={{marginRight: 10}} /> 目录
                </div>
                {/* 目录渲染在该元素，通过id获取元素 */}
                <div className="toc-list" style={{maxHeight:500,overflowY:"auto"}} id="outline"></div>
              </div>
            </Affix>
          </Col>
        </Row>
      </div>

      <PhotoSlider
        images={photoImages.map(item=>({src:item}))}
        visible={visible}
        onClose={() => setVisible(false)}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  const promise = new Promise((resolve) => {
    request(serviceApi.getArticleInfo, {
      method: 'get',
      params: {id: context.query.id}
    }).then((res) => {
      resolve(res.data)
    })
  })

  let articleInfo = await promise

  return {props: {articleInfo}}
}

const dispatchToProps = (dispatch) => {
  return {
    currentArticleInfoChange(obj) {
      let action = {
        type: 'changeCurrentArticleInfo',
        payload: obj
      }
      dispatch(action)
    }
  }
}

export default connect(null, dispatchToProps)(Detail)
