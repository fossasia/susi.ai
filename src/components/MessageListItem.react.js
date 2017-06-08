import React from 'react';
import { PropTypes } from 'prop-types';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Linkify from 'react-linkify';
import Emojify from 'react-emojione';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { divIcon } from 'leaflet';
import Paper from 'material-ui/Paper';
import ReactSwipe from 'react-swipe';
import Highlighter from 'react-highlight-words';

export function parseAndReplace(text) {
  return <Linkify properties={{target: '_blank'}}>
    {text}
  </Linkify>;
}

function imageParse(stringWithLinks){
  let replacePattern = new RegExp([
                      '((?:https?:\\/\\/)(?:[a-zA-Z]{1}',
                      '(?:[\\w-]+\\.)+(?:[\\w]{2,5}))',
                      '(?::[\\d]{1,5})?\\/(?:[^\\s/]+\\/)',
                      '*(?:[^\\s]+\\.(?:jpe?g|gif|png))',
                      '(?:\\?\\w+=\\w+(?:&\\w+=\\w+)*)?)'
                      ].join(''),'gim');
  let splits = stringWithLinks.split(replacePattern);
  let result = [];
  splits.forEach((item,key)=>{
    let checkmatch = item.match(replacePattern);
    if(checkmatch){
      result.push(
        <img key={key} src={checkmatch}
            style={{width:'95%',height:'auto'}} alt=''/>)
    }
    else{
      result.push(item);
    }
  });
  return result;
}

function drawWebSearchTiles(tilesData){
  let resultTiles = tilesData.map((tile,i) => {
    let category = 'Popular';
    if(tile.hasOwnProperty('Name')){
      category = tile.Name;
      tile = tile.Topics[0];
    }

    if(tile.Icon.URL){
      return(
        <div key={i}>
          <MuiThemeProvider>
            <Paper zDepth={0} className='websearchtile'>
              <div className='websearchtile-img-container'>
                <img src={tile.Icon.URL} className='websearchtile-img' alt=''/>
              </div>
              <div className='websearchtile-text'>
                <p className='websearchtile-category'>
                  Category: <strong>{category}</strong>
                </p>
                {tile.Text}<br/>
                <a href={tile.FirstURL} target='_blank'
                  rel='noopener noreferrer'>Know more</a>
              </div>
            </Paper>
          </MuiThemeProvider>
        </div>
      );
   }
   return(
    <div key={i}>
      <MuiThemeProvider>
        <Paper zDepth={0} className='websearchtile'>
          <div className='websearchtile-text'>
            <p className='websearchtile-category'>
              Category: <strong>{category}</strong>
            </p>
            {tile.Text}<br/>
            <a href={tile.FirstURL} target='_blank'
              rel='noopener noreferrer'>Know more</a>
          </div>
        </Paper>
      </MuiThemeProvider>
    </div>
    );

  });

  return resultTiles;
}

function drawTable(coloumns,tableData){
  let parseKeys;
  let showColName = true;
  if(coloumns.constructor === Array){
    parseKeys = coloumns;
    showColName = false;
  }
  else{
    parseKeys = Object.keys(coloumns);
  }
  let tableheader = parseKeys.map((key,i) =>{
    return(<TableHeaderColumn key={i}>{coloumns[key]}</TableHeaderColumn>);
  });
  let rows = tableData.map((eachrow,j) => {
    let rowcols = parseKeys.map((key,i) =>{
      return(
        <TableRowColumn key={i}>
          <Linkify properties={{target:'_blank'}}>
            {eachrow[key]}
          </Linkify>
        </TableRowColumn>
      );
    });
    return(
      <TableRow key={j}>{rowcols}</TableRow>
    );
  });

  const table =
  <MuiThemeProvider>
    <Table selectable={false}>
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      { showColName && <TableRow>{tableheader}</TableRow>}
    </TableHeader>
    <TableBody displayRowCheckbox={false}>{rows}</TableBody>
    </Table>
  </MuiThemeProvider>

  return table;
}

function drawMap(lat,lng,zoom){
  let position = [lat, lng];
  const icon = divIcon({
    className: 'map-marker-icon',
    iconSize: [35, 35]
  });
  const map = (
   <Map center={position} zoom={zoom}>
      <TileLayer
        attribution=''
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      <ExtendedMarker position={position} icon={icon}>
        <Popup>
          <span><strong>Hello!</strong> <br/> I am here.</span>
        </Popup>
      </ExtendedMarker>
    </Map>
  );
  return map;
}

class ExtendedMarker extends Marker {

  componentDidMount() {
    super.componentDidMount();

    this.leafletElement.openPopup();
  }
}

class MessageListItem extends React.Component {

