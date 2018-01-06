#!/bin/bash

set -o errexit 
set -o pipefail 
set -o nounset  
set -o xtrace

if [ -f index.zip ]; then
    rm index.zip 
fi

cd src 
"c:/Program Files/7-Zip/7z.exe" a -r ../index.zip *
cd .. 
aws lambda update-function-code --function-name JacksonarAlexa --zip-file fileb://index.zip