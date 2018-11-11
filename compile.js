var config = {
	dest: "bs",
	files: [
		"js/consts",
		"js/utils",
		"js/tween",
		"js/text",
		"js/particle",

		"js/rnd",
		"js/ai/ai",
		"js/ai/moveto",

		"js/entities/ship",
		"js/entities/sector",
		"js/entities/bullet",

		"js/cursors/cursor",
		"js/cursors/selectioncursor",
		"js/cursors/attackcursor",

		"js/cache",
		"js/world",
		"js/game",
		
		"js/scenes/menu",
		"js/scenes/play",

		"js/main"
	]
};

var fs = require("fs");

var fileCount = config.files.length;
var filesLoaded = 0;
var scripts = [];

for (var i = 0; i < fileCount; i++)
{
    (function(index) {
    	fs.readFile(config.files[index] + ".js", "utf-8", function(error, string) { 
	    	scripts[index] = string;

	        if (++filesLoaded === fileCount)
	        {
	            writeToDest();
	        }
	    });
	})(i);
}

function writeToDest() {
    var text = scripts.join("\n\n");

    fs.writeFile(config.dest + ".js", text);
}