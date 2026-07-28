document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. INTERACTIVE QUIZ LOGIC
    // ==========================================================================
    const quizData = [
        {
            question: "Which HTML5 tag is used to embed inline JavaScript code?",
            options: ["<script>", "<js>", "<javascript>", "<code">],
            answer: 0
        },
        {
            question: "Which CSS layout feature handles 2D grids natively?",
            options: ["Flexbox", "Float", "CSS Grid", "Position Absolute"],
            answer: 2
        },
        {
            question: "Which JS method converts JSON string into an Object?",
            options: ["JSON.stringify()", "JSON.parse()", "Object.toJSON()", "parse.JSON()"],
            answer: 1
        }
    ];

    let currentQ = 0;
    let score = 0;
    let canAnswer = true;

    const questionNum = document.getElementById('questionNum');
    const progressFill = document.getElementById('progressFill');
    const questionText = document.getElementById('questionText');
    const optionsGroup = document.getElementById('optionsGroup');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizContainer = document.getElementById('quizContainer');
    const scoreScreen = document.getElementById('scoreScreen');
    const finalScore = document.getElementById('finalScore');
    const totalQuestions = document.getElementById('totalQuestions');
    const restartBtn = document.getElementById('restartBtn');

    function loadQuiz() {
        canAnswer = true;
        quizFeedback.textContent = '';
        const q = quizData[currentQ];

        // Update progress UI
        questionNum.textContent = `Question ${currentQ + 1} of ${quizData.length}`;
        progressFill.style.width = `${((currentQ + 1) / quizData.length) * 100}%`;

        questionText.textContent = q.question;
        optionsGroup.innerHTML = '';

        q.options.forEach((optionText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.textContent = optionText;
            btn.addEventListener('click', () => handleAnswer(idx, btn));
            optionsGroup.appendChild(btn);
        });
    }

    function handleAnswer(selectedIdx, selectedBtn) {
        if (!canAnswer) return;
        canAnswer = false;

        const correctIdx = quizData[currentQ].answer;
        const allButtons = optionsGroup.querySelectorAll('.opt-btn');

        if (selectedIdx === correctIdx) {
            score++;
            selectedBtn.classList.add('correct');
            quizFeedback.style.color = 'var(--success)';
            quizFeedback.textContent = 'Correct Answer! 🎉';
        } else {
            selectedBtn.classList.add('wrong');
            allButtons[correctIdx].classList.add('correct');
            quizFeedback.style.color = 'var(--danger)';
            quizFeedback.textContent = 'Wrong Answer!';
        }

        setTimeout(() => {
            currentQ++;
            if (currentQ < quizData.length) {
                loadQuiz();
            } else {
                showScoreScreen();
            }
        }, 1200);
    }

    function showScoreScreen() {
        quizContainer.classList.add('hidden');
        scoreScreen.classList.remove('hidden');
        finalScore.textContent = score;
        totalQuestions.textContent = quizData.length;
    }

    restartBtn.addEventListener('click', () => {
        currentQ = 0;
        score = 0;
        scoreScreen.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        loadQuiz();
    });

    loadQuiz();


    // ==========================================================================
    // 2. LIVE API FETCHING LOGIC
    // ==========================================================================
    const fetchApiBtn = document.getElementById('fetchApiBtn');
    const apiDataText = document.getElementById('apiDataText');
    const apiStatus = document.getElementById('apiStatus');

    fetchApiBtn.addEventListener('click', fetchLiveData);

    async function fetchLiveData() {
        apiDataText.textContent = 'Fetching fresh data...';
        apiStatus.className = 'api-status loading';
        apiStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
        fetchApiBtn.disabled = true;

        try {
            // Using Official Public Joke API
            const response = await fetch('https://official-joke-api.appspot.com/random_joke');
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            apiDataText.innerHTML = `<strong>${data.setup}</strong><br><em style="color: var(--accent); margin-top: 6px; display: inline-block;">"${data.punchline}"</em>`;

            apiStatus.className = 'api-status';
            apiStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success)"></i> Success';
        } catch (error) {
            apiDataText.textContent = 'Oops! Could not fetch data. Please try again.';
            apiStatus.className = 'api-status';
            apiStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--danger)"></i> Error';
        } finally {
            fetchApiBtn.disabled = false;
        }
    }

});