#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <iostream>

auto test(const emscripten::val &input) {
  auto data = emscripten::convertJSArrayToNumberVector<int>(input); // copies data

    int i;
    for (i = 0; i < data.size() / 2; i += 4) {
        int avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }

  // make a typed array view of the output
  emscripten::val view{ emscripten::typed_memory_view(data.size(), data.data()) };
  // create new typed array to return
  auto result = emscripten::val::global("Uint8Array").new_(data.size());
  // copy data from generated output to return object
  result.call<void>("set", view);

  return result;
}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::function("test", &test);
}