chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    if ( message.url.indexOf('campusweb/')>0 ) {
        chrome.tabs.create({
            'url': message.url ,
            'active': false ,
            },function(tab){
                setTimeout(function(){chrome.tabs.remove(tab.id);}, 1000);
            });
    }
})