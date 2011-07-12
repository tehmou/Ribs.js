load("io.js");
load("../lib/underscore.js");

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
            if (!IO.exists(dir)) {
                return;
            }
            buildLog("* Processing dir " + dir, indent);
            indent++;
            var ls = IO.ls(dir);
            appendFile("package.js");
            processDir(dir + "/support");
            appendFiles(ls.files, ["package.js"]);
            appendDirectories(ls.directories, ["support", "tests"]);
            indent--;

            function appendDirectories(directories, exclude) {
                for (var i = 0; i < directories.length; i++) {
                    if (_.indexOf(exclude, directories[i]) === -1) {
                        processDir(dir + "/" + directories[i]);
                    }
                }
            }

            function appendFiles(files, exclude) {
                for (var i = 0; i < files.length; i++) {
                    if (_.indexOf(exclude, files[i]) === -1) {
                        appendFile(files[i]);
                    }
                }
            }

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
            var header = _.template(IO.read("modulehead.tmpl"), _.extend({ module: name }, buildSettings));
            buildLog("\\ Writing file to " + filePath, indent);
            IO.write(filePath, header + content);
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
