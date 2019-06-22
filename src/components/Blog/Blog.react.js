import React, { Component } from 'react';
import PropTypes from 'prop-types';
import htmlToText from 'html-to-text';
import { connect } from 'react-redux';
import _Card from '@material-ui/core/Card';
import _CardMedia from '@material-ui/core/CardMedia';
import dateFormat from 'dateformat';
import Fab from '@material-ui/core/Fab';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderHTML from 'react-render-html';
import _Loading from 'react-loading-animation';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import { getBlogReponse } from '../../apis';
import './Blog.css';
import 'font-awesome/css/font-awesome.min.css';
import Next from '@material-ui/icons/KeyboardArrowRight';
import Previous from '@material-ui/icons/KeyboardArrowLeft';
import susi from '../../images/susi-logo.svg';
import ToTopButton from '../Button/ToTopButton.react';
import { Header } from '../shared/About';

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

const Loading = styled(_Loading)`
  margin-top: 1.25rem;
  position: relative;
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

const BlogPostContainer = styled.div`
  padding: 1rem;
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

const BlogNavigation = styled.div`
  display: none;
  justify-content: center;
  padding-top: 0.938rem;

  @media (min-width: 1400px) {
    position: absolute;
    right: 15%;
    bottom: 13.75rem;
  }

  @media (max-width: 1000px) {
    bottom: 12.5rem;
  }
`;

const SocialButtons = styled.div`
  width: 100%;
  display: flex;
  padding: 0.625rem 0 1.25rem 0.625rem;
`;

const Icon = styled.i`
  padding-right: 0.625rem;
`;

const Container = styled.div`
  width: 100%;
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

const BottomPost = styled.div`
  padding: 6.25rem 1.25rem 2.5rem 1.25rem;

  @media (max-width: 1000px) {
    width: 90%;
    margin: 0.625rem 0 auto;
  }
`;

class Blog extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    blogKey: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postRendered: false,
      startPage: 0,
      nextDisplay: 'visible',
      prevDisplay: 'hidden',
      showScrollToTop: false,
    };
  }

  componentDidMount() {
    const { blogKey } = this.props;
    document.title =
      'Blog Posts about Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots - SUSI.AI';
    scrollToTopAnimation();
    if (blogKey) {
      this.getPosts(blogKey);
    }
    /* Adding scroll event Listener to window,
    to display ToTopButton only when the user has scrolled 90px*/
    window.addEventListener('scroll', this.showScrollToTop);
  }

  componentWillReceiveProps = props => {
    const { blogKey } = props;
    const { posts } = this.state;
    if (posts.length === 0 && blogKey) {
      this.getPosts(blogKey);
    }
  };

  getPosts = blogKey => {
    getBlogReponse(blogKey)
      .then(payload => {
        if (payload.status !== 'ok') {
          throw payload.message;
        }
        this.setState({ posts: payload.items, postRendered: true });
      })
      .catch(error => {
        console.log("Couldn't fetch blog response");
      });
  };

  scrollStep = () => {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - 1000);
  };
  //  Function to scroll to top of page
  scrollToTop() {
    const intervalId = setInterval(this.scrollStep, 16.66);
    this.setState({ intervalId: intervalId });
  }
  // Function to navigate to previous page
  previousPage = () => {
    const current = this.state.startPage;
    if (current - 10 === 0) {
      this.setState({
        startPage: current - 10,
        prevDisplay: 'hidden',
        nextDisplay: 'visible',
      });
    } else {
      this.setState({
        startPage: current - 10,
        prevDisplay: 'visible',
        nextDisplay: 'visible',
      });
    }
    this.scrollToTop();
  };
  // Function to navigate to next page
  nextPage = () => {
    const current = this.state.startPage;
    const size = this.state.posts.length;
    if (current + 10 === size - 10) {
      this.setState({
        startPage: current + 10,
        nextDisplay: 'hidden',
        prevDisplay: 'visible',
      });
    } else {
      this.setState({
        startPage: current + 10,
        prevDisplay: 'visible',
        nextDisplay: 'visible',
      });
    }
    this.scrollToTop();
  };

  showScrollToTop = () => {
    this.setState({
      showScrollToTop: window.scrollY >= 90,
    });
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.showScrollToTop);
  }

  render() {
    const nextStyle = {
      visibility: this.state.nextDisplay,
      marginLeft: '0.625rem',
    };

    const prevStyle = {
      visibility: this.state.prevDisplay,
    };

    const { showScrollToTop } = this.state;

    return (
      <div>
        <Header title="Blog" subtitle="Latest Blog Posts on SUSI.AI" />
        <Loading isLoading={!this.state.postRendered} />
        {!this.state.postRendered && (
          <div>
            <center>Fetching Blogs..</center>
          </div>
        )}
        {this.state.postRendered && (
          <div>
            <Container>
              {this.state.posts
                .slice(this.state.startPage, this.state.startPage + 10)
                .map((posts, i) => {
                  const description = htmlToText
                    .fromString(posts.description)
                    .split('…');
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
                  return (
                    <div key={posts} className="section_blog">
                      <Card>
                        <CardMedia image={image} />
                        <Overlay>
                          <OverlayLink href={posts.link}>
                            {`Published on ${dateFormat(
                              d,
                              'dddd, mmmm dS, yyyy',
                            )}`}
                          </OverlayLink>
                        </Overlay>
                        <BlogPostContainer>
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
                          <Typography variant="body1" gutterBottom>
                            {htmlContent}
                          </Typography>
                        </BlogPostContainer>
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
                              href={
                                'http://blog.fossasia.org/author/' +
                                posts.author
                              }
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
                })}
            </Container>
            <BlogNavigation>
              <Fab
                style={prevStyle}
                onClick={this.previousPage}
                color="primary"
              >
                <Previous />
              </Fab>
              <Fab style={nextStyle} onClick={this.nextPage} color="primary">
                <Next />
              </Fab>
            </BlogNavigation>
            <BottomPost />
          </div>
        )}
        <div style={{ display: showScrollToTop ? 'inline-block' : 'none' }}>
          <ToTopButton />
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  const { blogKey } = store.app.apiKeys;
  return {
    blogKey,
  };
}

export default connect(
  mapStateToProps,
  null,
)(Blog);
