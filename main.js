
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase,ref,push,onValue , remove,set , query, orderByChild, equalTo , get   } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const userId = sessionStorage.getItem('uid');
if(userId == '' || userId == undefined )window.location.href = "index.html";

//const urlParams = new URLSearchParams(window.location.search);
//const userId = urlParams.get('uid');


const appSettings = {
    databaseURL: "https://test-f21ec-default-rtdb.europe-west1.firebasedatabase.app/",   
  };
const app = initializeApp(appSettings);
const database = getDatabase(app);

//const shoopingListDB = ref(database,"users");
const shoopingListDB = ref(database, `users/${userId}/shoopingList`);
//const auth = getAuth(app);
//const userId = auth.currentUser.uid; // Retrieve the current user's ID
//alert(userId)
onValue(shoopingListDB, function(snapshot){
  debugger;
    if(snapshot.exists()){
        var  arrList = Object.entries(snapshot.val())
        var  arrList = arrList.sort(customSort);
        //console.log(JSON.stringify(arrList));
        shoppingListEl.innerHTML = ''
        for (let i=0;i<arrList.length;i++){
            addList(arrList[i])   
        }
    }
    else{
        shoppingListEl.innerHTML='No items'
    }
})

function addList(row){
        let ID = row[0];
        let name = row[1].name;
        let color = row[1].color;
        let category =row[1].category
        if(category ==undefined) category = 'other'
        else if(category =="dry") category = 'other'
        if(color == 'green') color= '#009aa5'
        let newEl = document.createElement("li");
        newEl.textContent =name 
        newEl.id = ID;
       
        //newEl.setAttribute("category", category);
        newEl.style.backgroundColor  = color
        let LocationInDB = ref(database,`users/${userId}/shoopingList/${ID}`);
        newEl.className = "li-" +category
    
        newEl.addEventListener("click",function(){
            debugger;
            //newEl.className = "li-white";
            newEl.classList.add('li-white');
            let changeColor= "white";
            if(color == 'white'){
                  //changeColor = 'green'
                //newEl.className = "li-green;
                changeColor='#009aa5'
                newEl.classList.add('li-green');

            }
            set(LocationInDB, {
                name : name,
                color:changeColor,
                category:category
              });
        })

        let div1 = document.createElement("div");
        div1.textContent =category 
        var className = "tag " + category
        div1.className = className;
        div1.style.display= 'none'
        newEl.append(div1)

        shoppingListEl.append(newEl)
}
const  inputFieldEl = document.getElementById("input=field")
const  addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const searchInput = document.getElementById('searchInput');
var buttons = document.getElementsByClassName('checkbox-click');
addButtonEl.addEventListener("click" , function(){
    debugger;
    let inputValue = inputFieldEl.value.trim();
    if(inputValue == '')return
    
    var block = false;
    const queryRef = query(shoopingListDB, orderByChild('name'), equalTo(inputValue));
    (async () => {
        const snapshot = await get(queryRef);
        if (snapshot.exists() ) {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            console.log(`Key: ${childKey}, Data:`, childData);
            Swal.fire({
              icon: 'error',
              title: 'אופס...',
              text: 'פריט קיים במערכת',
              confirmButtonColor: 'blue',
            })
          });
        } else {
          Swal.fire({
            title: 'בחר קטגוריה',
            input: 'select',
            inputOptions: {
              'milk': 'מוצרי חלב',
              'fruits': 'פירות',
              'veg': 'ירקות',
              "bread":"מאפים",
              "meat":"בשר",
              "clean": "ניקיון",
              "other":"אחר"
            },
            showCancelButton: true,
            cancelButtonText: 'בטל',
            confirmButtonText: 'בחר',
            confirmButtonColor: 'blue',
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value !== '') {
                  resolve();
                } else {
                  resolve('Please select an option');
                }
              });
            },
            preConfirm: () => {
              // Modify the confirm button style programmatically
              const confirmButton = Swal.getConfirmButton();
              confirmButton.style.color = 'red';
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const selectedOption = result.value;
              push(shoopingListDB,{name: inputValue , color: "white", category:selectedOption} )
              inputFieldEl.value = '';
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'המוצר נשמר בהצלחה',
                showConfirmButton: false,
                timer: 1500
              })
            }
          });
        }
      })();  
      
     
     
})
searchInput.addEventListener('input', function() {
    debugger;
  const searchQuery = searchInput.value.toLowerCase();
  const listItems = document.querySelectorAll('#shopping-list li');
  for(var i=0;i<listItems.length;i++){
    var item = listItems[i]
    const text = item.textContent.toLowerCase();

    if (text.includes(searchQuery)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  }
});

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    // Code to be executed when the button is clicked
    console.log('Button clicked: ' + this.id);
    
    var checked = this.checked;
    var liList = document.getElementsByTagName('li')
    for(var i=0;i<liList.length;i++){
      var li =liList[i]
      if(checked){
        if(li.className != mapping[this.id])
          li.style.display = 'none'
        else li.style.display =  'block'
      }else{
        if(li.className != mapping[this.id])
          li.style.display =  'block'     
      }
    }
    debugger
    for (var i = 0; i < buttons.length; i++) {
        var cbEl = buttons[i];
        if(cbEl.id != this.id)cbEl.checked = false;

    }
  });
}
var mapping = [];
mapping["milk-box"] = 'li-milk'
mapping["other-box"] = 'li-other'
mapping["bread-box"] = 'li-bread'
mapping["fruits-box"] = 'li-fruits'
mapping["veg-box"] = 'li-veg'
mapping["meat-box"] = 'li-meat'
mapping["clean-box"] = 'li-clean'
// Custom comparison function to sort by color and then by name
const customSort = (a, b) => {
    // Sort by color
    if (a[1].color < b[1].color) {
      return -1;
    }
    if (a[1].color > b[1].color) {
      return 1;
    }
  
    // Sort by name if colors are equal
    if (a[1].name < b[1].name) {
      return -1;
    }
    if (a[1].name > b[1].name) {
      return 1;
    }
  
    return 0; // Return 0 for equal values
  };
