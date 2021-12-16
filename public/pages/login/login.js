(async () => {
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

async function checkLogin() {
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

    await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
        .then(response => {
            if(response.status === 200) {
                location.href = "admin"
            }
            if(response.status === 401) {
                toastr.error("Invalid credentials")
            }
            if(response.status === 429) {
                toastr.error("All attempts used! Lockout for 5 minutes.")
            }
        })
}

toastr.options = {
    positionClass: 'toast-top-center'
}