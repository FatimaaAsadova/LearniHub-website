(function () {
  async function setupSurveyHandler() {
    const attach = () => {
      const form = document.getElementById('surveyForm');
      const submitBtn = document.getElementById('surveySubmitBtn');
      const messageDiv = document.getElementById('message');

      if (!form || form.__hasSurveyHandler) return;
      form.__hasSurveyHandler = true;

      const doSave = async () => {
        // Düyməni deaktiv edirik
        if (submitBtn) submitBtn.disabled = true;

        const formData = {
          full_name: document.getElementById('full_name')?.value.trim() || '',
          course_name: document.getElementById('course_name')?.value.trim() || '',
          link: document.getElementById('course_link')?.value.trim() || '',
          description: document.getElementById('description')?.value.trim() || '',
          category: document.getElementById('category')?.value.trim() || ''
        };

        if (!formData.full_name || !formData.course_name || !formData.link) {
          alert('⚠ Zəhmət olmasa ad, kurs adı və link daxil edin.');
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        try {
          // CANLI RENDER LİNKİN:
          const response = await fetch('https://learnihub-backend.onrender.com/api/survey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });

          const result = await response.json();

          if (response.ok) {
            if (messageDiv) {
              messageDiv.classList.remove('hidden');
              messageDiv.className = 'p-4 bg-green-100 text-green-800 rounded-lg text-center font-semibold mb-4';
              messageDiv.textContent = '✅ Məlumatlar uğurla göndərildi!';
              setTimeout(() => { 
                messageDiv.textContent = ''; 
                messageDiv.className = 'hidden'; 
              }, 4000);
            }
            form.reset();
          } else {
            throw new Error(result.error || 'Server xətası');
          }
        } catch (err) {
          console.error('Survey save error:', err);
          if (messageDiv) {
            messageDiv.classList.remove('hidden');
            messageDiv.className = 'p-4 bg-red-100 text-red-800 rounded-lg text-center font-semibold mb-4';
            messageDiv.textContent = '❌ Xəta: ' + err.message;
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      };

      if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          doSave();
        });
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        doSave();
      });
    };

    attach();

    const observer = new MutationObserver(() => {
      const form = document.getElementById('surveyForm');
      if (form && !form.__hasSurveyHandler) attach();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSurveyHandler);
  } else {
    setupSurveyHandler();
  }
})();