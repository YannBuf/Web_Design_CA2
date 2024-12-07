$(document).ready(() => {
    const apiBaseUrl = "http://8.210.171.205"; // API base URL

    //songs Details
    const $audioPlayer = $("#audioPlayer");
    const $songTitle = $("#songTitle");
    const $artist = $("#artist");
    const $lyricsContainer = $("#lyrics"); // Lyrics display area
    const $albumArt = $(".album-art img");
    const $playlistContainer = $("#playlistContainer");

    // Player buttons
    const $playBtn = $("#playBtn");
    const $prevBtn = $("#prevBtn");
    const $nextBtn = $("#nextBtn");
    const $volumeBtn = $("#volumeBtn");
    const $progress = $(".progress");
    const $progressBar = $(".progress-bar");
    const $currentTimeSpan = $("#currentTime");
    const $durationSpan = $("#duration");
    const $vinylRecord = $("#vinylRecord").parent();

    let lyrics = []; // Array to store lyrics data
    let currentSongIndex = 0; // Index of the currently playing song
    let playlist = []; // Playlist array, initially empty

    // Handle the search form submit event
    $("#searchForm").submit(async (event) => {
        event.preventDefault();
        const query = $("#searchForm input").val().trim();
        if (!query) {
            return alert("Please enter a search query!");
        }

        try {
            // Fetch search results
            const searchResponse = await fetch(`${apiBaseUrl}/search?query=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!searchResponse.ok) {
                throw new Error("Search request failed");
            }

            const searchResults = await searchResponse.json();

            if (!searchResults.length) {
                return alert("No matching songs found!");
            }

            // Check if on player.html page
            if (!window.location.pathname.endsWith("player.html")) {
                // Store search results in sessionStorage
                sessionStorage.setItem("searchResults", JSON.stringify(searchResults));
                sessionStorage.setItem("searchQuery", query);
                // Redirect to player.html
                window.location.href = "player.html";
                return;
            }

            // If on player.html, update the playlist
            updatePlaylist(searchResults);
        } catch (error) {
            alert("Unable to fetch search results, please try again later!");
            console.error(error);
        }
    });

    // Function to update the playlist with search results
    function updatePlaylist(searchResults) {
        playlist = searchResults; // Update playlist
        currentSongIndex = 0; // Reset song index
        $playlistContainer.empty(); // Clear current playlist

        searchResults.forEach((song) => {
            const $listItem = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center");
            $listItem.text(`${song.title} - ${song.artist}`);

            const $playButton = $("<button>").addClass("btn btn-outline-light btn-sm").text("Play");
            $playButton.on("click", () => playSong(song));

            $listItem.append($playButton);
            $playlistContainer.append($listItem);
        });
    }

    // Load search results from sessionStorage if available
    if (window.location.pathname.endsWith("player.html")) {
        const storedResults = sessionStorage.getItem("searchResults");
        const storedQuery = sessionStorage.getItem("searchQuery");

        if (storedResults && storedQuery) {
            const searchResults = JSON.parse(storedResults);
            $("#searchForm input").val(storedQuery); // Display search query
            updatePlaylist(searchResults);
        }
    }

    // Play the selected song
    async function playSong(song) {
        try {
            if (!$audioPlayer[0].paused) {
                $audioPlayer[0].pause(); // Pause if playing
            }

            // Fetch song details
            const detailsResponse = await fetch(`${apiBaseUrl}/song_details?url=${encodeURIComponent(song.link)}`);
            if (!detailsResponse.ok) {
                throw new Error("Failed to get song details");
            }

            const songDetails = await detailsResponse.json();

            // Update player UI
            $audioPlayer[0].src = songDetails.play_url;
            $albumArt.attr("src", songDetails.mp3_cover || "img/placeholder.png");
            $songTitle.text(song.title);
            $artist.text(song.artist);

            // Load lyrics
            const lyricsResponse = await fetch(`${apiBaseUrl}/lyrics?url=${encodeURIComponent(song.link)}`);
            if (lyricsResponse.ok) {
                const lyricsData = await lyricsResponse.json();
                lyrics = lyricsData.lyrics ? parseLrc(lyricsData.lyrics) : [];
            }

            // Start playing the song
            $audioPlayer[0].play();
            $playBtn.html('<img src="img/player/pause-fill.svg" width="25" height="25" />');
            $vinylRecord.addClass("playing");
        } catch (error) {
            alert("Unable to play the song, please try again later!");
            console.error(error);
        }
    }

    // Play/Pause button functionality
    $playBtn.on("click", function () {
        if ($audioPlayer[0].paused) {
            $audioPlayer[0].play();
            $playBtn.html('<img src="img/player/pause-fill.svg" width="25" height="25" />');
            $vinylRecord.addClass("playing");
        } else {
            $audioPlayer[0].pause();
            $playBtn.html('<img src="img/player/play-fill.svg" width="25" height="25" />');
            $vinylRecord.removeClass("playing");
        }
    });

    // Volume control functionality
    let isMuted = false;
    $volumeBtn.on("click", function () {
        isMuted = !isMuted;
        $audioPlayer[0].volume = isMuted ? 0 : 1;
        $volumeBtn.html(isMuted
            ? '<img src="img/player/volume-mute-fill.svg" width="25" height="25" />'
            : '<img src="img/player/volume-up-fill.svg" width="25" height="25" />');
    });

    // Previous and Next song functionality
    $prevBtn.on("click", prevSong);
    $nextBtn.on("click", nextSong);

    function prevSong() {
        currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : playlist.length - 1;
        playSong(playlist[currentSongIndex]);
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex < playlist.length - 1) ? currentSongIndex + 1 : 0;
        playSong(playlist[currentSongIndex]);
    }

    // Update progress bar as the song plays
    $audioPlayer.on("timeupdate", function () {
        const percent = ($audioPlayer[0].currentTime / $audioPlayer[0].duration) * 100;
        $progressBar.css("width", `${percent}%`);
        $currentTimeSpan.text(formatTime($audioPlayer[0].currentTime));
        if (lyrics.length > 0) {
            updateLyrics($audioPlayer[0].currentTime); // Update lyrics
        }
    });

    // Format time in MM:SS format
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    // Set duration when metadata is loaded
    $audioPlayer.on("loadedmetadata", function () {
        $durationSpan.text(formatTime($audioPlayer[0].duration));
    });

    // Click on progress bar to seek to a specific time
    $progress.on("click", function (e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        $audioPlayer[0].currentTime = percent * $audioPlayer[0].duration;
    });

    // Lyrics functionality
    let currentLyricIndex = 0;

    // Parse LRC lyrics
    function parseLrc(lrc) {
        return lrc.trim().split("\n").map(line => {
            const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
            return match ? {
                time: parseInt(match[1]) * 60 + parseFloat(match[2]), // Convert to seconds
                text: match[3]
            } : null;
        }).filter(Boolean);
    }

    // Update lyrics display based on current time
    function updateLyrics(currentTime) {
        while (currentLyricIndex < lyrics.length && currentTime >= lyrics[currentLyricIndex].time) {
            currentLyricIndex++;
        }

        // Display the current and previous lyrics
        let lyricsHtml = "";
        for (let i = Math.max(currentLyricIndex - 5, 0); i < currentLyricIndex + 5 && i < lyrics.length; i++) {
            const isCurrentLyric = i === currentLyricIndex - 1;
            const className = isCurrentLyric ? "current-lyric" : "";
            lyricsHtml += `<div class="${className}">${lyrics[i].text}</div>`;
        }

        $lyricsContainer.html(lyricsHtml);

        // Auto-scroll to the current lyric
        const $currentLyricElem = $(".current-lyric");
        if ($currentLyricElem.length > 0) {
            $lyricsContainer.scrollTop(
                $currentLyricElem[0].offsetTop - $lyricsContainer[0].offsetTop - $lyricsContainer.height() / 2
            );
        }
    }
});
