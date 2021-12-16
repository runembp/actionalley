(async () => {
    const page =  await fetch("api/pages/blog").then(response => response.json())
    const pageContent = page.pageContent.pagecontent
    document.getElementById("pageContent").innerHTML = pageContent

    renderBlogPosts()
})()

async function renderBlogPosts() {
    const blogpostContainer = document.getElementById("blogpostContainer")
    const result = await fetch("api/blog").then(response => response.json())
    const blogpostList = result.blogposts

    blogpostList.reverse()

    blogpostList.forEach(blogpost => {
        blogpostContainer.innerHTML +=
            `
                <div class="row">
                    <div class="col offset-1">
                        <p>${blogpost.created} - ${blogpost.author}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col offset-1">
                        <p><b>${blogpost.title}</b></p>
                        <p>${blogpost.content}</p>
                    </div>                
                </div>
                <hr>                
            `
    })


}