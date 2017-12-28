#!/bin/bash

set -o errexit 
set -o pipefail 
set -o nounset  
set -o xtrace

npm run build && aws s3 sync build/ s3://jacksonar 
