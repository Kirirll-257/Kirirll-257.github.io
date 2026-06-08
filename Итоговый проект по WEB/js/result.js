document.addEventListener('DOMContentLoaded', function () {
    loadLeader();
    const theme = document.getElementById('theme-s');
    if (theme) {
        const saveTheme = localStorage.getItem('theme');
        if (saveTheme === 'light') {
            document.body.classList.add('theme-light');
        }
        theme.addEventListener('click', function () {
            document.body.classList.toggle('theme-light');
            const Light = document.body.classList.contains('theme-light');
            localStorage.setItem('theme', Light ? 'light' : 'dark');
        });
    }
});

function loadLeader() {
    const res = JSON.parse(localStorage.getItem('quizResults') || '[]');
    const tb = document.getElementById('leader-board');
    document.getElementById('games-count').textContent = res.length;
    if (res.length > 0) {
        let totalP = 0;
        let bestS = 0;

        for (let i = 0; i < res.length; i++) {
            totalP += res[i].percentage;
            if (res[i].score > bestS) {
                bestS = res[i].score;
            }
        }

        const avgP = Math.round(totalP / res.length);
        document.getElementById('avg-score').textContent = avgP + '%';
        document.getElementById('best-score').textContent = bestS;

        const sort1 = [...res].sort((a, b) => b.score - a.score);
        const top5 = sort1.slice(0, 5);
        let html = '';
        for (let i = 0; i < top5.length; i++) {
            const r = top5[i];
            let win = '';
            if (i === 0) {
                win = 'Золото';
            } else if (i === 1) {
                win = 'Серебро';
            } else if (i === 2) {
                win = 'Бронза';
            } else {
                win = i + 1;
            }

            html += '<tr>';
            html += '<td>' + win + '</td>';
            html += '<td>' + r.score + '</td>';
            html += '<td>' + r.percentage + '%</td>';
            html += '<td>' + getCategory(r.category) + '</td>';
            html += '</tr>';
        }
        tb.innerHTML = html;
    } else {
        document.getElementById('avg-score').textContent = '0%';
        document.getElementById('best-score').textContent = '0';
    }
}

function getCategory(category) {
    const names = { 'html': 'HTML', 'css': 'CSS', 'javascript': 'JavaScript' };
    return names[category] || category;
}