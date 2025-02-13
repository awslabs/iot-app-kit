#!/usr/bin/env bash

# Smoke test environment setup script

source ./iot-app-kit.sh

echo -e ${blue}${bold}"Preparing smoke smoke test environment..."${normal}${no_color}

iot-app-kit package publish core --simulate
iot-app-kit package publish core-util --simulate
iot-app-kit package publish source-iotsitewise --simulate
iot-app-kit package publish source-iottwinmaker --simulate
iot-app-kit package publish react-components --simulate
iot-app-kit package pack dashboard --destination testing/smoke-test

echo -e ${green}${bold}"Success: Smoke test environment prepared."${normal}${no_color}
