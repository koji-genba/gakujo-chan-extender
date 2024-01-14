browser.runtime.onMessage.addListener(function(message, sender, callback) {
    if ( message.url.indexOf('campusweb/')>0 ) {
        browser.tabs.create({ url: message.url }).then(() => {
            browser.tabs.executeScript({
              code: `console.log('2');`,
            });
        });
    }
});