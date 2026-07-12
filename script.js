/* ==========================================================
   Eleanor & Evan
   Guest Concierge
   Part 1
========================================================== */

let guests = [];

/* -----------------------------
   Load Guest Data
------------------------------ */

async function loadGuests() {

    try {

        const response = await fetch("guests.json");

        guests = await response.json();

    } catch (error) {

        console.error(error);

        document.getElementById("errorMessage").textContent =
            "Unable to load guest information.";

    }

}

/* -----------------------------
   Helper
------------------------------ */

function byId(id) {

    return document.getElementById(id);

}

function clean(value) {

    if (value === null || value === undefined) return "";

    return String(value).trim();

}

/* -----------------------------
   Hotel Details
------------------------------ */

function hotelDetails(hotel) {

    if (hotel === "Movenpick") {

        return {

            hotelName: "Mövenpick Resort Khao Yai",

            stayDates: "19–20 December 2026",

            checkin: "19 December 2026 • From 3:00 PM",

            checkout: "20 December 2026 • By 12:00 PM"

        };

    }

    if (hotel === "Grand Wara") {

        return {

            hotelName: "Grand Wara Resort",

            stayDates: "19–20 December 2026",

            checkin: "19 December 2026 • From 2:00 PM",

            checkout: "20 December 2026 • By 12:00 PM"

        };

    }

    return {

        hotelName: "",

        stayDates: "",

        checkin: "",

        checkout: ""

    };

}

/* -----------------------------
   Shuttle Text
------------------------------ */

function transportText(value) {

    value = clean(value);

    if (
        value === "" ||
        value.toUpperCase() === "N/A"
    ) {

        return "Self-arranged";

    }

    switch (value) {

        case "18":

            return "18 December 2026\nAirport Shuttle";

        case "19":

            return "19 December 2026\nAirport Shuttle";

        case "20":

            return "20 December 2026\nAirport Shuttle";

        default:

            return value;

    }

}

/* -----------------------------
   Search Guest
------------------------------ */

function findGuest(name) {

    name = clean(name).toLowerCase();

    return guests.find(g =>
        clean(g.name).toLowerCase() === name
    );

}

/* ==========================================================
   Part 2
========================================================== */

/* -----------------------------
   Populate Itinerary
------------------------------ */

function showGuest(guest) {

    const hotel = hotelDetails(guest.hotel);

    byId("welcomeName").innerHTML =
        `Welcome,<br>${guest.name}`;

    byId("hotelName").textContent =
        hotel.hotelName;

    byId("stayDates").textContent =
        hotel.stayDates;

    byId("checkin").textContent =
        hotel.checkin;

    byId("checkout").textContent =
        hotel.checkout;

    if (byId("roomType")) {

        byId("roomType").textContent =
            clean(guest.room);

    }

    byId("arrivalTransport").innerHTML =
        transportText(guest.arrival).replace(/\n/g,"<br>");

    byId("departureTransport").innerHTML =
        transportText(guest.departure).replace(/\n/g,"<br>");

}

/* -----------------------------
   Transition
------------------------------ */

function openItinerary() {

    const search = byId("searchScreen");

    const itinerary = byId("itineraryScreen");

    search.classList.remove("active");

    search.classList.add("hidden");

    itinerary.classList.remove("hidden");

    itinerary.classList.add("active");

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

function backToSearch() {

    const search = byId("searchScreen");

    const itinerary = byId("itineraryScreen");

    itinerary.classList.remove("active");

    itinerary.classList.add("hidden");

    search.classList.remove("hidden");

    search.classList.add("active");

    byId("guestInput").focus();

}

/* -----------------------------
   Lookup
------------------------------ */

function lookupGuest() {

    byId("errorMessage").textContent = "";

    const input = byId("guestInput");

    const guest = findGuest(input.value);

    if (!guest) {

        byId("errorMessage").textContent =
            "We couldn't find that reservation name.";

        return;

    }

    showGuest(guest);

    openItinerary();

}

/* -----------------------------
   Events
------------------------------ */

function bindEvents() {

    byId("searchButton")
        .addEventListener("click", lookupGuest);

    byId("guestInput")
        .addEventListener("keypress", function(e){

            if(e.key==="Enter"){

                e.preventDefault();

                lookupGuest();

            }

        });

    byId("backButton")
        .addEventListener("click", backToSearch);

}

/* -----------------------------
   Initialise
------------------------------ */

document.addEventListener("DOMContentLoaded", async () => {

    await loadGuests();

    bindEvents();

});
