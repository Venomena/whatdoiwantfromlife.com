document.addEventListener('DOMContentLoaded', () => {
    const inputForm = document.getElementById('input-form');
    const logContainer = document.getElementById('log-container');
    const logBox = document.getElementById('log-box');
    const progressBar = document.getElementById('progress-bar').firstElementChild;
    const resultsContainer = document.getElementById('results-container');
    const resultsBox = document.getElementById('results-box');
  
    inputForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idea = document.getElementById('idea').value;
      const response = await fetch('http://127.0.0.1:5000/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });
      const data = await response.json();
      handleEvaluation(data.evaluation);
    });
  
    const handleEvaluation = (evaluation) => {
      logContainer.classList.remove('hidden');
      setTimeout(() => {
        logContainer.classList.add('show');
        progressBar.style.width = '100%';
        setTimeout(() => {
          resultsContainer.classList.remove('hidden');
          setTimeout(() => resultsContainer.classList.add('show'), 500);
          displayResults(evaluation);
        }, 1000);
      }, 100);
    };
  
    const displayResults = (evaluation) => {
      const sections = evaluation.split('\n\n').map((section) => {
        const div = document.createElement('div');
        div.className = 'evaluation-section mb-4';
        section.split('\n').forEach((line) => {
          const p = document.createElement('p');
          p.className = 'text-white';
          p.textContent = line;
          div.appendChild(p);
        });
        return div;
      });
      sections.forEach((section) => resultsBox.appendChild(section));
    };
  });
  