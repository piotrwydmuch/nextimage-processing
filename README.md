# nextimage-processing

## start

- przed startem potrzebne jest dodanie do projektu biblioteki emscripten

https://emscripten.org/docs/getting_started/downloads.html#sdk-download-and-install

- jeśli jest już zainstalowany emscripten to w folderze /emsdk

`source ./emsdk_env.sh`

## development

- potrzebujemy serwera http:

`python3 -m http.server`

- zbudowanie modułu wasm (w miejsce `example` podajemy kolejno nazwe pliku wyjściowego oraz wejsciowego):

`emcc --bind -o example.js example.cpp`