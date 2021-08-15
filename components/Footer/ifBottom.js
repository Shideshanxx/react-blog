// class Scroll {
//   // 滚动条在Y轴上的滚动距离
//   static getScrollTop() {
//     var scrollTop = 0,
//       bodyScrollTop = 0,
//       documentScrollTop = 0;
//     if (document.body) {
//       bodyScrollTop = document.body.scrollTop;
//     }
//     if (document.documentElement) {
//       documentScrollTop = document.documentElement.scrollTop;
//     }
//     scrollTop =
//       bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
//     return scrollTop;
//   }

//   // 文档的总高度
//   static getScrollHeight() {
//     var scrollHeight = 0,
//       bodyScrollHeight = 0,
//       documentScrollHeight = 0;
//     if (document.body) {
//       bodyScrollHeight = document.body.scrollHeight;
//     }
//     if (document.documentElement) {
//       documentScrollHeight = document.documentElement.scrollHeight;
//     }
//     scrollHeight =
//       bodyScrollHeight - documentScrollHeight > 0
//         ? bodyScrollHeight
//         : documentScrollHeight;
//     return scrollHeight;
//   }

//   // 浏览器视口的高度
//   static getWindowHeight() {
//     var windowHeight = 0;
//     if (document.compatMode == "CSS1Compat") {
//       windowHeight = document.documentElement.clientHeight;
//     } else {
//       windowHeight = document.body.clientHeight;
//     }
//     return windowHeight;
//   }

//   // 距离底部 px 距离返回 true
//   static ifBottom(px = 0) {
//     if (
//       Scroll.getScrollTop() + Scroll.getWindowHeight() + px >=
//       Scroll.getScrollHeight()
//     ) {
//       return true;
//     }
//     return false;
//   }
// }

// export default Scroll;

export function ifBottom() {
  window.onscroll = function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
      return true
    } else {
      return false
    }
  };
} 

