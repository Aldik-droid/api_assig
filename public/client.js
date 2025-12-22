document.getElementById('fetchBtn').addEventListener('click', async () => {
    const loader = document.getElementById('loading');
    const resultArea = document.getElementById('resultArea');
    
    loader.style.display = 'block';
    resultArea.classList.add('hidden');

    try {
        const response = await fetch('/api/get-full-user-data'); 
        const data = await response.json();

        document.getElementById('userImg').src = data.user.profilePicture;
        document.getElementById('userName').innerText = `${data.user.firstName} ${data.user.lastName}`;
        document.getElementById('userGender').innerText = data.user.gender;
        document.getElementById('userAge').innerText = data.user.age;
        document.getElementById('userDOB').innerText = data.user.dateOfBirth;
        document.getElementById('userLocation').innerText = `${data.user.city}, ${data.user.country}`;
        document.getElementById('userAddress').innerText = data.user.address;

        if (data.countryInfo) {
            document.getElementById('countryName').innerText = data.countryInfo.name;
            document.getElementById('countryCapital').innerText = data.countryInfo.capital;
            document.getElementById('countryLang').innerText = data.countryInfo.language;
            document.getElementById('countryCurrency').innerText = data.countryInfo.currencyCode;
        }

        if (data.exchangeRate) {
            document.getElementById('rateText').innerText = data.exchangeRate.text;
        }

        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';
        data.news.forEach(article => {
            const div = document.createElement('div');
            div.className = 'news-item';
            div.innerHTML = `
                ${article.image ? `<img src="${article.image}" alt="News Image">` : ''}
                <h4>${article.title}</h4>
                <p>${article.description || ''}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            newsContainer.appendChild(div);
        });

        resultArea.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data from server.');
    } finally {
        loader.style.display = 'none';
    }
});