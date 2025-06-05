const printBtn = document.querySelector(".print-btn");
printBtn.onclick = () => {
    window.print();
};

const fetchImage = () => {
    const container = document.querySelector(".container");
    var data = JSON.parse(localStorage.getItem("my-photo-state")) || null;
    var size = JSON.parse(localStorage.getItem("photo-state-size")) || 1;
    if (!data) {
        console.log("No Image Exist");
        window.location.href = "/";
    }
    for (let j = 0; j < parseInt(size); j++) {
        container.innerHTML += `
            <div class="img">
                <img src="${data[0].secure_url}" />
            </div>
            <div class="img">
                <img src="${data[1].secure_url}" />
            </div>
            `;
    }
};

fetchImage();
