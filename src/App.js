import React, { Component } from 'react';
import './App.css';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Row, Col } from 'react-bootstrap';


class App extends Component {
  render() {
    return (
      <div className="App">

          <Row className="show-grid">
            <Col sm={2} md={4} className="contact"><h5>contact</h5><br /></Col>
            <Col sm={10} md={8} className="chat grid-border"><h5>chat</h5><br />
              <div className="history"></div>
              <div className="message top-border">
                <MuiThemeProvider>
                  <TextField hintText="Ask Susi"
                    fullWidth={true} multiLine={true}
                    rows={2} rowsMax={4}
                  />
                </MuiThemeProvider>
              </div>
            </Col>


          </Row>{/*show-grid ends here*/}

      </div>
    );
  }
}

export default App;
