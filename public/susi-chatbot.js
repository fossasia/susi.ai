const susi_skills_deployed_url = "https://skills.susi.ai/";
const api_url = "https://api.susi.ai";
//Appending CSS
let headTag = document.getElementsByTagName("head")[0];
let link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = susi_skills_deployed_url+'chatbox-style.min.css';
link.media = 'all';
headTag.appendChild(link);
link = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = susi_skills_deployed_url+'chat-style.css';
link.media = 'all';
headTag.appendChild(link);
const script_tag = document.getElementById("susi-bot-script");
const userid = script_tag.getAttribute("data-userid");
const group = script_tag.getAttribute("data-group");
const language = script_tag.getAttribute("data-language");
const skill = script_tag.getAttribute("data-skill");
const botWindow = script_tag.getAttribute("data-bot-type")?(script_tag.getAttribute("data-bot-type")==="botWindow"?true:false):false;

// custom theme variables
let botbuilderBackgroundBody = "#ffffff";
let botbuilderBodyBackgroundImg = "";
let botbuilderUserMessageBackground = "#0077e5";
let botbuilderUserMessageTextColor = "#ffffff";
let botbuilderBotMessageBackground = "#f8f8f8";
let botbuilderBotMessageTextColor = "#455a64";
let botbuilderIconColor = "";
let botbuilderIconImg = susi_skills_deployed_url + 'customAvatars/0.png';

if(typeof jQuery=='undefined') {
	let jqTag = document.createElement('script');
	jqTag.type = 'text/javascript';
	jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
	jqTag.onload = getTheme;
	headTag.appendChild(jqTag);
} else {
	// to ensure jquery has loaded
	getTheme();
}

// get custom theme from user
function getTheme(){
		$.ajax({
			type: "GET",
			url: `${api_url}/cms/getSkillMetadata.json?userid=${userid}&group=${group}&language=${language}&skill=${skill}`,
			jsonpCallback: 'pa',
			contentType: "application/json",
			dataType: 'jsonp',
			jsonp: 'callback',
			crossDomain: true,
			success: function(data) {
				if (!data.accepted) {
					// not allowed to use. Exit.
					console.log(data.message);
					return;
				}
				enableBot();
				if(data.skill_metadata && data.skill_metadata.design){
				let settings = data.skill_metadata.design;
				botbuilderBackgroundBody = settings.bodyBackground?settings.bodyBackground:botbuilderBackgroundBody;
				botbuilderBodyBackgroundImg = settings.bodyBackgroundImage?settings.bodyBackgroundImage:botbuilderBodyBackgroundImg;
				botbuilderUserMessageBackground = settings.userMessageBoxBackground?settings.userMessageBoxBackground:botbuilderUserMessageBackground;
				botbuilderUserMessageTextColor = settings.userMessageTextColor?settings.userMessageTextColor:botbuilderUserMessageTextColor;
				botbuilderBotMessageBackground = settings.botMessageBoxBackground?settings.botMessageBoxBackground:botbuilderBotMessageBackground;
				botbuilderBotMessageTextColor = settings.botMessageTextColor?settings.botMessageTextColor:botbuilderBotMessageTextColor;
				botbuilderIconColor = settings.botIconColor?settings.botIconColor:botbuilderIconColor;
				botbuilderIconImg = settings.botIconImage?settings.botIconImage:botbuilderIconImg;
				applyTheme();
			}

			},
			error: function(e) {
				console.log(e);
			}
		});
}

// to apply custom theme
function applyTheme(){
	// body background
	$(".susi-sheet-content-container").css("background-color",botbuilderBackgroundBody);
	if(botbuilderBodyBackgroundImg){
		$(".susi-sheet-content-container").css("background-image","url('"+botbuilderBodyBackgroundImg+"')");
	}
	// user message container
	$(".susi-comment-by-user .susi-comment-body-container").css("background-color",botbuilderUserMessageBackground);
	$("head").append($('<style>.susi-comment-body-container-user:after { border-color:'+ `transparent transparent ${botbuilderUserMessageBackground} ${botbuilderUserMessageBackground} !important` +'}</style>'));
	$(".susi-comment-by-user .susi-comment-body-container").css("color",botbuilderUserMessageTextColor);
	// bot message container
	$(".susi-comment-by-susi .susi-comment-body-container").css("background-color",botbuilderBotMessageBackground);
	$(".susi-comment-by-susi .susi-comment-body-container").css("color",botbuilderBotMessageTextColor);
	// bot icon
	$(".susi-launcher-button").css("background-color",botbuilderIconColor);
	$(".susi-comment-avatar").css("background-color",botbuilderIconColor);
	if(botbuilderIconImg){
		$(".susi-launcher-button").css("background-image","url('"+botbuilderIconImg+"')");
		$(".susi-comment-avatar").css("background-image","url('"+botbuilderIconImg+"')");
	}
}

