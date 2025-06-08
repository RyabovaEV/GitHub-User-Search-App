const form = document.querySelector("[data-search-form]");
const input = document.querySelector("[data-search-input]");
const userInfoContainer = document.querySelector("[data-user-info-container]");
const reposContainer = document.querySelector("[data-repos-container]");

const API_GITHUB = "https://api.github.com/users"

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = input.value.trim();

    if (!userName){
        alert("Please enter a GitHab user name");
        return;
    }

    userInfoContainer.innerHTML = `<p>Loading...</p>`;
    userInfoContainer.innerHTML = "";

    try {
        const userResponse = await fetch(`${API_GITHUB}/${userName}`);

        if (!userResponse.ok) throw new Error("User Not Found");
        
        const userDate = await userResponse.json();

        userInfoContainer.innerHTML = `
            <div>
                <img src="${userDate.avatar_url}" alt="${userDate.login}"/>
                <h2>${userDate.name || userDate.login}</h2>
                <p>${userDate.bio || "No bio available"}</p>
            </div>
        `

        const reposResponse = await fetch(userDate.repos_url);
        if (!reposResponse.ok) throw new Error("Could not fetch repos");

        const repos = await reposResponse.json();

        if (repos.length) {
            reposContainer.innerHTML = `<h3>Repositories:</h3>`;

            repos.forEach(repo => {
                reposContainer.innerHTML += `
                <div class="repo">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </div>`
            })

        } else {
            reposContainer.innerHTML = `<p>No repositories found</p>`;
        }

    } catch (error) {
        userInfoContainer.innerHTML = `<p>${error.message}</p>`;
    }
})