//region Generate
async function generateCard({
                                borderRadius,
                                borderMargin,
                                backgroundStyle,
                                imageLink,
                                title,
                                titleStyle,
                                description,
                                descriptionStyle,
                                defs
                            }) {
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "400");
    svg.setAttribute("height", "600");

    // Create defs
    if (defs) {
        const defsElement = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defsElement.innerHTML = defs;
        svg.appendChild(defsElement);
    }

    // Create background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("rx", borderRadius || "0");
    rect.setAttribute("ry", borderRadius || "0");
    rect.setAttribute("x", borderMargin || "0");
    rect.setAttribute("y", borderMargin || "0");
    rect.setAttribute("width", (400 - 2 * (borderMargin || 0)).toString());
    rect.setAttribute("height", (600 - 2 * (borderMargin || 0)).toString());
    rect.setAttribute("style", backgroundStyle);
    svg.appendChild(rect);

    // Create image
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("x", "50");
    image.setAttribute("y", "50");
    image.setAttribute("width", "300");
    image.setAttribute("height", "300");
    image.setAttribute("href", imageLink);
    svg.appendChild(image);

    // Create title
    const titleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    titleElement.setAttribute("x", "200");
    titleElement.setAttribute("y", "400");
    titleElement.setAttribute("font-size", "35");
    titleElement.setAttribute("text-anchor", "middle");
    titleElement.setAttribute("style", titleStyle);
    titleElement.textContent = title;
    svg.appendChild(titleElement);

    // Create description
    const descriptionElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    descriptionElement.setAttribute("x", "200");
    descriptionElement.setAttribute("y", "450");
    descriptionElement.setAttribute("font-size", "25");
    descriptionElement.setAttribute("text-anchor", "middle");
    descriptionElement.setAttribute("style", descriptionStyle);

    // Add tspan elements for each line in the description
    const lines = description.split('\n');
    let firstLine = true;
    for (let line of lines) {
        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute("x", "200");
        tspan.setAttribute("dy", `${firstLine ? 0 : 1.2}em`);
        tspan.textContent = line;
        descriptionElement.appendChild(tspan);
        firstLine = false;
    }
    svg.appendChild(descriptionElement);

    return svg;
}

//endregion

const generateTypes = {
    card: generateCard
}

async function generate({generateType, ...options}) {
    return await (generateType ? generateTypes[generateType] : generateTypes.card)(options);
}

const defaultOptions = {
    backgroundStyle: "fill:white; stroke:black; stroke-width:2; fill-opacity:1",
    imageLink: "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
    title: "MaskedGUI",
    titleStyle: "fill: black; font-weight: bold; font-family: Verdana;",
    description: "Description",
    descriptionStyle: "fill: black; font-family: Verdana;",
    borderRadius: "10",
    borderMargin: "10",
    defs: "",
    generateType: "card"
};
