echo Writing Core and ManagedView..
cat src/core.js src/managedview.js > target/ribs.js

echo Appending utils..
cat src/utils/* >> target/ribs.js

echo Appending mixins..
cat src/mixins/* >> target/ribs.js
cat src/mixins/edit/* >> target/ribs.js
cat src/mixins/statechange/* >> target/ribs.js
cat src/mixins/support/* >> target/ribs.js
cat src/mixins/visual/* >> target/ribs.js

echo Copying to samples/lib..
cp target/ribs.js samples/lib

echo Completed!