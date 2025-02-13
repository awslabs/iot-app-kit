#!/usr/bin/env bash

bold=$(tput bold)
normal=$(tput sgr0)
red='\033[0;31m'
green='\033[0;32m'
blue='\033[0;34m'
no_color='\033[0m'

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
    echo "iot-app-kit CLI

${bold}USAGE${normal}
  iot-app-kit <command> <subcommand> [flags]

${bold}CORE COMMANDS${normal}
  package:   Manage iot-app-kit packages
  tarball:   Manage iot-app-kit package tarballs

${bold}FLAGS${normal}
  --help     Show help for command
  --version  Show iot-app-kit version

${bold}EXAMPLES${normal}
  $ iot-app-kit package build core
  $ iot-app-kit package pack core-util
  $ iot-app-kit package publish dashboard --simulate
  $ iot-app-kit package list react-components
  $ iot-app-kit tarball copy iot-app-kit-source-iotsitewise-12.5.0.tgz --destinations "dashboard react-components"
  $ iot-app-kit tarball link iot-app-kit-source-iottwinmaker-12.5.0.tgz --destinations react-components
    "
    exit 0
  elif [ $cmd = --version ]; then
    npm pkg get version | tr -d '"'
  else
    echo -e ${red}${bold}"Error: Invalid iot-app-kit command: $cmd."${normal}${no_color}
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
  elif [ $cmd = --help ]; then
    echo "Work with iot-app-kit packages.

${bold}USAGE${normal}
  iot-app-kit package <subcommand> [<package-name>] [flags]

${bold}GENERAL COMMANDS${normal}
  build:   Build a package
  pack:    Pack a package
  publish: Publish a package

${bold}TARGETED COMMANDS${normal}
  list:    List the packages dependent on the package

${bold}INHERITED FLAGS${normal}
  --help   Show help for command

${bold}EXAMPLES${normal}
  $ iot-app-kit package build core
  $ iot-app-kit package pack core-util
  $ iot-app-kit package publish dashboard --simulate
  $ iot-app-kit package list react-components
    "
    exit 0
  else
    echo -e ${red}${bold}"Error: Invalid iot-app-kit package command: $cmd."${normal}${no_color}
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
  elif [ $cmd = --help ]; then
    echo "Work with iot-app-kit package tarballs.

${bold}USAGE${normal}
  iot-app-kit tarball <subcommand> [<tarball-name>] [flags]

${bold}GENERAL COMMANDS${normal}
  copy:    Copy a package tarball into one or more destination packages
  link:    Link a package tarball to the package.json file for one or more destination packages

${bold}INHERITED FLAGS${normal}
  --help   Show help for command

${bold}EXAMPLES${normal}
  $ iot-app-kit tarball copy iot-app-kit-source-iotsitewise-12.5.0.tgz --destinations "dashboard react-components"
  $ iot-app-kit tarball link iot-app-kit-source-iottwinmaker-12.5.0.tgz --destinations react-components
    "
    exit 0
  else
    echo -e ${red}${bold}"Error: Invalid iot-app-kit tarball command: $cmd."${normal}${no_color}
    exit 1
  fi
}