  render() {
    let {message} = this.props;
    let stringWithLinks = this.props.message.text;
    let replacedText = '';
    let markMsgID = this.props.markID;
    if(this.props.message.hasOwnProperty('mark')
       && markMsgID) {
      let matchString = this.props.message.mark;
      if(stringWithLinks){
        let imgText = imageParse(stringWithLinks);
        let markedText = [];
        let matchStringarr = [];
        matchStringarr.push(matchString);
        imgText.forEach((part,key)=>{
          if(typeof(part) === 'string'){
            if(this.props.message.id === markMsgID){
              markedText.push(
              <Highlighter key={key}
                searchWords={matchStringarr}
                textToHighlight={part}
                highlightStyle={{backgroundColor:'orange'}}
              />  );
            }
            else{
             markedText.push(
              <Highlighter key={key}
                searchWords={matchStringarr}
                textToHighlight={part}
              />  );
            }
          }
          else{
            markedText.push(part);
          }
        });
        replacedText = markedText;
      };
    }
    else{
      if(stringWithLinks){
         let imgText = imageParse(stringWithLinks);
         replacedText = parseAndReplace(imgText);
      };
    }
    replacedText = <Emojify>{replacedText}</Emojify>
    let messageContainerClasses = 'message-container ' + message.authorName;
    if(this.props.message.hasOwnProperty('response')){
      if(Object.keys(this.props.message.response).length > 0){
        let data = this.props.message.response;
        let actions = this.props.message.actions;
        let listItems = []
        actions.forEach((action,index)=>{
          switch(action){
            case 'answer': {
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section  className={messageContainerClasses}>
                  <div className='message-text'>{replacedText}</div>
                  <div className='message-time'>
                    {message.date.toLocaleTimeString()}
                  </div>
                  </section>
                </li>
              );
              break
            }
            case 'anchor': {
              let link = data.answers[0].actions[index].link;
              let text = data.answers[0].actions[index].text;
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section  className={messageContainerClasses}>
                  <div className='message-text'>
                    <a href={link} target='_blank'
                      rel='noopener noreferrer'>{text}</a>
                  </div>
                  <div className='message-time'>
                    {message.date.toLocaleTimeString()}
                  </div>
                  </section>
                </li>
              );
              break
            }
            case 'map': {
              let lat = parseFloat(data.answers[0].actions[index].latitude);
              let lng = parseFloat(data.answers[0].actions[index].longitude);
              let zoom = parseFloat(data.answers[0].actions[index].zoom);
              let mymap = drawMap(lat,lng,zoom);
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section className={messageContainerClasses}>
                  <div>{mymap}</div>
                  <div className='message-time'>
                    {message.date.toLocaleTimeString()}
                  </div>
                  </section>
                </li>
              );
              break
            }
            case 'table': {
              let coloumns = data.answers[0].actions[index].columns;
              let table = drawTable(coloumns,data.answers[0].data);
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section className={messageContainerClasses}>
                  <div className='message-text'>{replacedText}</div>
                  <br />
                  <div><div className='message-text'>{table}</div></div>
                  <div className='message-time'>
                    {message.date.toLocaleTimeString()}
                  </div>
                  </section>
                </li>
              );
              break
            }
            case 'websearch': {
              let results = this.props.message.websearchresults;
              if(results.length === 0){
                let noResultFound = 'NO Results Found'
                listItems.push(
                  <li className='message-list-item' key={action+index}>
                    <section className={messageContainerClasses}>
                    <div><div className='message-text'>
                      <center>{noResultFound}</center></div></div>
                    <div className='message-time'>
                      {message.date.toLocaleTimeString()}
                    </div>
                    </section>
                  </li>
                );
              }
              else{
                let WebSearchTiles = drawWebSearchTiles(results);
                listItems.push(
                  <li className='message-list-item' key={action+index}>
                    <section className={messageContainerClasses}>
                    <div><div className='message-text'>
                      <ReactSwipe className='carousel'
                        key={WebSearchTiles.length}
                        swipeOptions={{continuous: false}}>
                        {WebSearchTiles}
                      </ReactSwipe>
                    </div></div>
                    <div className='message-time'>
                      {message.date.toLocaleTimeString()}
                    </div>
                    </section>
                  </li>
                );
              }
              break
            }
            default:
              // do nothing
          }
        });

        return (<div>{listItems}</div>);
      }
    }

    return (
      <li className='message-list-item'>
        <section  className={messageContainerClasses}>
        <div className='message-text'>{replacedText}</div>
        <div className='message-time'>
          {message.date.toLocaleTimeString()}
        </div>
        </section>
      </li>
    );
  }

};

MessageListItem.propTypes = {
  message: PropTypes.object,
  markID: PropTypes.string
};

export default MessageListItem;
