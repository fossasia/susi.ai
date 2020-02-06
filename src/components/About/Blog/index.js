import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import styled from 'styled-components';
import { getBlogReponse } from '../../../apis';
import './Blog.css';
import 'font-awesome/css/font-awesome.min.css';
import Next from '@material-ui/icons/KeyboardArrowRight';
import Previous from '@material-ui/icons/KeyboardArrowLeft';
import { Header } from '../../shared/About';
import BlogLoader from './BlogLoader';
import BlogItem from './BlogItem';

const BlogNavigation = styled.div`
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

const Container = styled.div`
  width: 100%;
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

  state = {
    posts: [],
    postRendered: false,
    startPage: 0,
    nextDisplay: 'visible',
    prevDisplay: 'hidden',
    nextPosts: [],
  };

  componentDidMount() {
    const { blogKey } = this.props;
    this.blogKey = blogKey;
    document.title =
      'Blog Posts about Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots - SUSI.AI';
    if (blogKey) {
      this.getPosts(0);
    }
  }

  componentWillReceiveProps = props => {
    const { blogKey } = props;
    this.blogKey = blogKey;
    const { posts } = this.state;
    if (posts.length === 0 && blogKey) {
      this.getPosts(0);
    }
  };

  getPosts = async offset => {
    this.setState({ postRendered: false });
    let payload = null;
    if (this.state.nextPosts.length === 0 || offset <= this.state.startPage) {
      payload = await getBlogReponse(this.blogKey, 10, offset);
    } else {
      payload = { items: this.state.nextPosts, status: 'ok' };
    }
    let nextPaylod = await getBlogReponse(this.blogKey, 10, offset + 10);
    try {
      if (payload.status !== 'ok') {
        throw payload.message;
      }
      const postsCount = payload.items.length;
      this.setState({
        posts: payload.items,
        nextPosts: nextPaylod.items,
        postRendered: true,
        startPage: offset,
        nextDisplay:
          postsCount < 10 || nextPaylod.items.length === 0
            ? 'hidden'
            : 'visible',
        prevDisplay: offset === 0 ? 'hidden' : 'visible',
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
    const offset = current - 10;
    this.scrollToTop();
    this.getPosts(offset);
  };
  // Function to navigate to next page
  nextPage = () => {
    const current = this.state.startPage;
    const offset = current + 10;
    this.scrollToTop();
    this.getPosts(offset);
  };

  render() {
    const nextStyle = {
      visibility: this.state.nextDisplay,
      marginLeft: '0.625rem',
    };

    const prevStyle = {
      visibility: this.state.prevDisplay,
    };

    return (
      <div>
        <Header title="Blog" subtitle="Latest Blog Posts on SUSI.AI" />
        {!this.state.postRendered && (
          <div>
            <center>
              <BlogLoader />
            </center>
          </div>
        )}
        {this.state.postRendered && (
          <div>
            <Container>
              {this.state.posts &&
                Array.isArray(this.state.posts) &&
                this.state.posts.length > 0 &&
                this.state.posts.map((posts, i) => (
                  <BlogItem posts={posts} key={i} />
                ))}
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
