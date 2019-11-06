import React, { Component } from 'react';
import PropTypes from 'prop-types';
import htmlToText from 'html-to-text';
import { connect } from 'react-redux';
import _Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import dateFormat from 'dateformat';
import Fab from '@material-ui/core/Fab';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';
import styled, { css } from 'styled-components';
import _Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import renderHTML from 'react-render-html';
import _Loading from 'react-loading-animation';
import { getBlogReponse } from '../../../apis';
import './Blog.css';
import 'font-awesome/css/font-awesome.min.css';
import Next from '@material-ui/icons/KeyboardArrowRight';
import Previous from '@material-ui/icons/KeyboardArrowLeft';
import susi from '../../../images/susi-logo.svg';
import { Header } from '../../shared/About';
import ScrollTopButton from '../../shared/ScrollTopButton';
import Fade from '@material-ui/core/Fade';
import SearchBar from 'material-ui-search-bar';

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

const CustomTypography = styled(_Typography)`
  margin-bottom: 2rem;
  color: rgba(0, 0, 0, 0.54);
`;

const Typography = styled(_Typography)`
  font-family: 'Raleway';
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
  margin-left: 0.5rem;
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
  font-family: 'Raleway';
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
      expandedElements: [],
    };
    this.expandedElements = [];
  }

  componentDidMount() {
    const { blogKey } = this.props;
    document.title =
      'Blog Posts about Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots - SUSI.AI';
    if (blogKey) {
      this.getPosts(blogKey);
    }
  }

  componentWillReceiveProps = props => {
    const { blogKey } = props;
    const { posts } = this.state;
    if (posts.length === 0 && blogKey) {
      this.getPosts(blogKey);
    }
  };

  getPosts = async blogKey => {
    let payload = await getBlogReponse(blogKey);

    try {
      if (payload.status !== 'ok') {
        throw payload.message;
      }
      this.setState({
        posts: payload.items,
        postRendered: true,
      });
    } catch (err) {
      console.log("Couldn't fetch blog response");
    }
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

  handleClick = index => e => {
    this.expandedElements.push(index);
    this.setState({
      expandedElements: this.expandedElements,
    });
  };

  handleClickRemove = index => e => {
    this.expandedElements.splice(this.expandedElements.indexOf(index), 1);
    this.setState({
      expandedElements: this.expandedElements,
    });
  };

  handleSearch = value => {
    var list = document.getElementsByClassName('section_blog');
    for (let i = 0; i < list.length; i++) {
      if (
        list[i].textContent.toLowerCase().indexOf(value.toLowerCase()) != -1
      ) {
        list[i].style.display = 'block';
      } else {
        list[i].style.display = 'none';
      }
    }
  };

  render() {
    const nextStyle = {
      visibility: this.state.nextDisplay,
      marginLeft: '0.625rem',
    };

    const prevStyle = {
      visibility: this.state.prevDisplay,
    };

    const { search } = this.state;
    return (
      <div>
        <Header title="Blog" subtitle="Latest Blog Posts on SUSI.AI" />
        <SearchBar
          value={search}
          onChange={value => this.handleSearch(value)}
          onRequestSearch={() => console.log('onRequestSearch')}
          style={{
            margin: '0 auto',
            maxWidth: 800,
            height: '4rem',
            marginTop: '2rem',
          }}
        />
        <Loading
          style={{ marginTop: '2rem' }}
          isLoading={!this.state.postRendered}
        />
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
                  const date = posts.pubDate.split(' ');
                  const d = new Date(date[0]);
                  return (
                    <div key={i} className="section_blog">
                      <Card>
                        <CardContent>
                          <Typography
                            component={'span'}
                            variant="h4"
                            align="justify"
                            className="blogTitle"
                          >
                            {posts.title}
                          </Typography>
                          <CustomTypography variant="subtitle1">
                            by
                            <a
                              style={{ paddingLeft: '0.3rem' }}
                              href={`http://blog.fossasia.org/author/${posts.author}`}
                            >
                              {posts.author}
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
                          <OverlayLink href={posts.link}>
                            {`Published on ${dateFormat(
                              d,
                              'dddd, mmmm dS, yyyy',
                            )}`}
                          </OverlayLink>
                        </Overlay>
                        {this.state.expandedElements.includes(i) ? (
                          <Fade in={true} timeout={1100}>
                            <BlogPostContainer>
                              <Typography
                                component={'span'}
                                variant="body1"
                                gutterBottom
                              >
                                {
                                  <Typography
                                    component={'span'}
                                    variant="body1"
                                    gutterBottom
                                  >
                                    {htmlContent}
                                  </Typography>
                                }
                              </Typography>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleClickRemove(i)}
                              >
                                <Typography>Read Less</Typography>
                                <Icon className="fa fa-chevron-up" />
                              </Button>
                            </BlogPostContainer>
                          </Fade>
                        ) : (
                          <BlogPostContainer>
                            <Typography
                              variant="body1"
                              component={'span'}
                              gutterBottom
                            >
                              {
                                <Typography variant="body1" gutterBottom>
                                  {resultText}
                                </Typography>
                              }
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={this.handleClick(i)}
                            >
                              <Typography>Read More</Typography>
                              <Icon className="fa fa-chevron-down" />
                            </Button>
                          </BlogPostContainer>
                        )}

                        <SocialButtons>
                          <TwitterShareButton
                            style={{ margin: '0px 5px' }}
                            url={posts.guid}
                            title={posts.title}
                            via="asksusi"
                            hashtags={posts.categories.slice(0, 4)}
                          >
                            <TwitterIcon size={48} round={true} />
                          </TwitterShareButton>
                          <FacebookShareButton
                            url={posts.link}
                            style={{ margin: '0px 5px' }}
                          >
                            <FacebookIcon size={48} round={true} />
                          </FacebookShareButton>
                        </SocialButtons>
                        <BlogFooter style={{ fontFamily: 'Raleway' }}>
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
        <ScrollTopButton />
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
