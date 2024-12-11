const showUsers = document.getElementById("users");
window.onload = async() => {
      await loadData();
}

const loadData = async () => {
      const response = await axios.get("http://localhost:9999/users")
      showUsers.innerHTML = response.data.data.map(user => `<li>${user.name} - id: ${user.id}</li>`).join("");
      console.log(response.data)

}