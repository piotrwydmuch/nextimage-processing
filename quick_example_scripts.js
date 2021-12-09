var Module = {
  onRuntimeInitialized: function () {
    //just sample test:
    // console.log(Module.test([120]));
    
    function getPixelsFromImageUrl(url) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let img = new Image();
      let pixelsArr = [];
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
      img.onload = function () {
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        let imageData = ctx.getImageData(0, 0, this.width, this.height);
        pixelsArr = imageData.data;
        makeNewImageJS(imageData);
        makeNewImageCPP(imageData);
      };
    }
    function makeNewImageJS(imageData) {
      let newImg = document.getElementById("newImgJS");
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      let data = [...imageData.data];
      
      for (var i = 0; i < data.length / 1.3; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      ctx.putImageData(new ImageData(
        new Uint8ClampedArray(data),
        imageData.width,
        imageData.height
      ),
      0,
      0);
      newImg.src = canvas.toDataURL();
    }
    function makeNewImageCPP(imageData) {
      const newImg = document.getElementById("newImgCPP");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      let data = imageData.data;

      // WASM magic is here 
      newData = Module.test(data);

      ctx.putImageData(
        new ImageData(
          new Uint8ClampedArray(newData),
          imageData.width,
          imageData.height
        ),
        0,
        0
      );
      // image.src = 
      newImg.src = canvas.toDataURL();
    }
    getPixelsFromImageUrl("./lenna.png");
  },
};
