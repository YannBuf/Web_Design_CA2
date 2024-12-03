$(document).ready(() => {
    const apiBaseUrl = "https://elated-real-narwhal.glitch.me"; // API 基础地址
    const audioPlayer = document.getElementById("audioPlayer");
    const songTitle = document.getElementById("songTitle");
    const artist = document.getElementById("artist");
    const lyricsContainer = document.getElementById("lyrics");
    const albumArt = document.querySelector(".album-art img");
    const playlistContainer = document.getElementById("playlistContainer");

    // 搜索表单提交事件
    $("#searchForm").submit(async (event) => {
        event.preventDefault();
        const query = $("#searchForm input").val().trim();
        if (!query) return alert("请输入搜索内容！");
        
        try {
            // 搜索歌曲，设置 mode 为 'cors'
            const searchResponse = await fetch(`${apiBaseUrl}/search?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                mode: 'cors', // 确保使用 CORS 模式
                headers: {
                    'Content-Type': 'application/json' // 可选，具体取决于 API 要求
                }
            });
            if (!searchResponse.ok) throw new Error("搜索请求失败");
            const searchResults = await searchResponse.json();

            if (!searchResults.length) {
                alert("未找到匹配的歌曲！");
                return;
            }

            // 检查是否在 player.html 页面
            if (!window.location.pathname.endsWith("player.html")) {
                // 将搜索结果存储到 sessionStorage 中
                sessionStorage.setItem("searchResults", JSON.stringify(searchResults));
                sessionStorage.setItem("searchQuery", query);
                // 跳转到 player.html
                window.location.href = "player.html";
                return;
            }

            // 如果在 player.html，更新播放列表
            updatePlaylist(searchResults);
        } catch (error) {
            alert("无法获取搜索结果，请稍后再试！");
            console.error(error);
        }
    });

    // 更新播放列表函数
    function updatePlaylist(searchResults) {
        playlistContainer.innerHTML = ""; // 清空现有列表
        searchResults.forEach((song) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.textContent = `${song.title} - ${song.artist}`;

            const playButton = document.createElement("button");
            playButton.className = "btn btn-outline-light btn-sm";
            playButton.textContent = "Play";
            playButton.addEventListener("click", () => playSong(song));

            listItem.appendChild(playButton);
            playlistContainer.appendChild(listItem);
        });
    }

    // 检查并加载 sessionStorage 中的搜索结果
    if (window.location.pathname.endsWith("player.html")) {
        const storedResults = sessionStorage.getItem("searchResults");
        const storedQuery = sessionStorage.getItem("searchQuery");

        if (storedResults && storedQuery) {
            const searchResults = JSON.parse(storedResults);
            $("#searchForm input").val(storedQuery); // 显示搜索关键词
            updatePlaylist(searchResults);
        }
    }

    // 播放歌曲
    async function playSong(song) {
        try {
            // 获取歌曲详情，设置 mode 为 'cors'
            const detailsResponse = await fetch(`${apiBaseUrl}/song_details?url=${encodeURIComponent(song.link)}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!detailsResponse.ok) throw new Error("无法获取歌曲详情");
            const songDetails = await detailsResponse.json();

            // 更新播放器
            audioPlayer.src = songDetails.play_url;
            albumArt.src = songDetails.mp3_cover || "img/placeholder.png";
            songTitle.textContent = song.title;
            artist.textContent = song.artist;

            // 加载歌词，设置 mode 为 'cors'
            const lyricsResponse = await fetch(`${apiBaseUrl}/lyrics?url=${encodeURIComponent(song.link)}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (lyricsResponse.ok) {
                const lyricsData = await lyricsResponse.json();
                lyricsContainer.textContent = lyricsData.lyrics || "无歌词信息";
            } else {
                lyricsContainer.textContent = "无歌词信息";
            }

            // 播放音频
            audioPlayer.play();
        } catch (error) {
            alert("无法播放歌曲，请稍后再试！");
            console.error(error);
        }
    }
});