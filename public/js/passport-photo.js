const passportBtn = document.querySelector("#passport-photo-page");
const photoStateBtn = document.querySelector("#photo-state-page");
const photoStatePage = document.querySelector("#photo-state");
const passportPage = document.querySelector("#passport-page");
const msg = document.querySelector("#msg");
var BASE64FILES = [];

// Open Photo State Page...
passportBtn.onclick = () => {
    passportPage.style.display = "none";
    photoStatePage.style.display = "flex";
};
// Open Passport Photo Page
photoStateBtn.onclick = () => {
    passportPage.style.display = "flex";
    photoStatePage.style.display = "none";
};
/*--------------------------------------------*/

// Passport Page Form Handling...
const passPhotos = document.querySelector("#pass-photos");
const passCopy = document.querySelector("#pass-copy");
const radioPassport = document.querySelector("#ra-passport");
const radioState = document.querySelector("#ra-state");
const passportCreateBtn = document.querySelector("#passport-create-btn");
const passportBtnLoader = document.querySelector(
    "#passport-create-btn #loader"
);
const passportSpan = document.querySelector("#passport-create-btn span");

const updateRadio = () => {
    // If radioPassport is checked, uncheck radioState
    if (radioPassport.checked) {
        radioState.checked = false;
    }
    // If radioState is checked, uncheck radioPassport
    else if (radioState.checked) {
        radioPassport.checked = false;
    }
};

// Add event listeners to handle clicks
radioPassport.addEventListener("click", () => {
    if (radioPassport.checked) {
        radioState.checked = false;
    }
});
radioState.addEventListener("click", () => {
    if (radioState.checked) {
        radioPassport.checked = false;
    }
});

// Add change event listeners to handle changes
radioPassport.addEventListener("change", updateRadio);
radioState.addEventListener("change", updateRadio);

const showMessage = (type, text) => {
    if (type) {
        msg.classList.add("success");
        msg.textContent = text;
    } else {
        msg.classList.add("error");
        msg.textContent = text;
    }
    setTimeout(() => {
        msg.textContent = "";
        msg.removeAttribute("class");
    }, 3000);
};

const createBase64 = async file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};
passPhotos.addEventListener("change", async () => {
    try {
        const files = passPhotos.files;
        for (const file of files) {
            const base64 = await createBase64(file);
            BASE64FILES.push(base64);
        }
    } catch (error) {
        console.error("Error While Selecting Files - ", error);
        BASE64FILES = [];
    }
});



// Let's Confirm Click on passport btn
passportCreateBtn.onclick = async () => {
    const photoCopy = passCopy.value;
    var isType;
    var size = 600;
    if (radioPassport.checked) {
        isType = radioPassport.value;
    } else {
        isType = radioState.value;
    }
    if (BASE64FILES.length == 0) {
        showMessage(false, "Please select an image");
        return;
    }
    if (photoCopy === "0") {
        showMessage(false, "Please select a copy");
        return;
    }

    if (isType === "STAMP") {
        size = 300;
    } else {
        size = 600;
    }

    if (photoCopy !== "0" && BASE64FILES.length > 0) {
        await submitPassport({
            photos: BASE64FILES.length !== 0 ? BASE64FILES : [],
            photo_copy: photoCopy,
            size
        });
    }
};

const submitPassport = async data => {
    const loader = document.querySelector("#passport-create-btn #loader");
    const loaderText = document.querySelector("#passport-create-btn span");
    const api = "/api/upload-photos";
    passportCreateBtn.disabled = true;
    passportCreateBtn.style.backgroundColor = "#003037";
    loader.classList.add("loading");
    loaderText.setAttribute("id", "text");
    loaderText.textContent = "Please Wait";

    try {
        const request = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const response = await request.json();
        if (response?.results[0]?.secure_url) {
            showMessage(true, response.message);
                localStorage.setItem("my-images",JSON.stringify(response.results))
                localStorage.setItem("copy-size",JSON.stringify(response.copy_size))
            setTimeout(() => {
                window.open("/print-photo.html","_blank")
            }, 2000);
        } else if (response?.results[0]?.error?.message) {
            console.log(response?.results);
            showMessage(false, response?.results[0]?.error?.message);
        }
    } catch (error) {
        console.log(error);
        showMessage(false, error.message);
    } finally {
        passportCreateBtn.style.backgroundColor = "#006d9f";
        passportCreateBtn.disabled = false;
        loader.classList.remove("loading");
        loaderText.removeAttribute("id");
        loaderText.textContent = "Create Now";
    }
};

