document.getElementById('embedForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var coverInput = document.getElementById('coverInput').files[0];
    var watermarkInput = document.getElementById('watermarkInput').files[0];

    if (coverInput && watermarkInput) {
        var reader = new FileReader();
        reader.onload = function() {
            var coverImg = new Image();
            coverImg.onload = function() {
                var watermarkImg = new Image();
                watermarkImg.onload = function() {
                    var canvas = document.createElement('canvas');
                    canvas.width = coverImg.width;
                    canvas.height = coverImg.height;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(coverImg, 0, 0);
                    ctx.drawImage(watermarkImg, 0, 0);

                    var downloadLink = document.getElementById('downloadLink');
                    downloadLink.href = canvas.toDataURL();
                    downloadLink.style.display = 'inline';
                    downloadLink.click();
                };
                watermarkImg.src = URL.createObjectURL(watermarkInput);
            };
            coverImg.src = reader.result;
        };
        reader.readAsDataURL(coverInput);
    } else {
        alert('Please select both cover image and watermark image.');
    }
});

document.getElementById('extractBtn').addEventListener('click', function() {
    var extractInput = document.getElementById('extractInput').files[0];

    if (extractInput) {
        var reader = new FileReader();
        reader.onload = function() {
            var coverImg = new Image();
            coverImg.onload = function() {
                var watermarkData = extractWatermark(coverImg);

                var watermarkCanvas = document.getElementById('watermarkImg');
                watermarkCanvas.src = watermarkData;
                watermarkCanvas.style.display = 'inline';
            };
            coverImg.src = reader.result;
        };
        reader.readAsDataURL(extractInput);
    } else {
        alert('Please select the cover image with watermark.');
    }
});

function extractWatermark(coverImg) {
    var canvas = document.createElement('canvas');
    canvas.width = coverImg.width;
    canvas.height = coverImg.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(coverImg, 0, 0);

    var coverImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var watermarkData = new Uint8ClampedArray(canvas.width * canvas.height * 4);

    for (var i = 0; i < coverImageData.data.length; i += 4) {
        watermarkData[i] = coverImageData.data[i] % 2 * 255;
        watermarkData[i + 1] = coverImageData.data[i + 1] % 2 * 255;
        watermarkData[i + 2] = coverImageData.data[i + 2] % 2 * 255;
        watermarkData[i + 3] = 255;
    }

    var watermarkCanvas = document.createElement('canvas');
    watermarkCanvas.width = canvas.width;
    watermarkCanvas.height = canvas.height;
    var watermarkCtx = watermarkCanvas.getContext('2d');
    var watermarkImageData = watermarkCtx.createImageData(canvas.width, canvas.height);
    watermarkImageData.data.set(watermarkData);
    watermarkCtx.putImageData(watermarkImageData, 0, 0);

    return watermarkCanvas.toDataURL();
}
