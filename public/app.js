$(document).ready(function(){
	$.getJSON("/api/todos",function(data){
		addTodos(data);
		console.log(data)
	})
	$('#todoInput').keypress(function(evt){
		if(evt.which == 13)
			createTodo();
	})
	$('.list').on('click','li',function(){
		updateTodo($(this));
	})
	$('.list').on('click','span',function(e){
		e.stopPropagation(); 
		deleteTodo($(this).parent());
	})
});

function addTodos(todos){
	//Add todos to the page
	todos.forEach(function(todo){
		addTodo(todo);
	})
}
function addTodo(todo){
	let newTodo = $('<li class="task"> '+ todo.name +'<span>X</span></li>');
	newTodo.data('id',todo._id);
	if(todo.completed){
		newTodo.addClass('done');
	}
	$('.list').append(newTodo);
}
function createTodo(){
	//send POST req 
	var userInput = $('#todoInput').val();
	$.post('/api/todos',{name : userInput})
	.then(function(newTodo){
		  $('#todoInput').val(''); 
		  addTodo(newTodo);
		//console.log(newTodo)
	})
	.catch(function(err){
		console.log(err);
	})
}
function deleteTodo(todo){
	//$(this).parent().remove();
		var clickedId = todo.data('id');
		var deleteUrl = '/api/todos/' + clickedId;
		$.ajax({
			type:'DELETE',
			url : deleteUrl
		})
		.then(function(data){
			todo.remove();
			console.log(data);
		})
}
function updateTodo(todo){
  var updateUrl = '/api/todos/' + todo.data('id');
  var isDone = !todo.data('completed');
  var updateData = {completed: isDone}
  $.ajax({
    method: 'PUT',
    url: updateUrl,
    data: updateData
  })
  .then(function(updatedTodo){
    todo.toggleClass("done");
    todo.data('completed', isDone);
  })
}