function enableBot() {
	$(document).ready(function() {

		const baseUrl = api_url + "/susi/chat.json?q=";
		let msgNumber = 0;//stores the message number to set id

		// Add dynamic html bot content(Widget style)
		let frameStyle=botWindow?"height:460px;top: inherit;":"";
		const mybot = '<div id="susi-frame-container" class="susi-frame-container-active" style="display: none;'+frameStyle+'">'+
				'<div id="susi-frame-wrap">'+
				'<div id="susi">'+
				    '<div id="susi-container" class="susi-container susi-reset">'+
				        '<div id="susi-chatbox" class="susi-chatbox">'+
				            '<div id="susi-conversation" class="susi-conversation susi-sheet susi-sheet-active susi-active">'+
				                '<div class="susi-sheet-content">'+
				                    '<div class="susi-sheet-content-container" style="background-color:'+botbuilderBackgroundBody+';background-image:url(\''+botbuilderBodyBackgroundImg+'\')">'+
				                        '<div class="susi-conversation-parts-container">'+
				                            '<div id="susi-message" class="susi-conversation-parts">'+
				                            '</div>'+
				                        '</div>'+
				                    '</div>'+
				                '</div>'+
				                '<div class="susi-composer-container">'+
				                    '<div id="susi-composer" class="susi-composer ">'+
				                        '<div class="susi-composer-textarea-container">'+
				                            '<div class="susi-composer-textarea" id="chat-input">'+ '<pre class="susi-send-button"><?xml version="1.0" encoding="UTF-8"?>'+
				                            '<!DOCTYPE svg  PUBLIC "-//W3C//DTD SVG 1.1//EN"  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'+
				                            '<svg width="100%" height="100%" enable-background="new 0 0 535.5 535.5" version="1.1" viewBox="0 0 535.5 535.5" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">'+
				                            '<polygon points="0 497.25 535.5 267.75 0 38.25 0 216.75 382.5 267.75 0 318.75" fill="#2180c0"/>'+'</pre>'+
				                                '<textarea id="susiTextMessage" placeholder="Enter your response" rows="1">'+'</textarea>'+
				                            '</div>'+
				                        '</div>'+
				                    '</div>'+
				                '</div>'+
				            '</div>'+
				        '</div>'+
				    '</div>'+
				'</div>'+
			'</div>'+
			'<div id="susi-launcher-close" title="Close" style="display: none;">'+'</div>'+
			'</div>'+
			'<div id="susi-launcher-container" class="susi-flex-center susi-avatar-launcher susi-launcher-enabled">'+
			'<div id="susi-avatar-text">'+'Hey there'+'</div>'+
			'<div id="susi-launcher" class="susi-launcher susi-flex-center susi-launcher-active" style="background-color: rgb(91, 75, 159);">'+
			'<div id="susi-launcher-button" class="susi-launcher-button" style="background-image: url(\''+ botbuilderIconImg +'\');">'+'</div>'+
			'</div>'+
			'</div>';

		$("body").append(mybot);

		$('#susi-launcher').click(function() {
			$('.susi-frame-container-active').toggle();
			$('#susi-avatar-text').toggle();
			$('#susi-launcher-close').toggle();
			document.getElementById('susiTextMessage').focus();
		});

		$('#susi-launcher-close').click(function() {
			$('.susi-frame-container-active').toggle();
			$('#susi-avatar-text').toggle();
			$('#susi-launcher-close').toggle();
		});


		// on input/text enter
		$('#susiTextMessage').on('keyup keypress', function(e) {
			const keyCode = e.keyCode || e.which;
			const text = $("#susiTextMessage").val();
			if (keyCode === 13) {
				if(text == "" ||  $.trim(text) == '') {
					e.preventDefault();
					return false;
				} else {
					setUserResponse(text);
					send(text);
					e.preventDefault();
					return false;
				}
			}
		});
		$('.susi-send-button').click(function(){
			const text = $("#susiTextMessage").val();
			if(text !== '') {
				$("#chat-input").blur();
				setUserResponse(text);
				send(text);
			}
		});

		// Send request to SUSI API
		function send(text) {
			let url = baseUrl+encodeURIComponent(text);
			if(userid && group && language && skill){
				url += `&privateskill=1&userid=${userid}&group=${group}&language=${language}&skill=${skill}`;
			}
			const thisMsgNumber = msgNumber;
			msgNumber++;
			setLoadingMessage(thisMsgNumber);
			$.ajax({
				type: "GET",
				url: url,
				contentType: "application/json",
				dataType: "json",
				success: function(data) {
					main(data,thisMsgNumber);
				},
				error: function(e) {
					console.log(e);
					main(null,thisMsgNumber);
				}
			});
		}


		// Main function
		function main(data, thisMsgNumber) {
			if (!data || !data.answers || data.answers.length === 0) {
				createSusiMessageAnswer("Sorry, I could not understand what you just said.", thisMsgNumber);
				return;
			}
			const actions=data.answers[0].actions;

			for(let action_index = 0;action_index<actions.length;action_index++){
				let action=actions[action_index];
				let type=action.type;
				let expression="";
				if(action_index!==0){
					thisMsgNumber = ++msgNumber;
					if (type === "answer" || type === "anchor" || type === "table") {
						setLoadingMessage(thisMsgNumber);
					}
				}
				if(type==="answer"){
					expression=action.expression;
					createSusiMessageAnswer(expression, thisMsgNumber);
				}
				else if(type==="anchor"){
					const text=action.text;
					const link=action.link;
					createSusiMessageAnchor(text,link, thisMsgNumber);
				}
				else if(type==="table"){
					const tableData = data.answers[0].data;
					const columns = Object.keys(action.columns);
					const columnsData = Object.values(action.columns);
					createSusiMessageTable(tableData, columns, columnsData, thisMsgNumber);
				}
			}
		}

		function setLoadingMessage(msgNumber){
		    const BotResponse = '<div id="susiMsg-'+msgNumber+'" class="susi-conversation-part susi-conversation-part-grouped-first">'+
		'<div style="background-image: url('+ botbuilderIconImg + ')" class="susi-comment-avatar susi-theme-bg">'+

		'</div>'+
		'<div class="susi-comment susi-comment-by-susi">'+
			'<div class="susi-comment-body-container susi-comment-body-container-susi" style="background-color:'+botbuilderBotMessageBackground+';color:'+botbuilderBotMessageTextColor+'">'+
				'<div class="susi-comment-body ">'+
					'<div class="susi-comment-content">'+
						'<div class="susi-question-label">'+
							'<div class="susi-msg-content-div"> <img src="'+susi_skills_deployed_url+'loading.gif'+'" style="height:13px;" /></div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>';
				$(BotResponse).appendTo('.susi-conversation-parts');
				scrollToBottomOfResults();
		}

		// Create SUSI message for answer
		function createSusiMessageAnswer(message,msgNumber) {
			if(message.match(/.*\.(jpg|png|gif)\b/)){
				message=message.replace(/.*\.(jpg|png|gif)\b/,function composeImgLink(link){
					return "<img style='max-width:100%' src='"+link+"'>";
				});
			}
			else{
				message=message.replace(/https?:[/|.|\w]*/gi,function composeLink(link){
					return "<a href='"+link+"' target='_blank'>"+link+"</a>";
				});
			}
			message = message.replace(new RegExp('\r?\n','g'), '<br />');
			$("#susiMsg-"+msgNumber+" .susi-msg-content-div").html(message);
			scrollToBottomOfResults();
		}

		// Create SUSI message for anchor
		function createSusiMessageAnchor(text, link, msgNumber) {
			$("#susiMsg-"+msgNumber+" .susi-msg-content-div").html("<a href='"+link+"' target='_blank'>"+text+"</a>");
			scrollToBottomOfResults();
		}

		// Create SUSI message for table
		function createSusiMessageTable(tableData, columns, columnsData, msgNumber) {
			let table = "<div style='overflow-x: scroll'><table><tbody><tr>";
			let i = 0 ;
			let j =0 ;

			//create headers for the table
			for(i = 0 ; i < columnsData.length ; i++){
				table = table.concat("<th>"+columnsData[i]+"</th>");

			}
			table =table.concat("</tr>");

			for(i = 0 ; i < tableData.length ; i++){
				table = table.concat("<tr>");

				for(j= 0; j < columns.length ;  j++){
					//check if such column value exists for that record
					if(tableData[i][columns[j]]){
						let cellData  = tableData[i][columns[j]];
						if (typeof cellData === "object") {
							cellData = cellData[0];
						}
						cellData.replace(/https?:[/|.|\w]*/gi,function composeLink(link){
							cellData="<a href='"+cellData+"' target='_blank'>"+cellData+"</a>";
						});

						table = table.concat("<td>"+cellData + "</td>" );
					}
				}

				table = table.concat("</tr>");

			}
			table =table.concat("</tbody></table></div>");
			$("#susiMsg-"+msgNumber+" .susi-msg-content-div").html(table);
			scrollToBottomOfResults();
		}

		// Set user response
		function setUserResponse(val) {
			const UserResponse = '<div class="susi-conversation-part susi-conversation-part-grouped-first">'+
			'<div class=" susi-comment susi-comment-by-user ">'+
			'<div class="susi-comment-body-container susi-comment-body-container-user" style="background-color:'+botbuilderUserMessageBackground+';color:'+botbuilderUserMessageTextColor+'">'+
			'<div class="susi-comment-body ">'+
			'<div class="susi-comment-content">'+
			val+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>';
			$(UserResponse).appendTo('.susi-conversation-parts');
			scrollToBottomOfResults();
			$("#susiTextMessage").val('');
		}

		// Scroll to the bottom
		function scrollToBottomOfResults() {
			let textsDiv = document.querySelector('.susi-sheet-content');
			textsDiv.scrollTop = textsDiv.scrollHeight;
		}

	});
}
