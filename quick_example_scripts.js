

  var Module = {
    onRuntimeInitialized: function() {
      //just sample test:
      console.log(Module.test([120]));

      function getPixelsFromImageUrl(url) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let img = new Image();
        let pixelsArr = [];
        
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = url;
        img.onload = function () {
          canvas.width = this.width;
          canvas.height = this.height;
          ctx.drawImage(this, 0, 0);
          let imageData = ctx.getImageData(0,0, this.width, this.height);
          pixelsArr = imageData.data;
          makeNewImageCPP(imageData);      
          makeNewImageJS(imageData);      
        };
      }
      

      
      function makeNewImageJS(imageData) {
        let newImg = document.getElementById("newImgJS");
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let image = new Image();
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        let data = imageData.data;
    
        for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i]     = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }
        ctx.putImageData(imageData, 0, 0);
      
        image.src = canvas.toDataURL();
        newImg.src = image.src;
      }

      function makeNewImageCPP(imageData) {
        const newImg = document.getElementById("newImgCPP");
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = new Image();
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        let data = imageData.data;
      
        // this result can be used for new image :) 
        // pixel manipulation should be in C++ (Module.test)
        newData = Module.test(data);

        for (var i = 0; i < newData.length; i += 4) {
          data[i]     = newData[i]; // red
          data[i + 1] = newData[i + 1]; // green
          data[i + 2] = newData[i + 2]; // blue
        }
        
        ctx.putImageData(imageData, 0, 0);
      
        image.src = canvas.toDataURL();
        newImg.src = image.src;
      }
      
      getPixelsFromImageUrl("./lenna.png")
    }
  };
