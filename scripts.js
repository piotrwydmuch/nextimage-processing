let messages = [];
let sourceImageSelected = false;
let sourceImg = document.getElementById("srcImg");
// Grayscale
const btn_js_grayscale = document.querySelector(".transform__js__grayscale");
const btn_cpp_grayscale = document.querySelector(".transform__cpp__grayscale");
const btn_go_grayscale = document.querySelector(".transform__go__grayscale");
// Median Filter
const btn_js_medianFilter = document.querySelector(".transform__js__medianFilter");
const btn_cpp_medianFilter = document.querySelector(".transform__cpp__medianFilter");
const btn_go_medianFilter = document.querySelector(".transform__go__medianFilter");
// Grayscale (bulk testing)
const btn_js_grayscale_bulk = document.querySelector(".transform__js__grayscale__bulk");
const btn_cpp_grayscale_bulk = document.querySelector(".transform__cpp__grayscale__bulk");
const btn_go_grayscale_bulk = document.querySelector(".transform__go__grayscale__bulk");
// Median Filter (bulk testing)
const btn_js_medianFilter_bulk = document.querySelector(".transform__js__medianFilter__bulk");
const btn_cpp_medianFilter_bulk = document.querySelector(".transform__cpp__medianFilter__bulk");
const btn_go_medianFilter_bulk = document.querySelector(".transform__go__medianFilter__bulk");
// All others
const newImgJS = document.querySelector("#newImgJS");
const newImgCPP = document.querySelector("#newImgCPP");
const newImgGO = document.querySelector("#newImgGO");
const infoDetails = document.querySelector(".info__details");
const optionArray = document.querySelector(".option-array");
const optionArraySize = document.querySelector("#option-array__size");
const optionArrayWarning = document.querySelector(".option-array__warning");
const optionImage = document.querySelectorAll(".option-img");
const optionImageList = document.querySelector(".header__img-change_ul");


let globalImageData;
const MEDIAN_FILTER_KERNEL_SIZE = 3;

function medianFilter(pixels, width, height, kernelSize) {
  const filteredPixels = new Uint8ClampedArray(pixels.length);
  
  for (let i = 0; i < pixels.length; i += 4) {
    const x = Math.floor((i / 4) % width);
    const y = Math.floor((i / 4) / width);
    
    // Create an array to hold the pixel values in the kernel for each color channel
    const values = [[], [], []];
    
    // Iterate over each pixel in the kernel
    for (let ky = -kernelSize; ky <= kernelSize; ky++) {
      for (let kx = -kernelSize; kx <= kernelSize; kx++) {
        // Get the pixel value at this position for each color channel
        const px = x + kx;
        const py = y + ky;
        const index = (py * width + px) * 4;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          values[0].push(pixels[index]);
          values[1].push(pixels[index + 1]);
          values[2].push(pixels[index + 2]);
        }
      }
    }
    
    // Compute the median value for each color channel
    // only way to get color image
    const medianValues = [
      computeMedian(values[0]),
      computeMedian(values[1]),
      computeMedian(values[2])
    ];
    
    filteredPixels[i] = medianValues[0];
    filteredPixels[i + 1] = medianValues[1];
    filteredPixels[i + 2] = medianValues[2];
    filteredPixels[i + 3] = 255; 
  }
  
  return filteredPixels;
}

function computeMedian(values) {
  values.sort((a, b) => a - b);
  const medianIndex = Math.floor(values.length / 2);
  return values[medianIndex];
}

function grayscale(data) {
  for (var i = 0; i < data.length; i += 4) {
    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }

  return data;
}


