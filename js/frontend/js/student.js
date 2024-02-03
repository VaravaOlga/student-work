export default class Student {
  constructor(id, name, surname, lastname,  birthday, studyStart, faculty) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.lastname = lastname;
    this. birthday =   new Date(birthday);
    this.studyStart = new Date(studyStart);
    this.faculty = faculty;
  }

  get fio(){
    return this.surname + ' ' + this.name + ' ' + this.lastname;
  }

  getBirthDateString() {
    const today = this.birthday;
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '.' + mm + '.' + yyyy;
  }

  getAgeStudent() {
    const today = new Date();
    let age = today.getFullYear() - this. birthday.getFullYear();
    let m = today.getMonth() - this. birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this. birthday.getDate())) {
      age--;
    }
    return age
  }


getEducationYears() {
  const startYear = this.studyStart.getFullYear();
  const endYear = startYear + 4;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  let course = currentYear - startYear;
  if (currentMonth >= 9) {
    course += 1;
  }

  if (course > 4) {
    course = 'закончил';
  }

  return `${startYear}-${endYear} (${course} курс)`;
}

}

