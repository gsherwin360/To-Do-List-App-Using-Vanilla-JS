/**----------------------------------------------------------------
 * Author        : Sherwin D. Gonzales
 * Date Created  : 11/12/2020
 * Last Modified :
 * Modifications : 
 * Descriptions  : 
 *
 *  Variables / Function Hoisting
 *   - Hoisting is a JavaScript mechanism where variables 
 *     and function declarations are moved to the top 
 *     of their scope before code execution.
 *   - To avoid Hoisting ensures that we always declare 
 *     our variables / functions first.
 *
 *  Variable Naming Convention
 *   - $variableName = Selector Caching
-----------------------------------------------------------------*/
'use strict';

const appCallback = function(){
	/*=======================================================================
	* Local Variables & Functions Declaration & Initialization
	=========================================================================*/

	// Selector Caching
	const $clearListBtn = document.getElementById('clear-list');
	const $currentDateHandler = document.getElementById('current-date');
	const $toDoListContainer = document.getElementById('to-do-list');
	const $inputToDo = document.getElementById('input-to-do');

	// Classes names
	const checkCLASS = "fa-check-circle";
	const uncheckClass = "fa-circle-thin";
	const lineThroughClass = "lineThrough";

	const defaultErrorMsg = "Please refresh this page and try again, or feel free to contact support team for assistance if the problem persists.";

	const toDoList = [];

	const addNewToDo = function(id, taskName, isDone){
		const promise = new Promise(function(resolve, reject){
			toDoList.push({
				"id": id,
				"name": taskName,
				"isDone": typeof isDone === "boolean" ? isDone : false
			});

			displayNewToDo(id, taskName, isDone);

			resolve(toDoList);
		});

		return promise;
	};

	const getToDoID = function(){
		// increment by 1
		return toDoList.length + 1;

		/*let id = 1;

		for (let i = 0; i < toDoList.length; i++){
			if(toDoList[i].id != id){
				break;
			}

			id++;
		}
		return id;*/
	};

	
	// This function will insert the todo into the list.
	const displayNewToDo = function(id, taskName, isDone){
		const doneClass = isDone === true ? checkCLASS : uncheckClass;
		const lineClass = isDone === true ? " " + lineThroughClass : "";

		const $item = document.createElement('li');
		$item.className = "item";

		const $completeIcon = document.createElement('i');
		$completeIcon.className = "fa " + doneClass;
		$completeIcon.setAttribute('data-id', id);
		$completeIcon.setAttribute('job', 'complete');

		const $text = document.createElement('p');
		$text.className = "text" + lineClass;
		$text.innerHTML = taskName;

		const $deleteIcon = document.createElement('i');
		$deleteIcon.className = "fa fa-trash-o";
		$deleteIcon.setAttribute('data-id', id);
		$deleteIcon.setAttribute('job', 'delete');

		// Append the item components
		$item.appendChild($completeIcon);
		$item.appendChild($text);
		$item.appendChild($deleteIcon);

		// OLD VERSION
		/*let item = '<li class="item">';
			item += '<i class="fa '+ doneClass + '" job="complete" data-id="'+ id +'"></i>';
			item += '<p class="text'+ lineClass +'">'+ toDo +'</p>';
			item += '<i class="fa fa-trash-o" job="delete" data-id="'+ id +'"></i>';
		item += '</li>';*/

		// Inserts a text as HTML, into a specified position.
		// accepts 2 parameters: the position, and a string containing HTML.
		const position = "beforeend"; // insert after the last children of the element
		$toDoListContainer.insertAdjacentElement(position, $item);

		return false;
	};

	// This function will render any existing todo list items when the page is loaded.
	const displayAllTasks = function(){
		//const list = '[{"name":"aaa","id":1,"done":false,"trash":false}]';
		const json = localStorage.getItem('TODO_LIST');
	
		if(json != null && isJson(json) === true){
			const list = JSON.parse(json)
			if(isArray(list) === true && list.length > 0){
				list.forEach(function(todo){
					addNewToDo(todo.id, todo.name, todo.isDone);
				});
			}
		}

		// Old
		/*if(isArray(list) === true && list.length > 0){
			let counter = 1;
			list.forEach(function(item){
				addToDo_UI(item.id, item.name, item.done, item.trash);
				counter++;
			});

			itemCounter = counter; // set the item counter
		}*/
		
		return false;
	};

	// This function will mark the toDo as completed.
	const completeToDo = function(element){
		const id = element.getAttribute('data-id');

		if(isNumber(id)){
			let isSuccess = false;

			for (let i = 0; i < toDoList.length; i++){
				if(toDoList[i].id == id){

					toDoList[i].isDone = toDoList[i].isDone ? false : true;
					isSuccess = true;
					break;
				} 
			}

			if(isSuccess === true){
				// Update the Local Storage
				localStorage.setItem('TODO_LIST', JSON.stringify(toDoList));

				element.classList.toggle(checkCLASS);
				element.classList.toggle(uncheckClass);
				element.parentNode.querySelector('.text').classList.toggle(lineThroughClass);
			} else {
				window.alert("Whoops, the server encountered an error while updating the status.\n" + defaultErrorMsg);
			}
		} else {
			window.alert("The ToDo ID associated with the current record is not valid.\n" + defaultErrorMsg);
		}

		return false;
	};

	// This function will remove the todo in the list.
	const removeToDo = function(element){
		const confirmMsg = window.confirm("Are you sure you want to permanently delete this todo? \nPlease click OK to continue.")

		if(confirmMsg === true){
			const id = element.getAttribute('data-id');

			if(isNumber(id)){
				let isSuccess = false;

    			for (let i = 0; i < toDoList.length; i++){
    				if(toDoList[i].id == id){
    					toDoList.removeItem(id);
    					isSuccess = true;
    					break;
    				}
    			}

				if(isSuccess === true){
					element.parentNode.remove();

					// Update the Local Storage
					localStorage.setItem('TODO_LIST', JSON.stringify(toDoList));
				} else {
					window.alert("Whoops, the server encountered an error while removing the todo.\n" + defaultErrorMsg);
				}
			} else {
				window.alert("The ToDo ID associated with the current record is not valid.\n" + defaultErrorMsg);
			}
		}

		return false;
	};

	
	// Determines whether the passed value is empty or not
	// Returns true if the value is empty; otherwise, false
	const isFieldNotEmpty = function(value){
		return typeof value !== "undefined" && value !== null && value !== "";
	};

	// Determines whether the passed value is an Array
	// Returns true if the value is an Array; otherwise, false.
	const isArray = function(value){
		// ES5 actually has a method for this (ie9+)
		// Array.isArray(value);

		return isFieldNotEmpty(value) && typeof value === 'object' && value.constructor === Array;
	};

	const isJson = function(value){
		value = typeof value !== "string" ? JSON.stringify(value) : value;

	    try {
	        value = JSON.parse(value);
	    } catch (e) {
	        return false;
	    }

	    if (typeof value === "object" && value !== null){
	        return true;
	    }

	    return false;
	};

	// Returns if a value is really a number
	const isNumber = function(value) {
		value = parseInt(value);
		return typeof value === 'number' && isFinite(value) && !(isNaN(value) || value < 0);
	};

	// Convert a Date object to a string, using locale settings
	const getCurrentDate = function(){
		// Shows todays date
		const dateOptions = { weekday: "long", month: "short", day: "numeric", year: "numeric" };
		const currentDate = new Date();

		return currentDate.toLocaleDateString('en-US', dateOptions)
	};


	/*=======================================================================
	* Event Listeners
	=========================================================================*/
	
	// Add an item to the list if the user press the enter key
	$inputToDo.addEventListener('keyup', function(event){
		// 13 = Enter Key
		if(event.keyCode == 13){
			const toDo = this.value;

			if(isFieldNotEmpty(toDo)){
				const id = getToDoID();

				if(isNumber(id)){
					const isDone = false;
					const isNewItem = true;
					
					addNewToDo(id, toDo, isDone).then(function(list){
						// Update the Local Storage
						localStorage.setItem('TODO_LIST', JSON.stringify(list));
						$inputToDo.value = "";
					});
				} else {
					window.alert("Whoops, the server encountered an error while processing the TaskID.\n" + defaultErrorMsg);
				}
			} else {
				window.alert("Please enter your to-do task. This field is required.");
			}
		}

		return false;
	}); // End keyup event listener


	$toDoListContainer.addEventListener('click', function(event){
		const element = event.target; // return the clicked element inside the list

		if(element.hasAttribute('job')){
			const elementJob = element.attributes.job.value; // complete or delete

			if(elementJob == 'complete'){
				completeToDo(element);
			} else if(elementJob == 'delete'){
				removeToDo(element);
			}
		}

		return false;
	});

	$clearListBtn.addEventListener('click', function(){
		localStorage.clear();
		location.reload();
		return false;
	});

	
	// Immediately Invoked Function Expression
	const initMainComponents = (function(){
		// Adding the remove to the Array.prototype
		Object.defineProperty(Array.prototype, "removeItem", {
			value: function(value) {
				for(let key in this){
					if(this[key].hasOwnProperty('id') && this[key].id == value){
						// The splice() method adds/removes items to/from an array,
						// and returns the removed item(s).
						this.splice(key, 1);
						break;
					}
				}
				return this;
			} 
		});


		// Initialize current date
		$currentDateHandler.innerHTML = getCurrentDate();

		displayAllTasks();
	})();
}; // End function appCallback


// Document Ready in Vanilla JS

// Study this part
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
	appCallback();
} else {
	document.addEventListener('DOMContentLoaded', appCallback);
}  