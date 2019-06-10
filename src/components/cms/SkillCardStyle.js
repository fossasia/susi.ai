import styled from 'styled-components';
import _Card from '@material-ui/core/Card';

export const Card = styled(_Card)`
  width: 16.25rem;
  height: ${props => (props.grid ? '12rem' : '10.5rem')};
  min-height: 9.375rem;
  margin: 0.625rem;
  overflow: hidden;
  font-size: 0.625rem;
  text-align: center;
  display: inline-block;
  background: #f2f2f2;
  border-radius: 5px;
  background-color: #f4f6f6;
  border: 1px solid #eaeded;
  padding: 5px;
  justify-content: center;
`;

export const Image = styled.img`
  position: relative;
  height: 4rem;
  width: 4rem;
  vertical-align: top;
  border-radius: 50%;
`;

export const TitleContainer = styled.div`
  text-align: left;
  color: #4285f4;
  border: 1px;
  height: 1.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
  font-size: 1rem;
`;

export const Example = styled.div`
  white-space: normal;
  text-align: center;
  font-style: italic;
  font-size: 0.875rem;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 8.625rem;
  padding: 0.625rem;
  vertical-align: middle;
  display: block;
  color: black;
  max-height: 5rem;
`;

export const RatingContainer = styled.div`
  positive: relative;
  float: left;
`;

export const TotalRating = styled.span`
  font-size: 0.8125rem;
  padding-left: 5px;
  color: #108ee9;
`;
