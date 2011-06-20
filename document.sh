SRC_DIR=src
TEMPLATE_DIR=jsdocs/templates
TARGET_DIR=jsdocs/generated

echo "Clearing the target directory ${TARGET_DIR}..."
rm -rf $TARGET_DIR
mkdir $TARGET_DIR

echo "Building the jsdocs from ${SRC_DIR}..."
cd lib/jsdoc-toolkit
./jsrun.sh ../../$SRC_DIR -d=../../$TARGET_DIR -t=../../$TEMPLATE_DIR -r=6
