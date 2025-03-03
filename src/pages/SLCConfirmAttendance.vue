<template>
  <div style="height: 100%; overflow-y:hidden">
    <q-card class="evaluation " style="  
  -webkit-box-shadow: 0px 0px 37px 64px rgba(204,206,219,0.61);
    -moz-box-shadow: 0px 0px 37px 64px rgba(204,206,219,0.61);
    box-shadow: 0px 0px 37px 64px rgba(204,206,219,0.61);
    background-color: #ffffffc2;
    height: 90vh;
    box-sizing: border-box;
    margin-block: 5vh;
    width: 30vw;
    min-width: 360px;
    " for="mainDiv" id="mainDiv">
      <div class="q-mt-xl" style="margin-top: 50px">
        <div style="text-align: center; font-size: 24px; font-weight: 600;">
          Please confirm your attendance through this form
        </div>
        <q-form>
          <div v-show="!OTPVerified && !OTPSent" style="margin-top: 15px;">
            <q-input outlined rounded label="SPAS ID" v-model="formInput.spas_id" :color="borderColor"
              :bg-color="bgColor" :label-color="labelColor" mask="X-XXXX-XX-XXXXX" fill-mask
              :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules dense>
              <template v-slot:before>
                <q-icon :color="logoColor" name="badge" size="md" />
              </template>
            </q-input>
            <q-input outlined rounded v-model="formInput.fName" :color="borderColor" :bg-color="bgColor"
              :label-color="labelColor" label="First Name" :rules="[(val) => val && val.length > 0 || 'Required']"
              lazy-rules dense>

              <template v-slot:before>
                <q-icon :color="logoColor" name="person" size="md" />
              </template>
            </q-input>
            <q-input dense outlined rounded v-model="formInput.mName" :color="borderColor" :bg-color="bgColor"
              :label-color="labelColor" label="Middle Name" hint="Put N/A if not applicable"
              :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>

              <template v-slot:before>
                <q-icon :color="logoColor" name="people" size="md" />
              </template>
            </q-input>
            <q-input dense outlined rounded v-model="formInput.lName" :color="borderColor" :bg-color="bgColor"
              :label-color="labelColor" label="Last Name" :rules="[(val) => val && val.length > 0 || 'Required']"
              lazy-rules>

              <template v-slot:before>
                <q-icon :color="logoColor" name="diversity_3" size="md" />
              </template>
            </q-input>
            <q-select dense outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
              v-model="formInput.suffix" label="Suffix" :options="suffix_options" emit-value map-options lazy-rules>

              <template v-slot:before>
                <q-icon :color="logoColor" name="groups_3" size="md" />
              </template>

              <template v-slot:append>
                <q-icon name="close" @click="formInput.suffix = null" class="remove-selection"
                  v-show="formInput.suffix"></q-icon>
              </template>
            </q-select>
            <q-input dense outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
              label="Birthdate" v-model="formInput.birthdate" @click="$refs.birthdateProxy.show()"
              :rules="[(val) => (val && val.length > 0) || 'Required Field']">

              <template v-slot:before>
                <q-icon :color="logoColor" name="cake" size="md" />
              </template>

              <template v-slot:append>
                <q-icon style="color: #3948ab85; margin-right: 10px" name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="birthdateProxy">
                    <q-date v-model="formInput.birthdate" default-year-month="2004/01" default-view="Years"
                      mask="MMM DD, YYYY" color="blue-grey-6">
                      <div class="row items-center justify-end">
                        <q-btn unelevated rounded v-close-popup label="Close" color="teal" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <!-- <q-input dense outlined rounded v-model="formInput.email" type="email" :color="borderColor"
              :bg-color="bgColor" :label-color="labelColor" label="Email Address"
              :rules="[(val) => val.includes('@') || 'Only valid email']" lazy-rules>
              <template v-slot:before>
                <q-icon :color="logoColor" name="mail" size="md" />
              </template>
            </q-input> -->
            Will you be attending SLC 2025?
            <div class="radios">
              <q-radio v-model="formInput.attendance" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                val="true" size="xl" color="indigo-7" @click="scrollTo()">
                <q-icon name="done" size="xl" color="green-5" />Yes
              </q-radio>
              <q-radio v-model="formInput.attendance" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                val="false" size="xl" color="indigo-7" @click="scrollTo()">
                <q-icon name="close" size="xl" color="red-5" />No
              </q-radio>
            </div>
            <q-slide-transition>
              <div v-show="formInput.attendance">
                <h4>DOST-SEI Scholars Leadership Camp (SLC) 2025 Commitment Contract</h4>
                Please click each checkbox
                <h4><q-checkbox v-model="accept[0]" />I. Statement of Commitment</h4>
                <p>I,
                  <b>
                    <u>
                      {{ (formInput.fName == null ? 'First Name' : formInput.fName) + ' ' +
                        (formInput.lName == null ? 'Last Name' : formInput.lName)
                      }}
                    </u>
                  </b>, a
                  DOST-SEI
                  scholar, acknowledge that
                  my
                  participation in
                  the Scholars
                  Leadership
                  Camp (SLC) 2025 is for my personal, holistic, and professional development. I also recognize that the
                  program is a
                  public investment and that my full commitment is expected.
                </p>
                <p>By signing this contract, I pledge to uphold the highest standards of conduct, respect, and
                  participation
                  throughout the training. I fully understand that violating this commitment may result in
                  disqualification
                  from
                  future DOST-SEI programs and projects.</p>

                <h4><q-checkbox v-model="accept[1]" />II. Attendance and Full Participation</h4>
                <ul>
                  <li>I will commit to attend all scheduled training days and activities on time.</li>
                  <li>I will actively engage in discussions, workshops, and group work, demonstrating my commitment to
                    leadership and
                    professional growth.</li>
                  <li>I will not arrive late, leave early, or be absent in case of emergency without prior approval from
                    the
                    organizers.</li>
                  <li>I will not engage in distractions such as excessive phone use, side conversations, or any form of
                    non-participation during camp activities.</li>
                </ul>

                <h4><q-checkbox v-model="accept[2]" />III. Proper Decorum and Professionalism</h4>
                <ul>
                  <li>I will follow the rules and regulations set by the DOST-SEI organizers and facilitators.</li>
                  <li>I will conduct myself with integrity, respect, and professionalism at all times during the camp.
                  </li>
                  <li>I will not engage in any form of discrimination, harassment, bullying, or misconduct that may
                    cause
                    discomfort
                    to others.</li>
                  <li>I will dress appropriately and maintain a professional demeanor throughout the training.</li>
                </ul>

                <h4><q-checkbox v-model="accept[3]" />IV. Respect and Safe Space Commitment</h4>
                <ul>
                  <li>I will respect the diverse backgrounds, opinions, and perspectives of all participants.</li>
                  <li>I will contribute to a safe and inclusive learning environment, ensuring that all scholars feel
                    welcome and
                    valued.</li>
                  <li>I will not engage in any form of harassment, offensive language, or inappropriate jokes that may
                    make
                    others
                    feel uncomfortable.</li>
                  <li>I will support my fellow scholars by listening, encouraging, and collaborating in a respectful
                    manner.
                  </li>
                </ul>

                <h4><q-checkbox v-model="accept[4]" />V. Post-Training Leadership Commitment</h4>
                <ul>
                  <li>I will conduct a One-Day Leadership Training for fellow DOST-SEI scholars in my university within
                    30
                    days after
                    the SLC, covering leadership skills, teamwork, and community engagement.</li>
                  <li>I will coordinate with my fellow SLC campers, DOST-SEI Scholars Regional Council, and DOST
                    Regional
                    Scholarship
                    Unit to successfully conduct this event.</li>
                  <li>I will submit an activity report to the DOST-SEI through the DOST Regional Scholarship Unit within
                    15
                    days after
                    the training, including:</li>
                  <ul>
                    <li>Program objectives and agenda</li>
                    <li>List of participants</li>
                    <li>Photos and documentation of the training</li>
                    <li>Reflection on the impact of the training</li>
                  </ul>
                  <li>Failure to conduct the post-training activity without a valid reason will result in blacklisting
                    from
                    future
                    DOST-SEI training programs.</li>
                </ul>

                <h4><q-checkbox v-model="accept[5]" />VI. Commitment to Program Objectives</h4>
                <ul>
                  <li>I will embrace the leadership lessons and values imparted during the camp and apply them in my
                    academic and
                    personal life.</li>
                  <li>I will contribute to meaningful discussions and activities, not just as a participant but as an
                    active
                    leader.
                  </li>
                  <li>I will maintain the confidentiality of any privileged or sensitive information shared during the
                    camp
                    and use it
                    only for educational and leadership purposes.</li>
                  <li>I will serve as a true Patriot Scholar of the DOST-SEI, demonstrating the core values of
                    Professional
                    Excellence, Social Responsibility, and Servant Leadership.</li>
                </ul>

                <h4><q-checkbox v-model="accept[6]" />VII. Cancellation Policy</h4>
                <ul>
                  <li>A qualified applicant who has already confirmed their slot may cancel participation under the
                    following
                    conditions:</li>
                  <ul>
                    <li>Decline attendance through email at least 5 calendar days before the event.</li>
                    <li>Acceptable reasons:</li>
                    <ul>
                      <li>Medical emergency</li>
                      <li>Death of an immediate family member</li>
                      <li>Academic conflict</li>
                      <li>Other extreme circumstances (case-to-case basis)</li>
                    </ul>
                  </ul>
                </ul>


                <h4><q-checkbox v-model="accept[7]" />VIII. Non-Compliance Policy</h4>
                <p>I understand that failure to comply with any of the terms and conditions of the contract will result
                  in
                  blacklisting from future DOST-SEI training programs and projects for scholars. It will be reported to
                  the
                  DOST
                  Regional and University Scholarship Coordinator for disciplinary action.</p>

                <h4>IX. Agreement and Signature</h4>
                <p>
                  <q-checkbox v-model="accept[8]">
                    By confirming my attendance, I acknowledge that I have read, understood, and agreed to the terms and
                    conditions
                    of
                    this
                    contract.
                  </q-checkbox>
                </p>
              </div>
            </q-slide-transition>
            <div class="button-container" v-show="!OTPVerified">
              <q-btn label="Confirm Attendance" color="primary" class="button-submit" @click="sendOTP"></q-btn>
            </div>
          </div>
          <div v-show="OTPSent && !OTPVerified">
            <br><br>
            We have sent an OTP to your <b>
              {{ formInput.email?.split('@')[0].substring(0, 2) + '******' +
                formInput.email?.split('@')[0].slice(-2) + '@' +
                formInput.email?.split('@')[1].substring(0, 2) + '***...' }}</b> Please input the received OTP below.
            <q-input dense outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
              v-model="otp" class="text-fields" type="number" label="OTP from your Email" hint="6-digit OTP" lazy-rules>

              <template v-slot:before>
                <q-icon :color="logoColor" name="key" size="md" />
              </template>
            </q-input>
            <div class="button-container">
              <q-btn unelevated rounded size="md" label="Confirm Attendance" color="teal" style="width: 50%"
                @click="confirmDialog = true"></q-btn>
            </div>
          </div>
          <div v-show="OTPVerified">
            <div v-show="1" style="display: flex;flex-direction: row; flex-wrap: wrap;">
              <div class="left-container">
              </div>
              <q-separator />
            </div>
          </div>
          <div class="button-container" v-show="OTPVerified" style="width: 100%;">
            <q-btn label="submit" type="submit" color="primary" class="button-submit"
              @click="submitConfirmAttendance()" />
          </div>
          <!-- remove comment to enable testing with pre-input data -->
          <!-- <q-btn label="test" @click="
            formInput.spas_id = 'U-2021-16-03278',
            formInput.fName = 'Joriz',
            formInput.mName = 'asdasd',
            formInput.lName = 'Dancel',
            formInput.birthdate = 'Jan 27, 2003',
            formInput.attendance = false,
            accept = [true, true, true, true, true, true, true, true, true]" /> -->
        </q-form>
      </div>
    </q-card>
  </div>

  <q-dialog v-model="allRequired" persistent>
    <q-card style="width: 300px !important" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon color="blue-grey-6" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        There are some unfulfilled fields.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="CLOSE" color="red-8" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="confirmDialog" persistent>
    <q-card style="width: 450px !important" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon color="blue-grey-6" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 30px; font-weight: 600">Before anything!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 18px">
        You are confirming your attendance to SLC 2025. <br /><br />
        This decision cannot be changed once submitted. Proceed?
        <br /><br />
        <span style="font-weight: 200; font-size: 13px;">
          (Failure to attend SLC 2025 despite confirming your attendance may result to
          blacklisting of future Patriot activities.)
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Confirm" @click="OTPValid()" color="green-8" v-close-popup />
        <q-btn flat label="Close" color="red-8" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="pleaseWait" persistent>
    <q-card style="width: 300px" class="q-px-sm q-pb-md prompt">
      <q-card-section>
        <div style="font-family: Montserrat; font-size: 21px">
          Please wait . . .
        </div>
      </q-card-section>

      <q-card-section style="display: flex; justify-content: center">
        <q-spinner-dots color="grey-6" size="3em" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="congrats" persistent>
    <q-card class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon name="verified" color="green-5" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">
          CONGRATULATIONS
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        Your attendance response have been <b>confirmed</b>.<br>
        An email confirming your response will be sent to you shortly.

      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="green" @click="refreshPage()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="errorWarning" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon color="blue-grey-6" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        {{ errMessage }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup @click="OTPVerified ? refreshPage() : ''" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useMeta } from "quasar"
