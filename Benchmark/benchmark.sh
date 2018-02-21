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

##############################################################
# Global variables about file destinations.                  #
##############################################################
TEST_CASES_FOLDER=./benchmark/TestCases/
BASE_DIR=./benchmark/$1/
JSON_FILE=${BASE_DIR}/result.json
REPORT_FILE=${BASE_DIR}/results.txt

##############################################################
# Builds with the npm build then launches lighthouse at it.  #
# The results are written to ${REPORT_FILE}                  #
##############################################################
run_test() {
    npm run build

    ./node_modules/lighthouse/lighthouse-cli/index.js http://localhost:5000 --quiet -perf --output json --output-path ${JSON_FILE}

    printf "\t\t first meaningful paint: " >> ${REPORT_FILE}
    jq '.audits["first-meaningful-paint"].rawValue' ${JSON_FILE} >> ${REPORT_FILE}
    printf "\t\t first interactive: " >> ${REPORT_FILE}
    jq '.audits["first-interactive"].rawValue' ${JSON_FILE} >> ${REPORT_FILE}

    rm ${JSON_FILE}
}

###########################################
# Removes if already existed an old file. #
###########################################
rm ${REPORT_FILE}

# For each directory...
for dir in ${BASE_DIR}/*; do
    if [ -d "${dir}" ]; then
        printf "Tests for: %s\n" $(basename ${dir}) >> ${REPORT_FILE}

        ###########################################
        # Copy the app.tsx file where component   #
        # will be loaded.                         #
        ###########################################
        cp ${dir}/App.tsx ./src/App.tsx

        ###########################################
        ###### Replacing the component files ######
        ###########################################
        cp ${dir}/components/* ./src/components/

        ###########################################
        ##### Copy one by one every test case #####
        ###########################################
        for generator in ${TEST_CASES_FOLDER}/*; do

            # Copy generator to location
            cp ${generator} ./src/Generator.tsx
            printf "\tTest Case: %s:\n" $(basename ${generator}) >> ${REPORT_FILE}

            # Run the test on the prepared files.
            run_test
        done
    fi
done

echo "Done"