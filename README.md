# nextimage-processing

## Uruchamianie

Potrzebujemy serwera http:

`$ python3 -m http.server`

następnie wchodzimy pod adres localhost.

## Instalacja i uruchomienie emscripten

- przed startem potrzebne jest dodanie do projektu biblioteki emscripten (opis w poniższym linku)

https://emscripten.org/docs/getting_started/downloads.html#sdk-download-and-install

- jeśli jest już zainstalowany emscripten to w folderze `/emsdk` używamy komendy

`$ source ./emsdk_env.sh`

## Development (c++)

Żeby korzystać z komend emsdk (to samo co wyżej):

`$ source ./emsdk_env.sh`

Można sprawdzić czy wszystko działa

`$ emcc --version`

### Budowanie modułu WASM

Podajemy kolejno nazwe pliku wyjściowego oraz wejsciowego:

`$ emcc --bind -o cpp_processing.js processing.cpp`

Dla dużych plików potrzebne dodanie flagi `-s ALLOW_MEMORY_GROWTH=1`

`$ emcc --bind -o cpp_processing.js processing.cpp -s ALLOW_MEMORY_GROWTH=1`

W celu optymalizacji można użyć opcji `-Ox`, gdzie `x` to poziom agresji optymalizacji od 1 do 3

`$ emcc --bind -o cpp_processing.js processing.cpp -s ALLOW_MEMORY_GROWTH=1 -O2`

Algorytmy przetwarzania obrazów znajdują się w pliku `./processing.cpp`

## Development (Go)

### Budowanie modułu WASM

Plik `processing.go` traktujemy następującą komendą:

`$ GOOS=js GOARCH=wasm go build -o processing.wasm`

Algorytmy przetwarzania obrazów znajdują się w pliku `./processing.go`

## Development (JavaScript)

Algorytmy przetwarzania obrazów znajdują się w pliku `./scripts.js`