/**
* * Todo Application
*/

!function($) {
    "use strict";

    var TodoApp = function() {
        this.$body = $("body"),
        this.$todoContainer = $('#todo-container'),
        this.$todoMessage = $("#todo-message"),
        this.$todoRemaining = $("#todo-remaining"),
        this.$todoTotal = $("#todo-total"),
        this.$archiveBtn = $("#btn-archive"),
        this.$todoList = $("#todo-list"),
        this.$todoDonechk = ".todo-done",
        this.$todoForm = $("#todo-form"),
        this.$todoInput = $("#todo-input-text"),
        this.$todoBtn = $("#todo-btn-submit"),

        this.$todoData = [
        {
            'id': '1',
            'text': 'Design One page theme',
            'done': false
        },
        {
            'id': '2',
            'text': 'Build a js based app',
            'done': true
        },
        {
            'id': '3',
            'text': 'Creating component page',
            'done': true
        },
        {
            'id': '4',
            'text': 'Testing??',
            'done': true
        },
        {
            'id': '5',
            'text': 'Hehe!! This is looks cool!',
            'done': false
        },
        {
            'id': '6',
            'text': 'Build an angular app',
            'done': true
        }];

        this.$todoCompletedData = [];
        this.$todoUnCompletedData = [];
    };

    //mark/unmark - you can use ajax to save data on server side
    TodoApp.prototype.markTodo = function(todoId, complete) {
       for(var count=0; count<this.$todoData.length;count++) {
            if(this.$todoData[count].id == todoId) {
                this.$todoData[count].done = complete;
            }
       }
    },
    //adds new todo
    TodoApp.prototype.addTodo = function(todoText) {
        this.$todoData.push({'id': this.$todoData.length, 'text': todoText, 'done': false});
        //regenerate list
        this.generate();
    },
    //Archives the completed todos
    TodoApp.prototype.archives = function() {
    	this.$todoUnCompletedData = [];
        for(var count=0; count<this.$todoData.length;count++) {
            //geretaing html
            var todoItem = this.$todoData[count];
            if(todoItem.done == true) {
                this.$todoCompletedData.push(todoItem);
            } else {
                this.$todoUnCompletedData.push(todoItem);
            }
        }
        this.$todoData = [];
        this.$todoData = [].concat(this.$todoUnCompletedData);
        //regenerate todo list
        this.generate();
    },
    //Generates todos
    TodoApp.prototype.generate = function() {
        //clear list
        this.$todoList.html("");
        var remaining = 0;
        for(var count=0; count<this.$todoData.length;count++) {
            //geretaing html
            var todoItem = this.$todoData[count];
            if(todoItem.done == true)
                this.$todoList.prepend('<li class="list-group-item"><label class="cr-styled"><input checked type="checkbox" class="todo-done" id="' + todoItem.id + '"><i class="fa"></i></label><span class="todo-text">' + todoItem.text + '</span></li>');
            else {
                remaining = remaining + 1;
                this.$todoList.prepend('<li class="list-group-item"><label class="cr-styled"><input type="checkbox" class="todo-done" id="' + todoItem.id + '"><i class="fa"></i></label><span class="todo-text">' + todoItem.text + '</span></li>');
            }
        }

        //set total in ui
        this.$todoTotal.text(this.$todoData.length);
        //set remaining
        this.$todoRemaining.text(remaining);
    },
    //init todo app
    TodoApp.prototype.init = function () {
        var $this = this;
        //generating todo list
        this.generate();

        //binding archive
        this.$archiveBtn.on("click", function(e) {
        	e.preventDefault();
            $this.archives();
            return false;
        });

        //binding todo done chk
        $(document).on("change", this.$todoDonechk, function() {
            if(this.checked) 
                $this.markTodo($(this).attr('id'), true);
            else
                $this.markTodo($(this).attr('id'), false);
            //regenerate list
            $this.generate();
        });

        //binding the new todo button
        this.$todoBtn.on("click", function() {
            if ($this.$todoInput.val() == "" || typeof($this.$todoInput.val()) == 'undefined' || $this.$todoInput.val() == null) {
                sweetAlert("Oops...", "You forgot to enter todo text", "error");
                $this.$todoInput.focus();
            } else {
                $this.addTodo($this.$todoInput.val());
            }
        });
    },
    //init TodoApp
    $.TodoApp = new TodoApp, $.TodoApp.Constructor = TodoApp
    
}(window.jQuery),

//initializing todo app
function($) {
    "use strict";
    $.TodoApp.init()
}(window.jQuery);