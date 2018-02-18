#!/usr/bin/env sh

########################################################################################################################
# @param $1 The folder inside ./benchmark folder which contains the items to benchmark.
#
# Each subfolder in the given folder have to contain all the src/ files. This script copy these files one folder by
# other, builds the app then launches the lighthouse from google. Then from the json gets the values which
# has meaning for the benchmark and puts into the given folder under the name "results.txt".
#
# WARNING: Requirements:
# The program: jq --> for extracting values from js
# An running instance of local server on port 5000. This can be started with command: `npm run prod`.
#
########################################################################################################################

if [ ! -d "./benchmark/$1" ]; then
    echo "./benchmark/$1 does not exists."
    exit 1
fi

TEST_CASES_FOLDER=./benchmark/TestCases/
BACKUP_FOLDER=./benchmark/Backup

BASE_DIR=./benchmark/$1/
JSON_FILE=result.json
REPORT_FILE=results.txt


echo "Backup current ./scr"
mkdir ${BACKUP_FOLDER}
mv ./src/* ${BACKUP_FOLDER}

echo "Running benchmark for: $1"

# Removes if already existed an old file.
rm ${BASE_DIR}/${REPORT_FILE}

# For each directory...
for dir in ${BASE_DIR}/*; do
    if [ -d "${dir}" ]; then
        echo "Running benchmark for: ${dir}..."
        mv ${dir}/src/* ./src/

        npm run build
        ./node_modules/lighthouse/lighthouse-cli/index.js http://localhost:5000 --quiet -perf --output json --output-path ${BASE_DIR}/${JSON_FILE}
        printf "%s's first meaningful value: " ${dir} >> ${BASE_DIR}/${REPORT_FILE}
        jq '.audits["first-meaningful-paint"].displayValue' ${BASE_DIR}/${JSON_FILE} >> ${BASE_DIR}/${REPORT_FILE}
        rm ${BASE_DIR}/${JSON_FILE}

        mv ./src/* ${dir}/src/
    fi
done

echo "Restoring the original ./src:"
mv ${BACKUP_FOLDER}/* ./src/
rmdir ${BACKUP_FOLDER}

echo "Done"