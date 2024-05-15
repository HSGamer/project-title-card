function getOptionsFromForm() {
    let options = {}
    options.backgroundStyle = document.getElementById('backgroundStyle').value;
    options.borderRadius = document.getElementById('borderRadius').value;
    options.borderMargin = document.getElementById('borderMargin').value;
    options.imageLink = document.getElementById('imageLink').value;
    options.title = document.getElementById('title').value;
    options.titleStyle = document.getElementById('titleStyle').value;
    options.description = document.getElementById('description').value;
    options.descriptionStyle = document.getElementById('descriptionStyle').value;
    return options;
}

function setOptionsToForm(options) {
    document.getElementById('backgroundStyle').value = options.backgroundStyle;
    document.getElementById('borderRadius').value = options.borderRadius;
    document.getElementById('borderMargin').value = options.borderMargin;
    document.getElementById('imageLink').value = options.imageLink;
    document.getElementById('title').value = options.title;
    document.getElementById('titleStyle').value = options.titleStyle;
    document.getElementById('description').value = options.description;
    document.getElementById('descriptionStyle').value = options.descriptionStyle;
}

async function previewSVG() {
    let svg = await generateSVG(getOptionsFromForm(), true);
    document.getElementById('svgContainer').innerHTML = new XMLSerializer().serializeToString(svg);
}

async function downloadSVG() {
    let svg = await generateSVG(getOptionsFromForm());
    let svgData = new XMLSerializer().serializeToString(svg);
    let blob = new Blob([svgData], {type: "image/svg+xml"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'Card.svg';
    a.click();
    URL.revokeObjectURL(url);
}

async function downloadPNG() {
    let svg = await generateSVG(getOptionsFromForm());
    let svgData = new XMLSerializer().serializeToString(svg);
    let blob = new Blob([svgData], {type: "image/svg+xml"});
    let url = URL.createObjectURL(blob);
    let img = new Image();
    img.src = url;
    img.onload = function () {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function (blob) {
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'Card.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
}

async function uploadFile() {
    // Open file picker
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    // Set image link
    document.getElementById('imageLink').value = await new Promise((resolve) => {
        input.addEventListener('change', () => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(input.files[0]);
        });
    });
}

document.getElementById('btnReview').addEventListener('click', previewSVG);
document.getElementById('btnDownload').addEventListener('click', downloadSVG);
document.getElementById('btnDownloadPNG').addEventListener('click', downloadPNG);
document.getElementById('btnUpload').addEventListener('click', uploadFile);
setOptionsToForm(defaultOptions);