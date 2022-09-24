import {generatePassword} from "./generator.js";
// ***

window.showEyeWarning = 
function () {
    $("#eye-warning").fadeIn();
}

window.scrollToTop =
function () {
    $("html,body").animate({
        scrollTop: $("body").offset().top
    }, 500);
}

window.submitFormCheckboxes =
function submitFormCheckboxes(form) {
    
    let outputPassword = "";
    
    console.log("checkboxes");
    outputPassword = generatePassword(passwordLength, { passwordRangeSettings : undefined, defaultGenerate : false});
    console.log(outputPassword);
    $("#password-output").text(outputPassword.join(''));
    scrollToTop();
    showEyeWarning();
};

window.submitFormSliders =
function submitFormSliders(form) {
    let outputPassword = [];
    console.log("sliders");
    outputPassword = generatePassword(passwordLength, { passwordRangeSettings : passwordRangeSettings, defaultGenerate : false});
    $("#password-output").text(outputPassword.join(''));
    scrollToTop();
    showEyeWarning();
    
}

const PASSWORD_MIN_LEN = 4;
let passwordLength = PASSWORD_MIN_LEN;
let passwordSymbolDivHTML = $("#password-symbols-settings").clone().html();
let passwordRangeSettings = { names : {"number-range-let" : 0, "number-range-num" : 0, "number-range-sym" : 0}, sum : 0};
const passwordSymbolsSetting = [];
let lastActiveField = undefined;

window.slidersSum =
function slidersSum(name = "number-range-let") {
    let sum = 0;
    for (let i in passwordRangeSettings.names) {
        sum += +passwordRangeSettings.names[i];
    }
    passwordRangeSettings.sum = sum;
    return sum;
}
window.setRangeSlidersValues =
function setRangeSlidersValues() {
    const $fields = $("#password-number-symbols-setttings");
    const sliderClassName = "slider-fill-";
    let rangeValue = 0;
    let $range = null;

    for (let name in passwordRangeSettings.names) {
        rangeValue = passwordRangeSettings.names[name];
        $fields.find(`input[name=${name}]`).val(rangeValue);
        $range = $($fields.find(`input[name=${name}][type=range]`));
        $range[0] && $range.attr("class", $range.attr("class").replace(/slider-fill-\d+/, sliderClassName + (0 | ((rangeValue) * 100 / (passwordLength)))));
    }
}
window.sliderMove =
function sliderMove(_this) {
    const $this = $(_this);
    let $thisVal = $this.val();
    const sliderClassName = "slider-fill-";
    let sliderElem = null;
    
    passwordRangeSettings.names[_this.name] = +$thisVal;
    slidersSum();
    
    if (passwordRangeSettings.sum !== passwordLength) {
        for (let name in passwordRangeSettings.names) {
            if (_this.name !== name) {
                passwordRangeSettings.names[name] -= Math.min((passwordRangeSettings.sum - passwordLength), passwordRangeSettings.names[name]);
                if (slidersSum() === passwordLength) {break;}
            }
        }
    }
    setRangeSlidersValues();
};

window.changePasswordLength =
function changePasswordLength(_this) {
    passwordLength = $(_this).val();

    console.log("Password length: ", passwordLength);
    $("#password-number-symbols-setttings").find("input").each((i, item) => { 
        $(item).attr("max", passwordLength);
        $(item).val(0);
        sliderMove(item);
    });
    $("#password-number-symbols-setttings *:first-child").find("input").each((i, item) => {
        $(item).val(passwordLength);
        sliderMove(item);
    });
    clonePasswordSymbolsHTMLElements(passwordLength);
};

window.clonePasswordSymbolsHTMLElements = 
function clonePasswordSymbolsHTMLElements(passwordLength = PASSWORD_MIN_LEN) {
    const symbolsNumber = $("#password-symbols-settings").children().length;
    
    for (let _ = 0; _ < symbolsNumber - passwordLength; _++) {
        $("#password-symbols-settings > *:first-child").remove();
    }
    for (let _ = 0; _ < passwordLength - symbolsNumber; _++) {
        $("#password-symbols-settings").append(passwordSymbolDivHTML);
    }
}

$(document).ready(() => {
    $("button[type=submit][name='password-number-symbols-setttings']").click(function (e) {
        e.preventDefault();
        submitFormSliders(this.form);
    });
    $("button[type=submit][name='password-symbols-settings']").click(function (e) {
        e.preventDefault();
        submitFormCheckboxes(this.form);
    });
    $("button[title='Settings']").click(function (e) {
        e.preventDefault();
        $("#additional-form").toggle();
    });
    $("#additional-form").toggle();
    $("button[title='Settings']").tooltip();
    $("#password-length-field").tooltip();
    $("#eye-warning").hide();
    
    //$("*[data-onchange='changePasswordLength']")
    clonePasswordSymbolsHTMLElements();
});