SRC_DIR=src
TARGET_DIR=jsdocs

echo "Clearing the target directory ${TARGET_DIR}..."
rm -rf $TARGET_DIR
mkdir $TARGET_DIR

echo "Building the jsdocs from ${SRC_DIR}..."
cd lib/jsdoc-toolkit
./jsrun.sh ../../$SRC_DIR -d=../../$TARGET_DIR -t=./templates/jsdoc -r=3
