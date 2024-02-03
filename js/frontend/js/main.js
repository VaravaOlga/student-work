import Student from "./student.js";

const SERVER_URL = 'http://localhost:3000'

async function serverAddstudent(obj){
  let response = await fetch (SERVER_URL + '/api/students' , {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
  })
  let data = await response.json()
  return data
}

async function serverGetstudent(){
  let response = await fetch (SERVER_URL + '/api/students' , {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },

  })
  let data = await response.json()
  return data
}


async function serverDeleteSudent(id) {
  let response = await fetch(SERVER_URL + '/api/students/' + id, {
      method: "DELETE",
  })

  let data = await response.json()

  return data
}

let serverData = await serverGetstudent();

let studentsArray = [];

if (serverData){
  for (const item of serverData) {
    studentsArray.push(new Student(item.id, item.name, item.surname, item.lastname,  item.birthday, item.studyStart, item.faculty))
  }
}

// const studentsArray = [
//   new Student('Игорь', 'Пасечников', 'Евгеньевич', new Date(1995, 3, 9), new Date(2021, 3, 9), 'менеджмент и управление'),
//   new Student('Матильда', 'Петрова', 'Юрьевна', new Date(1990, 3, 22), new Date(1995, 3, 9), 'гостинечное дело и туризм'),
//   new Student('Кирилл', 'Вовченко', 'Олегович', new Date(1992, 9, 22), new Date(1995, 3, 9), 'экономика и право'),
//   new Student('Алиса', 'Марконина', 'Александровна', new Date(1998, 3, 16), new Date(1995, 3, 9), 'менеджмент и управление'),
//   new Student('Ян', 'Тукалов', 'Ашотович', new Date(1992, 3, 22), new Date(1995, 3, 9), 'дизайн и упаковка')
// ];



const $studentsList = document.getElementById('students-list');
const $studentsListTHALL = document.querySelectorAll('.students-table th');

let column = 'fio';
let columnDir = true;

function newStudentTR(student) {
  const $studentTR = document.createElement('tr');
  const $fioTD = document.createElement('td');
  const $birthDateTD = document.createElement('td');
  const $startDateTD = document.createElement('td');
  const $facultyTD = document.createElement('td');
  const $deleteTD = document.createElement('td');
  const $btnDelete = document.createElement('button');
  $btnDelete.classList.add("btn", "btn-danger");


  $deleteTD.append($btnDelete)

  $fioTD.textContent = student.fio;
  $birthDateTD.textContent = student.getBirthDateString() + ' (' + student.getAgeStudent() +' лет)';
  $startDateTD.textContent = student.getEducationYears();
  $facultyTD.textContent = student.faculty;
  $btnDelete.textContent = "Удалить";

  $studentTR.append($fioTD);
  $studentTR.append($birthDateTD);
  $studentTR.append($startDateTD);
  $studentTR.append($facultyTD);
  $studentTR.append($deleteTD);

  $btnDelete.addEventListener("click", async function() {
    await serverDeleteSudent(student.id)
    $studentTR.remove()
})

  return $studentTR;
}

function getSortStudents(prop, dir) {
  const studentsArrayCopy = [...studentsArray];
  return studentsArrayCopy.sort(function(studentA, studentB){
    if (studentA[prop] === studentB[prop]) {
      return 0;
    }
    return dir ? (studentA[prop] < studentB[prop] ? -1 : 1) : (studentA[prop] > studentB[prop] ? -1 : 1);
  });
}

function filter(arr, filters) {
  let result = [...studentsArray];

  if (filters.fio) {
    result = result.filter((item) => item.fio.toLowerCase().includes(filters.fio.toLowerCase()));
  }

  if (filters.startDate) {
    result = result.filter((item) => item.getEducationYears().includes(filters.startDate));
  }

  if (filters.endDate) {
    result = result.filter((item) => item.getEducationYears().includes(filters.endDate));
  }

  if (filters.faculty) {
    result = result.filter((item) => item.faculty.toLowerCase().includes(filters.faculty.toLowerCase()));
  }
  return result;
}

function render() {
  const studentsArrayCopy = getSortStudents(column, columnDir);
  $studentsList.innerHTML = '';
  for (const student of studentsArrayCopy) {
    $studentsList.append(newStudentTR(student));
  }
}

let newArr = [...studentsArray];
function newRender() {
  const filters = {
    fio: document.getElementById('input-fio').value.trim(),
    startDate: document.getElementById('input-startDate').value.trim(),
    endDate: document.getElementById('input-endDate').value.trim(),
    faculty: document.getElementById('input-faculty').value.trim()
  };

  newArr = filter(newArr, filters);
  $studentsList.innerHTML = '';
  for (const student of newArr) {
    $studentsList.append(newStudentTR(student));
  }
}

document.getElementById('filter-form').addEventListener('submit', function(event) {
  event.preventDefault();
  newRender();
});

$studentsListTHALL.forEach(element => {
  element.addEventListener('click', function() {
    column = this.dataset.column;
    columnDir = !columnDir;
    render();
  });
});


  function validateStudent(name, surname, lastname,  birthday, studyStart, faculty) {
    const errors = [];
    if (!name) {
      errors.push('Введите имя');
    }
    if (!surname) {
      errors.push('Введите фамилию');
    }
    if (!lastname) {
      errors.push('Введите отчество');
    }
    if (! birthday || !/^\d{4}-\d{2}-\d{2}$/.test( birthday)) {
      errors.push('Введите корректную дату рождения (Формат: YYYY-MM-DD)');
    } else {
      const currentDate = new Date().toISOString().split('T')[0];
      if ( birthday < '1900-01-01' ||  birthday > currentDate) {
        errors.push('Введите корректную дату рождения (1900-01-01 - ' + currentDate + ')');
      }
    }
    if (!studyStart || studyStart < '2000' || studyStart > new Date().getFullYear()) {
      errors.push('Введите корректный год начала обучения (2000 - текущий год)');
    }
    if (!faculty) {
      errors.push('Введите факультет');
    }

    return errors;
  }

  function displayErrors(errors) {
    let errorString = "Ошибки валидации:\n";

    for (const error of errors) {
      errorString += `- ${error}\n`;
    }

    alert(errorString);
  }

  document.getElementById('addStudentForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const birthday = document.getElementById('birthday').value.trim();
    const studyStart = document.getElementById('startDate').value.trim();
    const faculty = document.getElementById('faculty').value.trim();

    const validationErrors = validateStudent(name, surname, lastname,  birthday, studyStart, faculty);

    if (validationErrors.length > 0) {
      displayErrors(validationErrors);
    } else {
      const newStudentData = {
        name: name,
        surname: surname,
        lastname: lastname,
        birthday: new Date(birthday),
        studyStart: new Date(studyStart),
        faculty: faculty
    };

      const response = await serverAddstudent(newStudentData);

      console.log(response);

      const newStudent = new Student(
        response.id,
        name,
        surname,
        lastname,
        new Date(birthday),
        new Date(studyStart),
        faculty
      );

      studentsArray.push(newStudent);

      document.getElementById('name').value = '';
        document.getElementById('surname').value = '';
        document.getElementById('lastname').value = '';
        document.getElementById('birthday').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('faculty').value = '';
      render();
    }
  });
render();
