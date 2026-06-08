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
});