// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

// Document ready
$(function () {

  // Render TODO-list with items from a previous session
  loadTodoList();

  // User clicked on the add button
  // If there is any text inside the item field, add that text to the todo list
  $('#add').on('click', function () {
    var text = $('#item').val();

    if (text) {
      addItem(text);
    }
  });

  // User pressed the enter button
  // If there is any text inside the item field, add that text to the todo list
  $('#item').on('keydown', function (event) {
    var text = $(this).val();

    if (text && event.which === 13) {
      addItem(text);
    }
  });

  // User clicked on the remove button of an item
  $('div.container').on('click', 'button.remove', function () {
    var itemId = $(this).parentsUntil('ul', 'li').first().attr('id');

    removeItem(itemId);
  });

  // User clicked on the complete button of an item
  $('div.container').on('click', 'button.complete', function () {
    var li = $(this).parentsUntil('ul', 'li').first();
    var id = li.attr('id');
    var completed = li.parent().attr('id') === 'todo' ? true : false;

    completeItem(id, completed);
  });

})

// Load items in the todolist
function loadTodoList() {
  // Call an ajax function to fetch the data
  // Add the items to the DOM in the correct list
  $.ajax({
    method: 'GET',
    url: 'http://5c7d84b6dd19010014c8ea27.mockapi.io/api/v1/todo',
    dataType: 'json'
  })
    .done(function (data, textStatus, jqXHR) {
      data.forEach(item => {
        addItemToDOM(item);
      });
    });
};

// Add an item to the list and remove the input
function addItem(text) {
  // Call an ajax function to store the item
  $.ajax({
    method: 'POST',
    url: 'http://5c7d84b6dd19010014c8ea27.mockapi.io/api/v1/todo',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      text: text,
      completed: false
    })
  })
    .done(function (data, textStatus, jqXHR) {
      // Add the item to the DOM and clear the input
      addItem(data);
      formInput();
    });
};

// Remove an item
function removeItem(id) {
  // Call an ajax function to remove the item
  $.ajax({
    method: 'DELETE',
    url: 'http://5c7d84b6dd19010014c8ea27.mockapi.io/api/v1/todo/' + id,
    dataType: 'json'
  })
    .done(function (data, textStatus, jqXHR) {
      // Remove the item from the DOM
      removeItemFromDOM(id);
    });
};

// Complete an item (or un-complete an item)
function completeItem(id, completed) {
  var li = $('#' + id);

  // Recreate the item object
  var item = {
    id: li.attr('id'),
    text: li.text(),
    completed: completed
  };

  // Call an ajax function to mark the item as completed
  $.ajax({
    method: 'PUT',
    url: 'http://5c7d84b6dd19010014c8ea27.mockapi.io/api/v1/todo/' + id,
    contentType: 'application/json',
    data: JSON.stringify(item)
  })
    .done(function (data, textStatus, jqXHR) {
      // Move the item in the DOM from todo to completed
      removeItemFromDOM(id);
      addItemToDOM(item);
    });
};

// Adds a new item to the todo or completed list
// var item = { id, text, completed }
function addItemToDOM(item) {
  var list = (item.completed) ? $('#completed') : $('#todo');

  var li = $('<li>').attr('id', item.id).text(item.text);
  var buttons = $('<div>').addClass('buttons');

  var removeButton = $('<button>').addClass('remove').html(removeSVG);
  var completeButton = $('<button>').addClass('complete').html(completeSVG);

  buttons.append(removeButton);
  buttons.append(completeButton);

  li.append(buttons);

  list.prepend(li);
};

// Remove an item from the DOM
function removeItemFromDOM(id) {
  $('#' + id).remove();
};

