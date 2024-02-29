<script>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { date } from 'quasar'

const baseURL = import.meta.env.DEV ? "http://localhost/SLC_api" : "/SLC_api"
const axiosInit = axios.create({
  baseURL,
  withCredentials: true
})

const filtered_course = ref(null)
const filtered_university = ref(null)
const filtered_univCity = ref(null)
const region_options = ref(null)
const univCity_options = ref(null)
const course_options = ref(null)
const university_options = ref(null)
const pageNum = ref(1)
const pleaseWait = ref(null)
const congrats = ref(null)
const errorWarning = ref(null)
const allRequired = ref(false)


axiosInit.get("/getdata/getRegions.php").then(function (response) {
  region_options.value = response.data;
})

axiosInit.get("/getdata/getCities.php").then(function (response) {
  univCity_options.value = response.data;
})
axiosInit.get("/getdata/getCourses.php").then(function (response) {
  course_options.value = response.data;
})
axiosInit.get("/getdata/getUniversities.php").then(function (response) {
  university_options.value = response.data;
})

const formInput = reactive({
  email: null,
  fName: null,
  mName: null,
  lName: null,
  suffix: null,
  sex: null,
  birthDate: null,
  phoneNumber: null,
  participant: null,
  university: null,
  univRegion: null,
  univCity: null,
  course: null,
  scholarProgram: null,
  yearLevel: null,
  yearAward: null,
  association: null,
  pretest: [null],
  expectation: null,
  designation: null,
  position: null,
  importMasterList: null
});

const suffix_options = ref([
  {
    label: 'Jr.',
    value: 1
  },
  {
    label: 'II',
    value: 2
  },
  {
    label: 'III',
    value: 3
  },
  {
    label: 'IV',
    value: 4
  },
])

const scholarProgram_options = ref([
  {
    label: 'RA 7687',
    value: 1
  },
  {
    label: 'Merit',
    value: 2
  },
  {
    label: 'RA 10612',
    value: 3
  }
])

const yearLevel_options = ref([
  {
    label: '1st Year',
    value: 1
  },
  {
    label: '2nd Year',
    value: 2
  },
  {
    label: '3rd Year',
    value: 3
  },
  {
    label: '4th Year',
    value: 4
  },
  {
    label: '5th Year',
    value: 5
  }
])

const yearAward_options = ref([
  Number(date.formatDate(Date.now(), 'YYYY')),
  Number(date.formatDate(Date.now(), 'YYYY')) - 1,
  Number(date.formatDate(Date.now(), 'YYYY')) - 2,
  Number(date.formatDate(Date.now(), 'YYYY')) - 3,
  Number(date.formatDate(Date.now(), 'YYYY')) - 4,
  Number(date.formatDate(Date.now(), 'YYYY')) - 5,
  Number(date.formatDate(Date.now(), 'YYYY')) - 6,
  Number(date.formatDate(Date.now(), 'YYYY')) - 7,
  Number(date.formatDate(Date.now(), 'YYYY')) - 8
])

const registrant_columns = [
  {
    name: 'attending',
    required: true,
    label: 'Attending',
    align: 'center',
    field: 'attending',
    sortable: true,
    format: val => `${val}`,
  },
  {
    name: 'masterid',
    label: 'ID',
    align: 'left',
    field: 'masterid',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'fullname',
    label: 'Full Name',
    align: 'left',
    field: 'fullname',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'type',
    required: true,
    label: 'Type',
    align: 'left',
    field: 'participant',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'univRegion',
    required: true,
    label: 'Region',
    align: 'left',
    field: 'univRegion',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'email',
    required: true,
    label: 'email',
    align: 'left',
    field: 'email',
    format: val => val.substring(0, 2) + val?.substring(2).replaceAll(val?.substring(2), '*'.repeat(val.length - 2)),
    sortable: true
  },
  {
    name: 'registerdate',
    required: true,
    label: 'Register Date',
    align: 'left',
    field: 'registerdate',
    format: val => `${val}`,
    sortable: true
  }
]

