let questions = [];
let curIndex = 0;
let score = 0;
let corAn = 0;
let wrongAn = 0;
let userAn = [];
let curCategory = 'all';
let curLevel = 'beginner';

function LoadingQuiz(category, level) {
    return fetch('index.json').then(response => response.json()).then(data => {
        if (data[category] && data[category][level]) {
            questions = data[category][level];
            questions.sort(() => Math.random() - 0.5);
            return true;
        }
        return false;
    })
        .catch(error => {
            console.log('Ошибка загрузки викторины: ', error);
            return false;
        });
}

function startGame(category, level) {
    curCategory = category;
    curLevel = level;
    LoadingQuiz(category, level).then(load => {
        ;
        if (load) {
            curIndex = 0;
            score = 0;
            corAn = 0;
            wrongAn = 0;
            userAn = [];
            showQuiz();
        } else {
            console.log('Не удалось загрузить викторину. Проверьте свой интернет!');
        }
    });
}

function showQuiz() {
    const quizCont = document.getElementById('quiz');
    if (!quizCont) {
        return;
    }
    quizCont.classList.remove('quiz_hidden');
    if (curIndex >= questions.length) {
        showRes();
        return;
    }

    const question = questions[curIndex];

    let html = '<div class="quiz-info">';
    html += '<span>Вопрос: ' + (curIndex + 1) + ' из ' + questions.length + '</span>';
    html += '<span>Очки: ' + score + '</span>';
    html += '</div>';
    html += '<h2>' + question.question + '</h2>';
    html += '<div class="options">';

    for (let i = 0; i < question.options.length; i++) {
        html += '<button class="option-btn" data-index="' + i + '">' + question.options[i] + '</button>';
    }
    html += '</div>';
    quizCont.innerHTML = html;
    const buttons = quizCont.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const indexes = parseInt(this.getAttribute('data-index'));
            selectAnswer(indexes);
        });
    });
    quizCont.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectAnswer(selectIndex) {
    const question = questions[curIndex];
    const isCor = selectIndex === question.correct;
    if (isCor) {
        score += 10;
        corAn++;
    } else {
        wrongAn++;
    }

    userAn.push({
        question: question.question,
        selected: question.options[selectIndex],
        correct: question.options[question.correct],
        isCor: isCor,
        explanation: question.explanation
    });
    curIndex++;
    showQuiz();
}

function showRes() {
    const quizCont = document.getElementById('quiz');
    quizCont.classList.remove('quiz_hidden');
    const percentage = Math.round((corAn / questions.length) * 100);
    saveRes(percentage);
    let rang = 'На пути к величию';
    if (percentage >= 80) {
        rang = 'Властелин легаси-кода';
    } else if (percentage >= 60) {
        rang = 'Мастер Ctr+C / Ctr+V'
    } else if (percentage >= 40) {
        rang = 'Герой "Hello, world!"';
    }

    let reviewHTML = '';
    for (let i = 0; i < userAn.length; i++) {
        const ans = userAn[i];
        const reviewClass = ans.isCor ? 'correct' : 'incorrect';
        reviewHTML += '<div class="review-item' + reviewClass + '">';
        reviewHTML += '<h3>Вопрос ' + (i + 1) + status + '<h3>';
        reviewHTML += '<p class="question-text">' + ans.question + '</p>';
        reviewHTML += '<div class="answer-details">';
        reviewHTML += '<p><strong>Ваш ответ: <strong>' + ans.selected + ' ' + (ans.isCor ? '(OK)' : '(NO)') + '<p>';
        if (!ans.isCor) {
            reviewHTML += '<p><strong>Правильный ответ:</strong>' + ans.correct + '</p>';
        }
        reviewHTML += '</div>';
        reviewHTML += '<div class="explanation">';
        reviewHTML += '<h4> Объяснение:</h4>';
        reviewHTML += '<div class="explanation-toggle">';
        reviewHTML += '<button class="toggle-btn active" onclick="toggleExplanation(' + i + ', \'simple\', this)">Простыми словами</button>';
        reviewHTML += '<button class="toggle-btn" onclick="toggleExplanation(' + i + ', \'professional\', this)">Профессионально</button>';
        reviewHTML += '</div>';
        reviewHTML += '<p class="explanation-text" id="exp-' + i + '">' + ans.explanation.simple + '</p>';
        reviewHTML += '</div>';
        reviewHTML += '</div>';
    }

    let html = '<div class="results-container">';
    html += '<h2>Тест завершён!</h2>';
    html += '<div class="final-stats">';
    html += '<div class="start-card">';
    html += '<span class="stat-label">Правильных ответов: </span>';
    html += '<span class="stat-value">' + corAn + '</span>';
    html += '</div>';
    html += '<div class="stat-card">';
    html += '<span class="stat-label">Неправильных ответов: </span>';
    html += '<span class="stat-value">' + wrongAn + '</span>';
    html += '</div>';
    html += '<div class="stat-card">';
    html += '<span class="stat-label">Общее число очков: </span>';
    html += '<span class="stat-value">' + score + '</span>';
    html += '</div>';
    html += '<div class="stat-card">';
    html += '<span class="stat-label">Ваше звание: </span>';
    html += '<span class="stat-value">' + rang + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="questions-review">';
    html += '<h3>Объяснение вопросов викторины: </h3>';
    html += reviewHTML;
    html += '</div>';
    html += '<div class="results-actions">';
    html += '<button class="btn-primary" onclick="restartTest()">Пройти заново?</button>';
    html += '<a href="index.html" class="btn-secondary">На главную</a>';
    html += '<a href="result.html" class="btn-secondary">Таблица лидеров</a>';
    html += '</div>';
    html += '</div>';

    quizCont.innerHTML = html;
    quizCont.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleExplanation(index, mode, button) {
    const par = button.parentElement;
    const buts = par.querySelectorAll('.toggle-btn');
    buts.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const ans = userAn[index];
    document.getElementById('exp-' + index).textContent = ans.explanation[mode];
}

function saveRes(percentage) {
    const res = JSON.parse(localStorage.getItem('quizResults') || '[]');
    res.push({
        date: new Date().toLocaleDateString('ru-RU'),
        score: score,
        correct: corAn,
        wrong: wrongAn,
        percentage: percentage,
        category: curCategory,
        level: curLevel
    });
    localStorage.setItem('quizResults', JSON.stringify(res));
}

function restartTest() {
    startGame(curCategory, curLevel);
}

document.addEventListener('DOMContentLoaded', function () {
    const theme = document.getElementById('theme-s');
    if (theme) {
        const saveTheme = localStorage.getItem('theme');
        if (saveTheme === 'light') {
            document.body.classList.add('theme-light');
            theme.textContent = 'Тема';
        }
        theme.addEventListener('click', function () {
            document.body.classList.toggle('theme-light');
            const Light = document.body.classList.contains('theme-light');
            localStorage.setItem('theme', Light ? 'light' : 'dark');
            theme.textContent = Light ? 'Светлая' : 'Тёмная';
        });
    }
    const startButtons = document.querySelectorAll('.new');
    startButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            const level = this.getAttribute('data-level');
            if (category && level) {
                startGame(category, level);
            }
        });
    });
});