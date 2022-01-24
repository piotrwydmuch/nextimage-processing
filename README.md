# nextimage-processing

## start

- przed startem potrzebne jest dodanie do projektu biblioteki emscripten

https://emscripten.org/docs/getting_started/downloads.html#sdk-download-and-install

- jeśli jest już zainstalowany emscripten to w folderze /emsdk

```source ./emsdk_env.sh```

## development (c++)

-  żeby korzystać z komend emsdk

$ source ./emsdk_env.sh

-  można sprawdzić czy wszystko działa

$ emcc --version

- zbudowanie modułu wasm (w miejsce `example` podajemy kolejno nazwe pliku wyjściowego oraz wejsciowego):

```emcc --bind -o example.js example.cpp```

- dla dużych plików potrzebne dodanie flagi ```-s ALLOW_MEMORY_GROWTH=1```

```emcc --bind -o example.js example.cpp -s ALLOW_MEMORY_GROWTH=1```

## development (go lang)

- plik `processing.go` traktujemy następującą komendą

```GOOS=js GOARCH=wasm go build -o processing.wasm```

## testowanie

- potrzebujemy serwera http:

```python3 -m http.server```