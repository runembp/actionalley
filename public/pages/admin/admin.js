(async () => {
    renderPageControls()
    await renderActivityControls()
    await renderBlogControls()
    renderLogoutControls()
})()

const editor = new Quill("#quill", {
    theme: "snow"
})

let selectedPageTitle
let selectedPageContent
let activityList
let selectedActivity
let blogpostList
let selectedBlogPost

function renderPageControls() {
    const pageSelector = document.getElementById("pageSelect")
    const savePageButton = document.getElementById("savePageButton")
    const cancelPageButton = document.getElementById("cancelPageButton")

    pageSelector.addEventListener("click", setQuillText)
    savePageButton.addEventListener("click", saveQuillText)
    cancelPageButton.addEventListener("click", cancelQuillEdit)
}

async function renderActivityControls() {
    const createActivityButton = document.getElementById("createActivityButton")
    const activitySelector = document.getElementById("activitySelect")
    const response = await fetch("/api/activities").then(response => response.json())

    activityList = response.activityList
    activitySelector.innerHTML = "<option selected value='-1'>Select activity</option>"
    activityList.forEach(activity => {
        activitySelector.innerHTML += `<option class="list-group-item" value="${activity.id}">${activity.title}</option>`
    })

    createActivityButton.addEventListener("click", createActivity)
    activitySelector.addEventListener("change", renderSelectedActivity)
}

async function renderBlogControls() {
    const createBlogButton = document.getElementById("createBlogButton")
    const blogSelector = document.getElementById("blogSelect")
    const response = await fetch("/api/blog").then(response => response.json())

    blogpostList = response.blogposts
    blogSelector.innerHTML = "<option selected value='-1'>Select blogpost</option>"
    blogpostList.forEach(blogpost => {
        blogSelector.innerHTML += `<option class="list-group-item" value="${blogpost.id}">${blogpost.title}</option>`
    })

    createBlogButton.addEventListener("click", createBlogPost)
    blogSelector.addEventListener("change", renderSelectedBlogPost)
}

async function setQuillText(pageSelector) {
    selectedPageTitle = pageSelector.target.value
    const selectedPage = await fetch(`api/pages/${selectedPageTitle}`).then(response => response.json())
    selectedPageContent = selectedPage.pageContent.pagecontent
    editor.root.innerHTML = selectedPageContent
}

async function saveQuillText() {
    const editorText = editor.root.innerHTML

    await fetch("api/pages/", {
        method: "PUT",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            pagename: selectedPageTitle,
            pagecontent: editorText
        })
    }).then(response => {
        if(response.status === 200) {
            toastr.success(`Content of ${selectedPageTitle} has been saved!`)
        }
        else {
            toastr.error(`Error happened during saving: ${response.status}`)
        }
    })
}

function cancelQuillEdit() {
    editor.root.innerHTML = ""
    document.getElementById("savePageButton").removeEventListener("click", saveQuillText)
}

function renderSelectedActivity(activitySelector) {
    const selectedActivityId = parseInt(activitySelector.target.value)
    const selectedActivityTitle = document.getElementById("activityTitle")
    const selectedActivityDescription = document.getElementById("activityDescription")
    const selectedActivityImageLink = document.getElementById("activityImageLink")
    const saveSelectedActivityButton = document.getElementById("saveSelectedActivityButton")
    const deleteSelectedActivityButton = document.getElementById("deleteSelectedActivityButton")

    if(selectedActivityId === -1)
    {
        selectedActivityTitle.value = null
        selectedActivityDescription.value = null
        selectedActivityImageLink.value = null
        saveSelectedActivityButton.removeEventListener("click", saveSelectedActivity)
        deleteSelectedActivityButton.removeEventListener("click", deleteSelectedActivity)
        return
    }

    const activity = activityList.find(x => x.id === selectedActivityId)
    selectedActivity = activity
    selectedActivityTitle.value = activity.title
    selectedActivityDescription.innerText = activity.description
    selectedActivityImageLink.value = activity.image
    saveSelectedActivityButton.addEventListener("click", saveSelectedActivity)
    deleteSelectedActivityButton.addEventListener("click", deleteSelectedActivity)
}

async function saveSelectedActivity() {
    const newActivityTitle = document.getElementById("activityTitle").value
    const newActivityDescription = document.getElementById("activityDescription").value
    const newActivityImage = document.getElementById("activityImageLink").value

    await fetch(`/api/activities/`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            id: selectedActivity.id,
            title: newActivityTitle,
            description: newActivityDescription,
            image: newActivityImage
        })
    }).then(response => {
        if(response.status === 200) {
            toastr.success(`${newActivityTitle} has been saved!`)
            renderActivityControls()
        } else {
            toastr.error(`Error happened during saving: ${response.status}`)
        }
    })
}

