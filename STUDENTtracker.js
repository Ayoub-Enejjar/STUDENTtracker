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
        const newStudent = new Student(ID, name);
        if (!this.head) {
            this.head = newStudent;
            return;
        }
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newStudent;
    }

    findStudent(ID) {
        let current = this.head;
        while (current) {
            if (current.ID === ID) return current;
            current = current.next;
        }
        return null;
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

const studentList = new StudentList();

function initializeStudentInput() {
    const count = parseInt(document.getElementById('studentCount').value);
    const container = document.getElementById('studentInputs');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        container.innerHTML += `
            <div>
                <input type="number" id="id${i}" placeholder="ID Étudiant ${i + 1}">
                <input type="text" id="name${i}" placeholder="Nom Étudiant ${i + 1}">
                <button onclick="addStudent(${i})">Ajouter</button>
            </div>
        `;
    }
}

function addStudent(index) {
    const id = parseInt(document.getElementById(`id${index}`).value);
    const name = document.getElementById(`name${index}`).value;
    studentList.addStudent(id, name);
    updateStudentTable();
}

function markAttendance() {
    const id = parseInt(document.getElementById('studentId').value);
    const status = document.getElementById('attendanceStatus').value;
    const student = studentList.findStudent(id);
    if (student) {
        student.attendance = status;
        updateStudentTable();
        updateStatistics();
    } else {
        alert('Étudiant non trouvé!');
    }
}

function updateStudentTable() {
    const container = document.getElementById('studentTable');
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
    container.innerHTML = html;
}

function updateStatistics() {
    const stats = studentList.getStatistics();
    document.getElementById('statsDisplay').innerHTML = `
        <p>Présents: ${stats.present}</p>
        <p>Absents: ${stats.absent}</p>
        <p>Total: ${stats.total}</p>
    `;
}