function iot-app-kit__package__build() {
  if [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Build iot-app-kit packages.

${bold}USAGE${normal}
  iot-app-kit package build [<package-name>]

${bold}INHERITED FLAGS${normal}
  --help   Show help for command

${bold}EXAMPLES${normal}
  $ iot-app-kit package build core
    "
    exit 0
  fi

  local package=$1
  local needs_help=false
  while [ $# -gt 0 ]; do
    case $1 in
      -h | --help) needs_help=true ;;
    esac
    shift
  done

  echo -e ${blue}${bold}"Building package ($package)..."${normal}${no_color}

  npx turbo build --filter=@iot-app-kit/$package
}

# Create iot-app-kit package tarballs
function iot-app-kit__package__pack() {
  if [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Pack iot-app-kit packages.

${bold}USAGE${normal}
  iot-app-kit package pack [<package-name>] [flags]

${bold}FLAGS${normal}
  -d, --destination   Specify a path to output the tarball

${bold}INHERITED FLAGS${normal}
  --help   Show help for command

${bold}EXAMPLES${normal}
  $ iot-app-kit package pack core
  $ iot-app-kit package pack dashboard --destination testing/smoke-test
    "
    exit 0
  fi

  # get the package name and then shift the argument stack
  local package=$1; shift
  local current_dir=$(pwd)
  local destination=undefined
  while [ $# -gt 0 ]; do
    case $1 in
      -d | --destination) destination="$2" ;;
    esac
    shift
  done

  declare pack_destination
  if [ "$destination" = undefined ]; then
    pack_destination=$current_dir
  elif [ "$destination" = "testing/smoke-test" ]; then
    pack_destination="$current_dir/testing/smoke-test"
  else
    pack_destination="$current_dir/packages/$destination"
  fi

  echo -e ${blue}${bold}"Packing package ($package)..."${normal}${no_color}

  npx turbo pack --filter @iot-app-kit/$package --cwd $current_dir --output-logs=errors-only -- --pack-destination=$pack_destination

  # integrity check
  local tarball=$(get_package_tarball_filename $package)
  if [ $(is_file_created $pack_destination/$tarball) = false ]; then
    echo -e ${red}${bold}"Error: Package ($package) was incorrectly packaged."${normal}${no_color}
    exit 1
  else
    echo -e ${green}${bold}"Success: Package ($package) was correctly packaged."${no_color}${normal}
  fi
}

# Publish iot-app-kit packages
function iot-app-kit__package__publish() {
  if [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Publish iot-app-kit packages.

${bold}USAGE${normal}
  iot-app-kit package publish [<package-name>] [flags]

${bold}FLAGS${normal}
  -s, --simulate   Simulate publishing the package

${bold}INHERITED FLAGS${normal}
  --help   Show help for command

${bold}EXAMPLES${normal}
  $ iot-app-kit package publish core --simulate
    "
    exit 0
  fi

  local package=$1

  # get optional simulation parameter from flag
  local is_sim=false
  while [ $# -gt 0 ]; do
    case $1 in
      --simulate | -s) is_sim=true ;;
    esac
    shift
  done

  # exit until supported
  if [ "$is_sim" = false ]; then
    echo -e ${blue}${bold}"Publishing package ($package)..."${normal}${no_color}
    npm publish -w @iot-app-kit/$package
    echo -e ${green}${bold}"Success: Package ($package) was successfully published."${no_color}${normal}
  else
    echo -e ${blue}${bold}"Publishing package ($package) (simulated)..."${normal}${no_color}
    # create the package tarball
    iot-app-kit package pack $package
    local tarball=$(get_package_tarball_filename $package)
    # get the list of consuming iot-app-kit package directories
    local destinations=$(iot-app-kit package list $package)
    # copy the tarball into each consuming package's directory
    iot-app-kit tarball copy $tarball -d "$destinations"
    # link the tarball to each consuming package's package.json
    iot-app-kit tarball link $tarball -d "$destinations"
    echo -e ${green}${bold}"Success: Package ($package) was successfully published (simulated)."${no_color}${normal}
  fi
}

# List a package's iot-app-kit dependencies
function iot-app-kit__package__list() {
  if [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "List the internal dependencies of an iot-app-kit package.

${bold}USAGE${normal}
  iot-app-kit package list [<package-name>]

${bold}INHERITED FLAGS${normal}
  --help   Show help for command

${bold}EXAMPLES${normal}
  $ iot-app-kit package list core
    "
    exit 0
  fi

  local package=$1
  # get the list of iot-app-kit packages a package depends on at runtime from the package's package.json
  local deps=$(npm pkg get dependencies --ws | jq -r 'to_entries[] | select(.value | has("@iot-app-kit/'"$package"'")) | .key')

  # format json to create flat package list and echo the packages (e.g., core core-util dashboard)
  echo "$deps" | grep -Fx -f <(printf "%s\n" "${PACKAGE_LIST[@]}") |  awk -F'/' '{print $2}'
}

# Copy iot-app-kit package tarballs into a list of package directories
function iot-app-kit__tarball__copy() {
  if [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Copy iot-app-kit package tarballs to one or more destination packages.

${bold}USAGE${normal}
  iot-app-kit tarball copy [<tarball-name>] [flags]

${bold}FLAGS${normal}
  -d, --destinations   List of destination packages to copy package tarball into.

${bold}INHERITED FLAGS${normal}
  --help   Show help for command

${bold}EXAMPLES${normal}
  $ iot-app-kit tarball copy iot-app-kit-core-12.5.0.tgz --destinations react-components
  $ iot-app-kit tarball copy iot-app-kit-core-12.5.0.tgz --destinations "dashboard react-components"
    "
    exit 0
  fi

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

  for destination in $destinations; do
    echo -e ${blue}${bold}"Copying package tarball ($tarball) into destination ($destination)..."${normal}${no_color}
  done
  echo -e ${blue}${bold}"Copying package tarball ($tarball) into destination (smoke-test)..."${normal}${no_color}

  # copy the tarball into each package directory (no echo)
  find $package_dirs -type d -maxdepth 0 -exec cp $tarball {} \; > /dev/null

  # integrity check
  for destination in $destinations; do
    if [ $(is_file_created packages/$destination/$tarball) = false ]; then
      echo -e ${red}${bold}"Error: Package tarball ($tarball) was incorrectly copied into destination ($destination)."${normal}${no_color}
      exit 1
    else
      echo -e ${green}${bold}"Success: Package tarball ($tarball) was correctly copied into destination ($destination)."${normal}${no_color}
    fi
  done

  if [ $(is_file_created testing/smoke-test/$tarball) = false ]; then
    echo -e ${red}${bold}"Error: Package tarball ($tarball) was incorrectly copied into destination (smoke-test)."${normal}${no_color}
    exit 1
  else
    echo -e ${green}${bold}"Success: Package tarball ($tarball) was correctly copied into destination (smoke-test)."${normal}${no_color}
  fi
}

# Update a list of packages to install an iot-app-kit from a tarball
function iot-app-kit__tarball__link() {
  if [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Link iot-app-kit package tarballs to the package.json of one or more destination packages.

${bold}USAGE${normal}
  iot-app-kit tarball link [<tarball-name>] [flags]

${bold}FLAGS${normal}
  -d, --destinations   List of destination packages to link package tarball to.

${bold}INHERITED FLAGS${normal}
  --help   Show help for command

${bold}EXAMPLES${normal}
  $ iot-app-kit tarball link iot-app-kit-core-12.5.0.tgz --destinations react-components
  $ iot-app-kit tarball link iot-app-kit-core-12.5.0.tgz --destinations "dashboard react-components"
    "
    exit 0
  fi

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
    echo -e ${blue}${bold}"Linking package tarball ($tarball) to destination ($destination)..."${normal}${no_color}
    # append the tarball file name to the destination package's files list to include it in the destination package's tarball
    npm pkg -w @iot-app-kit/$destination set files[]="$tarball"
    # update the destination package's dependencies to install the tarball instead of installing from npm
    npm pkg -w @iot-app-kit/$destination set dependencies."@iot-app-kit/$package"="file:$tarball"
  done

  # integrity check
  for destination in $destinations; do
    if [ $(is_tarball_linked $tarball $destination) = false ]; then
      echo -e ${red}${bold}"Error: Package tarball ($tarball) was incorrectly linked to destination ($destination)."${normal}${no_color}
      exit 1
    else
      echo -e ${green}${bold}"Success: Package tarball ($tarball) was correctly linked to destination ($destination)."${normal}${no_color}
    fi
  done
}

function get_package_tarball_filename() {
  local package=$1;
  local tarball=$(find . -name "iot-app-kit-$package-*.tgz" -type f -exec basename {} \; | head -n 1)

  echo $tarball
}

function is_file_created() {
  local filename=$1

  if [ -f $filename ]; then
    echo true
  else
    echo false
  fi
}

function is_tarball_linked() {
  local tarball=$1
  local destination=$2

  npm pkg -w @iot-app-kit/$destination get files | grep -q $tarball | echo true || echo false
}
