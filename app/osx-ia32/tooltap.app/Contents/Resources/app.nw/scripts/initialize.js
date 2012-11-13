//------------------------------------------------------------------------------
var gui = require('nw.gui')

//------------------------------------------------------------------------------
function onLoad() {
    var button = document.getElementById("open-dev-tools")
    button.onclick = openDevTools
}

//------------------------------------------------------------------------------
function openDevTools() {
    gui.Window.get().showDevTools()
}