async function deleteSelectedActivity() {
    const confirmationText = `Are you sure you want to delete ${selectedActivity.title}?`
    if(confirm(confirmationText) === false) {
        return
    }

    await fetch(`/api/activities/${selectedActivity.id}`, {
        method: "DELETE"
    }).then(response => {
        if(response.status === 200){
            toastr.info(`${selectedActivity.title} has been deleted.`)
            document.getElementById("activityTitle").value = ""
            document.getElementById("activityDescription").value = ""
            document.getElementById("activityImageLink").value = ""
            renderActivityControls()
        } else {
            toastr.error(`Error happened during deletion: ${response.status}`)
        }
    })
}

async function createActivity() {
    const newActivityTitle = document.getElementById("newActivityTitle").value
    const newActivityDescription = document.getElementById("newActivityDescription").value
    const newActivityImageLink = document.getElementById("newActivityImageLink").value

    await fetch("/api/activities", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            title: newActivityTitle,
            description: newActivityDescription,
            image: newActivityImageLink
        })
    }).then(response => {
        if(response.status === 200) {
            toastr.success(`${newActivityTitle} has been created!`)
            socket.emit("newactivity")
            renderActivityControls()
        } else {
            toastr.error(`Error happened during creation: ${response.status}`)
        }
    })
}

function renderSelectedBlogPost(blogSelector) {
    const blogPostId = parseInt(blogSelector.target.value)
    const blogTitle = document.getElementById("blogTitle")
    const blogContent = document.getElementById("blogContent")
    const blogAuthor = document.getElementById("blogAuthor")
    const saveSelectedBlogButton = document.getElementById("saveSelectedBlogButton")
    const deleteSelectedBlogButton = document.getElementById("deleteSelectedBlogButton")

    if(blogPostId === -1) {
        blogTitle.value = ""
        blogContent.value = ""
        blogAuthor.value = ""
        saveSelectedBlogButton.removeEventListener("click", saveSelectedBlogPost)
        deleteSelectedBlogButton.removeEventListener("click", deleteSelectedBlogPost)
        return
    }

    const blogpost = blogpostList.find(x => x.id === blogPostId)
    selectedBlogPost = blogpost
    blogTitle.value = blogpost.title
    blogContent.value = blogpost.content
    blogAuthor.value = blogpost.author
    saveSelectedBlogButton.addEventListener("click", saveSelectedBlogPost)
    deleteSelectedBlogButton.addEventListener("click", deleteSelectedBlogPost)
}

async function saveSelectedBlogPost() {
    const newBlogTitle = document.getElementById("blogTitle").value
    const newBlogContent = document.getElementById("blogContent").value
    const newBlogImage = document.getElementById("blogAuthor").value

    await fetch(`/api/blog/`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            id: selectedBlogPost.id,
            title: newBlogTitle,
            content: newBlogContent,
            author: newBlogImage
        })
    }).then(response => {
        if(response.status === 200) {
            toastr.success(`${newBlogTitle} has been saved!`)
            renderBlogControls()
        } else {
            toastr.error(`Error happened during saving: ${response.status}`)
        }
    })
}

async function deleteSelectedBlogPost() {
    const confirmationText = `Are you sure you want to delete ${selectedBlogPost.title}?`
    if(confirm(confirmationText) === false) {
        return
    }

    await fetch(`/api/blog/${selectedBlogPost.id}`, {
        method: "DELETE"
    }).then(response => {
        if(response.status === 200){
            toastr.info(`${selectedBlogPost.title} has been deleted.`)
            renderBlogControls()
            document.getElementById("blogTitle").value = null
            document.getElementById("blogContent").value = null
            document.getElementById("blogAuthor").value = null
        } else {
            toastr.error(`Error happened during deletion: ${response.status}`)
        }
    })
}

async function createBlogPost() {
    const newBlogPostTitle = document.getElementById("newBlogTitle").value
    const newBlogPostContent = document.getElementById("newBlogContent").value
    const newBlogPostAuthor = document.getElementById("newBlogAuthor").value
    const localDateNow = new Date(Date.now()).toLocaleString("da-DK")

    await fetch("/api/blog", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            title: newBlogPostTitle,
            content: newBlogPostContent,
            author: newBlogPostAuthor,
            created: localDateNow
        })
    }).then(response => {
        if(response.status === 200) {
            toastr.success(`${newBlogPostTitle} has been created!`)
            socket.emit("newblogpost")
            renderBlogControls()
        } else {
            toastr.error(`Error happened during creation: ${response.status}`)
        }
    })
}

function renderLogoutControls() {
    const adminNav = document.getElementById("adminNav")
    const logoutControl = document.createElement("li")
    logoutControl.innerHTML =
        `
        <li class="navbar-item navbutton">
            <a href="/logout" class="btn btn-sm btn-danger">Logout</a>
        </li>
        `
    adminNav.appendChild(logoutControl)
}

toastr.options = {
    positionClass: 'toast-top-center'
}