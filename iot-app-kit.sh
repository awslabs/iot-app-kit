#!/usr/bin/env bash

bold=$(tput bold)
normal=$(tput sgr0)

PACKAGE_LIST=(
  "@iot-app-kit/core"
  "@iot-app-kit/core-util"
  "@iot-app-kit/dashboard"
  "@iot-app-kit/react-components"
  "@iot-app-kit/source-iotsitewise"
  "@iot-app-kit/source-iottwinmaker"
)

# iot-app-kit CLI command initiator
function iot-app-kit() {
  # get the command (e.g., package, tarball, etc.) and then shift the argument stack
  local cmd=$1; shift

  # run the requested command and proxy the remaining/shifted arguments as a list (i.e., without the command)
  if [ $cmd = package ]; then
    iot-app-kit__package "$@"
  elif [ $cmd = tarball ]; then
    iot-app-kit__tarball "$@"
  elif [ $cmd = --help ]; then
    echo "
${bold}USAGE${normal}
  iot-app-kit <command> <subcommand> [flags]

${bold}CORE COMMANDS${normal}
  package:   Manage iot-app-kit packages
  tarball:   Manage iot-app-kit package tarballs

${bold}FLAGS${normal}
  --help     Show help for a command
  --version  Show iot-app-kit version
    "
  elif [ $cmd = --version ]; then
    npm pkg get version | tr -d '"'
  else
    echo "Invalid iot-app-kit command: $cmd"
    exit 1
  fi
}

# iot-app-kit package CLI command initiator
function iot-app-kit__package() {
  # get the command (e.g., build, pack, etc.) and then shift the argument stack
  local cmd=$1; shift

  # run the requested command and proxy the remaining/shifted arguments as a list(i.e., without the command)
  if [ $cmd = build ]; then
    iot-app-kit__package__build "$@"
  elif [ $cmd = pack ]; then
    iot-app-kit__package__pack "$@"
  elif [ $cmd = publish ]; then
    iot-app-kit__package__publish "$@"
  elif [ $cmd = list ]; then
    iot-app-kit__package__list "$@"
  else
    echo "Invalid iot-app-kit package command: $cmd"
    exit 1
  fi
}

# iot-app-kit tarball CLI command initiator
function iot-app-kit__tarball() {
  # get the command (e.g., copy, link, etc.) and then shift the argument stack
  local cmd=$1; shift

  # run the requested command and proxy the remaining/shifted arguments as a list (i.e., without the command)
  if [ $cmd = copy ]; then
    iot-app-kit__tarball__copy "$@"
  elif [ $cmd = link ]; then
    iot-app-kit__tarball__link "$@"
  else
    echo "Invalid iot-app-kit tarball command: $cmd"
    exit 1
  fi
}

function iot-app-kit__package__build() {
  local package=$1

  npx turbo build --filter=@iot-app-kit/$package
}

# Create iot-app-kit package tarballs
function iot-app-kit__package__pack() {
  # get the package name and then shift the argument stack
  local package=$1; shift

  # get optional pack destination from flag (default is ".")
  declare pack_destination
  while [ $# -gt 0 ] ; do
    case $1 in
      -d | --destination) pack_destination="$2" ;;
    esac
    shift
  done

  # re-direct the output to avoid echoing custom prepack/postpack npm scripts
  npm pack -w @iot-app-kit/$package --pack-destination=$pack_destination > /dev/null

  # get the filename of the newly created tarball
  local tarball=$(find . -name "iot-app-kit-$package-*.tgz" -type f -exec basename {} \; | head -n 1)

  # echo the tarball filename to allow consumer to utilize
  echo $tarball
}

# Publish iot-app-kit packages
function iot-app-kit__package__publish() {
  local package=$1

  # get optional simulation parameter from flag
  local is_sim=0
  while [ $# -gt 0 ] ; do
    case $1 in
      --simulate | -s) is_sim=1 ;;
    esac
    shift
  done

  # exit until supported
  if [ $is_sim -eq 0 ]; then
    echo "publish currently only supports simulation for testing."
    exit 1
  fi

  # create the package tarball
  local tarball=$(iot-app-kit package pack $package)
  # get the list of consuming iot-app-kit package directories
  local destinations=$(iot-app-kit package list $package)
  # copy the tarball into each consuming package's directory
  iot-app-kit tarball copy $tarball -d "$destinations"
  # link the tarball to each consuming package's package.json
  iot-app-kit tarball link $tarball -d "$destinations"
}

# List a package's iot-app-kit dependencies
function iot-app-kit__package__list() {
  local package=$1
  # get the list of iot-app-kit packages a package depends on at runtime from the package's package.json
  local deps=$(npm pkg get dependencies --ws | jq -r 'to_entries[] | select(.value | has("@iot-app-kit/'"$package"'")) | .key')

  # format json to create flat package list and echo the packages
  echo "$deps" | grep -Fx -f <(printf "%s\n" "${PACKAGE_LIST[@]}") |  awk -F'/' '{print $2}'
}

# Copy iot-app-kit package tarballs into a list of package directories
function iot-app-kit__tarball__copy() {
  local tarball=$1; shift
  local package_dirs=()

  # get list of package directories to copy into from flag
  declare destinations
  while [ $# -gt 0 ]; do
    case $1 in
      -d | --destinations) destinations="$2" ;;
    esac
    shift
  done

  # prepend package directory name to tarball destinations
  for destination in $destinations; do
    package_dirs+="packages/$destination "
  done

  # always copy tarball into smoke-test for testing
  package_dirs+="testing/smoke-test"

  # copy the tarball into each package directory (no echo)
  find $package_dirs -type d -maxdepth 0 -exec cp $tarball {} \; > /dev/null
}

# Update a list of packages to install an iot-app-kit from a tarball
function iot-app-kit__tarball__link() {
  local tarball=$1; shift
  # get the package name from the tarball
  local package=${tarball#iot-app-kit-}
  local package=${package%-*}

  # get list of package directories to copy into from flag
  declare destinations
  while [ $# -gt 0 ]; do
    case $1 in
      -d | --destinations) destinations="$2" ;;
    esac
    shift
  done

  for destination in $destinations; do
    # append the tarball file name to the destination package's files list to include it in the destination package's tarball
    npm pkg -w @iot-app-kit/$destination set files[]="$tarball"
    # update the destination package's dependencies to install the tarball instead of installing from npm
    npm pkg -w @iot-app-kit/$destination set dependencies."@iot-app-kit/$package"="file:$tarball"
  done
}

