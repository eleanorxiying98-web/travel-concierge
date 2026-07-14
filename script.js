/* ==========================================================
   Eleanor & Evan
   Guest Concierge
   Version 2
   Part 1
========================================================== */

let guests = [];

/* ---------------------------------------------------------
   Load Guest Data
--------------------------------------------------------- */

async function loadGuests() {

    try {

        const response = await fetch("guests.json");

        guests = await response.json();

    } catch (err) {

        console.error(err);

        byId("errorMessage").textContent =
            "Unable to load guest information.";

    }

}

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

function byId(id){

    return document.getElementById(id);

}

function clean(value){

    if(value===undefined || value===null){

        return "";

    }

    return String(value).trim();

}

function isSelfArranged(value){

    value = clean(value).toUpperCase();

    return value === "" || value === "N/A";

}


/* ---------------------------------------------------------
   Hotel Configuration
--------------------------------------------------------- */
function getHotel(hotel){

    hotel = clean(hotel).toLowerCase();

    if(hotel.includes("moven")){

        return{
            name:"Mövenpick Resort Khao Yai",
            checkinTime:"3:00 PM",
            checkoutTime:"12:00 PM",
            arrivalShuttle:"11:30 AM"
        };

    }

    if(hotel.includes("grand")){

        return{
            name:"Grand Wara Resort",
            checkinTime:"2:00 PM",
            checkoutTime:"12:00 PM",
            arrivalShuttle:"11:00 AM"
        };

    }

    return null;

}

/* ---------------------------------------------------------
   Arrival Date
--------------------------------------------------------- */

function getArrivalDate(guest){

    const transport = clean(guest.arrival);

    if(transport.includes("18")){

        return "18 December 2026";

    }

    if(transport.includes("19")){

        return "19 December 2026";

    }

    return "19 December 2026";

}

/* ---------------------------------------------------------
   Departure Date
--------------------------------------------------------- */

function getDepartureDate(guest){

    const transport = clean(guest.departure);

    if(transport==="20"){

        return "20 December 2026";

    }

    return "";

}


/* ---------------------------------------------------------
   Arrival Transport
--------------------------------------------------------- */

function getArrivalTransport(guest){

    if(isSelfArranged(guest.arrival)){

        return{

            title:"I have made my own arrangements"

        };

    }

    const hotel = getHotel(guest.hotel);

    return{

        date:getArrivalDate(guest),

        time:hotel.arrivalShuttle

    };

}


/* ---------------------------------------------------------
   Departure Transport
--------------------------------------------------------- */

function getDepartureTransport(guest){

    if(isSelfArranged(guest.departure)){

        return{

            title:"I have made my own arrangements"

        };

    }

    return{

        title:"Airport Shuttle",

        date:getDepartureDate(guest),

        time:"12:00 PM"

    };

}


/* ---------------------------------------------------------
   Find Guest
--------------------------------------------------------- */

function findGuest(name){

    name = clean(name).toLowerCase();

    return guests.find(g=>{

        return clean(g.name).toLowerCase()===name;

    });

}

/* ==========================================================
   Render Itinerary
   Part 2
========================================================== */

function showItinerary(guest){

    const hotel = getHotel(guest.hotel);

    /* ----------------------------------
       Welcome
    ----------------------------------- */

    byId("welcomeName").textContent =
        `Welcome, ${guest.name}`;

    /* ----------------------------------
       Intro
    ----------------------------------- */

    const intro = document.querySelector(
        "#itineraryScreen .intro"
    );

    intro.textContent =
        "Your personalised accommodation and transport arrangements for the wedding weekend are below.";

    /* ----------------------------------
       Hotel
    ----------------------------------- */

    const hotelName = byId("hotelName");
    const stayDates = byId("stayDates");
    const checkin = byId("checkin");
    const checkout = byId("checkout");

    if(!hotel){

        hotelName.textContent =
            "I have made my own arrangements";

        hotelName.classList.add("self-arranged");

        stayDates.textContent =
            "Accommodation has been arranged independently of the wedding room allocation.";

        checkin.parentElement.style.display = "none";
        checkout.parentElement.style.display = "none";

    }else{

        hotelName.classList.remove("self-arranged");

        hotelName.textContent =
            hotel.name;

        stayDates.textContent =
            `${getArrivalDate(guest)} – 20 December 2026`;

        checkin.parentElement.style.display = "flex";
        checkout.parentElement.style.display = "flex";

        checkin.textContent =
            `${getArrivalDate(guest)} • ${hotel.checkinTime}`;

        checkout.textContent =
            `20 December 2026 • ${hotel.checkoutTime}`;

    }

    /* ----------------------------------
   Arrival Transport
----------------------------------- */

const arrival = getArrivalTransport(guest);

if (arrival.title === "I have made my own arrangements") {

    byId("arrivalTransport").textContent =
        arrival.title;

} else {

    byId("arrivalTransport").innerHTML = 
        <div>${arrival.date}</div>
        <div>${arrival.time}</div>
    ;

}


/* ----------------------------------
   Departure Transport
----------------------------------- */

const departure = getDepartureTransport(guest);

if (departure.title === "I have made my own arrangements") {

    byId("departureTransport").textContent =
        departure.title;

} else {

    byId("departureTransport").innerHTML = 
        <div>${departure.date}</div>
        <div>${departure.time}</div>
    ;

}
   
    /* ----------------------------------
       Notes
    ----------------------------------- */

    byId("guestNotes").textContent =
        "Exact pick-up locations and final travel information will be shared closer to the wedding weekend.";

    /* ----------------------------------
       Screen Transition
    ----------------------------------- */

    byId("searchScreen").classList.add("hidden");
    byId("searchScreen").classList.remove("active");

    byId("itineraryScreen").classList.remove("hidden");
    byId("itineraryScreen").classList.add("active");

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ==========================================================
   Eleanor & Evan
   Guest Concierge
   Version 2
   Part 3
========================================================== */

/* ---------------------------------------------------------
   Search
--------------------------------------------------------- */

function searchGuest(){

    byId("errorMessage").textContent = "";

    const input = clean(byId("guestInput").value);

    if(input===""){

        byId("errorMessage").textContent =
            "Please enter your reservation name.";

        return;

    }

    const guest = findGuest(input);

    if(!guest){

        byId("errorMessage").textContent =
            "We couldn't find a reservation under that name. Please try again or contact us if you need assistance.";

        return;

    }

    showItinerary(guest);

}


/* ---------------------------------------------------------
   Return Home
--------------------------------------------------------- */

function returnHome(){

    byId("itineraryScreen").classList.add("hidden");
    byId("itineraryScreen").classList.remove("active");

    byId("searchScreen").classList.remove("hidden");
    byId("searchScreen").classList.add("active");

    byId("guestInput").value = "";

    byId("errorMessage").textContent = "";

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}


/* ---------------------------------------------------------
   Initialise
--------------------------------------------------------- */

async function initialise(){

    await loadGuests();

    const input = byId("guestInput");

    const searchButton = byId("searchButton");

    const backButton = byId("backButton");

    /* Search Button */

    searchButton.addEventListener(

        "click",

        function(){

            searchGuest();

        }

    );

    /* Press Enter */

    input.addEventListener(

        "keydown",

        function(event){

            if(event.key==="Enter"){

                event.preventDefault();

                searchGuest();

            }

        }

    );

    /* Back Button */

    backButton.addEventListener(

        "click",

        function(){

            returnHome();

        }

    );

}


/* ---------------------------------------------------------
   Start App
--------------------------------------------------------- */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initialise();

    }

);
