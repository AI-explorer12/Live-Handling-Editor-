fx_version "cerulean"
game "gta5"
lua54 "yes"
author "legend"
version "1.1.0"
description "Handling Editor"

client_script "LiveHandlingEditor_cl.lua"

server_script "LiveHandlingEditor_sv.lua"

files {
    "ui/script.js",
    "ui/index.html",
    'ui/info-window.html',
    'ui/notes.json',
    'ui/img/*.png',
    
}

ui_page "ui/index.html"