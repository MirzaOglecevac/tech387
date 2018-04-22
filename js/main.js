
// PROPERTIES

// currently active menu item
var clickedMenuItem = '';

// current language of the webpage
var currentLanguage = 'english';

// by default dropdown menu(under 850px od screen width) is closed
var menuOpened = false;

// all menu items
var menuItems = ['main', 'aboutus', 'team', 'contact'];

// all review items
var reviewItems = ['firstReview', 'secondReview', 'thirdReview'];

// review buttons
var buttons = ['firstButton', 'secondButton', 'thirdButton'];




// FUNCTIONS


/**
 * check form data and send it if the form is OK
 */
function sendContactData(){
    var xhr = new XMLHttpRequest();
    var url = 'https://api.tech387.ba';
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    var name = document.getElementById('fullname').value;
    var email = document.getElementById('email').value;
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value;


    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var validEmail = regex.test(String(email).toLowerCase());

    if(name === '' || email === '' || message === ''){
        if(currentLanguage === 'english'){
            document.getElementById('toast').textContent = 'All fields need to be filled';
        }else {
            document.getElementById('toast').textContent = 'Sva polja trebaju biti popunjena';
        }

        document.getElementById('toast').style = "bottom: 20px !important";
        setTimeout(function () {
            document.getElementById('toast').style = "bottom: -80px !important";
        }, 3000);
    }else if(validEmail === false){
        if(currentLanguage === 'english'){
            document.getElementById('toast').textContent = 'Entered email is not a valid email';
        }else {
            document.getElementById('toast').textContent = 'Uneseni email nije validan';
        }

        document.getElementById('toast').style = "bottom: 20px !important";
        setTimeout(function () {
            document.getElementById('toast').style = "bottom: -80px !important";
        }, 3000);
    }else {
        // if everything is OK, stringify data and send it
        var body = JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            message: message
        });

        xhr.send(body);
    }
}


/**
 * Change page after clicking on one of the menu items
 * @param event
 */
function changePage(event){

    var currentPage;

    if(event.id){
        currentPage = event.id;
    }else {
        currentPage = event;
    }

    clickedMenuItem = currentPage;

    if(currentPage === 'team' || currentPage === 'contact'){
        document.getElementById('menu').classList.add('menuWithShadow');
    }else {
        document.getElementById('menu').classList.remove('menuWithShadow');
    }

    switch(currentPage){
        case 'main': changeItemsAppearence(currentPage);  sessionStorage.setItem('page', 'main'); $('#container').load('pages/main.html', function() {
            checkLanguage(clickedMenuItem); // check language after loading another page
            changeMenuBackgroundColor(); // check menu background color after loading another page
        });  break;
        case 'aboutus': changeItemsAppearence(currentPage);  sessionStorage.setItem('page', 'aboutus'); $('#container').load('pages/aboutus.html', function() {
            checkLanguage(clickedMenuItem);
            changeMenuBackgroundColor();
        });  break;
        case 'team': changeItemsAppearence(currentPage); sessionStorage.setItem('page', 'team'); $('#container').load('pages/team.html', function() {
            checkLanguage(clickedMenuItem);
            changeMenuBackgroundColor();
        }); break;
        case 'contact': changeItemsAppearence(currentPage);  sessionStorage.setItem('page', 'contact'); $('#container').load('pages/contact.html', function() {
            checkLanguage(clickedMenuItem);
            changeMenuBackgroundColor();
        });
    }

    window.scrollTo(0,0); // after changing the page, scroll to the top of the window
    toggleMenu('close'); // if dropdown menu is on, close it after changing the page
}


/**
 * Close dropdown menu after resizing screen over 850px and style approprietely menu items
 */
window.addEventListener('resize', function(){
    var page = sessionStorage.getItem('page');
    if(window.innerWidth >= 850){
        if(menuOpened === true){
            toggleMenu();
        }
        changeItemsAppearence(clickedMenuItem);
    }else {
        changeItemsAppearence(clickedMenuItem);
    }
});



/**
 * Change menu item background color depending on scrollY position (after vertical scrolling)
 */
function changeMenuBackgroundColor(){
    var page = sessionStorage.getItem('page');

    if(page === 'team' || page === 'contact'){
        document.getElementById("menu").classList.add('scrollOver');
        return;
    }

    if(window.scrollY > 395){
        document.getElementById("menu").classList.add('menuWithShadow');
    }else {
        document.getElementById("menu").classList.remove('menuWithShadow');
    }

    if(window.scrollY >= 60){
        document.getElementById("menu").classList.add('scrollOver');
        document.getElementById(clickedMenuItem).classList.add('firstTwo');
        changeItemsAppearence(clickedMenuItem);
    }else {
        if(menuOpened === true && window.innerWidth <= 850){
            console.log("menu opened");
            return;
        }

        document.getElementById("menu").classList.remove('scrollOver');
        document.getElementById(clickedMenuItem).classList.remove('firstTwo');
        changeItemsAppearence(clickedMenuItem); // change menu item style approprietely
    }
}


