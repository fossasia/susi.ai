import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

export const StyledIconButton = styled(Button)`
  border-radius: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 0.2rem;
  margin-left: -2px;
  font-size: 1rem;
  background: rgb(66, 133, 244);
  color: #fff;
  height: 5rem;
`;

const Container = styled.div`
  display: flex;
  margin: 0rem 3rem;
  margin-top: 1rem;
  margin-bottom: -0.5rem;
`;

const Text = styled.textarea`
  width: 33%;
  font-size: 1rem;
  padding: 2px 0.5rem;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border: 2px solid rgb(66, 133, 244);
`;

class CopyWithButton extends React.Component {
  state = {
    copied: false,
  };

  render() {
    return (
      <Container>
        <Text value={this.props.value} />
        <CopyToClipboard
          text={this.props.value}
          onCopy={() => this.setState({ copied: true })}
        >
          <StyledIconButton>
            <i className="material-icons">
              {this.state.copied ? 'assignment_turned_in' : 'content_copy'}
            </i>
          </StyledIconButton>
        </CopyToClipboard>
      </Container>
    );
  }
}

CopyWithButton.propTypes = {
  value: PropTypes.string,
};

export default CopyWithButton;
