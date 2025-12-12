const allBreedsUrl = 'https://dog.ceo/api/breeds/list/all';
const selectElement = document.getElementById('breed-select');
const dogImageElement = document.getElementById('dog-image');
const button = document.getElementById('fetch-dog-btn');

// --- 1. Cins Listesini Çekme ve Doldurma ---
async function fetchAndPopulateBreeds() {
    try {
        const response = await fetch(allBreedsUrl);
        const data = await response.json();
        
        if (data.status === 'success') {
            const breeds = data.message;
            
            // Dönen cinsi ve varsa alt cinsleri işleme
            for (const breed in breeds) {
                if (breeds[breed].length === 0) {
                    // Ana cinsi ekle (örn: husky)
                    addOptionToSelect(breed, breed);
                } else {
                    // Alt cinsleri ekle (örn: hound/afghan)
                    breeds[breed].forEach(subBreed => {
                        const fullBreedName = ${breed}-${subBreed};
                        const displayName = ${subBreed} ${breed};
                        addOptionToSelect(fullBreedName, displayName);
                    });
                }
            }
        }
    } catch (error) {
        console.error('Cins listesi çekilirken hata oluştu:', error);
        alert('Cins listesi yüklenemedi. Ağ bağlantısını kontrol edin.');
    }
}

function addOptionToSelect(value, text) {
    const option = document.createElement('option');
    option.value = value;
    // Görüntü ismini düzenleme (örn: 'hound-afghan' -> 'Afghan Hound')
    option.textContent = text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    selectElement.appendChild(option);
}

// --- 2. Resim Çekme İşlevi ---
async function fetchRandomDog() {
    const selectedBreed = selectElement.value;
    let fetchUrl;

    if (selectedBreed === 'random') {
        fetchUrl = 'https://dog.ceo/api/breeds/image/random'; // Rastgele resim
    } else {
        // Belirli bir cinsten rastgele resim (Örn: /breed/hound/images/random)
        // API'deki "sub-breed/main-breed" formatına dikkat edin.
        const parts = selectedBreed.split('-'); 
        if (parts.length > 1) {
            // Alt cins varsa (Örn: 'afghan-hound') -> URL'de 'hound/afghan' olmalı
            fetchUrl = https://dog.ceo/api/breed/${parts[1]}/${parts[0]}/images/random;
        } else {
             // Sadece ana cins varsa (Örn: 'husky')
            fetchUrl = https://dog.ceo/api/breed/${selectedBreed}/images/random;
        }
    }

    dogImageElement.src = ''; 
    dogImageElement.alt = 'Yükleniyor...';

    try {
        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (data.status === 'success' && data.message) {
            dogImageElement.src = data.message;
            dogImageElement.alt = ${selectedBreed.toUpperCase()} Köpek;
        } else {
            dogImageElement.alt = 'Hata: Resim bulunamadı.';
        }
    } catch (error) {
        console.error('Resim çekilirken bir hata oluştu:', error);
        dogImageElement.alt = 'Bağlantı Hatası.';
    }
}

// --- Başlangıç ve Olay Dinleyicileri ---
document.addEventListener('DOMContentLoaded', () => {
    fetchAndPopulateBreeds(); // Sayfa yüklenince cinsleri doldur
    fetchRandomDog(); // İlk resmi yükle
});

button.addEventListener('click', fetchRandomDog);
selectElement.addEventListener('change', fetchRandomDog); // Cins değişince de resim getir
