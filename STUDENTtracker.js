// --- Data Models ---
class Student {
    constructor(ID, name, attendance = '') {
        this.ID = ID;
        this.name = name;
        this.attendance = attendance;
        this.next = null;
    }
}

class StudentList {
    constructor() {
        this.head = null;
    }

    addStudent(ID, name) {
        if (this.findStudent(ID)) return false; // Prevent duplicate IDs
        const newStudent = new Student(ID, name);
        if (!this.head) {
            this.head = newStudent;
            return true;
        }
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newStudent;
        return true;
    }

    findStudent(ID) {
        let current = this.head;
        while (current) {
            if (current.ID === ID) return current;
            current = current.next;
        }
        return null;
    }

    getAllStudents() {
        const students = [];
        let current = this.head;
        while (current) {
            students.push({ ...current });
            current = current.next;
        }
        return students;
    }

    setAllStudents(students) {
        this.head = null;
        students.forEach(s => this.addStudent(s.ID, s.name));
        // Restore attendance
        let current = this.head;
        students.forEach(s => {
            if (current) {
                current.attendance = s.attendance;
                current = current.next;
            }
        });
    }

    getStatistics() {
        let present = 0, absent = 0;
        let current = this.head;
        while (current) {
            if (current.attendance === 'Present') present++;
            else if (current.attendance === 'Absent') absent++;
            current = current.next;
        }
        return { present, absent, total: present + absent };
    }
}

// --- Persistence ---
const STORAGE_KEY = 'studentListData';
const studentList = new StudentList();

function saveToStorage() {
    const students = studentList.getAllStudents();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            const students = JSON.parse(data);
            studentList.setAllStudents(students);
        } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
        }
    }
}

// --- UI Logic ---
const UI = {
    studentInputs: document.getElementById('studentInputs'),
    studentTable: document.getElementById('studentTable'),
    statsDisplay: document.getElementById('statsDisplay'),
    loading: document.querySelector('.loading'),
    addForm: document.getElementById('addStudentForm'),
    attendanceForm: document.getElementById('attendance'),

    showLoading(show = true) {
        this.loading.style.display = show ? 'block' : 'none';
    },

    showMessage(msg, type = 'info') {
        let el = document.getElementById('ui-message');
        if (!el) {
            el = document.createElement('div');
            el.id = 'ui-message';
            el.style.position = 'fixed';
            el.style.top = '20px';
            el.style.left = '50%';
            el.style.transform = 'translateX(-50%)';
            el.style.zIndex = '2000';
            el.style.padding = '12px 24px';
            el.style.borderRadius = '8px';
            el.style.fontWeight = 'bold';
            el.style.background = type === 'error' ? '#dd6722' : '#30aee9';
            el.style.color = '#fff';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.style.background = type === 'error' ? '#dd6722' : '#30aee9';
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 2200);
    },

    renderStudentInputs(count) {
        this.studentInputs.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'student-input-row';
            div.innerHTML = `
                <input type="number" id="id${i}" placeholder="ID Étudiant ${i + 1}" aria-label="ID Étudiant ${i + 1}">
                <input type="text" id="name${i}" placeholder="Nom Étudiant ${i + 1}" aria-label="Nom Étudiant ${i + 1}">
                <button type="button" data-index="${i}" class="add-student-btn">Ajouter</button>
            `;
            this.studentInputs.appendChild(div);
        }
    },

    renderStudentTable() {
        let html = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Assiduité</th>
                </tr>
        `;
        let current = studentList.head;
        while (current) {
            html += `
                <tr>
                    <td>${current.ID}</td>
                    <td>${current.name}</td>
                    <td>${current.attendance || '-'}</td>
                </tr>
            `;
            current = current.next;
        }
        html += '</table>';
        this.studentTable.innerHTML = html;
    },

    renderStatistics() {
        const stats = studentList.getStatistics();
        this.statsDisplay.innerHTML = `
            <p>Présents: ${stats.present}</p>
            <p>Absents: ${stats.absent}</p>
            <p>Total: ${stats.total}</p>
        `;
    },

    clearStudentInputs() {
        this.studentInputs.innerHTML = '';
    }
};

// --- Event Handlers ---
function initializeStudentInput() {
    const count = parseInt(document.getElementById('studentCount').value);
    if (isNaN(count) || count <= 0) {
        UI.showMessage('Veuillez entrer un nombre valide.', 'error');
        return;
    }
    UI.renderStudentInputs(count);
}

function handleAddStudent(e) {
    if (!e.target.classList.contains('add-student-btn')) return;
    const index = e.target.getAttribute('data-index');
    const id = parseInt(document.getElementById(`id${index}`).value);
    const name = document.getElementById(`name${index}`).value.trim();
    if (isNaN(id) || !name) {
        UI.showMessage('ID et nom requis.', 'error');
        return;
    }
    const added = studentList.addStudent(id, name);
    if (!added) {
        UI.showMessage('ID déjà existant.', 'error');
        return;
    }
    saveToStorage();
    UI.renderStudentTable();
    UI.clearStudentInputs();
    UI.showMessage('Étudiant ajouté avec succès.');
}

function markAttendance() {
    const id = parseInt(document.getElementById('studentId').value);
    const status = document.getElementById('attendanceStatus').value;
    if (isNaN(id)) {
        UI.showMessage('ID invalide.', 'error');
        return;
    }
    const student = studentList.findStudent(id);
    if (student) {
        student.attendance = status;
        saveToStorage();
        UI.renderStudentTable();
        UI.renderStatistics();
        UI.showMessage('Assiduité mise à jour.');
    } else {
        UI.showMessage('Étudiant non trouvé!', 'error');
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    UI.renderStudentTable();
    UI.renderStatistics();

    // Remove inline onclicks, use event listeners
    document.getElementById('studentCount').addEventListener('keydown', e => {
        if (e.key === 'Enter') initializeStudentInput();
    });
    document.querySelector('#addStudentForm button').addEventListener('click', initializeStudentInput);
    UI.studentInputs.addEventListener('click', handleAddStudent);
    document.querySelector('#attendance button').addEventListener('click', markAttendance);
});