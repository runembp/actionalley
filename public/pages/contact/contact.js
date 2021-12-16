(async () => {
    const contactMessageButton = document.getElementById("contactMessageButton")
    const page =  await fetch("api/pages/contact").then(response => response.json())
    document.getElementById("pageContent").innerHTML = page.pageContent.pagecontent

    contactMessageButton.addEventListener("click", sendContactMessage)
    renderGoogleMap()
})()

function renderGoogleMap() {
    const actionAlleyFort = {
        lat: 55.70383763691911,
        lng: 12.731623466373268 }
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: actionAlleyFort,
    })
    new google.maps.Marker({
        position: actionAlleyFort,
        map: map,
        label: "The Action Alley Fort",
        optimized: true
    })
}

function sendContactMessage() {

    const nameInput = document.getElementById("contactName")
    const telephoneInput = document.getElementById("contactPhone")
    const emailInput = document.getElementById("contactEmail")
    const messageInput = document.getElementById("contactMessage")

    if(!nameInput.checkValidity() && !telephoneInput.checkValidity() || !emailInput.checkValidity() || !messageInput.checkValidity())
    {
        toastr.error("Please fill out every field in the contact form.")
        return
    }

    fetch("/api/contact", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            name: nameInput.value,
            telephone: telephoneInput.value,
            email: emailInput.value,
            message: messageInput.value,
        })
    }).then(response => {
        if (response.status === 200) {
            toastr.success("Message has been sent!")
        } else {
            toastr.error("Message couldn't be sent. Please try again.")
        }
    })
}

toastr.options = {
    positionClass: 'toast-bottom-center'
}