import { ref } from 'vue'
import {
  axiosInit,
  testSubmit,
  formInput,
  suffix_options
} from '../components/DefineInitials.vue';

const metaData = {
  title: 'SLC Registration',
}


// bypass otp
const OTPVerified = ref(false)
const otp = ref(null)
const allRequired = ref(null)
const pleaseWait = ref(null)
const congrats = ref(null)
const errorWarning = ref(null)
const OTPSent = ref(false)
const conduct = ref(null)
const accept = ref([false, false, false, false, false, false, false, false, false])
const confirmDialog = ref(false)

const refreshPage = () => {
  location.reload()
};


export default {
  mounted() {
    if (this.formInput.attendance == true) {
      const myDiv = document.querySelector('#mainDiv');
      myDiv.scrollTo({ bottom: 200, behavior: 'smooth' })
    }
  },
  setup() {
    useMeta(metaData)
    const errMessage = ref(null)
    const confirmationClosed = ref(false)

    axiosInit.get('/general/getConfig.php?' +
      '&getConduct=' +
      true
    ).then(function (response) {
      if (response.data) {
        conduct.value = response.data.conduct
      }
    })

    const OTPValid = () => {
      pleaseWait.value = true;
      formInput.otp = otp.value;
      const dlInsert = toFormData(formInput);
      axiosInit
        .post("slc/record/submitAttendance.php?", dlInsert)
        .then(function (response) {
          pleaseWait.value = false;
          if (response.data.success === true) {
            congrats.value = true;
          } else {
            errorWarning.value = true;
            errMessage.value = response.data.errMessage
          }
        });
    };

    const toFormData = (obj) => {
      const formData = new FormData();
      for (const key in obj) {
        formData.append(key, obj[key]);
      }
      return formData;
    };

    // const sendOTP = () => {


    // };

    const submitConfirmAttendance = () => {
      pleaseWait.value = true
      const dlInsert = toFormData(formInput);
      axiosInit.post(
        "slc/record/submitAttendance.php", dlInsert
      ).then(function (response) {
        if (response.data.success) {
          pleaseWait.value = false
          congrats.value = true
        }
        else {
          errorWarning.value = true
        }
      })
    }

    return {
      suffix_options,
      toFormData,
      submitConfirmAttendance,
      // sendOTP,
      refreshPage,
      OTPValid,
      testSubmit,
      confirmationClosed,

      borderColor: 'blue-10',
      labelColor: 'blue-10',
      bgColor: 'blue-grey-3',
      logoColor: 'blue-10',
      conduct,
      accept,
      confirmDialog,


      errMessage,
      OTPVerified,
      OTPSent,

      formInput,
      otp,
      allRequired,

      pleaseWait,
      congrats,
      errorWarning,

      sendOTP() {
        pleaseWait.value = true;
        if (
          !formInput.fName ||
          !formInput.mName ||
          !formInput.lName ||
          !formInput.birthdate ||
          !accept.value.every(v => v === true)
        ) {
          pleaseWait.value = false;
          allRequired.value = true;
        }
        else {
          const dlInsert = toFormData(formInput);
          axiosInit
            .post('slc/auth/sendOTPAttendance.php', dlInsert)
            .then(function (response) {
              pleaseWait.value = false;
              if (response.data.emailSent === true) {
                OTPSent.value = response.data.emailSent;
                formInput.email = response.data.email
              }
              else {
                errorWarning.value = true;
                errMessage.value = response.data.errMessage
              }
            });
        }
      },
      scrollTo() {
        setTimeout(() => {
          const myDiv = document.querySelector('#mainDiv');
          myDiv.scrollTo({ top: 750, behavior: 'smooth' })
        }, 200);

      }
    }

  }
}

</script>