/**
 * Style menu items
 * @param item
 */
function changeItemsAppearence(item){

    item = item ? item : 'main';

    var width = window.innerWidth;

    for(var i = 0; i < menuItems.length; i++){

        if(item === menuItems[i]){

            if((menuItems[i] === 'main' || menuItems[i] === 'aboutus') && width > 850){
                document.getElementById(menuItems[i]).style = "background-color: #1c1c1c; color: #fff";
            }else {
                document.getElementById(menuItems[i]).style = "background-color: #fff; color: #1c1c1c";
            }
        }else {
            document.getElementById(menuItems[i]).style = "background-color: #transparent; color: #fff";
            document.getElementById(menuItems[i]).classList.remove('firstTwo');
        }

    }

}


/**
 * Call neccessary functions on loading of the page
 */
function callMainFunctions(){

    if(sessionStorage.getItem('page') === null){
        $('#container').load('pages/main.html'); // first page to show
        sessionStorage.setItem('page', 'main');
        setClickedMenuItemAppearence('main'); // style currently active menu item
        changePage('main');
    }else {
        var page = sessionStorage.getItem('page');
        $('#container').load('pages/' + page + '.html');
        sessionStorage.setItem('page', page);
        changePage(page);
    }

}


/**
 * Check language on loading of the page
 * @param item
 */
function checkLanguage(item){

    var language;

    if(item.id){
        language = item.id;
        currentLanguage = language;
    }
    else if(item === 'english' || item === 'bosnian'){
        language = item;
    }


    if(currentLanguage === 'english'){
        document.getElementById('english').style.opacity = '1';
        document.getElementById('bosnian').style.opacity = '0.44';
        changeToEnglish();
    }else {
        document.getElementById('english').style.opacity = '0.44';
        document.getElementById('bosnian').style.opacity = '1';
        changeToBosnian();
    }

    translateMenuItems(); // separete translating of menu items
};


/**
 * Translate menu items
 */
function translateMenuItems(){
    var bosnian = ['O nama', 'Misija i vizija', 'Tim', 'Kontakt', 'Promjeni jezik'];
    var english = ['About us', 'Mission and vision', 'Team', 'Contact us', 'Change language'];
    var data = document.getElementsByClassName('menuItems');

    if(currentLanguage === 'english'){
        for(var i = 0; i < data.length; i++){
            data[i].textContent = english[i];
        }
    }else {
        for(var i = 0; i < data.length; i++){
            data[i].textContent = bosnian[i];
        }
    }
}


/**
 * Style clicked menu item
 * @param page
 */
function setClickedMenuItemAppearence(page){

    if(window.innerWidth <= 850){
        document.getElementById(page).style = "background-color: #fff;";
    }else {
        document.getElementById(page).style = "background-color: #1c1c1c;";
    }

}


/**
 * Toggle dropdown menu when neccessary
 * @param item
 */
function toggleMenu(item){

    var page = sessionStorage.getItem('page');

    if(window.innerWidth <= 850 && item === 'close'){
        console.log("bingo");
        document.getElementById('menuItemsBigScreen').style.height = 0;
        if(window.scrollY < 60){
            console.log("THERE");
            if(page === 'main' || page === 'aboutus'){

                document.getElementById('menu').classList.remove('scrollOver');
            }
        }
        menuOpened = false;
        return;
    }


    if(menuOpened === false){
        document.getElementById('menuItemsBigScreen').style.height = '195px';
        if(page === 'main' || page === 'aboutus'){
            document.getElementById('menu').classList.add('scrollOver');
        }

        menuOpened = true;
    }else {
        document.getElementById('menuItemsBigScreen').style.height = 0;
        if(window.scrollY < 60){
            if(page === 'main' || page === 'aboutus'){
                document.getElementById('menu').classList.remove('scrollOver');
            }
        }
        menuOpened = false;
    }

}


/**
 * Change style of active client review
 * @param item
 */
