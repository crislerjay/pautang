const totalElem = document.querySelector('.total');
const pautangListElem = document.querySelector('.pautangList');
const nameElem = document.querySelector('#name');
const dateElem = document.querySelector('#date');
const amountElem = document.querySelector('#amount');
const modal = document.querySelector('.modal');
const add = document.querySelector('.add');
const close = document.querySelector('.close');
const alert = document.querySelector('.alert');
const form = document.querySelector('#form');
const name = document.querySelector('#name');
const amount = document.querySelector('#amount');

// get data from localstorage
const localStorageUtang = JSON.parse(localStorage.getItem('utangs'));
let utangs = localStorage.getItem('utangs') !== null ? localStorageUtang : [];

// filter array based on selected value
function handleSelectChange() {
  var selectedValue = document.getElementById("selected").value;
  updateTotal(selectedValue)
}

// open form
add.addEventListener('click', function() {
  modal.style.display = 'block'
});

// close form
close.addEventListener('click', function() {
  modal.style.display = 'none'
});

// show success alert
function showAlert() {
  alert.style.display = 'block'
  // close after 5 seconds
  setTimeout(function() {
    alert.style.display = 'none'
  }, 3000);
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// change date format to text
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function convertDate(date_str) {
  temp_date = date_str.split("-");
  return months[Number(temp_date[1]) - 1] + " " + temp_date[2] + " " +  temp_date[0];
}

form.addEventListener('submit', function(e) {
  e.preventDefault()
  if (name.value.trim() === '' || amount.value.trim() === '' || date.value.trim() === '') {
    alert('Please input all fields');
  } else {
    const utang = {
      id: generateID(),
      name: nameElem.value,
      amount: +amountElem.value, // change to number
      date: convertDate(dateElem.value)
    };
    utangs.unshift(utang); // push ot array
    addUtangDOM(utang); // display added to dom
    updateLocalStorage(); // update localstorage
    updateTotal('all');  // update total
    showAlert() // show success alert
    createDropdown() // update dropdown options
    // remove values from form
    nameElem.value = '';
    amountElem.value = '';
    dateElem.value = '';
  }
});

// display object/array to dom
function addUtangDOM(utang) {
  const item = document.createElement('li'); // create li element
  //create item 
  item.innerHTML = `
    <p>
      <span class="name">${utang.name}</span><br>
      <span class="date">${utang.date}</span>
    </p>
    <p>&#8369; <span class="amount">${utang.amount}</span></p>
    <button class="delete-btn" onclick="removeUtang(${utang.id})">x</button>
  `;
  //add to ul/dom
  pautangListElem.appendChild(item);
}

// Remove transaction by ID
function removeUtang(id) {
  if (confirm("Delete item permanently?")) {
    utangs = utangs.filter(utang => utang.id !== id);
    updateLocalStorage();
    init();
  }
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem('utangs', JSON.stringify(utangs));
}

// Update the balance
function updateTotal(option) {
  if (option === 'all') {
    const amounts = utangs.map(utang => utang.amount); // get all amount
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2); // calculate
    totalElem.innerText = `₱ ${total}`; // changed total text
    pautangListElem.innerHTML = ''; // remove all item
    utangs.forEach(addUtangDOM); // display to dom
  } else {
    const copy = utangs.map(utang => utang) // create copy of array
    const filtered = copy.filter(item => item.name === option) /// filter array based on option
    const amounts = filtered.map(utang => utang.amount); // get all amount
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2); // calculate
    totalElem.innerText = `₱ ${total}`; // changed total text
    pautangListElem.innerHTML = ''; // remove all item
    filtered.forEach(addUtangDOM); // display to dom
  }
}

function createDropdown() {
  let selected = document.getElementById('selected');
  const getName = utangs.map(utang => utang.name); // create copy of names
  getName.unshift('all') // add all to the start of array
  let uniqueChars = [...new Set(getName)]; // remove duplicate

  // Add options to the select element based on the array
  selected.innerHTML = ''; // remove all item
  for (var i = 0; i < uniqueChars.length; i++) {
    var option = document.createElement("option");
    option.value = uniqueChars[i];
    option.text = uniqueChars[i];
    selected.appendChild(option);
  }
}

// run on load, display to dom
function init() {
  pautangListElem.innerHTML = '';
  utangs.forEach(addUtangDOM);
  updateTotal('all');
  createDropdown()
}

init();


