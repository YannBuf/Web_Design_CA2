/*

document.querySelector('.album-container').addEventListener('wheel', (event) => {
    event.preventDefault(); // 防止页面滚动
    const container = event.currentTarget;
    container.scrollLeft += event.deltaY; // 横向滚动
});

document.addEventListener("DOMContentLoaded", () => {
    const albums = document.querySelectorAll(".album");
    albums.forEach(album => {
      const delay = album.dataset.delay || 0; // 获取 data-delay 属性
      album.style.animationDelay = `${delay}ms`; // 设置动画延迟
    });
  });

  */

  document.addEventListener("DOMContentLoaded", () => {
    // 设置动画延迟
    const albums = document.querySelectorAll(".album");
    albums.forEach(album => {
        const delay = album.dataset.delay || 0; // 获取 data-delay 属性
        album.style.animationDelay = `${delay}ms`; // 设置动画延迟
        album.style.animation = "album-appear 1s ease forwards"; // 应用动画
    });

    // 横向滚动监听
    document.querySelectorAll('.album-container').forEach(container => {
        container.addEventListener('wheel', (event) => {
            event.preventDefault(); // 防止页面滚动
            container.scrollLeft += event.deltaY; // 横向滚动
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const albums = document.querySelectorAll(".album"); // 获取所有 .album 元素
  albums.forEach((album, index) => {
      const delay = index * 100; // 每个专辑延迟300ms
      album.style.animationDelay = `${delay}ms`; // 设置延迟
  });

  console.log("Dynamic delay applied to albums!"); // 确认代码执行
});