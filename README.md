# nextimage-processing

This application allows for analyzing the execution speed of selected image processing algorithms (C++, Go, JavaScript) implemented on the client-side using WebAssembly.

You can test it here: https://jolly-cray-4b8db4.netlify.app/

## Running

We need an HTTP server:

`$ python3 -m http.server`

Then access the localhost address.

## Installing and running emscripten

- Before starting, you need to add the emscripten library to the project (description in the link below)

https://emscripten.org/docs/getting_started/downloads.html#sdk-download-and-install

- If emscripten is already installed, use the following command in the `/emsdk` folder:

`$ source ./emsdk_env.sh`

## Development (C++)

To use emsdk commands (same as above):

`$ source ./emsdk_env.sh`

You can check if everything is working:

`$ emcc --version`

### Building the WASM module

Specify the output filename followed by the input filename:

`$ emcc --bind -o cpp_processing.js processing.cpp`

For large files, you need to add the flag `-s ALLOW_MEMORY_GROWTH=1`

`$ emcc --bind -o cpp_processing.js processing.cpp -s ALLOW_MEMORY_GROWTH=1`

For optimization, you can use the `-Ox` option, where `x` is the optimization aggressiveness level from 1 to 3

`$ emcc --bind -o cpp_processing.js processing.cpp -s ALLOW_MEMORY_GROWTH=1 -O2`

Image processing algorithms are located in the `./processing.cpp` file

## Development (Go)

### Building the WASM module

Treat the `processing.go` file with the following command:

`$ GOOS=js GOARCH=wasm go build -o processing.wasm`

Image processing algorithms are located in the `./processing.go` file

## Development (JavaScript)

Image processing algorithms are located in the `./scripts.js` file
