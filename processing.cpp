#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <iostream>
#include <chrono>  // for high_resolution_clock

auto processImage(const emscripten::val &input) {
  auto data = emscripten::convertJSArrayToNumberVector<int>(input); // copies data

  // Record start time
  auto start_time = std::chrono::high_resolution_clock::now();

  for (int i = 0; i < data.size(); i += 4) {
    int avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i]     = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }

  // Record end time
  auto end_time = std::chrono::high_resolution_clock::now();
  auto time = end_time - start_time;

  std::cout << "took " <<
    time/std::chrono::milliseconds(1) << "ms to run.\n";

  // make a typed array view of the output
  emscripten::val view{ emscripten::typed_memory_view(data.size(), data.data()) };
  // create new typed array to return
  auto result = emscripten::val::global("Uint8Array").new_(data.size());
  // copy data from generated output to return object
  result.call<void>("set", view);

  return result;
}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::function("processImage", &processImage);
}