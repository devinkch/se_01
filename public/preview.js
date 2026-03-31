const titleInput = document.getElementById('input-title');
const messageInput = document.getElementById('input-message');
const postcardTitle = document.getElementById('postcard-title');
const postcardMessage = document.getElementById('postcard-message');

titleInput.addEventListener('input', function() {
  postcardTitle.textContent = titleInput.value;
});

messageInput.addEventListener('input', function() {
  postcardMessage.textContent = messageInput.value;
});

const cityImages = {
    Berlin: {
      bg: '/assets/postcard_img_berlin_bg.jpg',
      cutout: '/assets/postcard_img_berlin_cutout.png'
    },
    Paris: {
      bg: '/assets/postcard_img_paris_bg.jpg',
      cutout: '/assets/postcard_img_paris_cutout.png'
    },
    Amsterdam: {
      bg: '/assets/postcard_img_amsterdam_bg.jpg',
      cutout: '/assets/postcard_img_amsterdam_cutout.png'
    }
  };
  
  const postcardBg = document.querySelector('.postcard-bg');
  const postcardCutout = document.querySelector('.postcard-cutout');
  
  document.querySelectorAll('input[name="city"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      const city = this.value;
      postcardTitle.textContent = city;
      titleInput.value = city;
      postcardBg.src = cityImages[city].bg;
      postcardCutout.src = cityImages[city].cutout;
    });
  });