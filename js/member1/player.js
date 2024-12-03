$(document).ready(function() {
    const audio = $('#audioPlayer')[0];
    const playBtn = $('#playBtn');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const volumeBtn = $('#volumeBtn');
    const progress = $('.progress');
    const progressBar = $('.progress-bar');
    const currentTimeSpan = $('#currentTime');
    const durationSpan = $('#duration');
    const vinylRecord = $('#vinylRecord').parent();
    const lyricsContainer = $('#lyrics'); // lyrics area

    let lyrics = [];
    let currentLyricIndex = 0;

    // Load LRC file for lyrics
    function loadLrcFile(url, callback) {
        $.get(url, function(lrcText) {
            console.log("LRC loaded", lrcText); 
            callback(parseLrc(lrcText));
        }).fail(function() {
            console.error('Failed to load LRC file.');
            lyricsContainer.text('Failed to load lyrics.'); 
        });
    }

    // 解析LRC歌词
    function parseLrc(lrc) {
        const lines = lrc.trim().split('\n');
        const parsedLyrics = [];
        lines.forEach(line => {
            const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseFloat(match[2]);
                const text = match[3];
                parsedLyrics.push({
                    time: minutes * 60 + seconds, // 转换为秒
                    text: text
                });
            }
        });
        console.log("解析的歌词：", parsedLyrics); // 调试信息
        return parsedLyrics;
    }

    // 更新歌词显示
    function updateLyrics(currentTime) {
        while (currentLyricIndex < lyrics.length && currentTime >= lyrics[currentLyricIndex].time) {
            currentLyricIndex++;
        }

        // 确保歌词容器只显示当前歌词及前面的几行
        let lyricsHtml = '';
        for (let i = Math.max(currentLyricIndex - 5, 0); i < currentLyricIndex + 5 && i < lyrics.length; i++) {
            const isCurrentLyric = (i === currentLyricIndex - 1); // 当前播放的歌词行
            const className = isCurrentLyric ? 'current-lyric' : ''; // 高亮当前歌词行
            lyricsHtml += `<div class="${className}">${lyrics[i].text}</div>`;
        }

        lyricsContainer.html(lyricsHtml);

        // 自动滚动到当前歌词
        const currentLyricElem = $('.current-lyric');
        if (currentLyricElem.length > 0) {
            lyricsContainer.scrollTop(currentLyricElem[0].offsetTop - lyricsContainer[0].offsetTop - lyricsContainer.height() / 2);
        }
    }

    // 加载LRC歌词文件
    loadLrcFile('src/test.lrc', function(parsedLyrics) {
        lyrics = parsedLyrics;
        if (lyrics.length === 0) {
            lyricsContainer.text('未找到歌词');
        }
    });

    // Form validation
    $('#searchForm').on('submit', function(e) {
        e.preventDefault();
        const searchInput = $(this).find('input');
        if (searchInput.val().trim() === '') {
            searchInput.addClass('is-invalid');
            return;
        }
        searchInput.removeClass('is-invalid');
        // Handle search...
    });

    // Play/Pause
    playBtn.on('click', function() {
        if (audio.paused) {
            audio.play();
            
            playBtn.html('<img src="img/player/pause-fill.svg" width="25" height="25" />');
            vinylRecord.addClass('playing');
        } else {
            audio.pause();
            playBtn.html('<img src="img/player/play-fill.svg" width="25" height="25" />');
            vinylRecord.removeClass('playing');
        }
    });

    // Update progress bar
    audio.addEventListener('timeupdate', function() {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.css('width', `${percent}%`);
        currentTimeSpan.text(formatTime(audio.currentTime));
        if (lyrics.length > 0) {
            updateLyrics(audio.currentTime); // 更新歌词
        }
    });

    // Set duration when metadata is loaded
    audio.addEventListener('loadedmetadata', function() {
        durationSpan.text(formatTime(audio.duration));
    });

    // Click on progress bar to seek
    progress.on('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // Format time in MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Volume control
    let isMuted = false;
    volumeBtn.on('click', function() {
        if (isMuted) {
            audio.volume = 1;
            volumeBtn.html('<img src="img/player/volume-up-fill.svg" width="25" height="25" />');
        } else {
            audio.volume = 0;
            volumeBtn.html('<img src="img/player/volume-mute-fill.svg" width="25" height="25" />');
        }
        isMuted = !isMuted;
    });

    // Previous and Next buttons (placeholder functionality)
    prevBtn.on('click', function() {
        // Handle previous track
        console.log('Previous track');
    });

    nextBtn.on('click', function() {
        // Handle next track
        console.log('Next track');
    });
});
