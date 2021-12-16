(async () => {
    const page =  await fetch("api/pages/activities").then(response => response.json())
    document.getElementById("pageContent").innerHTML = page.pageContent.pagecontent

    await renderActivityList()
})()

async function renderActivityList() {
    const activityListContainer = document.getElementById("activityList")
    const result = await fetch("api/activities").then(response => response.json())
    const activityList = result.activityList

    activityList.forEach((activity, iterator) => {
        if(iterator % 2 === 0) {
            activityListContainer.innerHTML +=
                `
                    <div class="row">
                        <div class="col">
                            <img class="img-thumbnail" src="${activity.image}">
                        </div>
                        <div class="col">
                            <p><b>${activity.title}</b></p>
                            <p>${activity.description}</p>
                        </div>
                    </div>
                `
        }
        else {
            activityListContainer.innerHTML +=
                `
                    <div class="row">
                        <div class="col">
                            <p><b>${activity.title}</b></p>
                            <p>${activity.description}</p>
                        </div>
                        <div class="col">
                            <img class="img-thumbnail" src="${activity.image}">
                        </div>
                    </div>
                `
        }
    })
}