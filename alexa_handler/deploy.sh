#!/bin/bash

set -o errexit 
set -o pipefail 
set -o nounset  
set -o xtrace

if [ -f index.zip ]; then
    rm index.zip 
fi

cd src 

npm install --save 

"c:/Program Files/7-Zip/7z.exe" a -r ../index.zip *
cd .. 
aws lambda update-function-code --publish --function-name JacksonarAlexa --zip-file fileb://index.zip