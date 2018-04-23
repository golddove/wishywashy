chrome.runtime.sendMessage(
    {
        'title': document.title,
        'url': window.location.href,
        'details': window.getSelection().toString()
    }
);