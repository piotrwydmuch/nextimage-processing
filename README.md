# nextimage-processing

## uruchamianie

- potrzebujemy serwera http:

```python3 -m http.server```

następnie wchodzimy pod adres `http://localhost:8000/`

## development (ogólnie)

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

```emcc --bind -o cpp_processing.js processing.cpp```

- dla dużych plików potrzebne dodanie flagi ```-s ALLOW_MEMORY_GROWTH=1```

```emcc --bind -o cpp_processing.js processing.cpp -s ALLOW_MEMORY_GROWTH=1```

- algorytmy przetwarzania obrazów znajdują się w pliku `./processing.cpp`

## development (go lang)

- plik `processing.go` traktujemy następującą komendą

```GOOS=js GOARCH=wasm go build -o processing.wasm```

- algorytmy przetwarzania obrazów znajdują się w pliku `./processing.go`

## development (js)

- algorytmy przetwarzania obrazów znajdują się w pliku `./scripts.js`