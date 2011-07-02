#!/bin/ksh

CMD="java -jar ../lib/jsdoc-toolkit/jsrun.jar deploy.js $@"
echo $CMD
$CMD

