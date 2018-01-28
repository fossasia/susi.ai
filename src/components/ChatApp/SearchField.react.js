import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TextField, IconButton} from 'material-ui'
import SearchIcon from 'material-ui/svg-icons/action/search';
import UpIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import DownIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import ExitIcon from 'material-ui/svg-icons/navigation/close';

const animationStyle = {
    transition: 'width 0.75s cubic-bezier(0.000, 0.795, 0.000, 1.000)'
};

const additionalStyles={
    text: animationStyle,
    frame: animationStyle
}

const ESCAPE_KEY = 27;

class ExpandingSearchField extends Component{

    constructor(props) {
        super(props);
        this.state = {isOpen: false};
    }

    closeSearch = ()=>{
        if(this.state.isOpen){
            this.setState({isOpen:false});
            this.props.exitSearch();
        }
    }

    handleKeyDown =(event) => {
        switch( event.keyCode ) {
            case ESCAPE_KEY:
            this.closeSearch();
            break;
            default:
            break;
        }
    }

    onClick = () => {
        this.setState({isOpen: !this.state.isOpen});
        if(!this.state.isOpen){
            this.props.activateSearch();
        }
        else{
            this.props.exitSearch();
        }
    }

    onChange = (event) => {
        this.props.onTextChange(event);
    }

    onClickRecent = () => {
        this.props.scrollRecent();
    }

    onClickPrev = () => {
        this.props.scrollPrev();
    }

    componentWillMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    render() {

        const baseStyles = {

            open: {
                width: 180,
            },

            closed: {
                width: 0,
            },

            smallIcon: {
                fill: 'white'
            },

            icon: {
                width: 40,
                height: 40,
                padding: 5,
                top: 10
            },

            frame: {
            }

        };

        const searchStyle = {
            WebkitTextFillColor: 'white',
            color: 'white'
        }

        let textStyle = this.state.isOpen ? baseStyles.open : baseStyles.closed;
        textStyle = Object.assign(textStyle,
            additionalStyles ? additionalStyles.text : {});

            const divStyle = Object.assign({},textStyle, baseStyles.frame,
                additionalStyles ? additionalStyles.frame : {});
                divStyle.width += baseStyles.icon.width + 5;
                divStyle.display =  'inline';

                if(this.state.isOpen){
                    return (
                        <div style={divStyle} className='searchComponent'>
                            <TextField
                                name='search'
                                className='search displayNone'
                                placeholder="Search..."
                                inputStyle={searchStyle}
                                style={textStyle}
                                value={this.props.searchText}
                                onChange={(event) => this.onChange(event)}
                                autoFocus={true} />
                                <span className='counter'>
                                    {this.props.searchIndex}/{this.props.searchCount}
                                </span>
                                <IconButton
                                    className='displayNone'
                                    iconStyle={baseStyles.smallIcon}
                                    style={baseStyles.icon}
                                    onClick={this.onClickPrev}>
                                    <UpIcon />
                                </IconButton>
                                <IconButton
                                    className='displayNone'
                                    iconStyle={baseStyles.smallIcon}
                                    style={baseStyles.icon}
                                    onClick={this.onClickRecent}>
                                    <DownIcon />
                                </IconButton>
                                <IconButton
                                    className='displayCloseNone'
                                    iconStyle={baseStyles.smallIcon}
                                    style={baseStyles.icon}
                                    onClick={this.onClick}>
                                    <ExitIcon />
                                </IconButton>
                            </div>

                        );
                    }
                    return (
                        <div style={divStyle}>
                            <IconButton
                                className='displayNone displayCloseNone'
                                iconStyle={baseStyles.smallIcon}
                                style={baseStyles.icon}
                                onClick={this.onClick}>
                                <SearchIcon />
                            </IconButton>
                            <TextField
                                name='search'
                                value={this.props.searchText}
                                style={textStyle}
                                inputStyle={searchStyle} />
                            </div>
                        );
                    }
                };

                ExpandingSearchField.propTypes = {
                    activateSearch: PropTypes.func,
                    exitSearch: PropTypes.func,
                    onTextChange: PropTypes.func,
                    scrollRecent: PropTypes.func,
                    scrollPrev: PropTypes.func,
                    searchIndex: PropTypes.number,
                    searchCount: PropTypes.number,
                    searchText: PropTypes.string,
                };

                export default ExpandingSearchField;
