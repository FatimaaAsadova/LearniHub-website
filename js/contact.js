// js/contact.js — Realtime Database (matches js/firebase.js)
import { db, ref, push, set } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      alert('⚠ Please fill in all fields.');
      return;
    }

    try {
      const contactRef = push(ref(db, 'contactMessages'));
      await set(contactRef, {
        name,
        email,
        message,
        timestamp: Date.now(),
      });

      alert('✓ Your message was sent successfully!');
      form.reset();
    } catch (err) {
      console.error('Failed to submit:', err);
      alert('✗ Failed to send message, try again.');
    }
  });
});
