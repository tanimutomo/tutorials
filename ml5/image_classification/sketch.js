let classifier;
let img;

function preload2() {
    classifier = ml5.imageClassifier("MobileNet");
    img = loadImage("images/tmp.png")
}

function setup() {
    createCanvas(400, 400);
    classifier.classify(img, gotResult);
    image(img, 0, 0);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        crateDiv(`Label: ${results[0].label}`)
        crateDiv(`Confidence: ${nf(results[0].confidence, 0, 2)}`)
    }
}