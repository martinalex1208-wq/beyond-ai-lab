/**
 * Prompt Lab - Photography Prompt Generator
 * Beyond AI Lab v1
 */

const LABELS = {
  subject: {
    portrait: 'a portrait of a person',
    landscape: 'a vast landscape scene',
    abstract: 'abstract shapes and textures',
    architecture: 'architectural structures',
    product: 'a product on clean background',
    wildlife: 'wildlife in natural habitat',
    street: 'street photography scene',
    fashion: 'fashion editorial shot',
    food: 'food photography',
    macro: 'macro detail of a subject'
  },
  'camera-angle': {
    'eye-level': 'shot at eye level',
    'low-angle': 'low angle looking up',
    'high-angle': 'high angle looking down',
    'birds-eye': "bird's eye view from above",
    'worms-eye': "worm's eye view from below",
    'dutch-angle': 'dutch angle with tilted horizon',
    'over-shoulder': 'over the shoulder perspective',
    profile: 'profile view'
  },
  lighting: {
    'natural-daylight': 'natural daylight',
    'golden-hour': 'golden hour warm light',
    'blue-hour': 'blue hour ambient light',
    'soft-diffused': 'soft diffused lighting',
    'dramatic-sidelight': 'dramatic sidelight with strong shadows',
    backlight: 'backlit with rim light',
    studio: 'professional studio lighting',
    neon: 'neon and city lights',
    'low-key': 'low key moody lighting',
    'high-key': 'high key bright lighting'
  },
  lens: {
    '24mm': '24mm wide angle lens',
    '35mm': '35mm lens',
    '50mm': '50mm lens',
    '85mm': '85mm portrait lens',
    '90mm-macro': '90mm macro lens',
    '135mm': '135mm lens',
    '200mm': '200mm telephoto lens',
    '70-200mm': '70-200mm zoom lens',
    fisheye: 'fisheye lens',
    'tilt-shift': 'tilt-shift lens'
  },
  aperture: {
    f1.2: 'f/1.2 shallow depth of field',
    f1.4: 'f/1.4 shallow depth of field',
    f1.8: 'f/1.8 shallow depth of field',
    f2.8: 'f/2.8',
    f4: 'f/4',
    f5.6: 'f/5.6',
    f8: 'f/8',
    f11: 'f/11',
    f16: 'f/16 deep depth of field'
  }
};

function generatePrompt(formData) {
  const subject = LABELS.subject[formData.subject] || formData.subject;
  const angle = LABELS['camera-angle'][formData['camera-angle']] || formData['camera-angle'];
  const lighting = LABELS.lighting[formData.lighting] || formData.lighting;
  const lens = LABELS.lens[formData.lens] || formData.lens;
  const aperture = LABELS.aperture[formData.aperture] || formData.aperture;

  return `Professional photography of ${subject}, ${angle}, ${lighting}, shot with ${lens} at ${aperture}, high resolution, 8K, photorealistic, award-winning composition.`;
}

function init() {
  const form = document.getElementById('prompt-form');
  const outputEl = document.getElementById('prompt-output');
  const promptTextEl = document.getElementById('prompt-text');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      subject: form.subject.value,
      'camera-angle': form['camera-angle'].value,
      lighting: form.lighting.value,
      lens: form.lens.value,
      aperture: form.aperture.value
    };

    const prompt = generatePrompt(formData);
    promptTextEl.textContent = prompt;
    outputEl.hidden = false;
    outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.querySelectorAll('.copy-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const prompt = button.parentElement.querySelector('.prompt-text').innerText;
      if (!prompt) return;

      navigator.clipboard.writeText(prompt).then(() => {
        button.innerText = 'Copied!';
        setTimeout(() => {
          button.innerText = 'Copy Prompt';
        }, 2000);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
