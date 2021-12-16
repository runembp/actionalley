(async () => {
    const page =  await fetch("api/pages/frontpage").then(response => response.json())
    document.getElementById("pageContent").innerHTML = page.pageContent.pagecontent
})()