const masterList_columns = [
  {
    name: 'attending',
    required: true,
    label: 'Attending',
    align: 'center',
    field: 'attending',
    sortable: true,
    format: val => `${val}`,
  },
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: 'id',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'left',
    field: 'email',
    format: val => val.substring(0, 2) + val?.substring(2).replaceAll(val?.substring(2), '*'.repeat(val.length - 2)),
    sortable: true
  },
  {
    name: 'conduct',
    required: true,
    label: 'Conduct',
    align: 'left',
    field: 'conduct',
    format: val => `${val}`,
    sortable: true
  }
]

const pretest_columns = [
  {
    name: 'fullname',
    required: true,
    label: 'Full Name',
    align: 'left',
    field: 'fullname',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'type',
    required: true,
    label: 'Type',
    align: 'left',
    field: 'participant',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'region',
    required: true,
    label: 'Region',
    align: 'left',
    field: 'univRegion',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'left',
    field: 'email',
    format: val => `${val}`,
    sortable: true
  },
]


const pretest_columnsExport = [
  {
    name: 'created_at',
    label: 'Submitted at',
    field: 'created_at',

  },
  {
    name: 'fullname',
    label: 'Full Name',
    field: 'fullname',

  },
  {
    name: 'participant',
    label: 'Participant',
    field: 'participant',

  },
  {
    name: 'birthdate',
    label: 'Birthdate',
    field: 'birthdate',

  },
  {
    name: 'age',
    label: 'Age',
    field: 'age',

  },
  {
    name: 'sex',
    label: 'Sex',
    field: 'sex',

  },
  {
    name: 'course',
    label: 'course',
    field: 'course',

  },
  {
    name: 'university',
    label: 'university',
    field: 'university',

  },
  {
    name: 'univRegion',
    label: 'univRegion',
    field: 'univRegion',

  },
  {
    name: 'yearLevel',
    label: 'yearLevel',
    field: 'yearLevel',

  },
  {
    name: 'yearAward',
    label: 'yearAward',
    field: 'yearAward',

  },
  {
    name: 'scholarProgram',
    label: 'scholarProgram',
    field: 'scholarProgram',

  },
  {
    name: 'phoneNumber',
    label: 'phoneNumber',
    field: 'phoneNumber',

  },
  {
    name: 'email',
    label: 'email',
    field: 'email',

  },
  {
    name: 'questions',
    label: 'questions',
    field: 'questions',

  },
  {
    name: 'expectations',
    label: 'expectations',
    field: 'expectations',

  }
]

const evaluation_columns = [
  {
    name: 'evaldone',
    label: 'Eval Done',
    field: 'doneeval',
    sortable: true,
    align: 'center',
  },
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'center',
    field: 'email',
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'region',
    required: true,
    label: 'Region',
    align: 'center',
    field: 'univRegion',
    format: val => `${val}`,
    sortable: true
  },

]
const evaluation_columnsExport = [
  { name: 'created_at', label: 'Submitted at', field: 'created_at' },
  { name: 'doneeval', label: 'doneeval', field: 'doneeval' },
  { name: 'fullname', label: 'fullname', field: 'fullname' },
  { name: 'participant', label: 'participant', field: 'participant' },
  { name: 'birthdate', label: 'birthdate', field: 'birthdate' },
  { name: 'age', label: 'age', field: 'age' },
  { name: 'sex', label: 'sex', field: 'sex' },
  { name: 'course', label: 'course', field: 'course' },
  { name: 'university', label: 'university', field: 'university' },
  { name: 'univRegion', label: 'univRegion', field: 'univRegion' },
  { name: 'yearLevel', label: 'yearLevel', field: 'yearLevel' },
  { name: 'yearAward', label: 'yearAward', field: 'yearAward' },
  { name: 'scholarProgram', label: 'scholarProgram', field: 'scholarProgram' },
  { name: 'phoneNumber', label: 'phoneNumber', field: 'phoneNumber' },
  { name: 'email', label: 'email', field: 'email' },
  { name: 'af', label: 'af', field: 'af' },
  { name: 'c', label: 'c', field: 'c' },
  { name: 'q', label: 'q', field: 'q' },
  { name: 'org', label: 'org', field: 'org' },
  { name: 'out', label: 'out', field: 'out' },
  { name: 'romero', label: 'romero', field: 'romero' },
  { name: 'cangrejo', label: 'cangrejo', field: 'cangrejo' },
  { name: 'acala', label: 'acala', field: 'acala' },
  { name: 'chua', label: 'chua', field: 'chua' },
  { name: 'bulante', label: 'bulante', field: 'bulante' },
  { name: 'five1', label: 'five1', field: 'five1' },
  { name: 'five2', label: 'five2', field: 'five2' },
  { name: 'five3', label: 'five3', field: 'five3' },
  { name: 'five4', label: 'five4', field: 'five4' },
  { name: 'five5', label: 'five5', field: 'five5' },
  { name: 'five6', label: 'five6', field: 'five6' }
]

