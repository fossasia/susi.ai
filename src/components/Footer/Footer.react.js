import React from 'react';
import susi from '../../images/susi-logo.svg';
import './Footer.css';
import { Link } from 'react-router-dom';
import urls from '../../utils/urls';

const Footer = () => {
  // Footer Component
  return (
    <div className="footer-wrapper">
      <div className="footer">
        <div className="footer-container">
          <Link to="/">
            <img src={susi} alt="SUSI" className="susi-logo" />
          </Link>
          <ul className="alignLeft">
            <li>
              <Link to="/overview">Overview</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <a href={urls.API_URL}>API</a>
            </li>
            <li>
              <a href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi">
                Code
              </a>
            </li>
          </ul>
          <ul className="alignRight">
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
