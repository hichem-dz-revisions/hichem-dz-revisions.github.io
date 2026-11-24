// --- GESTION THÈME ---
const root = document.documentElement;
const themeBtn = document.getElementById('theme-icon');

function toggleTheme() {
    if (root.getAttribute('data-theme') === 'light') {
        root.removeAttribute('data-theme'); 
        themeBtn.textContent = '🌙';
    } else {
        root.setAttribute('data-theme', 'light'); 
        themeBtn.textContent = '☀️';
    }
}

// --- GESTION ONGLETS ---
let exosGenerated = false;

function switchTab(id) {
    document.querySelectorAll('.container').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.target.classList.add('active');
    
    if(id === 'exos' && !exosGenerated) { 
        generateTDH(); 
        exosGenerated = true; 
    }
}

// ==========================================
// --- BANQUE DE QUESTIONS QCM (Très large) ---
// ==========================================
const qcmBank = [
    {
        q: "Lors de la préparation d'une solution par dissolution, quelle verrerie doit-on utiliser pour prélever le volume final avec précision ?",
        ans: "Une fiole jaugée",
        opts: ["Un bécher", "Une éprouvette graduée", "Une fiole jaugée", "Un erlenmeyer"],
        exp: "La fiole jaugée possède un trait de jauge qui permet de mesurer un volume avec une grande précision (contrairement au bécher qui n'est pas précis)."
    },
    {
        q: "Quelle est la première étape de la préparation d'une solution par dissolution ?",
        ans: "Peser la masse calculée de soluté",
        opts: ["Verser l'eau dans la fiole", "Peser la masse calculée de soluté", "Agiter la solution", "Boucher la fiole"],
        exp: "Avant de manipuler, il faut toujours calculer la masse (m = Cm x V) puis la peser avec une balance de précision."
    },
    {
        q: "Comment doit-on lire le niveau de liquide dans une fiole jaugée pour être précis ?",
        ans: "En plaçant l'œil au niveau du bas du ménisque",
        opts: ["En regardant d'en haut", "En plaçant l'œil au niveau du bas du ménisque", "En regardant d'en bas", "Peu importe la position"],
        exp: "Pour éviter les erreurs de parallaxe, l'œil doit être aligné avec le bas du ménisque (la courbure du liquide)."
    },
    {
        q: "Dans une solution aqueuse d'eau salée, quel est le solvant ?",
        ans: "L'eau",
        opts: ["Le sel", "L'eau", "Le mélange", "Le soluté"],
        exp: "Une solution est aqueuse quand le solvant est l'eau. Le sel est le soluté dissous."
    },
    {
        q: "Que signifie le mot 'homogène' pour une solution ?",
        ans: "On ne distingue pas les constituants à l'œil nu",
        opts: ["Le liquide est transparent", "On ne distingue pas les constituants à l'œil nu", "Le mélange est froid", "Il y a plusieurs phases visibles"],
        exp: "Un mélange homogène est un mélange dans lequel on ne peut pas distinguer les différents constituants à l'œil nu."
    },
    {
        q: "Quelle est l'unité de la concentration en masse (Cm) ?",
        ans: "g/L",
        opts: ["g", "L", "g/L", "mol/L"],
        exp: "La concentration en masse s'exprime en grammes par litre (g/L ou g.L⁻¹)."
    },
    {
        q: "On ajoute du sucre dans un verre d'eau. Au bout d'un moment, le sucre ne se dissout plus et s'accumule au fond. Comment appelle-t-on cet état ?",
        ans: "Une solution saturée",
        opts: ["Une solution aqueuse", "Une solution saturée", "Un mélange hétérogène", "Une solution concentrée"],
        exp: "Lorsque la concentration atteint la solubilité maximale (la limite), on dit que la solution est saturée."
    },
    {
        q: "Qu'est-ce que la solubilité d'un soluté ?",
        ans: "La masse maximale de soluté qu'on peut dissoudre dans 1 L de solvant",
        opts: ["La vitesse à laquelle le soluté se dissout", "La masse maximale de soluté qu'on peut dissoudre dans 1 L de solvant", "La température de fusion du soluté", "Le volume d'eau nécessaire pour dissoudre 1g de soluté"],
        exp: "La solubilité est la concentration maximale. Au-delà, la solution est saturée et le soluté ne se dissout plus."
    }
];

