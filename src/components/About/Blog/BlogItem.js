import React, { useState } from 'react';
import dateFormat from 'dateformat';
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import renderHTML from 'react-render-html';
import susi from '../../../images/susi-logo.svg';
import './Blog.css';
import styled, { css } from 'styled-components';
import htmlToText from 'html-to-text';
import _CardMedia from '@material-ui/core/CardMedia';
import _Card from '@material-ui/core/Card';

const allCategories = [
  'FOSSASIA',
  'GSoC',
  'SUSI.AI',
  'Tutorial',
  'Android',
  'API',
  'App generator',
  'CodeHeat',
  'Community',
  'Event',
  'Event Management',
  'loklak',
  'Meilix',
  'Open Event',
  'Phimpme',
  'Pocket Science Lab',
  'yaydoc',
];

const arrDiff = (a1, a2) => {
  let a = [],
    diff = [];
  for (let f = 0; f < a1.length; f++) {
    a[a1[f]] = true;
  }
  for (let z = 0; z < a2.length; z++) {
    if (a[a2[z]]) {
      delete a[a2[z]];
    } else {
      a[a2[z]] = true;
    }
  }
  for (let k in a) {
    diff.push(k);
  }
  return diff;
};

const LinkStyle = css`
  font-size: 0.875rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.54);
`;

const FlexBox = styled.div`
  display: flex;
  align-items: baseline;
  color: rgba(51, 51, 51, 0.7);
  line-height: 1.563rem;
  margin-right: 2rem;
`;

const BlogPostContainer = styled.div`
  padding: 1rem;
`;

const SocialButtons = styled.div`
  width: 100%;
  display: flex;
  padding: 0.625rem 0 1.25rem 0.625rem;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  * {
    margin-right: 5px;
  }
`;

const BlogFooterLink = styled.a`
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87);
  height: 1.875rem;

  &:hover {
    text-decoration: underline;
    color: rgba(51, 51, 51, 0.7);
  }
`;

const OverlayLink = styled.a`
  &&& {
    ${LinkStyle};
  }
`;

const Icon = styled.i`
  margin-right: 0rem 0.025rem;
  height: 100%;
  text-align: center;
`;

const BlogFooter = styled.div`
  padding: 3rem;
  background: #f7f7f7;
  display: flex;
  flex-wrap: wrap;
`;

const CardMedia = styled(_CardMedia)`
  height: 0;
  padding-top: 56.25%;
  height: 31.25rem;
  object-fit: contain;
  vertical-align: middle;

  @media (max-width: 1000px) {
    height: 18.75rem;
  }
`;

const Title = styled.div`
  margin: 5px 15px -15px 15px;
`;

const Card = styled(_Card)`
  position: relative;
`;

const Overlay = styled.div`
  position: relative;
  left: 0rem;
  background: rgba(0, 0, 0, 0.54);
  width: 100%;
  padding: 1rem;
  margin-top: -3.5rem;
`;

const CustomTypography = styled(Typography)`
  margin-bottom: 2rem;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.875rem;
`;

const getShortDescription = content => {
  var dummyNode = document.createElement('div'),
    resultText = '';

  dummyNode.innerHTML = content;
  resultText = dummyNode.textContent;
  resultText = resultText.split(' ', 50).join(' ') + '....';

  return resultText;
};

