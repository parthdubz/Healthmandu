
document.addEventListener('DOMContentLoaded', () => {
  
  const circles = document.querySelectorAll('.circle');
  circles.forEach(circle => {
    circle.addEventListener('click', () => {
      circle.classList.toggle('active');
    });
  });
});
