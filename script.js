async function fetchProfileData() {
    const apiUrl = 'https://api.web3.bio/profile/0xhashbrown.eth';
    try {
        const response = await fetch(apiUrl);
        const profiles = await response.json();
        displayProfiles(profiles);
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
}
function displayProfiles(profiles) {
    const profileContainer = document.getElementById('profileContent');
    // Initialize containers to hold unique values
    const uniqueAvatars = new Set();
    const uniqueNames = new Set();
    const uniqueDescriptions = new Set();
    const uniqueLocations = new Set();
    const uniqueLinks = new Map();

    profiles.forEach(profile => {
        uniqueAvatars.add(profile.avatar);
        uniqueNames.add(profile.displayName);
        if (profile.description) uniqueDescriptions.add(profile.description);
        if (profile.location) uniqueLocations.add(profile.location);

        // Iterate through links and add them if not already present
        Object.entries(profile.links || {}).forEach(([key, value]) => {
            if (!uniqueLinks.has(key)) {
                uniqueLinks.set(key, value.link);
            }
        });
    });

    // Only display the first avatar
    const firstAvatar = uniqueAvatars.values().next().value;

    // Now create the HTML for the single card
    const profileHtml = `
        <div class="mb-5 p-4 bg-white rounded-lg shadow">
            ${firstAvatar ? `<img class="w-20 h-20 rounded-full mx-auto" src="${firstAvatar}" alt="Profile Avatar">` : ''}
            <h2 class="text-xl font-semibold mt-2 text-center">${Array.from(uniqueNames).join(', ') || 'N/A'}</h2>
            <p class="text-gray-600 text-center">${Array.from(uniqueDescriptions).join(', ') || 'No description provided.'}</p>
            <p class="text-gray-600 text-center">Location: ${Array.from(uniqueLocations).join(', ') || 'N/A'}</p>
            <div class="mt-3 text-center">
                ${Array.from(uniqueLinks).map(([key, link]) => `
                    <a href="${link}" class="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">${key}</a>
                `).join('')}
            </div>
        </div>
    `;

    // Set the innerHTML to the newly created profileHtml
    profileContainer.innerHTML = profileHtml;
}

// Call the function when the window loads
window.addEventListener('load', fetchProfileData);
