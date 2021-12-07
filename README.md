# nextimage-processing

- przed startem potrzebne jest dodanie do projektu biblioteki emscripten

https://emscripten.org/docs/getting_started/downloads.html#sdk-download-and-install

- zbudowanie modułu wasm (w miejsce `example` podajemy kolejno nazwe pliku wyjściowego oraz wejsciowego):

`emcc --bind -o example.js example.cpp`