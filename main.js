setInterval(autoExtender,60000)
window.alert("autoExtender")
function autoExtender(){
    if(document.getElementById("timeout-timer").textContent < 10){
        document.getElementById("portaltimerimg").click();
    }
}