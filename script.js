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

            title:"Arranged independently"

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

            title:"Arranged independently"

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

  if (!hotel) {

    hotelName.classList.add("self-arranged");

    hotelName.textContent =
        "Arranged independently";

    stayDates.style.display = "none";

    checkin.parentElement.style.display = "none";
    checkout.parentElement.style.display = "none";

} else {

    hotelName.classList.remove("self-arranged");

    hotelName.textContent =
        hotel.name;

    stayDates.style.display = "block";

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

if (arrival.title === "Arranged independently") {

    byId("arrivalTransport").textContent =
        arrival.title;

} else {

    byId("arrivalTransport").textContent =
        `${arrival.date} • ${arrival.time}`;

}


/* ----------------------------------
   Departure Transport
----------------------------------- */

const departure = getDepartureTransport(guest);

if (departure.title === "Arranged independently") {

    byId("departureTransport").textContent =
        departure.title;

} else {

    byId("departureTransport").textContent =
    `${departure.date} • ${departure.time}`;

}

/* ----------------------------------
   Transport Note
----------------------------------- */

const usingWeddingTransport =
    !isSelfArranged(guest.arrival) ||
    !isSelfArranged(guest.departure);

byId("transportNote").style.display =
    usingWeddingTransport ? "block" : "none";

/* ----------------------------------
   Extend Your Stay
----------------------------------- */

const extendStay = byId("extendStayText");

if (hotel && hotel.name.includes("Grand Wara")) {

   extendStay.innerHTML = `
    If you'd like to extend your stay at Grand Wara Resort,
    please contact Khun Air, the English-speaking owner, via Line.

    <p class="contact-line">
        <strong>Line ID:</strong>
        Airsununta / +66 81 696 3790
    </p>
`;
   
} else {

extendStay.innerHTML = `
If you'd like to make a reservation or extend your stay at
<strong>Mövenpick Resort Khao Yai</strong>, please contact the
reservations team directly to receive the preferential wedding rates.

<div class="contact-block">

    <p class="contact-line">
        <strong>Email:&nbsp;</strong>
        <a href="mailto:Resort.KhaoYai.Reservation@movenpick.com">
            Resort.KhaoYai.Reservation@movenpick.com
        </a>
    </p>

    <p class="contact-line">
        <strong>Mention:&nbsp;</strong>
        <span class="wedding-reference">
            "Eleanor &amp; Evan's Wedding – 19 December 2026"
        </span>
    </p>

</div>
`;
    /* ----------------------------------
       Screen Transition
    ----------------------------------- */

    byId("searchScreen").classList.add("hidden");
    byId("searchScreen").classList.remove("active");

    byId("itineraryScreen").classList.remove("hidden");
    byId("itineraryScreen").classList.add("active");

   window.scrollTo(0, 0);

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
const websiteButton = byId("websiteButton");

websiteButton.addEventListener(

    "click",

    function(){

        window.open(
            "https://mariamlol.my.canva.site/elevan-invite",
            "_blank"
        );

    }

);

/* ---------------------------------------------------------
   Start App
--------------------------------------------------------- */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initialise();

    }

);
