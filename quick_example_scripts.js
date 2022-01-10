const btn_js = document.querySelector(".transform__js")
const btn_cpp = document.querySelector(".transform__cpp")
const btn_go = document.querySelector(".transform__go")
const newImgJS = document.querySelector("#newImgJS");
const newImgCPP = document.querySelector("#newImgCPP");
const newImgGO = document.querySelector("#newImgGO");
const infoDetails = document.querySelector(".info__details")

var Module = {
  onRuntimeInitialized: function () {
    //just sample test:
    // console.log(Module.test([120]));

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
        let imageData = ctx.getImageData(0, 0, this.width, this.height);

        btn_js.addEventListener("click", () => {
          newImgJS.src = "";
          makeNewImageJS(imageData);
        })
        btn_cpp.addEventListener("click", () => {
          newImgCPP.src = "";
          makeNewImageCPP(imageData);
        })

        btn_go.addEventListener("click", () => {
          newImgGO.src = "";
          makeNewImageGo(imageData);
        })
        
        //first time run it automaticly
        makeNewImageJS(imageData);
        makeNewImageCPP(imageData);
        makeNewImageGO(imageData); // fix me
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
      infoDetails.textContent = info
      
      ctx.putImageData(new ImageData(
        new Uint8ClampedArray(data),
        imageData.width,
        imageData.height
      ),
      0,
      0);
      newImgJS.src = canvas.toDataURL();
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
      infoDetails.textContent = info

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

    function makeNewImageCPP(imageData) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      let data = imageData.data;

      const t0 = performance.now();
      
      // WASM magic is here 
      newData = Module.test(data);

      const t1 = performance.now();
      let info = `C++ processing took ${t1 - t0} milliseconds.`
      console.info(info)
      infoDetails.textContent = info

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
    getPixelsFromImageUrl("./lenna.png");
  },
};
