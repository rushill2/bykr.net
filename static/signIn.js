// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import "firebase/analytics"; // Import the Firebase Analytics module

// const firebaseConfig = {
//     apiKey: "AIzaSyAfPPcba9lX4Dq1pTTy_TEZ21KhYBFx3vo",
//     authDomain: "bykr-376421.firebaseapp.com",
//     projectId: "bykr-376421",
//     storageBucket: "bykr-376421.appspot.com",
//     messagingSenderId: "196507110771",
//     appId: "1:196507110771:web:c6f5052f4bff78b5a04906",
//     measurementId: "G-B595D58YZZ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // Attach event listener to sign-in button
// document.getElementById('google-login-button').addEventListener('click', function() {
//   // Trigger Google Sign-In
//   const provider = new GoogleAuthProvider();
//   signInWithPopup(app, provider).then(function(result) {
//     // Handle successful sign-in
//     const idToken = result.credential.idToken;
//     // Send idToken to your server for server-side verification and handling
//     // of user account data
//     const user = result.user;
//     // Access user account data using user object
//     console.log('ID token:', idToken);
//     console.log('User account data:', user);
//   }).catch(function(error) {
//     // Handle sign-in error
//     console.error('Error signing in with Google:', error);
//   });
// });


// window.addEventListener('load', function() {
//     // Your Firebase code here
//   });