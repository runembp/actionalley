(() => {
    renderPageControls()
    renderActivityControls()
    renderBlogControls()
})()

const editor = new Quill("#quill", {
    theme: "snow",
})

let selectedPageTitle;
let selectedPageContent;
let activityList;
let selectedActivity;
let blogpostList;
let selectedBlogPost;

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
        method: "PATCH",
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
    editor.root.innerHTML = selectedPageContent
}

function renderSelectedActivity(activitySelector) {
    const activity = activityList.find(x => x.id === parseInt(activitySelector.target.value))
    selectedActivity = activity;
    document.getElementById("activityTitle").value = activity.title
    document.getElementById("activityDescription").innerText = activity.description
    document.getElementById("activityImageLink").value = activity.image
    document.getElementById("saveSelectedActivityButton").addEventListener("click", saveSelectedActivity)
    document.getElementById("deleteSelectedActivityButton").addEventListener("click", deleteSelectedActivity)
}

function saveSelectedActivity() {
    const newActivityTitle = document.getElementById("activityTitle").value
    const newActivityDescription = document.getElementById("activityDescription").value
    const newActivityImage = document.getElementById("activityImageLink").value

    fetch(`/api/activities/`, {
        method: "PATCH",
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
        } else {
            toastr.error(`Error happened during saving: ${response.status}`)
        }
    })
}

function deleteSelectedActivity() {
    const confirmationText = `Are you sure you want to delete ${selectedActivity.title}?`
    if(confirm(confirmationText) === false) {
        return;
    }

    fetch(`/api/activities/${selectedActivity.id}`, {
        method: "DELETE"
    }).then(response => {
        if(response.status === 200){
            toastr.info(`${selectedActivity.title} has been deleted.`)
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
        } else {
            toastr.error(`Error happened during creation: ${response.status}`)
        }
    })
}

function renderSelectedBlogPost(blogSelector) {
    const blogpost = blogpostList.find(x => x.id === parseInt(blogSelector.target.value))
    selectedBlogPost = blogpost
    document.getElementById("blogTitle").value = blogpost.title
    document.getElementById("blogContent").value = blogpost.content
    document.getElementById("blogAuthor").value = blogpost.author
    document.getElementById("saveSelectedBlogButton").addEventListener("click", saveSelectedBlogPost)
    document.getElementById("deleteSelectedBlogButton").addEventListener("click", deleteSelectedBlogPost)
}

function saveSelectedBlogPost() {
    const newBlogTitle = document.getElementById("blogTitle").value
    const newBlogContent = document.getElementById("blogContent").value
    const newBlogImage = document.getElementById("blogAuthor").value

    fetch(`/api/blog/`, {
        method: "PATCH",
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
        } else {
            toastr.error(`Error happened during saving: ${response.status}`)
        }
    })
}

function deleteSelectedBlogPost() {
    const confirmationText = `Are you sure you want to delete ${selectedBlogPost.title}?`
    if(confirm(confirmationText) === false) {
        return;
    }

    fetch(`/api/blog/${selectedBlogPost.id}`, {
        method: "DELETE"
    }).then(response => {
        if(response.status === 200){
            toastr.info(`${selectedBlogPost.title} has been deleted.`)
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
        } else {
            toastr.error(`Error happened during creation: ${response.status}`)
        }
    })
}

toastr.options = {
    positionClass: 'toast-top-center'
};