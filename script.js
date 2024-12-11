let inpName = document.getElementById("name");
let inpEmail = document.getElementById("email");
let inpTel = document.getElementById("tel");
let inpGender = document.getElementById("gender");
let inpMore = document.getElementById("more");
let btnSubmit = document.getElementById("submit");
let showStatus = document.querySelector("#showStatus");

btnSubmit.addEventListener("click", async (e) => {
    e.target.value = "55555";
    try {
        console.log(inpMore.value);
        const userData = {
            name: inpName.value || null,
            email: inpEmail.value || null,
            tel: inpTel.value || null,
            gender: inpGender.value || null,
            more: inpMore.value || null,
        };
        let statusCode = await axios.post("http://localhost:9999/users", userData)
        console.log(statusCode);
        console.log(userData);
        showStatus.innerHTML = "User created successfully";
        showStatus.className = "showStatus success";
    } catch (err) {
        if(err.response){console.log(err.response.data);err = err.response.data || "Error no clue"}
        let htmlData = "<div>";
        htmlData += `<div>${err.errMess}</div>`;
        htmlData += `<ul>`;
        for (let i = 0; i < err.err.length; i++) {
            htmlData += `<li>${err.err[i]}</li>`;
        }
        htmlData+= "</ul>";
        htmlData += "</div>";

        showStatus.innerHTML = htmlData;
        showStatus.className = "showStatus danger";
    }
})
