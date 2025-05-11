import React from 'react';
import { Divider, Button } from 'antd';
import './Footer.css';

const recommendItems = [
  { name: '开源指南', href: 'https://zh-hans.react.dev/' },
  { name: '网上导航', href: 'www.baidu.com' },
  { name: '我的朋友', href: '/friends' },
  { name: '留点什么', href: '/leave' },
  { name: '关于作者', href: '/profile' },
  { name: '文章归档', href: '/archive' },
  { name: '文章分类', href: '/categories' },
  { name: '文章标签', href: '/tags' },
];

const Footer = () => {
  return (
    <div className="stellar-footer">
      {/* 左右布局容器 */}
      <div className="footer-content">
        {/* 左侧格言部分 */}
        <div className="footer-quote">
          <h2>格言</h2>
          <p className="quote-content">
            再看看那个光点，它就在这里。这是家园，这是我们——你所要的每一个人。
            你认识的每一个人，你听说过的每一个人都是经过的每一个人，都在路上画度过他们的一生。
          </p>
          <Button href="https://stellarium.org/" className="stellar-button">
            点击开启星辰之旅
          </Button>
        </div>

        {/* 右侧猜你想看部分 */}
        <div className="footer-recommend">
          <h3>猜你想看</h3>
          <ul className="recommend-grid">
            {recommendItems.map((item, index) => (
              <li key={index} className="recommend-item">
                <a href={item.href} className="recommend-link">{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Divider className="footer-divider" />

      {/* 页脚信息 */}
      <div className="footer-meta">
        <div className="copyright">
          ©2025/4/20 By MiKiWei
        </div>

        <div className="traveler-info">
          旅行者 1 号当前距离地球 24,886,188,016 千米，约为 166.351524 个天文单位
        </div>
      </div>
    </div>
  );
};

export default Footer;