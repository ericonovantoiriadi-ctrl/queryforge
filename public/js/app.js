document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('analyze-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const sql = document.getElementById('sql-input').value;
            const dialect = document.getElementById('dialect').value;
            document.getElementById('loading').style.display = 'block';
            try {
                const resp = await fetch('/api/analyze', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({sql, dialect}) });
                const data = await resp.json();
                if (data.id) window.location.href = '/results/' + data.id;
            } catch(err) { alert('Analysis failed: ' + err.message); }
            document.getElementById('loading').style.display = 'none';
        });
    }
});
