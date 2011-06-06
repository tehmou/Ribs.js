TARGET_DIR=target
TARGET_FILE=ribs.js
TARGET=$TARGET_DIR/$TARGET_FILE

echo "Clearing target directory $TARGET_DIR"
rm -rf $TARGET_DIR
mkdir $TARGET_DIR

echo Writing Core and ManagedView..
echo -e "// Core classes\n" > $TARGET
cat src/core.js >> $TARGET

echo jQuery plugin support..
echo -e "// jQuery plugin support\n" >> $TARGET
cat src/jquery.ribs.js >> $TARGET

echo Appending utils..
echo -e "\n\n\n// Utilities\n" >> $TARGET
cat src/utils/* >> $TARGET

echo Appending mixins..
echo -e "\n\n\n// Support mixins\n" >> $TARGET
cat src/mixins/support/* >> $TARGET
echo -e "\n\n\n// Basic mixin classes\n" >> $TARGET
cat src/mixins/* >> $TARGET
echo -e "\n\n\n// Default mixin classes\n" >> $TARGET
cat src/mixins/invalidating/* >> $TARGET

echo Appending backbone support..
echo -e "\n\n\n// Backbone integrations\n" >> $TARGET
cat src/backbone/ribs.backbone.js src/backbone/backbonepivot.js >> $TARGET

echo Copying to target and samples/lib..
cp $TARGET samples/lib

echo Completed!
