import React, { Component } from 'react';
import Translate from '../../Translate/Translate.react';
import RaisedButton from 'material-ui/RaisedButton';


export default class Facebookshare extends Component{
	constructor(props){
		super(props);
		this.state={
			style:{ margin:20,}
		};
		
		
	}
	
	
	
    render(){
        
        return (
            
            
					<div>
						<div>
							<div style={{
								marginTop: '10px',
								'marginBottom':'0px',
								fontSize: '15px',
								fontWeight: 'bold'}}>
								<Translate text="Post to Facebook"/>
								<RaisedButton label="Post"  style={this.state.style} />
							</div>
							
						</div>
					</div>
				
			
            

        );
    }
}