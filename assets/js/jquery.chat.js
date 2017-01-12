/**
** Chat application 
*/

!function($) {
    "use strict";

    var ChatApp = function() {
        this.$body = $("body"),
        this.$chatInput = $('.chat-input'),
        this.$chatList = $('.conversation-list'),
        this.$chatSendBtn = $('.chat-send .btn')
    };

    //saves chat entry - You should send ajax call to server in order to save chat enrty
    ChatApp.prototype.save = function() {
        var chatText = this.$chatInput.val();
        var chatTime = moment().format("h:mm");
        if (chatText == "") {
            sweetAlert("Oops...", "You forgot to enter your chat message", "error");
            this.$chatInput.focus();
        } else {
            $('<li class="clearfix"><div class="chat-avatar"><img src="img/avatar-2.jpg" alt="male"><i>' + chatTime + '</i></div><div class="conversation-text"><div class="ctext-wrap"><i>John Deo</i><p>' + chatText + '</p></div></div></li>').appendTo('.conversation-list');
            this.$chatInput.val('');
            this.$chatInput.focus();
            this.$chatList.scrollTo('100%', '100%', {
                easing: 'swing'
            });
        }
    },
    ChatApp.prototype.init = function () {
        var $this = this;
        //binding keypress event on chat input box - on enter we are adding the chat into chat list - 
        $this.$chatInput.keypress(function (ev) {
            var p = ev.which;
            if (p == 13) {
                $this.save();
                return false;
            }
        });


        //binding send button click
        $this.$chatSendBtn.click(function (ev) {
           $this.save();
           return false;
        });
    },
    //init ChatApp
    $.ChatApp = new ChatApp, $.ChatApp.Constructor = ChatApp
    
}(window.jQuery);