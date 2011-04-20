var visualize = function (url) {
    $("body").append('<div id="code-container"><pre id="code-text"></pre></div>');

    $.ajax({
        url: url,
        success: function (data) {
            var lines = data.split("\n"),
                result = "",
                removing = false;
            while(lines.length > 0) {
                if (lines[0] === "<!-- visualizer -->") {
                    removing = true;
                }
                !removing && (result += lines[0] + "\n");
                if(lines[0] === "<!-- /visualizer -->") {
                    removing = false;
                }
                lines.splice(0, 1);
            }
            $("#code-text").text(result);
        },
        error: function () {
            $("#code-text").text("Error occured while loading the code.");
        }
    });

};