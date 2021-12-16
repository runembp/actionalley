const socket = io()

socket.on("newactivity", () => {
    toastr.success("A new activity has been created! Go to Activities to see it!")
})

socket.on("newblogpost", () => {
    toastr.success("A new blog post has been posted! Go to our Blog section to read all about the new stuff!")
})

toastr.options = {
    positionClass: 'toast-top-center'
};