function changeReviewStyle(item){

    var id = item.id;

    for(var i = 0; i < reviewItems.length; i++){
        if(reviewItems[i] === id || buttons[i] === id){

            document.getElementById(reviewItems[i]).style.opacity = 1;

            if(reviewItems[i] === 'firstReview' || buttons[i] === 'firstButton'){
                document.getElementById('firstClientImage').classList.remove('hidden_image');
                document.getElementById('firstClientImage').classList.add('showed_image');
                document.getElementById('firstClientReview').classList.remove('hidden_box');
                document.getElementById('firstClientReview').classList.add('arrow_box');
                document.getElementById('firstButton').style.backgroundColor = "#333";

                styleHiddenReviews(id);

            }else if(reviewItems[i] === 'secondReview' || buttons[i] === 'secondButton'){
                document.getElementById('secondClientImage').classList.remove('hidden_image');
                document.getElementById('secondClientImage').classList.add('showed_image');
                document.getElementById('secondClientReview').classList.remove('hidden_box');
                document.getElementById('secondClientReview').classList.add('arrow_box');
                document.getElementById('secondButton').style.backgroundColor = "#333";

                styleHiddenReviews(id);

            }else if(reviewItems[i] === 'thirdReview' || buttons[i] === 'thirdButton'){
                document.getElementById('thirdClientImage').classList.remove('hidden_image');
                document.getElementById('thirdClientImage').classList.add('showed_image');
                document.getElementById('thirdClientReview').classList.remove('hidden_box');
                document.getElementById('thirdClientReview').classList.add('arrow_box');
                document.getElementById('thirdButton').style.backgroundColor = "#333";

                styleHiddenReviews(id);

            }
        }else {
            document.getElementById(reviewItems[i]).style.opacity = 0.4;
        }
    }
}


/**
 * Change style of inactive client reviews
 * @param item
 */
function styleHiddenReviews(item) {

    if(item === 'firstReview' || item === 'firstButton'){
        document.getElementById('secondClientImage').classList.add('hidden_image');
        document.getElementById('secondClientImage').classList.remove('showed_image');
        document.getElementById('secondClientReview').classList.add('hidden_box');
        document.getElementById('secondClientReview').classList.remove('arrow_box');

        document.getElementById('thirdClientImage').classList.add('hidden_image');
        document.getElementById('thirdClientImage').classList.remove('showed_image');
        document.getElementById('thirdClientReview').classList.add('hidden_box');
        document.getElementById('thirdClientReview').classList.remove('arrow_box');

        document.getElementById('secondButton').style.backgroundColor = "#aaa";
        document.getElementById('thirdButton').style.backgroundColor = "#aaa";

    }else if (item === 'secondReview' || item === 'secondButton'){

        document.getElementById('firstClientImage').classList.add('hidden_image');
        document.getElementById('firstClientImage').classList.remove('showed_image');
        document.getElementById('firstClientReview').classList.add('hidden_box');
        document.getElementById('firstClientReview').classList.remove('arrow_box');

        document.getElementById('thirdClientImage').classList.add('hidden_image');
        document.getElementById('thirdClientImage').classList.remove('showed_image');
        document.getElementById('thirdClientReview').classList.add('hidden_box');
        document.getElementById('thirdClientReview').classList.remove('arrow_box');

        document.getElementById('firstButton').style.backgroundColor = "#aaa";
        document.getElementById('thirdButton').style.backgroundColor = "#aaa";
    }else {
        document.getElementById('firstClientImage').classList.add('hidden_image');
        document.getElementById('firstClientImage').classList.remove('showed_image');
        document.getElementById('firstClientReview').classList.add('hidden_box');
        document.getElementById('firstClientReview').classList.remove('arrow_box');

        document.getElementById('secondClientImage').classList.add('hidden_image');
        document.getElementById('secondClientImage').classList.remove('showed_image');
        document.getElementById('secondClientReview').classList.add('hidden_box');
        document.getElementById('secondClientReview').classList.remove('arrow_box');

        document.getElementById('secondButton').style.backgroundColor = "#aaa";
        document.getElementById('firstButton').style.backgroundColor = "#aaa";
    }
}


/**
 * Style focused form element
 * @param item
 */
function changeInputBottomBorder(item){
    var id = item.id;
    document.getElementById(id).style.borderBottom = "1px solid blue";
}


/**
 * Style form element after losing its focus
 * @param item
 */
function returnInputBottomBorder(item){
    var id = item.id;
    document.getElementById(id).style.borderBottom = "1px solid #bbb";
}


/**
 * Scroll after clicking the down button on main page
 */
function scrollDown(){
    var currentYPosition = window.scrollY;
    var toScroll = 395 - currentYPosition;

    window.scrollBy({
        top: toScroll,
        left: 0,
        behavior: 'smooth'
    });
}


/**
 * Secundary function for toggling dropdown menu
 * @param event
 */
function closeMenu(event){
    if(menuOpened === true && event.id === 'container'){
        toggleMenu('close');
    }
}

