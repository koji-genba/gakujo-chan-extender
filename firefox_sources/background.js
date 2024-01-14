browser.runtime.onMessage.addListener(function(message, sender, callback) {
    if ( message.url.indexOf('campusweb/')>0 ) {
        browser.tabs.create({
            'url': message.url ,
            'active': false ,
            },function(tab){
                setTimeout(function(){browser.tabs.remove(tab.id);}, 1000);
            });
    }
})