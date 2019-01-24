import React from 'react';
import susi from '../../images/susi-logo.svg';
import './Footer.css';
import { Link } from 'react-router-dom';
import urls from '../../utils/urls';

const Footer = () => {
  // Footer Component
  return (
    <div className="footer-wrap">
      <div className="footer-container">
        <Link className="susi-logo-container" to="/">
          <img src={susi} alt="SUSI" className="susi-logo-footer" />
        </Link>
        <div className="footer-content">
          <div className="footer-left">
            <ul>
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
          </div>
          <ul>
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
