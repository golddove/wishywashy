/** saves selected code into the title on input.html */
chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
    document.getElementById("title").value = selection[0]
});

/** saves current link into URL on input.html */
chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
    var activeTab = arrayOfTabs[0];
    var activeTabId = activeTab.id; // or do whatever you need
    document.getElementById("url").value =  activeTab.url;
});


