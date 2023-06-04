window.addEventListener("load", onPageLoad);
function onPageLoad() {
  sessionStorage.setItem('uid', '');
}
window.onpopstate = function(event) {
  if (!event.state) {
    sessionStorage.setItem('uid', '');
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyAGjLLyL4rfOcW5tiM29wLKVLZdp8tgVdU",
  authDomain: "test-f21ec.firebaseapp.com",
  databaseURL: "https://test-f21ec-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-f21ec",
  storageBucket: "test-f21ec.appspot.com",
  messagingSenderId: "374148281637",
  appId: "1:374148281637:web:4aa3e9758dbebe53f096cc",
  measurementId: "G-YVB8NWRZ79"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()


const register = document.getElementById('register');
const login = document.getElementById('login');
register.addEventListener("click" , function(){
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  full_name = document.getElementById('full_name').value
  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }
  if (validate_field(full_name) == false ) {
    alert('One or More Extra Fields is Outta Line!!')
    return
  }
 
  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      email : email,
      full_name : full_name,
    }
    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: ' ברוך הבא '  +full_name,
      showConfirmButton: false,
      timer: 1500
    })
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message
    Swal.fire({
      icon: 'error',
      title: 'אופס...',
      text: errors[error_code],
      confirmButtonColor: 'blue',
    })
  })
      
     
     
})
login.addEventListener("click" , function(){
  // Get all our input fields
  debugger;
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    Swal.fire({
      icon: 'error',
      title: 'אופס...',
      text: "אימייל או ססמא לא נכונים",
      confirmButtonColor: 'blue',
    })
    return
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    debugger;
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
    last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)
  .catch(function(error) {
    console.error("Error updating user data:", error);
  });
    sessionStorage.setItem('uid', user.uid);
    window.location.href = "main.html";
    // window.location.href = "main.html?uid=" + user.uid;
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message
    Swal.fire({
      icon: 'error',
      title: 'אופס...',
      text: errors[error_code],
      confirmButtonColor: 'blue',
    })
  
  })
     
     
})


var errors = {
  "auth/invalid-email": "כתובת האימייל שסופקה אינה תקינה.",
  "auth/user-disabled": "חשבון המשתמש נוטרל על ידי מנהל מערכת.",
  "auth/user-not-found": "המשתמש המתאים לאימייל שסופק לא קיים.",
  "auth/wrong-password": "הסיסמה שסופקה אינה נכונה עבור כתובת האימייל הנתונה.",
  "auth/email-already-in-use": "כתובת האימייל כבר בשימוש על ידי חשבון אחר.",
  "auth/weak-password": "הסיסמה שסופקה אינה מספקת מספר מחרוזות חזק דרוש.",
  "auth/operation-not-allowed": "סוג הפעולה אסור (לדוגמה, חשבונות על סמך סיסמה מנוטרלים).",
  "auth/popup-closed-by-user": "המשתמש סגר את חלון הפופאפ כניסה.",
  "auth/account-exists-with-different-credential": "כבר קיים חשבון עם אותה כתובת אימייל, אך פרטי הכניסה שונים.",
  "auth/provider-already-linked": "חשבון המשתמש כבר מחובר לספק הנתונים הנתון.",
  "auth/requires-recent-login": "פעולה זו רגישה ודורשת התחברות חוזרת. יש לבצע התחברות מחדש לפני נסיון חוזר."
}


// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}