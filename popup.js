function onPageDetailsReceived(pageDetails)
{
    document.getElementById('title').value = pageDetails.title;
    document.getElementById('url').value = pageDetails.url;
    document.getElementById('details').innerText = pageDetails.details;
}
let statusDisplay = null;

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    statusDisplay = document.getElementById('status-display');
    document.getElementById('addItem')
        .addEventListener('submit', addItem);
    // Get the event page
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});