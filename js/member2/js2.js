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