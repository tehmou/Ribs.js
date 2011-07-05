load("io.js");

function build(buildSettings) {
    buildLog("Building " + buildSettings.name + " " + buildSettings.version);

    clean();
    buildModules();

    function clean () {
        IO.rmdir(buildSettings.target);
        IO.mkdir(buildSettings.target);
    }

    function buildModules() {
        var modules = IO.ls(buildSettings.src).directories;
        buildLog("Found " + modules.length + " modules");
        for (var i = 0; i < modules.length; i++) {
            buildModule(modules[i]);
        }
    }

    function buildModule(name) {
        buildLog("-- Building module " + name);
        var output = "";
        var indent = 0;
        processDir(srcFilePath(name));
        indent++;
        writeModule(name, output);
        indent--;

        function processDir(dir) {
            indent++;
            if (dir.match(/tests$/)) {
                buildLog("x Tests directory omitted " + dir, indent);
            } else {
                buildLog("* Processing dir " + dir, indent);
                indent++;
                appendFile("package.js");
                var ls = IO.ls(dir);
                for (var i = 0; i < ls.directories.length; i++) {
                    processDir(dir + "/" + ls.directories[i]);
                }
                for (i = 0; i < ls.files.length; i++) {
                    if (ls.files[i] !== "package.js") {
                        appendFile(ls.files[i]);
                    }
                }
                indent--;
            }
            indent--;

            function appendFile(path) {
                path = dir + "/" + path;
                buildLog("* Appending file " + path, indent);
                if (IO.exists(path)) {
                    var file = IO.read(path);

                    output += file.replace(/([\n]*)$/, "");
                    output += "\n\n\n";
                }
            }
        }

        function writeModule(name, content) {
            var filePath = targetFilePath(buildSettings.name + "-" + buildSettings.version + "-" + name + ".js");
            filePath = filePath.toLowerCase();
            buildLog("\\ Writing file to " + filePath, indent);
            IO.write(filePath, content);
        }
    }

    function srcFilePath(name) {
        return buildSettings.src + "/" + name;
    }

    function targetFilePath(name) {
        return buildSettings.target + "/" + name;
    }

    function buildLog(msg, indent) {
        var out = "";
        indent = indent || 0;
        for (var i = 0; i < indent; i++) {
            out += "   ";
        }
        print(out + msg);
    }
}
