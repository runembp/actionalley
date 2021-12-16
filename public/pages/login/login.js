(() => {
    document.getElementById("submitCredentials").addEventListener("click", checkLogin)
    document.getElementById("username").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            checkLogin()
        }
    })
    document.getElementById("password").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            checkLogin()
        }
    })
})()

function checkLogin() {
    const username = document.getElementById("username")
    const password = document.getElementById("password")

    if (!username.checkValidity()) {
        toastr.info("Please enter username")
        return
    }

    if (!password.checkValidity()) {
        toastr.info("Please enter password")
        return
    }

    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
        .then(response => response.json())
        .then(x => {
            location.href = "admin"
        })
        .catch(() => {
            toastr.error("Invalid credentials.")
        })
}

toastr.options = {
    positionClass: 'toast-top-center'
};