// ==========================================
// --- LOGIQUE TDH (GÉNÉRATION INFINIE) ---
// ==========================================
let exercisesData = [];

// Fonction utilitaire pour un nombre aléatoire avec décimales
function rand(min, max, decimals = 1) {
    let val = Math.random() * (max - min) + min;
    return parseFloat(val.toFixed(decimals));
}

// Fonction pour mélanger un tableau (Fisher-Yates)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function generateTDH() {
    const container = document.getElementById('exercises-list');
    container.innerHTML = ""; 
    exercisesData = []; 

    let calcGenerators = [
        // Calc 1 : Trouver Cm (Cm = m/V)
        () => {
            let V_ml = [50, 100, 150, 200, 250, 500][Math.floor(Math.random()*6)];
            let V_L = V_ml / 1000;
            let m = rand(1, 25, 1);
            let ans = parseFloat((m / V_L).toFixed(2));
            return {
                title: "Calcul de concentration", unitDisplay: "g/L", correctAns: ans,
                question: `On dissout une masse <strong>m = ${m} g</strong> de soluté dans de l'eau pour obtenir un volume final de solution <strong>V = ${V_ml} mL</strong>.<br>Quelle est la concentration en masse Cm de cette solution ?`,
                explanation: `<strong>Méthode :</strong> Cm = m / V.<br>⚠️ Conversion : V = ${V_ml} mL = ${V_L} L.<br>Calcul : Cm = ${m} / ${V_L} = <strong>${ans} g/L</strong>.`
            };
        },
        // Calc 2 : Trouver la masse (m = Cm * V)
        () => {
            let Cm = [5, 10, 15, 20, 25, 40, 50][Math.floor(Math.random()*7)];
            let V_ml = [50, 100, 250, 500][Math.floor(Math.random()*4)];
            let V_L = V_ml / 1000;
            let ans = parseFloat((Cm * V_L).toFixed(2));
            return {
                title: "Préparation par dissolution", unitDisplay: "g", correctAns: ans,
                question: `On souhaite préparer <strong>${V_ml} mL</strong> d'une solution de concentration <strong>Cm = ${Cm} g/L</strong>.<br>Quelle masse m de soluté faut-il peser ?`,
                explanation: `<strong>Méthode :</strong> m = Cm × V.<br>⚠️ Conversion : V = ${V_ml} mL = ${V_L} L.<br>Calcul : m = ${Cm} × ${V_L} = <strong>${ans} g</strong>.`
            };
        },
        // Calc 3 : Trouver le Volume (V = m / Cm)
        () => {
            let m = rand(2, 20, 1);
            let Cm = [10, 20, 25, 50][Math.floor(Math.random()*4)];
            let V_L = m / Cm;
            let V_ml = parseFloat((V_L * 1000).toFixed(0));
            return {
                title: "Calcul de Volume", unitDisplay: "mL", correctAns: V_ml,
                question: `On a pesé une masse <strong>m = ${m} g</strong> de soluté. On veut préparer une solution de concentration <strong>Cm = ${Cm} g/L</strong>.<br>Quel volume V de solution (en mL) doit-on préparer ?`,
                explanation: `<strong>Méthode :</strong> V = m / Cm.<br>Calcul en Litres : V = ${m} / ${Cm} = ${V_L} L.<br>⚠️ On demande des mL : ${V_L} L × 1000 = <strong>${V_ml} mL</strong>.`
            };
        }
    ];

    let selectedCalcs = shuffle([...calcGenerators]).slice(0, 3);
    let selectedQcms = shuffle([...qcmBank]).slice(0, 2);

    let finalQuestions = shuffle([
        ...selectedCalcs.map(fn => fn()),
        ...selectedQcms.map(q => ({ ...q, isQcm: true }))
    ]);

    finalQuestions.forEach((exo, i) => {
        const cardId = `exo-card-${i}`;
        exo.id = cardId;
        exercisesData.push(exo);

        let html = `
        <div class="card exercise-card" id="${cardId}">
            <div class="exo-header">
                <h2 style="border:none; margin:0; color:var(--text)">Q${i+1} : ${exo.title}</h2>
                <span class="exo-number">Q${i+1}</span>
            </div>
            <div class="question-text">${exo.question}</div>
        `;

        if(exo.isQcm) {
            html += `<div class="qcm-zone" id="qcm-${cardId}">`;
            shuffle(exo.opts).forEach((opt) => {
                html += `<button class="qcm-btn" onclick="checkQcm(${i}, '${opt}', this)">${opt}</button>`;
            });
            html += `</div>`;
        } else {
            html += `
            <div class="answer-zone">
                <input type="number" id="input-${cardId}" step="any" placeholder="Ta réponse">
                <span class="unit-label">${exo.unitDisplay}</span>
                <button class="btn" onclick="checkInput(${i}, 'input-${cardId}')">Vérifier</button>
            </div>
            `;
        }

        html += `<div class="feedback" id="feedback-${cardId}"></div></div>`;
        container.innerHTML += html;
    });
}

