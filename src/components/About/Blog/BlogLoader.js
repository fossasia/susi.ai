import React from 'react';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';

const Center = styled.div`
  display: block;
  position: relative;

  * {
    position: relative;
    left: 15%;
    margin-top: 30px;
  }
`;

const BlogCardSkeleton = () => (
  <ContentLoader
    height={320}
    width={700}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="13" y="9" rx="0" ry="0" width="450" height="200" />
    <rect x="13" y="225" rx="3" ry="3" width="150" height="13" />
    <rect x="175" y="225" rx="3" ry="3" width="289" height="13" />
    <rect x="13" y="250" rx="3" ry="3" width="30" height="13" />
    <rect x="47" y="250" rx="3" ry="3" width="418" height="13" />
    <rect x="13" y="275" rx="3" ry="3" width="450" height="13" />
  </ContentLoader>
);
const BlogLoader = () => (
  <Center>
    <BlogCardSkeleton />
    <BlogCardSkeleton />
    <BlogCardSkeleton />
  </Center>
);

export default BlogLoader;
