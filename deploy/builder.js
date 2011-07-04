load("io.js");


function build (buildSettings) {
    print("Building " + buildSettings.name + " " + buildSettings.version);

    clean();
    buildModules();

    function clean () {
        IO.rmdir(buildSettings.target);
        IO.mkdir(buildSettings.target);
    }

    function buildModules() {
        var modules = IO.ls(buildSettings.src).directories;
        print("Found " + modules.length + " modules");
        for (var i = 0; i < modules.length; i++) {
            buildModule(modules[i]);
        }
    }

    function buildModule(name) {
        print("-- Building module " + name);
        var output = "";

        writeModule(name, output);
    }

    function writeModule(name, content) {
        var filePath = buildSettings.target + "/" + buildSettings.name + "-" + buildSettings.version + "-" + name + ".js";
        print("    * Writing file to " + filePath);
        IO.write(filePath, content);
    }
}
