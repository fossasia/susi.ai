import React from 'react';
import _Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import _Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';
import styled, { css } from 'styled-components';
import Fade from '@material-ui/core/Fade';
import './Blog.css';
import dateFormat from 'dateformat';
import htmlToText from 'html-to-text';
import renderHTML from 'react-render-html';
import susi from '../../../images/susi-logo.svg';
import PropTypes from 'prop-types';

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

const Overlay = styled.div`
  position: relative;
  left: 0rem;
  background: rgba(0, 0, 0, 0.54);
  width: 100%;
  padding: 1rem;
  margin-top: -3.5rem;
`;

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
const Card = styled(_Card)`
  position: relative;
`;

const CustomTypography = styled(_Typography)`
  margin-bottom: 2rem;
  color: rgba(0, 0, 0, 0.54);
`;

const Typography = styled(_Typography)`
  font-family: 'Raleway';
`;

const OverlayLink = styled.a`
  font-family: 'Raleway';
  &&& {
    ${LinkStyle};
  }
`;

const BlogPostContainer = styled.div`
  padding: 1rem;
`;

const Icon = styled.i`
  margin-left: 0.5rem;
  padding-right: 0.625rem;
`;

const BlogFooter = styled.div`
  padding: 3rem;
  background: #f7f7f7;
  display: flex;
  flex-wrap: wrap;
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

const SocialButtons = styled.div`
  width: 100%;
  display: flex;
  padding: 0.625rem 0 1.25rem 0.625rem;
`;

class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedElements: [],
    };
    this.expandedElements = [];
    this.post = this.props.posts;
  }

  render() {
    const description = htmlToText.fromString(this.post.description).split('…');
    const content = this.post.content;
    let category = [];
    this.post.categories.forEach(cat => {
      let k = 0;
      for (k = 0; k < allCategories.length; k++) {
        if (cat === allCategories[k]) {
          category.push(cat);
        }
      }
    });

    const tags = arrDiff(category, this.post.categories);
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

    var dummyNode = document.createElement('div'),
      resultText = '';

    dummyNode.innerHTML = content;
    resultText = dummyNode.textContent;
    resultText = resultText.split(' ', 50).join(' ') + '....';

    let image = susi;
    const regExp = /\[(.*?)\]/;
    const imageUrl = regExp.exec(description[0]);
    if (imageUrl) {
      image = imageUrl[1];
    }
    const date = this.post.pubDate.split(' ');
    const d = new Date(date[0]);

    return (
      <Card>
        <CardContent>
          <Typography
            component={'span'}
            variant="h4"
            align="justify"
            className="blogTitle"
          >
            {this.post.title}
          </Typography>
          <CustomTypography variant="subtitle1">
            by
            <a
              style={{ paddingLeft: '0.3rem' }}
              href={`http://blog.fossasia.org/author/${this.post.author}`}
            >
              {this.post.author}
            </a>
          </CustomTypography>
        </CardContent>
        <CardMedia
          image={image}
          style={{
            height: '20rem',
            margin: '0 auto',
          }}
        />
        <Overlay>
          <OverlayLink href={this.post.link}>
            {`Published on ${dateFormat(d, 'dddd, mmmm dS, yyyy')}`}
          </OverlayLink>
        </Overlay>
        {this.props.expandedElements.includes(this.props.index) ? (
          <Fade in={true} timeout={1100}>
            <BlogPostContainer>
              <Typography component={'span'} variant="body1" gutterBottom>
                {
                  <Typography component={'span'} variant="body1" gutterBottom>
                    {htmlContent}
                  </Typography>
                }
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.props.handleClickRemove(this.props.index);
                }}
              >
                <Typography>Read Less</Typography>
                <Icon className="fa fa-chevron-up" />
              </Button>
            </BlogPostContainer>
          </Fade>
        ) : (
          <BlogPostContainer>
            <Typography variant="body1" component={'span'} gutterBottom>
              {
                <Typography variant="body1" gutterBottom>
                  {resultText}
                </Typography>
              }
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.props.handleClick(this.props.index);
              }}
            >
              <Typography>Read More</Typography>
              <Icon className="fa fa-chevron-down" />
            </Button>
          </BlogPostContainer>
        )}

        <SocialButtons>
          <TwitterShareButton
            style={{ margin: '0px 5px' }}
            url={this.post.guid}
            title={this.post.title}
            via="asksusi"
            hashtags={this.post.categories.slice(0, 4)}
          >
            <TwitterIcon size={48} round={true} />
          </TwitterShareButton>
          <FacebookShareButton
            url={this.post.link}
            style={{ margin: '0px 5px' }}
          >
            <FacebookIcon size={48} round={true} />
          </FacebookShareButton>
        </SocialButtons>
        <BlogFooter style={{ fontFamily: 'Raleway' }}>
          <FlexBox>
            <Icon className="fa fa-calendar" />
            <BlogFooterLink href={this.post.link}>
              {dateFormat(d, 'mmmm dd, yyyy')}
            </BlogFooterLink>
          </FlexBox>
          <FlexBox>
            <Icon className="fa fa-user" />
            <BlogFooterLink
              rel="noopener noreferrer"
              href={'http://blog.fossasia.org/author/' + this.post.author}
            >
              {this.post.author}
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
    );
  }
}

BlogPost.propTypes = {
  index: PropTypes.number,
  posts: PropTypes.object,
  handleClick: PropTypes.func,
  handleClickRemove: PropTypes.func,
  expandedElements: PropTypes.array,
};
export default BlogPost;
