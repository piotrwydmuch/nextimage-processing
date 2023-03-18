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

// Computes the median value of a vector of integers
int computeMedian(std::vector<int>& values) {
  std::sort(values.begin(), values.end());
  int medianIndex = values.size() / 2;
  return values[medianIndex];
}

// Applies median filtering to an image represented as a one-dimensional array of pixels
auto medianFilter(const emscripten::val &input, int width, int height, int kernelSize) {
  auto pixels = emscripten::convertJSArrayToNumberVector<int>(input); // copies data

  // Create a new vector to hold the filtered pixels
  std::vector<unsigned char> filteredPixels(width * height * 4);

  // Record start time
  auto start_time = std::chrono::high_resolution_clock::now();
  
  // Iterate over each pixel in the image
  for (int i = 0; i < width * height * 4; i += 4) {
    int x = (i / 4) % width;
    int y = (i / 4) / width;
    
    // Create a vector to hold the pixel values in the kernel for each color channel
    std::vector<int> values[3];
    
    // Iterate over each pixel in the kernel
    for (int ky = -kernelSize; ky <= kernelSize; ky++) {
      for (int kx = -kernelSize; kx <= kernelSize; kx++) {
        // Get the pixel value at this position for each color channel
        int px = x + kx;
        int py = y + ky;
        int index = (py * width + px) * 4;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          values[0].push_back(pixels[index]);
          values[1].push_back(pixels[index + 1]);
          values[2].push_back(pixels[index + 2]);
        }
      }
    }
    
    // Compute the median value for each color channel
    std::vector<int> medianValues = {
      computeMedian(values[0]),
      computeMedian(values[1]),
      computeMedian(values[2])
    };
    
    // Set the pixel value in the filtered image for each color channel
    filteredPixels[i] = medianValues[0];
    filteredPixels[i + 1] = medianValues[1];
    filteredPixels[i + 2] = medianValues[2];
    filteredPixels[i + 3] = 255; // Alpha channel is always 255
  }
  
  // Copy the filtered pixels back to the original pixel array
  for (int i = 0; i < width * height * 4; i++) {
    pixels[i] = filteredPixels[i];
  }

  // Record end time
  auto end_time = std::chrono::high_resolution_clock::now();
  auto time = end_time - start_time;

  std::cout << "took " <<
    time/std::chrono::milliseconds(1) << "ms to run.\n";

  // make a typed array view of the output
  emscripten::val view{ emscripten::typed_memory_view(pixels.size(), pixels.data()) };
  // create new typed array to return
  auto result = emscripten::val::global("Uint8Array").new_(pixels.size());
  // copy data from generated output to return object
  result.call<void>("set", view);

  return result;

}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::register_vector<int>("VectorInt");
  emscripten::function("processImage", &processImage);
  emscripten::function("medianFilter", &medianFilter);
}
