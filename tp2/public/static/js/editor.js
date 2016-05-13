function crear_placeholders(editor){
    var style = "background-color: #18BC9C;" +
                    "color: white;" +
                    "font-weight: bold;" +
                    "padding: 5px 10px;"

    var code_blocks = $('iframe').contents().find('body').find('code');
    for (var i=0; i < code_blocks.length; i++) {
        code_blocks[i].style = style;
    }
}
