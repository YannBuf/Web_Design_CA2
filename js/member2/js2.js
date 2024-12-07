document.addEventListener("DOMContentLoaded", () => {
    // Set animation delay
    const albums = document.querySelectorAll(".album");
    albums.forEach(album => {
        const delay = album.dataset.delay || 0; // Get the data-delay attribute
        album.style.animationDelay = `${delay}ms`; // Set the animation delay
        album.style.animation = "album-appear 1s ease forwards"; // Apply the animation
    });

    // Horizontal scroll listener
    document.querySelectorAll('.album-container').forEach(container => {
        container.addEventListener('wheel', (event) => {
            event.preventDefault(); // Prevent page scrolling
            container.scrollLeft += event.deltaY; // Horizontal scroll
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const albums = document.querySelectorAll(".album"); // Get all .album elements
  albums.forEach((album, index) => {
      const delay = index * 100; // Set each album's delay to 100ms * index
      album.style.animationDelay = `${delay}ms`; // Apply the delay
  });

  console.log("Dynamic delay applied to albums!"); // Confirm the code execution
});
