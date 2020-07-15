var $ = function (query) { return document.querySelector(query); };
// Get Elements
var redSlider = $('#red');
var greenSlider = $('#green');
var blueSlider = $('#blue');
var rgbInput = $('#rgb');
var hexInput = $('#hex');
var background = document.body;
var colourBox = $('#colour-box');
var Colour = /** @class */ (function () {
    function Colour(red, green, blue) {
        if (red === void 0) { red = 0; }
        if (green === void 0) { green = 0; }
        if (blue === void 0) { blue = 0; }
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    Colour.prototype.set = function (colour) {
        this.red = colour.red;
        this.green = colour.green;
        this.blue = colour.blue;
    };
    Colour.prototype.fromRgbString = function (rgbString) {
        var values = rgbString.split(',').map(function (el) { return Math.min(parseInt(el.trim()), 255); });
        this.red = values[0];
        this.green = values[1];
        this.blue = values[2];
        this.setSliders();
    };
    Colour.prototype.toRgbString = function () {
        return this.red + ", " + this.green + ", " + this.blue;
    };
    Colour.prototype.fromHexString = function (hexString) {
        if (hexString.length == 4) {
            this.red = hexToInt(hexString.slice(1, 2));
            this.green = hexToInt(hexString.slice(2, 3));
            this.blue = hexToInt(hexString.slice(3, 4));
        }
        else {
            this.red = hexToInt(hexString.slice(1, 3));
            this.green = hexToInt(hexString.slice(3, 5));
            this.blue = hexToInt(hexString.slice(5, 7));
        }
        this.setSliders();
    };
    Colour.prototype.toHexString = function () {
        return "#" + intToHex(this.red) + intToHex(this.green) + intToHex(this.blue);
    };
    Colour.prototype.setSliders = function () {
        redSlider.value = this.red.toString();
        greenSlider.value = this.green.toString();
        blueSlider.value = this.blue.toString();
        setInputs(this);
    };
    Colour.getRandom = function () {
        return new Colour(randomColour(), randomColour(), randomColour());
    };
    return Colour;
}());
var Modes;
(function (Modes) {
    Modes[Modes["Foreground"] = 0] = "Foreground";
    Modes[Modes["Background"] = 1] = "Background";
})(Modes || (Modes = {}));
var mode = Modes.Foreground;
// Random Number Generator
var randomIntBetween = function (min, max) { return Math.floor((Math.random() * (max - min + 1))); };
var randomColour = function () { return randomIntBetween(0, 255); };
// RGB To Hex
var intToHex = function (int) {
    int = Math.min(int, 255);
    var out = int.toString(16);
    if (out.length == 1) {
        out = '0' + out;
    }
    return out.toUpperCase();
};
var hexToInt = function (hex) { return Math.min(parseInt(hex, 16), 255); };
// Toggle Mode
var toggleMode = function () {
    if (mode == Modes.Foreground) {
        mode = Modes.Background;
        $('#title').innerText = "Background";
        bgColour.setSliders();
        updateColour();
    }
    else {
        mode = Modes.Foreground;
        $('#title').innerText = "Foreground";
        fgColour.setSliders();
        updateColour();
    }
};
// Get Input Colour
var getInputColour = function () {
    var red = parseInt(redSlider.value);
    var green = parseInt(greenSlider.value);
    var blue = parseInt(blueSlider.value);
    return new Colour(red, green, blue);
};
// Set Current Colour
var setCurrentColour = function (colour) {
    // Update Box Colour
    var currentColour = (mode == Modes.Foreground) ? fgColour : bgColour;
    var box = (mode == Modes.Foreground) ? colourBox : background;
    // Update Current Colour 
    currentColour.set(colour);
    // Set Colour Visually
    box.style.backgroundColor = colour.toHexString();
};
// Set Inputs
var setInputs = function (colour) {
    rgbInput.value = colour.toRgbString();
    hexInput.value = colour.toHexString();
};
// Handle Rgb Change
var handleRgbChange = function () {
    var currentColour = (mode == Modes.Foreground) ? fgColour : bgColour;
    currentColour.fromRgbString(rgbInput.value);
    setCurrentColour(currentColour);
};
// Handle Hex Change
var handleHexChange = function () {
    var currentColour = (mode == Modes.Foreground) ? fgColour : bgColour;
    currentColour.fromHexString(hexInput.value);
    setCurrentColour(currentColour);
};
// Handle Slider Scroll
var handleSliderScroll = function (e) {
    var sliderEl = e.target;
    var currentColour = (mode == Modes.Foreground) ? fgColour : bgColour;
    var delta = 1;
    if (e.shiftKey) {
        delta *= 5;
    }
    if (e.ctrlKey) {
        delta *= 3;
        // Prevent Page Zoom
        e.preventDefault();
    }
    if (e.deltaY < 0) {
        // Scrolling up
        currentColour[sliderEl.id] += delta;
    }
    else {
        // Scrolling down
        currentColour[sliderEl.id] -= delta;
    }
    currentColour.setSliders();
    updateColour();
};
// On load
var bgColour = Colour.getRandom();
background.style.backgroundColor = bgColour.toHexString();
var fgColour = Colour.getRandom();
colourBox.style.backgroundColor = fgColour.toHexString();
fgColour.setSliders();
// Update Colour
var updateColour = function () {
    var inputColour = getInputColour();
    setCurrentColour(inputColour);
    setInputs(inputColour);
};
// Add Event Listeners
updateColour();
redSlider.addEventListener('input', updateColour);
redSlider.addEventListener('wheel', handleSliderScroll);
greenSlider.addEventListener('input', updateColour);
greenSlider.addEventListener('wheel', handleSliderScroll);
blueSlider.addEventListener('input', updateColour);
blueSlider.addEventListener('wheel', handleSliderScroll);
rgbInput.addEventListener('change', handleRgbChange);
hexInput.addEventListener('change', handleHexChange);
// Mobile Actual Viewport Height
var updateVh = function () {
    document.body.style.setProperty('--vh', innerHeight + "px");
};
// Update Viewport Height On Resize
addEventListener('resize', updateVh);
// Run On Page Load
updateVh();
// Hide Address Bar
setTimeout(function () {
    scrollTo(0, 1);
}, 0);
