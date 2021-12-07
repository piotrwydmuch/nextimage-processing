#include <emscripten/bind.h>
#include <emscripten/val.h>

auto test(const emscripten::val &input) {
  auto data = emscripten::convertJSArrayToNumberVector<float>(input); // copies data

    int i;
    for (i=0;i < data.size();i++) {
        data[i] = data[i] * 3;
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