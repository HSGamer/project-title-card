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
    options.defs = document.getElementById('defs').value;
    options.generateType = document.getElementById('generateType').value;
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
    document.getElementById('defs').value = options.defs;
    document.getElementById('generateType').value = options.generateType;
}

async function previewSVG() {
    let options = getOptionsFromForm();
    let svg = await generate(options);
    document.getElementById('svgContainer').innerHTML = new XMLSerializer().serializeToString(svg);
}

async function downloadSVG() {
    let options = getOptionsFromForm();
    options.imageLink = await resolveImageLink(options.imageLink);
    let svg = await generate(options);
    let svgData = new XMLSerializer().serializeToString(svg);
    let blob = new Blob([svgData], {type: "image/svg+xml"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'card.svg';
    a.click();
    URL.revokeObjectURL(url);
}

async function downloadPNG() {
    let resizePercentage = prompt('Enter resize percentage (1-100)', '100');
    if (resizePercentage === null) return;
    resizePercentage = parseInt(resizePercentage);
    if (isNaN(resizePercentage) || resizePercentage < 1 || resizePercentage > 100) {
        alert('Invalid resize percentage');
        return;
    }

    let options = getOptionsFromForm();
    options.imageLink = await resolveImageLink(options.imageLink);
    let svg = await generate(options);
    let svgData = new XMLSerializer().serializeToString(svg);
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    img.onload = () => {
        canvas.width = img.width * resizePercentage / 100;
        canvas.height = img.height * resizePercentage / 100;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let url = canvas.toDataURL('image/png');
        let a = document.createElement('a');
        a.href = url;
        a.download = 'card.png';
        a.click();
    };
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

async function exportOptions() {
    let options = getOptionsFromForm();
    let blob = new Blob([JSON.stringify(options)], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'card-options.json';
    a.click();
    URL.revokeObjectURL(url);
}

async function importOptions() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.click();

    input.addEventListener('change', async () => {
        let reader = new FileReader();
        reader.onload = () => setOptionsToForm(JSON.parse(reader.result));
        reader.readAsText(input.files[0]);
    });
}

function loadGenerateTypes() {
    let select = document.getElementById('generateType');
    for (let type of Object.keys(generateTypes)) {
        let option = document.createElement('option');
        option.value = type;
        option.innerText = type;
        select.appendChild(option);
    }
}

document.getElementById('btnReview').addEventListener('click', previewSVG);
document.getElementById('btnDownload').addEventListener('click', downloadSVG);
document.getElementById('btnDownloadPNG').addEventListener('click', downloadPNG);
document.getElementById('btnUpload').addEventListener('click', uploadFile);
document.getElementById('btnExport').addEventListener('click', exportOptions);
document.getElementById('btnImport').addEventListener('click', importOptions);
loadGenerateTypes();
setOptionsToForm(defaultOptions);