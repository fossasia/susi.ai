(function(){
  
  var chat = {
    messageToSend: '',
    templateResponse: Handlebars.compile( $("#message-response-template").html()),
    init: function() {
      this.cacheDOM();
      this.bindEvents();
      this.render();
    },
    cacheDOM: function() {
      this.$chatHistory = $('.chat-history');
      this.$button = $('button');
      this.$textarea = $('#message-to-send');
      this.$chatHistoryList =  this.$chatHistory.find('ul');
    },
    bindEvents: function() {
      this.$button.on('click', this.addMessage.bind(this));
      this.$textarea.on('keyup', this.addMessageEnter.bind(this));
    },
    render: function() {
      this.scrollToBottom();
      if (this.messageToSend.trim() !== '') {
        var template = Handlebars.compile( $("#message-template").html());
        var context = { 
          messageOutput: this.messageToSend,
          time: this.getCurrentTime()
        };

        this.$chatHistoryList.append(template(context));
        this.scrollToBottom();
        this.$textarea.val('');
        
        // responses
        var query = this.messageToSend.trim();
        this.getSusiResponse(query);
      }
      
    },
    addMessage: function() {
      this.messageToSend = this.$textarea.val()
      this.render();         
    },
    addMessageEnter: function(event) {
        // enter was pressed
        if (event.keyCode === 13) {
          if (event.shiftKey) { //enter + shift
            $(this).val( $(this.target).val() + "\n" );
          } else {
            this.addMessage();
          }
        }
    },
    scrollToBottom: function() {
       this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
    },
    getCurrentTime: function() {
        return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    processSusiData: function(data) {
      var contextResponse = { 
        response: data.answers[0].actions[0].expression,
        time: this.getCurrentTime()
      };
      this.$chatHistoryList.append(this.templateResponse(contextResponse));
      this.scrollToBottom();
    },
    susiapipath: '/api/susi.json?callback=p&q=',
    localhost:'http://127.0.0.1:9000',
    remotehost:'https://loklak.org',
    getSusiResponse: function(queryString) {
      var _super = this;
      $.ajax({
        url: (window.location.protocol == 'file:' ? _super.localhost : _super.remotehost) + _super.susiapipath + encodeURIComponent(queryString),
        dataType: 'jsonp',
        jsonpCallback: 'p',
        jsonp: 'callback',
        crossDomain: true,
        async: false,
        timeout: window.location.protocol == 'file:' ? 1000 : 10000,
        success: function (data) {
          _super.processSusiData(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
          $.ajax({
            url: _super.remotehost + _super.susiapipath + encodeURIComponent(queryString),
            dataType: 'jsonp',
            jsonpCallback: 'p',
            jsonp: 'callback',
            crossDomain: true,
            async: false,
            success: function (data) {
              data.answers[0].actions[0].expression = '* ' + data.answers[0].actions[0].expression
              _super.processSusiData(data);
            }
          });
        } 
      });
    }
  };

  
  chat.init();
  
  var searchFilter = {
    options: { valueNames: ['name'] },
    init: function() {
      var userList = new List('people-list', this.options);
      var noItems = $('<li id="no-items-found">No items found</li>');
      
      userList.on('updated', function(list) {
        if (list.matchingItems.length === 0) {
          $(list.list).append(noItems);
        } else {
          noItems.detach();
        }
      });
    }
  };
  
  searchFilter.init();
  
})();