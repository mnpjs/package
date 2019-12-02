## Binary

A binary file is created to execute the package from command line.

There are two entries in the `bin` property of _package.json_: the standard path to the executable, and the `mnp-dev` file which points to the source location. This is here so that it is possible to run the binary locally when developing, without having to build it first.