(async () => {
    const page =  await fetch("api/pages/frontpage").then(response => response.json())
    const pageContent = page.pageContent.pagecontent
    document.getElementById("pageContent").innerHTML = pageContent
})()