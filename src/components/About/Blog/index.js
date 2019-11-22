import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _Loading from 'react-loading-animation';
import { getBlogReponse } from '../../../apis';
import './Blog.css';
import 'font-awesome/css/font-awesome.min.css';
import { Header } from '../../shared/About';
import ScrollTopButton from '../../shared/ScrollTopButton';
import SearchBar from 'material-ui-search-bar';
import isMobileView from '../../../utils/isMobileView';
import uiActions from '../../../redux/actions/ui';
import { bindActionCreators } from 'redux';
import BlogPost from './BlogPost';
import Pagination from 'react-paginating';
import Button from '@material-ui/core/Button';

// Number of items shown in the page
const limit = 5;
// Pagination Element's displayed page count
const pageCount = 3;

const Loading = styled(_Loading)`
  margin-top: 1.25rem;
  position: relative;
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

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      posts: [],
      postRendered: false,
      elementsDisplayed: [],
      currentPage: 1,
      totalElements: 0,
      mode: 'normal',
      searchResults: [],
      displaySearchbar: false,
    };
    this.elementsToDisplay = [];
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
        elementsDisplayed: payload.items.slice(0, 5),
        displaySearchbar: true,
        total: payload.items.length,
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

  handlePageChange = (page, e) => {
    let elementsToDisplay = [];
    if (this.state.mode === 'normal') {
      elementsToDisplay = this.state.posts.slice(page * 5 - 5, page * 5);
      this.setState({
        currentPage: page,
        elementsDisplayed: elementsToDisplay,
        total: 50,
      });
      this.scrollToTop();
    } else {
      elementsToDisplay = this.state.searchResults.slice(
        page * 5 - 5,
        page * 5,
      );
      this.setState({
        currentPage: page,
        elementsDisplayed: elementsToDisplay,
        total: this.state.searchResults.length,
      });
      this.scrollToTop();
    }
  };

  handleSearch = value => {
    const { actions } = this.props;
    let results = 0;
    if (value.length === 0) {
      this.setState({
        mode: 'normal',
        searchResults: [],
        currentPage: 1,
      });
    } else {
      let searchResults = [];
      for (let i = 0; i < this.state.posts.length; i++) {
        if (
          this.state.posts[i].content
            .toLowerCase()
            .indexOf(value.toLowerCase()) !== -1
        ) {
          searchResults.push(this.state.posts[i]);
          results++;
        }
      }
      if (results === 0) {
        actions.openSnackBar({
          snackBarMessage: 'No results found for the search term!',
        });
      }
      let elementsToDisplay = searchResults.slice(0, 5);
      this.setState({
        mode: 'search',
        searchResults: searchResults,
        elementsDisplayed: elementsToDisplay,
        total: searchResults.length,
      });
    }
  };

  render() {
    const { search } = this.state;
    const mobileView = isMobileView();
    return (
      <div>
        <Header title="Blog" subtitle="Latest Blog Posts on SUSI.AI" />
        <SearchBar
          value={search}
          onChange={value => this.handleSearch(value)}
          style={{
            width: mobileView ? '20rem' : '60rem',
            margin: '0 auto',
            display: this.state.displaySearchbar == false ? 'none' : '',

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
              {this.state.elementsDisplayed.map((post, i) => {
                return (
                  <div key={post.title} className="section_blog">
                    <BlogPost index={i} posts={post} />
                  </div>
                );
              })}
              <div className="pagination">
                <Pagination
                  total={this.state.total}
                  limit={limit}
                  pageCount={pageCount}
                  currentPage={this.state.currentPage}
                >
                  {({ pages, currentPage, totalPages, getPageItemProps }) => (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        {...getPageItemProps({
                          pageValue: 1,
                          onPageChange: this.handlePageChange,
                        })}
                      >
                        first
                      </Button>

                      {pages.map((page, index) => {
                        let activePage = null;
                        if (currentPage === page) {
                          activePage = {
                            backgroundColor: '#0F2645',
                          };
                        }
                        return (
                          <Button
                            key={index}
                            variant="contained"
                            color="primary"
                            {...getPageItemProps({
                              pageValue: page,
                              key: page,
                              style: activePage,
                              onPageChange: this.handlePageChange,
                            })}
                          >
                            {page}
                          </Button>
                        );
                      })}

                      <Button
                        variant="contained"
                        color="primary"
                        {...getPageItemProps({
                          pageValue: totalPages,
                          onPageChange: this.handlePageChange,
                        })}
                      >
                        last
                      </Button>
                    </div>
                  )}
                </Pagination>
              </div>
            </Container>
            <BottomPost />
          </div>
        )}
        <ScrollTopButton />
      </div>
    );
  }
}

Blog.propTypes = {
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  const { blogKey } = store.app.apiKeys;
  return {
    blogKey,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Blog);
