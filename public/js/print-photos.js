const gridContainer = document.querySelector("#grid");
const grid = document.getElementById("grid");
            const radios = document.querySelectorAll('input[name="size"]');
            radios.forEach(radio => {
                radio.addEventListener("change", e => {
                    if (e.target.checked) {
                        if (e.target.value === "stamp") {
                            grid.classList.remove("passport-size-grid");
                            grid.classList.add("stamp-size-grid");
                        } else {
                            grid.classList.remove("stamp-size-grid");
                            grid.classList.add("passport-size-grid");
                        }
                    }
                });
            });

            document
                .getElementById("print-btn")
                .addEventListener("click", () => {
                    window.print();
                });


const fetchImages = async () => {
    var data = JSON.parse(localStorage.getItem("my-images")) || null;
    var size = JSON.parse(localStorage.getItem("copy-size")) || 2;
    if (!data) {
        console.log("No Image Exist");
        window.location.href = "/";
    }
    data.forEach(photo => {
        for (let i = 0; i < parseInt(size); i++) {
            gridContainer.innerHTML += `
             <div class="photo-cell">
                <div class="spinner"></div>
                <div class="error-message">Failed to load photo !</div>
                <img src="${photo.secure_url}" />
            </div>
            `;
        }
    });
    const gridCell = gridContainer.querySelectorAll(".photo-cell");
    gridCell.forEach(item => {
        const spinners = item.querySelectorAll(".spinner");
        const errorMessages = item.querySelectorAll(".error-message");
        const images = item.querySelectorAll("img");
        for (let i = 0; i < images.length; i++) {
            // When image loads successfully
            images[i].onload = () => {
                spinners[i].style.display = "none";
                errorMessages[i].style.display = "none";
                images[i].style.display = "block";
            };
            // When image loading fails
            images[i].onerror = () => {
                spinners[i].style.display = "none";
                images[i].style.display = "none";
                errorMessages[i].style.display = "block";
            };
        }
    });
};




fetchImages();
