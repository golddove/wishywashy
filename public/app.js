










document.addEventListener("DOMContentLoaded", event => {

    const app = firebase.app();
});

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInViaPopup(provider);
}