const inOut_columns = ref([
  {
    name: 'fullName',
    required: true,
    label: 'Full Name',
    align: 'center',
    field: 'fullName',
    sortable: true,
    format: val => `${val}`
  },
  {
    name: 'inOut',
    required: true,
    label: 'In or Out',
    align: 'center',
    field: 'inOut',
    sortable: true,
    format: val => `${val}`
  },
])

const inOut_columnsExport = ref([
  {
    name: 'fullName',
    label: 'Full Name',
    field: 'fullName',
  },
  {
    name: 'inOut',
    label: 'In or Out',
    field: 'inOut',
  },
  {
    name: 'group',
    label: 'Group',
    field: 'group',
  },
  {
    name: 'universityName',
    label: 'University',
    field: 'universityName',
  }
])

const filter_university = (val, update) => {
  const temp = university_options.value
  if (val === '') {
    update(() => {
      filtered_university.value = temp
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filtered_university.value = temp.filter((label) => label.label.toLowerCase().indexOf(needle) > -1)
  })
}

const filter_univCity = (val, update) => {
  const temp = univCity_options.value
  if (val === '') {
    update(() => {
      filtered_univCity.value = temp
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filtered_univCity.value = temp.filter((label) => label.label.toLowerCase().indexOf(needle) > -1)
  })
}
const filter_course = (val, update) => {
  const temp = course_options.value
  if (val === '') {
    update(() => {
      filtered_course.value = temp
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filtered_course.value = temp.filter((label) => label.label.toLowerCase().indexOf(needle) > -1)
  })
}

const scrollToElement = (el) => {
  const myDiv = document.querySelector(el);
  myDiv.scrollTo({ top: 0, behavior: 'smooth' })
}

const submitResponse = (action, id) => {
  pleaseWait.value = true
  if (action == 'REGISTER') {
    if ((!formInput.participant ||
      ((formInput.participant == 1) && (
        !formInput.fName ||
        !formInput.mName ||
        !formInput.lName ||
        !formInput.sex ||
        !formInput.birthDate ||
        !formInput.phoneNumber ||
        !formInput.univRegion ||
        !formInput.univCity ||
        !formInput.university ||
        !formInput.yearLevel ||
        !formInput.course ||
        !formInput.yearAward
      )) || ((formInput.participant == 2) && (
        !formInput.fName ||
        !formInput.mName ||
        !formInput.lName ||
        !formInput.sex ||
        !formInput.birthDate ||
        !formInput.phoneNumber ||
        !formInput.univRegion ||
        !formInput.designation ||
        !formInput.position
      ))
    )) {
      pleaseWait.value = false
      allRequired.value = true
    } else {

      const dlInsert = toFormData(formInput);
      axiosInit.post(
        "/record/submitRegistrant.php", dlInsert, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
      ).then(function (response) {
        if (response.data.success) {
          pleaseWait.value = false
          congrats.value = true
        }
        else {
          pleaseWait.value = false
          errorWarning.value = true
        }
      })
    }
  }
  else if (action == 'UPDATE') {
    if ((!formInput.participant ||
      ((formInput.participant == 1) && (
        !formInput.fName ||
        !formInput.mName ||
        !formInput.lName ||
        !formInput.sex ||
        !formInput.birthDate ||
        !formInput.phoneNumber ||
        !formInput.univRegion ||
        !formInput.univCity ||
        !formInput.university ||
        !formInput.yearLevel ||
        !formInput.course ||
        !formInput.yearAward
      )) || ((formInput.participant == 2) && (
        !formInput.fName ||
        !formInput.mName ||
        !formInput.lName ||
        !formInput.sex ||
        !formInput.birthDate ||
        !formInput.phoneNumber ||
        !formInput.univRegion ||
        !formInput.designation ||
        !formInput.position
      ))
    )) {
      pleaseWait.value = false
      allRequired.value = true
    }
    else {
      formInput.id = id
      formInput.university = !Number.isInteger(formInput.university) && formInput.university != null ? university_options.value.filter(obj => formInput.university == obj.label)[0].value : formInput.university
      formInput.univRegion = !Number.isInteger(formInput.univRegion) && formInput.univRegion != null ? region_options.value.filter(obj => formInput.univRegion == obj.label)[0].value : formInput.univRegion
      formInput.univCity = !Number.isInteger(formInput.univCity) && formInput.univCity != null ? univCity_options.value.filter(obj => formInput.univCity == obj.label)[0].value : formInput.univCity
      formInput.course = !Number.isInteger(formInput.course) && formInput.course != null ? course_options.value.filter(obj => formInput.course == obj.label)[0].value : formInput.course

      formInput.suffix = !Number.isInteger(formInput.suffix) && formInput.suffix != null ? suffix_options.value.filter(obj => formInput.suffix == obj.label)[0].value : formInput.suffix
      formInput.yearLevel = !Number.isInteger(formInput.yearLevel) && formInput.yearLevel != null ? yearLevel_options.value.filter(obj => formInput.yearLevel == obj.label)[0].value : formInput.yearLevel
      formInput.scholarProgram = !Number.isInteger(formInput.scholarProgram) && formInput.scholarProgram != null ? scholarProgram_options.value.filter(obj => formInput.scholarProgram == obj.label)[0].value : formInput.scholarProgram
      formInput.yearAward = !Number.isInteger(formInput.yearAward) && formInput.yearAward != null ? yearAward_options.value.filter(obj => formInput.yearAward == obj.label)[0].value : formInput.yearAward
      const dlInsert = toFormData(formInput);
      axiosInit.post(
        '/operations/updateRegistrant.php', dlInsert,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then(function (response) {
          if (response.data.success) {
            pleaseWait.value = false
            congrats.value = true
          }
        })
    }


  }
  else if (action == 'MASTER') {
    axiosInit.get('/operations/updateMasterList.php?email=' +
      formInput.email +
      '&id=' +
      formInput.id +
      '&conduct=' +
      formInput.conduct
    ).then(function (response) {
      if (response.data.success == true) {
        pleaseWait.value = false
        congrats.value = true
      }
    })
  }

}

const testSubmit = () => {
  formInput.email = 'bonbacuno@gmail.com'
  formInput.fName = 'Bon David'
  formInput.mName = 'Bernardo'
  formInput.lName = 'Bacuño'
  formInput.suffix = null
  formInput.sex = 1
  formInput.birthDate = '01/02/2003'
  formInput.phoneNumber = '09663407046'
  formInput.participant = '1'
  formInput.university = '150'
  formInput.univRegion = '3'
  formInput.univCity = '60'
  formInput.course = '5'
  formInput.scholarProgram = '2'
  formInput.yearLevel = '1'
  formInput.yearAward = '2023'
  formInput.association = 'President of GuruGuru Club'
  formInput.pretest = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5,]
  formInput.expectation = 'a lot'
  formInput.designation = 1
  formInput.position = 2
}

const toFormData = (obj) => {
  const formData = new FormData()
  for (const key in obj) {
    formData.append(key, obj[key])
  }
  return formData
}



export {
  axiosInit,
  baseURL,
  yearAward_options,
  yearLevel_options,
  scholarProgram_options,
  suffix_options,
  region_options,
  univCity_options,
  course_options,
  university_options,
  filter_course,
  filter_univCity,
  filter_university,
  filtered_course,
  filtered_univCity,
  filtered_university,
  pageNum,
  scrollToElement,
  submitResponse,
  testSubmit,
  formInput,
  inOut_columns,
  evaluation_columns,
  pretest_columns,
  registrant_columns,
  allRequired,
  masterList_columns,
  pretest_columnsExport,
  evaluation_columnsExport,
  inOut_columnsExport
}
</script>