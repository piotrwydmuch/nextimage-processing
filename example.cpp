#include <emscripten/bind.h>

using namespace emscripten;

float lerp(float a, float b, float t) {
    return (1 - t) * a + t * b;
}

uint8_t showArr(uint8_t arr) {
    return arr;
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("lerp", &lerp);
    function("showArr", &showArr);
}