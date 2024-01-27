const li = document.createElement("li");
li.style.fontStyle="italic";
li.style.fontSize="90%";
li.appendChild(document.createTextNode("extension version " + browser.runtime.getManifest().version));
document.getElementById("tabmenu-ul").appendChild(li);