var Module = {
  onRuntimeInitialized: function () {

    function getPixelsFromImageUrl(url) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
      img.onload = function () {
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        globalImageData = ctx.getImageData(0, 0, this.width, this.height);
      
        //first time run it automaticly
        // makeNewImageJS(imageData);
        // makeNewImageCPP(imageData);
        // makeNewImageGO(imageData); // fix me
      };

    }

    function makeNewImageJS(imageData, func) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      let data = [...imageData.data];
      
      const t0 = performance.now();

      if (func.name === 'medianFilter') {
        data = medianFilter(data, imageData.width, imageData.height, MEDIAN_FILTER_KERNEL_SIZE)
      } else if (func.name === 'grayscale') {
        data = grayscale(data);
      }
      
      const t1 = performance.now();
      let info = `JS processing took ${t1 - t0} milliseconds.`
      console.info(info)

      //UI console
      addInfoToConsole(info)
      renderConsole()
      
      if (imageData.height > 1) {
        ctx.putImageData(new ImageData(
          new Uint8ClampedArray(data),
          imageData.width,
          imageData.height
        ),
        0,
        0);
        newImgJS.src = canvas.toDataURL();
      }

      return t1 - t0;
    }

    function makeNewImageGo(imageData, func) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      let data = [...imageData.data];
      
      const t0 = performance.now();
      
      // WASM magic is here 
      const new_Uint8Array = new Uint8Array(data);
      if (func.name === 'medianFilter') {
        newDataLength = medianFilterGo(new_Uint8Array, imageData.width, imageData.height, MEDIAN_FILTER_KERNEL_SIZE)
      } else if (func.name === 'grayscale') {
        newDataLength = grayscaleGo(new_Uint8Array)
      }
      newData = new Uint8Array(newDataLength)
			SetUint8ArrayInGo(newData)

      const t1 = performance.now();
      let info = `GO processing took ${t1 - t0} milliseconds.`
      console.info(info)
      
      //UI console
      addInfoToConsole(info)
      renderConsole()

      if (imageData.height > 1) {
        ctx.putImageData(
          new ImageData(
            new Uint8ClampedArray(newData),
            imageData.width,
            imageData.height
          ),
          0,
          0
        );
        newImgGO.src = canvas.toDataURL();
      }

      return t1 - t0;
    }

    function makeNewImageCPP(imageData, func) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      let data = imageData.data;

      const t0 = performance.now();
      
      // WASM magic is here 
      if (func.name === 'medianFilter') {
        newData = Module.medianFilter(data, imageData.width, imageData.height, MEDIAN_FILTER_KERNEL_SIZE);
      } else if (func.name === 'grayscale') {
        newData = Module.processImage(data);
      }

      const t1 = performance.now();
      let info = `C++ processing took ${t1 - t0} milliseconds.`
      console.info(info)
     
      //UI console
      addInfoToConsole(info)
      renderConsole()

      if (imageData.height > 1) {
        ctx.putImageData(
          new ImageData(
            new Uint8ClampedArray(newData),
            imageData.width,
            imageData.height
          ),
          0,
          0
        );
        newImgCPP.src = canvas.toDataURL();
      }

      return t1 - t0;
    }

    function addInfoToConsole(msg) {
      function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }
      const d = new Date();
      let h = addZero(d.getHours());
      let m = addZero(d.getMinutes());
      let s = addZero(d.getSeconds());
      let time = `${h}:${m}:${s}`;
      let singleEntry = `${time}: ${msg}`;
      messages.push(singleEntry);
    }

    function renderConsole() {
      infoDetails.innerHTML = '';
      messages.forEach((msg) => {
        let entry = document.createElement('li');
        entry.appendChild(document.createTextNode(msg))
        infoDetails.appendChild(entry);
      })
      
      infoDetails.parentElement.scrollTo({
        top: 999999, // always to bottom
        behavior: 'smooth'
      });
    }

    optionImage.forEach((option) => {
      option.addEventListener("click", (e) => {
        const target = e.currentTarget;
        sourceImageSelected = true;
        setSourceImage(target);
      })
    })

    optionArray.addEventListener("click", (e) => {
      const target = e.currentTarget;
      sourceImageSelected = true;
      setSourceImage(target, true);
    })
    
    function isSourceImageSelected() {
      if (!sourceImageSelected) {
        alert("Select image to process first!")
        return false;
      } else {
        return true;
      }
    }
    
    // collecting event options in non-annonymus function
    // now its possible to remove event listeners when changing src img
    const jsGrayscaleEventOptions = () => {
      if (!isSourceImageSelected()) return;
      newImgJS.src = "";
      return makeNewImageJS(globalImageData, grayscale);
    }
    const jsMedianFilterEventOptions = () => {
      if (!isSourceImageSelected()) return;
      newImgJS.src = "";
      return makeNewImageJS(globalImageData, medianFilter);
    }
    const cppGrayscaleEventOptions = () => {
      if (!isSourceImageSelected()) return;
      newImgCPP.src = "";
      return makeNewImageCPP(globalImageData, grayscale);
    }
    const cppMedianFilterEventOptions = () => {
      if (!isSourceImageSelected()) return;
      newImgCPP.src = "";
      return makeNewImageCPP(globalImageData, medianFilter);
    }
    const goGrayscaleEventOptions = () => {
      if (!isSourceImageSelected()) return;
      newImgGO.src = "";
      return makeNewImageGo(globalImageData, grayscale);
    }
    const goMedianFilterEventOptions = () => {
      if (!isSourceImageSelected()) return;
      newImgGO.src = "";
      return makeNewImageGo(globalImageData, medianFilter);
    }

    const bulktestingJs = () => {
      if (!isSourceImageSelected()) return;
      bulkTesting(jsGrayscaleEventOptions)
    }
    const bulktestingCpp = () => {
      if (!isSourceImageSelected()) return;
      bulkTesting(cppEventOptions)
    }
    // const goEventOptions = () => {
    //   if (!isSourceImageSelected()) return;
    //   newImgGO.src = "";
    //   return makeNewImageGo(globalImageData);
    // }
    const bulktestingGo = () => {
      if (!isSourceImageSelected()) return;
      bulkTesting(goEventOptions)
    }

    const bulkTesting = (func) => {
      async function run() {
        resultArray = [];
        for (let i = 1; i < 11; i++) {
          await resultArray.push(func());
        }
        console.log("Done!");
        console.log(resultArray);
        //sendDataToBackend(resultArray)
      }
      run();
    }

    const sendDataToBackend = (array) => {
      fetch("http://localhost:5000/save_data", {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          times: array,
          run_name: "run_xxx",
        }),
      }).then((r) => {
        console.log(r);
      }).catch(err => {
        window.alert('Test result cannot be saved to file.  Err: ' + err)
      });
    }

    const eventsHandler = () => {
      // HAX ALERT:
      // idk how to check is there any event
      // so delete it everytime :(
      btn_js_grayscale.removeEventListener("click", jsGrayscaleEventOptions)
      btn_js_medianFilter.removeEventListener("click", jsMedianFilterEventOptions)
      btn_cpp_grayscale.removeEventListener("click", cppGrayscaleEventOptions)
      btn_cpp_medianFilter.removeEventListener("click", cppMedianFilterEventOptions)
      btn_go_grayscale.removeEventListener("click", goGrayscaleEventOptions)
      btn_go_medianFilter.removeEventListener("click", goMedianFilterEventOptions)
      // btn_go.removeEventListener("click", goEventOptions)
      // now add new events with new data
      btn_js_grayscale.addEventListener("click", jsGrayscaleEventOptions)
      btn_js_medianFilter.addEventListener("click", jsMedianFilterEventOptions)
      btn_cpp_grayscale.addEventListener("click", cppGrayscaleEventOptions)
      btn_cpp_medianFilter.addEventListener("click", cppMedianFilterEventOptions)
      btn_go_grayscale.addEventListener("click", goGrayscaleEventOptions)
      btn_go_medianFilter.addEventListener("click", goMedianFilterEventOptions)
      // btn_go.addEventListener("click", goEventOptions)

      //bulk testing (same hax like above)
      btn_js_grayscale_bulk.removeEventListener("click", bulktestingJs) // fix me
      btn_js_medianFilter_bulk.removeEventListener("click", bulktestingJs) // fix me
      btn_cpp_grayscale_bulk.removeEventListener("click", bulktestingCpp)// fix me
      // btn_cpp_medianFilter_bulk.removeEventListener("click", bulktestingCpp)// fix me
      btn_go_grayscale_bulk.removeEventListener("click", bulktestingGo)// fix me
      // btn_go_medianFilter_bulk.removeEventListener("click", bulktestingGo)// fix me

      btn_js_grayscale_bulk.addEventListener("click", bulktestingJs) // fix me
      btn_js_medianFilter_bulk.addEventListener("click", bulktestingJs) // fix me
      btn_cpp_grayscale_bulk.addEventListener("click", bulktestingCpp)// fix me
      // btn_cpp_medianFilter_bulk.addEventListener("click", bulktestingCpp)// fix me
      btn_go_grayscale_bulk.addEventListener("click", bulktestingGo)// fix me
      // btn_go_medianFilter_bulk.addEventListener("click", bulktestingGo)// fix me
    }

    function setSourceImage(target, isArr) {

      if (isArr) {
        sourceImg.src = "./imgs/placeholder.jpg";
        sourceImg.alt = `Array of data. Length: ${optionArraySize.value}`;
        globalImageData = new ImageData(optionArraySize.value / 4, 1); //ImageData(width, height); 
        // new ImageDate creates Uint8ClampedArray and its size is equal to (width*height*4)
        console.log(globalImageData)
        const warningClassList = optionArrayWarning.classList;
        (optionArraySize.value > 67108864) ? // 2^26 
          warningClassList.remove("hidden") : 
          warningClassList.add("hidden");
      } else {
        sourceImg.src = target.children[0].src;
        sourceImg.alt = target.children[0].alt;
      }

      Array.from(optionImageList.children).forEach((el) => {
        el.classList.remove("active");
      })
      target.classList.add("active");
      
      if (!isArr) getPixelsFromImageUrl(sourceImg.src);
      addInfoToConsole(`New image selected - ${sourceImg.alt}`);
      document.querySelectorAll(".buttons-container").forEach((el) => {
        el.classList.remove("inactive");
      })
      renderConsole();
    }
    
    eventsHandler();
    getPixelsFromImageUrl(sourceImg.src);
  },
};
