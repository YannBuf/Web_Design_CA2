// Get form elements 
const form = document.querySelector('form');
const albumNameInput = document.getElementById('album-name');
const albumCoverInput = document.getElementById('albumCover');
const artistNameInput = document.getElementById('artist-name');
const songNameInput = document.getElementById('song-name');
const albumDescriptionInput = document.getElementById('album-description');
const musicGenreSelect = document.getElementById('music-genre');
const musicFileInput = document.getElementById('music-file');

// Custom validation function 自定义验证函数
form.addEventListener('submit', function (event) {
    let isValid = true;
    let errorMessage = '';

    // verify Album Name
    if (albumNameInput.value.trim().length < 3) {
        isValid = false;
        errorMessage += 'Album name must be at least 3 characters long.\n';
    }

    // verify Album Cover Size
    if (albumCoverInput.files[0]) {
        const file = albumCoverInput.files[0];
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function () {
            if (img.width > 800 || img.height > 800) {
                alert('Album cover must be within 800x800 dimensions.');
                isValid = false;
            }
        };
    }

    // verify Artist Name
    if (!/^[a-zA-Z\s]+$/.test(artistNameInput.value)) {
        isValid = false;
        errorMessage += 'Artist name must contain only letters and spaces.\n';
    }

    // verify Song Name
    if (songNameInput.value.trim().length === 0) {
        isValid = false;
        errorMessage += 'Song name cannot be empty.\n';
    }

    // verify Album Description
    if (albumDescriptionInput.value.trim().length < 10) {
        isValid = false;
        errorMessage += 'Album description must be at least 10 characters long.\n';
    }

    // verify Music Genre
    if (musicGenreSelect.value === '') {
        isValid = false;
        errorMessage += 'Please select a music genre.\n';
    }

    // verify Music File
    if (musicFileInput.files.length === 0) {
        isValid = false;
        errorMessage += 'Please upload a music file.\n';
    }

    // If validation fails, prevent the form from being submitted and display an error message 
    if (!isValid) {
        event.preventDefault();
        alert(errorMessage);
    }
});