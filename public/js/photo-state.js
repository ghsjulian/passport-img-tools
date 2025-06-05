const nidMsg = document.querySelector("#nid-msg");
const frontNid = document.querySelector("#front-nid");
const backNid = document.querySelector("#back-nid");
const photoCopy = document.querySelector("#photo-copy");
const createPhotoState = document.querySelector("#create-photo-state");
const loader = document.querySelector("#create-photo-state #load");
const loadingText = document.querySelector("#create-photo-state span");

var FRONT_NID = "";
var BACK_NID = "";

const showNidMessage = (type, text) => {
    if (type) {
        nidMsg.classList.add("success");
        nidMsg.textContent = text;
    } else {
        nidMsg.classList.add("error");
        nidMsg.textContent = text;
    }
    setTimeout(() => {
        nidMsg.textContent = "";
        nidMsg.removeAttribute("class");
    }, 3000);
};

const createBase64String = async file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

frontNid.addEventListener("change", async () => {
    try {
        const file = frontNid.files[0];
        const base64 = await createBase64String(file);
        FRONT_NID = base64;
    } catch (error) {
        console.error("Error While Selecting Files - ", error);
    }
});
backNid.addEventListener("change", async () => {
    try {
        const file = backNid.files[0];
        const base64 = await createBase64String(file);
        BACK_NID = base64;
    } catch (error) {
        console.error("Error While Selecting Files - ", error);
    }
});

const showResult = () => {
    const previewContainer = document.querySelector(".preview-container");
    document.querySelector("#main-container").style.display = "none";
    previewContainer.style.display = "grid";
    document.body.style.display = "block";
};

createPhotoState.onclick = async () => {
    //  showResult();
    const copySize = photoCopy.value;
    if (FRONT_NID === "") {
        showNidMessage(false, "Select NID Front Part");
        return;
    } else if (BACK_NID === "") {
        showNidMessage(false, "Select NID Back Part");
        return;
    } else if (copySize === "0") {
        showNidMessage(false, "Please Select Copy Size");
        return;
    }

    if (BACK_NID && FRONT_NID && copySize) {
        await submitPhotoState({
            copy_size: copySize,
            nid_front: FRONT_NID,
            nid_back: BACK_NID
        });
    }
};

const submitPhotoState = async data => {
    const api = "/api/upload-nid";
    createPhotoState.disabled = true;
    createPhotoState.style.backgroundColor = "#003037";
    loader.classList.add("loading");
    loadingText.setAttribute("id", "text");
    loadingText.textContent = "Please Wait";
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
            showNidMessage(true, response?.message);
            localStorage.setItem(
                "my-photo-state",
                JSON.stringify(response?.results)
            );
            localStorage.setItem(
                "photo-state-size",
                JSON.stringify(response.copy_size)
            );
            setTimeout(() => {
                window.open("/print-photo-state.html", "_blank");
            }, 2000);
        } else if (response?.results[0]?.error?.message) {
            console.log(response?.results);
            showNidMessage(false, response?.results[0]?.error?.message);
        }
    } catch (error) {
        showNidMessage(false, error.message);
        console.log(error);
    } finally {
        createPhotoState.style.backgroundColor = "#006d9f";
        createPhotoState.disabled = false;
        loader.classList.remove("loading");
        loadingText.removeAttribute("id");
        loadingText.textContent = "Create Photostat";
    }
};