const BlogItem = ({ posts }) => {
  const [isExpanded, changeView] = useState(false);
  const description = htmlToText.fromString(posts.description).split('…');
  const content = posts.content;
  let category = [];
  posts.categories.forEach(cat => {
    let k = 0;
    for (k = 0; k < allCategories.length; k++) {
      if (cat === allCategories[k]) {
        category.push(cat);
      }
    }
  });

  const tags = arrDiff(category, posts.categories);
  const fCategory = category
    .map(cat => (
      <BlogFooterLink
        key={cat}
        href={
          'http://blog.fossasia.org/category/' +
          cat.replace(/\s+/g, '-').toLowerCase()
        }
        rel="noopener noreferrer"
      >
        {cat}
      </BlogFooterLink>
    ))
    .reduce((prev, curr) => [prev, ', ', curr]);
  const ftags = tags
    .map(tag => (
      <BlogFooterLink
        key={tag}
        href={
          'http://blog.fossasia.org/tag/' +
          tag.replace(/\s+/g, '-').toLowerCase()
        }
        rel="noopener noreferrer"
      >
        {tag}
      </BlogFooterLink>
    ))
    .reduce((prev, curr) => [prev, ', ', curr]);
  let htmlContent = content.replace(/<img.*?>/, '');
  htmlContent = renderHTML(htmlContent);
  let image = susi;
  const regExp = /\[(.*?)\]/;
  const imageUrl = regExp.exec(description[0]);
  if (imageUrl) {
    image = imageUrl[1];
  }
  const date = posts.pubDate.split(' ');
  const d = new Date(date[0]);

  let ShortDescription = getShortDescription(posts.content);

  return (
    <div key={posts} className="section_blog">
      <Card>
        <CardMedia image={image} />
        <Overlay>
          <OverlayLink href={posts.link}>
            {`Published on ${dateFormat(d, 'dddd, mmmm dS, yyyy')}`}
          </OverlayLink>
        </Overlay>
        <Title>
          <Typography variant="h4">{posts.title}</Typography>
          <CustomTypography variant="subtitle1">
            by
            <a
              style={{ paddingLeft: '0.3rem' }}
              href={`http://blog.fossasia.org/author/${posts.author}`}
            >
              {posts.author}
            </a>
          </CustomTypography>
        </Title>
        {isExpanded ? (
          <BlogPostContainer>
            <Typography variant="body1" gutterBottom>
              {htmlContent}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => changeView(!isExpanded)}
            >
              <Typography>Read Less &nbsp;</Typography>
              <Icon className="fa fa-chevron-up" />
            </Button>
          </BlogPostContainer>
        ) : (
          <BlogPostContainer>
            <Typography variant="body1" gutterBottom>
              {ShortDescription}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => changeView(!isExpanded)}
            >
              <Typography>Read More &nbsp;</Typography>
              <Icon className="fa fa-chevron-down" />
            </Button>
          </BlogPostContainer>
        )}
        <SocialButtons>
          <TwitterShareButton
            url={posts.guid}
            title={posts.title}
            via="asksusi"
            hashtags={posts.categories.slice(0, 4)}
          >
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
          <FacebookShareButton url={posts.link}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <LinkedinShareButton url={posts.link}>
            <LinkedinIcon size={32} round={true} />
          </LinkedinShareButton>{' '}
          <WhatsappShareButton url={posts.link}>
            <WhatsappIcon size={32} round={true} />
          </WhatsappShareButton>
          <TelegramShareButton url={posts.link}>
            <TelegramIcon size={32} round={true} />
          </TelegramShareButton>
        </SocialButtons>
        <BlogFooter>
          <FlexBox>
            <Icon className="fa fa-calendar" />
            <BlogFooterLink href={posts.link}>
              {dateFormat(d, 'mmmm dd, yyyy')}
            </BlogFooterLink>
          </FlexBox>
          <FlexBox>
            <Icon className="fa fa-user" />
            <BlogFooterLink
              rel="noopener noreferrer"
              href={'http://blog.fossasia.org/author/' + posts.author}
            >
              {posts.author}
            </BlogFooterLink>
          </FlexBox>
          <FlexBox>
            <Icon className="fa fa-folder-open-o" />
            {fCategory}
          </FlexBox>
          <FlexBox>
            <Icon className="fa fa-tags" />
            <div>{ftags}</div>
          </FlexBox>
        </BlogFooter>
      </Card>
    </div>
  );
};

BlogItem.propTypes = {
  posts: PropTypes.object,
};

export default BlogItem;
