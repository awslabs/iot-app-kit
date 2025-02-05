#!/usr/bin/env bash

# Smoke test environment setup script

source ./iot-app-kit.sh
iot-app-kit package build dashboard
iot-app-kit package publish core --simulate
iot-app-kit package publish core-util --simulate
iot-app-kit package publish source-iotsitewise --simulate
iot-app-kit package publish source-iottwinmaker --simulate
iot-app-kit package publish react-components --simulate
iot-app-kit package pack dashboard --destination testing/smoke-test
