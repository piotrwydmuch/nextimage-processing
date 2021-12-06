//calling wasm modules    
var Module = {
  onRuntimeInitialized: function() {
    console.log('lerp result: ' + Module.lerp(1, 5, 0.5));
    console.log('my result: ' + Module.showArr([2,4,5]));
  }
};


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
    modifyImage(imageData);
    makeNewImage(imageData);      
  };
}

function modifyImage(imageData) {
  //const pixels = imageData.data;

}

function makeNewImage(imageData) {
  let newImg = document.getElementById("newImg");
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  let image = new Image();
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  let data = imageData.data;

  var Module = {
    onRuntimeInitialized: function() {
      console.log('my cpp result: ' + Module.showArr(data));
    }
  };

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




getPixelsFromImageUrl("./lenna.png")