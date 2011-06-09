#!/bin/sh

VERSION_NUMBER=0.0.90b

VERSION_STRING=$(cat <<EOF
/*global $,_,console*/\n\n


/**\n\x20
*\x20@namespace Ribs.js $VERSION_NUMBER\n
\x20*\x20\n
\x20*\x20(c) 2011 Timo Tuominen\n
\x20*\x20Ribs.js may be freely distributed under the MIT license.\n
\x20*\x20For all details and documentation:\n
\x20*\x20http://tehmou.github.com/ribs.js\n
**/\x20\n
EOF
)

echo $VERSION_STRING

TARGET_DIR=target
TARGET_FILE_CORE=ribs-core-$VERSION_NUMBER.js
TARGET_FILE_MIXINS=ribs-mixins-$VERSION_NUMBER.js
TARGET_FILE_BACKBONE=ribs-backbone-$VERSION_NUMBER.js


echo "Clearing target directory $TARGET_DIR"
rm -rf $TARGET_DIR
mkdir $TARGET_DIR


TARGET=$TARGET_DIR/$TARGET_FILE_CORE
echo Writing $TARGET
echo $VERSION_STRING > $TARGET

echo "// Core classes\n" >> $TARGET
cat src/core.js >> $TARGET
echo "Ribs.VERSION = \"$VERSION_NUMBER\";\n\n" >> $TARGET

echo --jQuery plugin support..
echo "// jQuery plugin support\n" >> $TARGET
cat src/jquery.ribs.js >> $TARGET

echo --Utils..
echo "\n\n\n// Utilities\n" >> $TARGET
cat src/utils/* >> $TARGET

echo --Core mixins..
echo "\n\n\n// Support mixins\n" >> $TARGET
cat src/mixins/support/* >> $TARGET
echo "\n\n\n// Basic mixin classes\n" >> $TARGET
cat src/mixins/basic.js >> $TARGET


TARGET=$TARGET_DIR/$TARGET_FILE_MIXINS
echo Writing $TARGET
echo $VERSION_STRING > $TARGET

echo "\n\n\n// Default mixin classes\n" >> $TARGET
cat src/mixins/invalidating/* >> $TARGET
cat src/mixins/plainpivot.js >> $TARGET


TARGET=$TARGET_DIR/$TARGET_FILE_BACKBONE
echo Writing $TARGET
echo $VERSION_STRING > $TARGET

echo "\n\n\n// Backbone integrations\n" >> $TARGET
cat src/backbone/ribs.backbone.js src/backbone/modelsupport.js src/backbone/pivot.js >> $TARGET

echo Copying to target and samples/lib..
cp $TARGET_DIR/* samples/lib/

echo Completed!
