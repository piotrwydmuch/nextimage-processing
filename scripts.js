let messages = [];
let sourceImg = document.getElementById("srcImg");
const btn_js = document.querySelector(".transform__js")
const btn_cpp = document.querySelector(".transform__cpp")
const btn_go = document.querySelector(".transform__go")
const newImgJS = document.querySelector("#newImgJS");
const newImgCPP = document.querySelector("#newImgCPP");
const newImgGO = document.querySelector("#newImgGO");
const infoDetails = document.querySelector(".info__details")
const optionImage = document.querySelectorAll(".option-img")
const optionImageList = document.querySelector(".header__img-change_ul")
const btn_js_bulk = document.querySelector(".transform__js__bulk");
const btn_cpp_bulk = document.querySelector(".transform__cpp__bulk");
const btn_go_bulk = document.querySelector(".transform__go__bulk");


let globalImageData;

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

    function makeNewImageJS(imageData) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      let data = [...imageData.data];
      
      const t0 = performance.now();
    
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      
      const t1 = performance.now();
      let info = `JS processing took ${t1 - t0} milliseconds.`
      console.info(info)

      //UI console
      addInfoToConsole(info)
      renderConsole()
      
      ctx.putImageData(new ImageData(
        new Uint8ClampedArray(data),
        imageData.width,
        imageData.height
      ),
      0,
      0);
      newImgJS.src = canvas.toDataURL();

      return t1 - t0;
    }

    function makeNewImageGo(imageData) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      let data = [...imageData.data];
      
      const t0 = performance.now();
      
      // WASM magic is here 
      const new_Uint8Array = new Uint8Array(data);
      newDataLength = add(new_Uint8Array)
      newData = new Uint8Array(newDataLength)
			SetUint8ArrayInGo(newData)

      const t1 = performance.now();
      let info = `GO processing took ${t1 - t0} milliseconds.`
      console.info(info)
      
      //UI console
      addInfoToConsole(info)
      renderConsole()

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

      return t1 - t0;
    }

    function makeNewImageCPP(imageData) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      let data = imageData.data;

      const t0 = performance.now();
      
      // WASM magic is here 
      newData = Module.processImage(data);

      const t1 = performance.now();
      let info = `C++ processing took ${t1 - t0} milliseconds.`
      console.info(info)
     
      //UI console
      addInfoToConsole(info)
      renderConsole()

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
        setSourceImage(target);
      })
    })
    
    // collecting event options in non-annonymus function
    // now its possible to remove event listeners when changing src img
    const jsEventOptions = () => {
      newImgJS.src = "";
      return makeNewImageJS(globalImageData);
    }
    const cppEventOptions = () => {
      newImgCPP.src = "";
      return makeNewImageCPP(globalImageData);
    }
    const goEventOptions = () => {
      newImgGO.src = "";
      return makeNewImageGo(globalImageData);
    }
    const bulktestingJs = () => {
      bulkTesting(jsEventOptions)
    }
    const bulktestingCpp = () => {
      bulkTesting(cppEventOptions)
    }
    const bulktestingGo = () => {
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
        // sendDataToBackend(resultArray)
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
      });
    }

    const eventsHandler = () => {
      // HAX ALERT:
      // idk how to check is there any event
      // so delete it everytime :(
      btn_js.removeEventListener("click", jsEventOptions)
      btn_cpp.removeEventListener("click", cppEventOptions)
      btn_go.removeEventListener("click", goEventOptions)
      // now add new events with new data
      btn_js.addEventListener("click", jsEventOptions)
      btn_cpp.addEventListener("click", cppEventOptions)
      btn_go.addEventListener("click", goEventOptions)

      //bulk testing (same hax like above)
      btn_js_bulk.removeEventListener("click", bulktestingJs)
      btn_cpp_bulk.removeEventListener("click", bulktestingCpp)
      btn_go_bulk.removeEventListener("click", bulktestingGo)

      btn_js_bulk.addEventListener("click", bulktestingJs)
      btn_cpp_bulk.addEventListener("click", bulktestingCpp)
      btn_go_bulk.addEventListener("click", bulktestingGo)
    }

    function setSourceImage(target) {
      sourceImg.src = target.children[0].src;
      sourceImg.alt = target.children[0].alt;

      Array.from(optionImageList.children).forEach((el) => {
        el.classList.remove("active");
      })
      target.classList.add("active");
      
      getPixelsFromImageUrl(sourceImg.src);
      eventsHandler();
      addInfoToConsole(`New image selected - ${sourceImg.alt}`);
      renderConsole();
    }

    getPixelsFromImageUrl(sourceImg.src);
  },
};