function checkQcm(index, btnText, btnElement) {
    let exo = exercisesData[index];
    let fb = document.getElementById(`feedback-${exo.id}`);
    document.getElementById(`qcm-${exo.id}`).querySelectorAll('.qcm-btn').forEach(b => b.disabled = true);

    let isCorrect = (btnText === exo.ans);

    if (isCorrect) {
        btnElement.classList.add('correct');
        fb.innerHTML = `✅ <strong>Bonne réponse !</strong><br><br><div class="math-box">${exo.exp}</div>`;
        fb.className = "feedback success show";
    } else {
        btnElement.classList.add('incorrect');
        document.getElementById(`qcm-${exo.id}`).querySelectorAll('.qcm-btn').forEach(b => {
            if(b.textContent === exo.ans) b.classList.add('correct');
        });
        fb.innerHTML = `❌ <strong>Raté.</strong> La bonne réponse était : ${exo.ans}.<br><br><div class="math-box">${exo.exp}</div>`;
        fb.className = "feedback error show";
    }
}

function checkInput(index, inputId) {
    let exo = exercisesData[index];
    let input = document.getElementById(inputId);
    let val = parseFloat(input.value);
    let fb = document.getElementById(`feedback-${exo.id}`);

    if (isNaN(val)) { fb.innerHTML = "Merci d'entrer un nombre valide."; fb.className = "feedback error show"; return; }
    
    let tol = 0.1; 

    if (Math.abs(val - exo.correctAns) <= tol) {
        fb.innerHTML = `✅ <strong>Parfait !</strong><br><br><div class="math-box">${exo.explanation}</div>`;
        fb.className = "feedback success show";
        input.disabled = true;
    } else {
        let erreurClassique = "";
        if (exo.unitDisplay === "g/L" && val >= exo.correctAns * 50) {
            erreurClassique = `<br><br>💡 <em>Indice : Il y a de fortes chances que tu aies oublié de convertir les millilitres (mL) en Litres (L) ! (Divise par 1000)</em>`;
        }
        if (exo.unitDisplay === "mL" && val < exo.correctAns / 50) {
            erreurClassique = `<br><br>💡 <em>Indice : Tu as trouvé le volume en Litres, mais on te demande des millilitres (mL) ! (Multiplie par 1000)</em>`;
        }

        fb.innerHTML = `❌ <strong>Raté.</strong> Ta réponse : ${val} ${exo.unitDisplay}.<br>La bonne réponse était <strong>${exo.correctAns} ${exo.unitDisplay}</strong>.${erreurClassique}<br><br><div class="math-box">${exo.explanation}</div>`;
        fb.className = "feedback error show";
    }
}
