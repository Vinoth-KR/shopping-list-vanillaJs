const form = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filterInput = document.getElementById('filter');
let isEditMode = false;
const formSubmitBtn = form.querySelector('button');


function createBtn(classList){
    const btn = document.createElement('button');
    btn.className = classList;
    return btn;
}

function createIcon(classes){
    const icon = document.createElement('i');

    icon.className = classes;
    return icon;
}

function displayItems(){
    const items = getItemsFromStorage();

    items.forEach(item => addItemtoDom(item));

    checkUI();   
}

function checkDuplicate(item){
    let itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}
const addItem = (e) => {
    e.preventDefault();

    let newItem = itemInput.value;

    //Validation of Input
    if(newItem === '') {
        alert('Please add an item');
        return;
    }
    
    

    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        //Removing Class 
        itemToEdit.remove();

        isEditMode = false;
    }else {
        if(checkDuplicate(newItem)){
            alert('The item with same name already exists!');
            return;
        }
    }
    

    addItemtoDom(newItem);

    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';

}

const addItemtoDom = (item) => {
    
    const liEl = document.createElement('li');

    liEl.classList.add('item');

    liEl.appendChild(document.createTextNode(item));

    const btn = createBtn('remove-item btn-link text-red');

    btn.appendChild(createIcon('fa-solid fa-xmark'));

    liEl.appendChild(btn);

    itemList.appendChild(liEl);
}

const addItemToStorage =(item) => {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));

}

const getItemsFromStorage = () => {
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
    itemsFromStorage = [];        
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));        
    }

    return itemsFromStorage;
}


function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item){
    if(!isEditMode){     
    isEditMode = true;
    item.classList.add('edit-mode');
    formSubmitBtn.innerHTML='<i class="fa-solid fa-pen"></i> Update Item';
    formSubmitBtn.style.backgroundColor = '#228822';
    itemInput.value = item.textContent;
    }
}

function removeItem(item){
   if(confirm('Are you sure to remove?')){
    item.remove();

    //Remove item from storage.
    removeItemFromStorage(item.textContent);

    checkUI();
   }
}

function removeItemFromStorage(item){
    let  itemsFromStorage = getItemsFromStorage();   

    itemsFromStorage = itemsFromStorage.filter(i => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    //Clear from localStorage
    localStorage.removeItem('items');

    checkUI();
}

const onFilterInput = (e) => {
    let textToMatch = e.target.value.toLowerCase();

    const items = itemList.querySelectorAll('li');

    items.forEach(item => filterValues(item, textToMatch));
}

function filterValues(item, textToMatch) {
    let itemVal = item.firstChild.textContent.toLowerCase();
    
    if(itemVal.indexOf(textToMatch) != -1){
      item.style.display = 'flex';
    } else {       
      item.style.display = 'none';
    }
}

function checkUI(){
    itemInput.value = '';

    const items = document.querySelectorAll('li');
    if(items.length === 0){
        clearBtn.classList.add('hidden');
        filterInput.classList.add('hidden');
    }else{
        clearBtn.classList.remove('hidden');
        filterInput.classList.remove('hidden');
    }

    formSubmitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formSubmitBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

function init(){
//Event Listeners
form.addEventListener('submit', addItem);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click',clearItems);
filterInput.addEventListener('input', onFilterInput);
document.addEventListener('DOMContentLoaded', displayItems);

}

init();