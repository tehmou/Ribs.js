var IO;

(function () {
    var File = Packages.java.io.File;

    IO = {
        exists: function (path) {
            file = new File(path);
            if (file.isDirectory()){
                return true;
            }
            if (!file.exists()){
                return false;
            }
            if (!file.canRead()){
                return false;
            }
            return true;
        },

        write: function (path, content) {
            var out = new Packages.java.io.PrintWriter(
                new Packages.java.io.OutputStreamWriter(
                    new Packages.java.io.FileOutputStream(path), "utf-8"
                )
            );
            out.write(content);
            out.flush();
            out.close();
        },

        read: function (path) {
            if (!IO.exists(path)) {
                throw "File doesn't exist there: "+path;
            }
            return readFile(path, IO.encoding);
        },

        ls: function(dir) {
            var list = { files: [], directories: [] };
            dir = new File(dir);
            if (!dir.directory) {
                throw "Not a directory! " + dir;
            } else {
                var files = dir.list();
                for (var f = 0; f < files.length; f++) {
                    var file = String(files[f]);
                    if (file.match(/^\.[^\.\/\\]/)) continue;

                    if ((new File(dir + "/" + file)).list()) {
                        list.directories.push(file);
                    }
                    else {
                        list.files.push(file);
                    }
                }
            }

            return list;
        },

        rmdir: function (path) {
            var file = new File(path);
            removeDir(file);
        },

        mkdir: function (path) {
            var file = new File(path);
            if (!file.exists()) {
                file.mkdir();
            }
        }
    };

    function removeFile (fIn) {
        fIn["delete"].apply(fIn);
    }

    function removeDir (fIn) {
        var i, list;
        if (fIn.isDirectory()) {
            list = IO.ls(fIn);
            for (i = 0; i < list.files.length; i++) {
                removeFile(new File (fIn, list.files[i]));
            }
            for (i = 0; i < list.directories.length; i++) {
                removeDir(new File (fIn, list.directories[i]));
            }
        }
        removeFile(fIn);
    }

})();