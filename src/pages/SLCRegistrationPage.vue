<template>
  <q-card class="evaluation" style="
      -webkit-border-radius: 50px;
      -moz-border-radius: 50px;
      border-radius: 50px;
      padding-block: 50px;
    " id="topElement">
    <div id="parentContainer">
      <div>
        <q-img src="/pubmat-big.jpg" v-show="!OTPVerified" :ratio="2" />
        <q-img src="/pubmat-small.jpg" v-show="OTPVerified" style="border-radius: 25px;" />
      </div>
      <q-form>
        <div v-show="!OTPVerified && !OTPSent" style="margin-top: 15px;">
          This email will be used to further contact you with DOST-SEI and Patriot Programs.
          <q-input outlined rounded v-model="formInput.email" type="email" :color="formColor" :label-color="formColor"
            label="Email Address" :rules="[(val) => val.includes('@') || 'Only valid email']" lazy-rules>
            <template v-slot:before>
              <q-icon class="logo-color" name="mail" size="lg" />
            </template>
          </q-input>
          <div class="button-container" v-show="!OTPVerified">
            <q-toggle v-model="accept" @click="accept ? (dataPolicyMenu = !dataPolicyMenu) : ''">
              I accept the <b>Data Privacy Policy Terms</b>
            </q-toggle>
            <q-btn label="Send OTP" color="primary" class="button-submit" @click="sendOTP"
              :disabled="!accept || formInput.email == null"></q-btn>
          </div>
        </div>
        <div v-show="OTPSent && !OTPVerified">
          <q-input outlined rounded color="indigo-7" label-color="indigo-7" v-model="otp" class="text-fields"
            type="number" label="OTP from your Email" hint="6-digit OTP" lazy-rules>

            <template v-slot:before>
              <q-icon class="logo-color" name="key" size="lg" />
            </template>
          </q-input>
          <div class="button-container">
            <q-btn unelevated rounded size="lg" label="Verify OTP" color="teal" style="width: 50%"
              @click="OTPValid()"></q-btn>
          </div>
        </div>
        <div v-show="OTPVerified">
          <div v-show="pageNum == 1" style="display: flex;flex-direction: row; flex-wrap: wrap;">
            <div class="left-container">
              <q-input outlined rounded v-model="formInput.email" readonly type="email" :color="formColor"
                :label-color="formColor" label="Email to Register"
                :rules="[(val) => val.includes('@') || 'Only valid email']" lazy-rules>

                <template v-slot:before>
                  <q-icon class="logo-color" name="mail" size="lg" />
                </template>
              </q-input>
              <q-input @input="val => { formInput.fName = val.toUpperCase() }" outlined rounded
                v-model="formInput.fName" :color="formColor" :label-color="formColor" label="First Name"
                hint="Name inputted will reflect on certificates"
                :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>

                <template v-slot:before>
                  <q-icon class="logo-color" name="person" size="lg" />
                </template>
              </q-input>
              <q-input @input="val => { formInput.mName = val.toUpperCase() }" outlined rounded
                v-model="formInput.mName" :color="formColor" :label-color="formColor" label="Middle Name"
                hint="Put N/A if not applicable" :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>

                <template v-slot:before>
                  <q-icon class="logo-color" name="people" size="lg" />
                </template>
              </q-input>
              <q-input @input="val => { formInput.lName = val.toUpperCase() }" outlined rounded
                v-model="formInput.lName" :color="formColor" :label-color="formColor" label="Last Name"
                :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>

                <template v-slot:before>
                  <q-icon class="logo-color" name="diversity_3" size="lg" />
                </template>
              </q-input>
              <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.suffix"
                label="Suffix" :options="suffix_options" emit-value map-options lazy-rules>

                <template v-slot:before>
                  <q-icon class="logo-color" name="groups_3" size="lg" />
                </template>

                <template v-slot:append>
                  <q-icon name="close" @click="formInput.suffix = null" class="remove-selection"
                    v-show="formInput.suffix"></q-icon>
                </template>
              </q-select>
            </div>
            <div v-show="OTPVerified" class="right-container">

              <q-input outlined rounded :color="formColor" :label-color="formColor" label="Birthdate"
                v-model="formInput.birthDate" @click="$refs.birthdateProxy.show()"
                :rules="[(val) => (val && val.length > 0) || 'Required Field']">

                <template v-slot:before>
                  <q-icon class="logo-color" name="cake" size="lg" />
                </template>

                <template v-slot:append>
                  <q-icon style="color: #3948ab85; margin-right: 10px" name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="birthdateProxy">
                      <q-date v-model="formInput.birthDate" default-year-month="2004/01" default-view="Years"
                        mask="MMM DD, YYYY">
                        <div class="row items-center justify-end">
                          <q-btn unelevated rounded v-close-popup label="Close" color="teal" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <div class="radios">
                <q-radio v-model="formInput.sex" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1"
                  size="xl" color="indigo-7">
                  <q-icon class="logo-color" name="male" size="xl" />Male
                </q-radio>
                <q-radio v-model="formInput.sex" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="2"
                  size="xl" color="indigo-7">
                  <q-icon class="logo-color" name="female" size="xl" />Female
                </q-radio>
              </div>
              <br>{{ "Are you a member of LGBTQ community?" }}
              <div class="radios">
                <ul style="list-style-type: none; padding: 0; margin: 0; ">
                  <div style="display: inline-block" v-for="val in radio_val.slice(3).reverse()">
                    <li>
                      <q-btn :outline="formInput.lgbt[0] != yesno_options[val - 1]"
                        :unelevated="formInput.lgbt[0] == yesno_options[val - 1]" :label="yesno_options[val - 1]"
                        @click="() => { formInput.lgbt[0] = yesno_options[val - 1]; }"
                        :class="formInput.lgbt[0] == yesno_options[val - 1] ? 'pulsate-bck' : ''"
                        :color="formInput.lgbt[0] == yesno_options[val - 1] ? gad_colors[val - 1] : 'purple-5'"
                        style="margin-inline: 10px; margin-block: 5px" />
                    </li>
                  </div>
                </ul>
              </div>
              <q-slide-transition>
                <div v-if="formInput.lgbt[0]">
                  {{ formInput.lgbt[0] == 'Yes' ?
          'Are you okay to be roomed together with a cisgender*?'
          : 'Are you okay to be roomed together with a member of LGBTQ ? ' }}
                  <div class="radios">
                    <ul style="list-style-type: none; padding: 0; margin: 0; ">
                      <div style="display: inline-block" v-for="val in radio_val.slice(3).reverse()">
                        <li>
                          <q-btn :outline="formInput.lgbt[1] != yesno_options[val - 1]"
                            :unelevated="formInput.lgbt[1] == yesno_options[val - 1]" :label="yesno_options[val - 1]"
                            @click="() => { formInput.lgbt[1] = yesno_options[val - 1]; }"
                            :class="formInput.lgbt[1] == yesno_options[val - 1] ? 'pulsate-bck' : ''"
                            :color="formInput.lgbt[1] == yesno_options[val - 1] ? gad_colors[val - 1] : 'purple-5'"
                            style="margin-inline: 10px; margin-block: 5px" />
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>

              </q-slide-transition>
              <q-input rounded outlined v-model="formInput.phoneNumber" type="number" maxlength="11" :color="formColor"
                :label-color="formColor" label="Phone Number" lazy-rules
                :rules="[(val) => (val && val.length == 11) || '11 digit phone number only']">

                <template v-slot:before>
                  <q-icon class="logo-color" name="phone" size="lg" />
                </template>
              </q-input>
            </div>

          </div>
          <div v-show="pageNum == 2">
            <div class="radios">
              <div label="Scholar" style="
                  background-size: contain;
                  background-repeat: no-repeat;
                  background-position: center;
                  cursor: pointer;
                ">
                <q-img src="/radio-option1.png" alt="" srcset="" @click="selectParticipantType(1)"
                  :class="{ 'pulsate-bck': formInput.participant == 1 }"
                  style="height: 20vh; width: 20vh; filter: grayscale(100%)" />
              </div>
              <div style="
                  background-size: contain;
                  background-repeat: no-repeat;
                  background-position: center;
                  cursor: pointer;
                ">
                <q-img src="/radio-option2.png" alt="" srcset="" @click="selectParticipantType(2)"
                  :class="{ 'pulsate-bck': formInput.participant == 2 }"
                  style="height: 20vh; width: 20vh; filter: grayscale(100%)" />
              </div>
            </div>
            <div class="left-container">
              <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.univRegion"
                label="Region of your School" :options="region_options" emit-value map-options lazy-rules>

                <template v-slot:before>
                  <q-icon class="logo-color" name="map" size="lg" />
                </template>
              </q-select>
              <q-slide-transition :duration="700">
                <div v-show="formInput.participant == 1 || (formInput.univRegion == 13 && formInput.participant == 2)">
                  <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.univCity"
                    use-input emit-value map-options input-debounce="0" label="City of your University"
                    :options="filtered_univCity" @filter="filter_univCity" behavior="menu" lazy-rules
                    :rules="[(val) => (val && val > 0) || 'Required Field',]"
                    v-show="formInput.participant == 1 || (formInput.participant == 2 && formInput.univRegion == 13)">

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:before>
                      <q-icon class="logo-color" name="mode_of_travel" size="lg" />
                    </template>

                    <template v-slot:append>
                      <q-icon name="close" @click="formInput.univCity = null" class="remove-selection"
                        v-show="formInput.univCity"></q-icon>
                    </template>
                  </q-select>
                  <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.university"
                    use-input emit-value map-options input-debounce="0" label="University"
                    :options="filtered_university" @filter="filter_university" behavior="menu" lazy-rules
                    :rules="[(val) => (val && val > 0) || 'Required Field',]">

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:before>
                      <q-icon class="logo-color" name="school" size="lg" />
                    </template>

                    <template v-slot:append>
                      <q-icon name="close" @click="formInput.university = null" class="remove-selection"
                        v-show="formInput.university"></q-icon>
                    </template>
                  </q-select>
                </div>
              </q-slide-transition>
            </div>
            <div class="right-container">
              <q-slide-transition :duration="700">
                <div v-show="formInput.participant == 1">
                  <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.course"
                    use-input emit-value map-options input-debounce="0" label="Course" :options="filtered_course"
                    @filter="filter_course" behavior="menu" lazy-rules
                    :rules="[(val) => (val && val > 0) || 'Required Field']">

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:before>
                      <q-icon class="logo-color" name="golf_course" size="lg" />
                    </template>

                    <template v-slot:append>
                      <q-icon name="close" @click="formInput.course = null" class="remove-selection"
                        v-show="formInput.course"></q-icon>
                    </template>
                  </q-select>
                  <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.yearLevel"
                    label="Year Level" :options="yearLevel_options" emit-value map-options lazy-rules
                    :rules="[(val) => (val && val > 0) || 'Required Field']">

                    <template v-slot:before>
                      <q-icon class="logo-color" name="settings_input_composite" size="lg" />
                    </template>
                  </q-select>
                  <q-select outlined rounded :color="formColor" :label-color="formColor"
                    v-model="formInput.scholarProgram" label="Scholarship Program" :options="scholarProgram_options"
                    emit-value map-options lazy-rules :rules="[(val) => (val && val > 0) || 'Required Field']">

                    <template v-slot:before>
                      <q-icon class="logo-color" name="auto_graph" size="lg" />
                    </template>
                  </q-select>
                  <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.yearAward"
                    label="Year Award" :options="yearAward_options" emit-value map-options lazy-rules
                    :rules="[(val) => (val && val > 0) || 'Required Field']">

                    <template v-slot:before>
                      <q-icon class="logo-color" name="verified_user" size="lg" />
                    </template>
                  </q-select>
                  <q-input outlined rounded v-model="formInput.association" :color="formColor" :label-color="formColor"
                    label="Associations" hint="e.g Member/President of Scholars Club"
                    :rules="[(val) => val.length > 0 || 'Required']" lazy-rules>

                    <template v-slot:before>
                      <q-icon class="logo-color" name="sort" size="lg" />
                    </template>
                  </q-input>
                </div>
              </q-slide-transition>
              <q-slide-transition :duration="700">
                <div v-show="formInput.participant == 2">
                  <q-input outlined rounded v-model="formInput.designation" :color="formColor" :label-color="formColor"
                    label="Designation" :rules="[(val) => val.length > 0 || 'Required']" lazy-rules
                    hint="e.g. Project Director, University Coordinator">

                    <template v-slot:before>
                      <q-icon class="logo-color" name="sort" size="lg" />
                    </template>
                  </q-input>
                  <q-input outlined rounded v-model="formInput.position" :color="formColor" :label-color="formColor"
                    label="Position" :rules="[(val) => val.length > 0 || 'Required']" lazy-rules
                    hint="e.g. Senior Science Research Specialist">

                    <template v-slot:before>
                      <q-icon class="logo-color" name="sort" size="lg" />
                    </template>
                  </q-input>
                </div>
              </q-slide-transition>
            </div>
          </div>
          <!-- && formInput.participant == 1 -->
          <div v-show="pageNum == 3">
            <q-separator />
            <p style="justify-content: center;">
              <b>DIRECTIONS</b>: Using a 5-point Likert scale, please put a checkmark (✓) on the
              appropriate column that represents the extent of your agreement to the following
              statements about some quality dimensions of this activity.
              All fields required.
            </p>
            <div v-for="(item, index) in questions.af" :key="item.id">
              <br>{{ item }}
              <div class="radios">
                <ul style="list-style-type: none; padding: 0; margin: 0; ">
                  <div v-for="val in radio_val" :key="val.id"
                    :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                    <li>
                      <q-btn :outline="formInput.pretest[index] != val" :unelevated="formInput.pretest[index] == val"
                        :label="likertScaleDesc[val - 1]" @click="formInput.pretest[index] = val"
                        :class="formInput.pretest[index] == val ? 'pulsate-bck' : ''"
                        :color="formInput.pretest[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                        style="margin-inline: 10px; margin-block: 5px" />
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            {{ "31. " + questions.lastQuestion }}
            <q-input v-model="formInput.expectation" :color="formColor" :label-color="formColor" filled rounded
              :rules="[(val) => val.length > 0 || 'Required Field']" lazy-rules>

              <template v-slot:before>
                <q-icon class="logo-color" name="psychology_alt" size="lg" />
              </template>
            </q-input>
          </div>
          <q-separator />
        </div>


        <div class="button-container" v-show="OTPVerified">
          <div class="radios" style="width: 100%;">
            <div v-show="pageNum > 1" style="width: 25%;">
              <q-btn label="Back" @click="pageNum--" color="teal" class="button-submit" style="width: 100%;"></q-btn>
            </div>
            <div v-show="pageNum < 3 && !(pageNum == 2 && formInput.participant == 2)" style="width: 25%;">
              <q-btn label="Next" @click="pageNum++, scrollToElement('#topElement')" color="teal" class="button-submit"
                style="width: 100%; height: 12%" :disabled="((
          (pageNum == 1) && (
            !formInput.fName ||
            !formInput.mName ||
            !formInput.lName ||
            !formInput.sex ||
            formInput.lgbt.length != 2 ||
            !formInput.birthDate ||
            !formInput.phoneNumber ||
            formInput.phoneNumber.length != 11
          )) || ((pageNum == 2) && (
            !formInput.univRegion ||
            !formInput.univCity ||
            !formInput.university ||
            !formInput.yearLevel ||
            !formInput.course ||
            !formInput.yearAward ||
            !formInput.scholarProgram
          )))"></q-btn>
            </div>
          </div>
          <div class="button-container" style="width: 100%;"
            v-show="pageNum == 3 || (pageNum == 2 && formInput.participant == 2)">
            <q-btn label="submit" type="submit" color="primary" class="button-submit" @click="submitResponse()" />
          </div>
        </div>
        <!-- remove comment to enable testing with pre-input data -->
        <!-- <q-btn label="test" @click="testSubmit()" /> -->
      </q-form>
    </div>
  </q-card>
  <q-dialog v-model="allRequired" persistent>
    <q-card style="width: 300px !important" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon class="logo-color" name="error" size="70px" />
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
        Your
        <b>SLC 2024</b> journey is about to start right here.<br />
        An email will be sent to you containing<br />
        your proof of registration.<br />

      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="green" @click="refreshPage()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="errorWarning" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon class="logo-color" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        Please try again
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup @click="refreshPage()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="notListed" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon class="logo-color" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        Kindly contact your respective scholarship coordinator<br>to be able to register.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="OTPNotMatch" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon class="logo-color" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        OTP do not match! Try Again.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="alreadySubmitted" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon class="logo-color" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        You have already submitted your registration form.
        <br>Thank you.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="greeting" maximized transition-hide="slide-up">
    <q-card class="greeting-container">
      <q-img src="/SLCGreetingLogo3.png" class="pulsate-logo greeting-logo" v-close-popup />
    </q-card>
  </q-dialog>
  <q-dialog v-model="dataPolicyMenu" position="left" transition-show="slide-right" transition-hide="slide-left"
    maximized :persistent="!conformeCheck">
    <q-card class="dataPolicy" style="
      -webkit-border-radius: 25px;
      -moz-border-radius: 25px;
      border-radius: 25px;  
      ">
      <q-card-section>
        <div class="text-h5" style="color: #d6ac1f">Data Privacy Notice</div>
        <div class="text-subtitle2" style="color: #d6ac1f">
          Department of Science and Technology - Science Education Institute
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll">
        <p class="dataPolicyText">
          {{ dataPolicyText }}
        </p>
      </q-card-section>
      <q-card-section>
        <div class="row items-center justify-end">
          <!-- <q-checkbox v-model="conformeCheck" size="lg"> -->
          <p class="dataPolicyText">
            CONFORME:

            I hereby authorize the DOST-SEI to collect and process the data indicated herein for future improvements
            and
            research study. I understand that my personal information is protected by R.A. 10173, Data Privacy Act of
            2012.
          </p>
          <!-- </q-checkbox> -->

          <q-btn v-close-popup label="I Agree" color="green-6" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar, useMeta } from "quasar"
import { ref } from 'vue'
import axios from 'axios'
import {
  baseURL,
  axiosInit,
  yearAward_options,
  yearLevel_options,
  scholarProgram_options,
  suffix_options,
  filter_course,
  filter_univCity,
  filter_university,
  filtered_course,
  filtered_univCity,
  filtered_university,
  pageNum,
  region_options,
  scrollToElement,
  testSubmit,
  formInput,
  university_options,
  univCity_options,
  course_options
} from '../components/DefineInitials.vue';

const metaData = {
  title: 'SLC Registration',
}


const accept = ref(false)
// test otp verification
const OTPVerified = ref(false)
const otp = ref(null)
const isOTPSixDigit = ref(null)
const allRequired = ref(null)
const pleaseWait = ref(null)
const congrats = ref(null)
const errorWarning = ref(null)
const notListed = ref(null)
const alreadySubmitted = ref(null)
const OTPSent = ref(false)
// const university_options = ref(null)
// const univCity_options = ref(null)
// const course_options = ref(null)
const OTPNotMatch = ref(null)

const refreshPage = () => {
  location.href = "/";
};



const sendOTP = () => {
  pleaseWait.value = true;
  axiosInit
    .get('slc/auth/sendOTP.php?email=' + formInput.email)
    .then(function (response) {
      if (response.data.regExists === true) {
        pleaseWait.value = false;
        alreadySubmitted.value = true
      } else if (response.data.notListed === true) {
        pleaseWait.value = false;
        notListed.value = response.data.notListed;
      } else if (response.data.emailSent === true) {
        pleaseWait.value = false;
        OTPSent.value = response.data.emailSent;
      } else {
        pleaseWait.value = false;
        errorWarning.value = true;
      }
    });
};

export default {
  beforeMount() {

    // pleaseWait.value = true

    // axiosInit.get("slc/getdata/getCourses.php").then(function (response) {
    //   course_options.value = response.data;
    // })
    // axiosInit.get("/getdata/getUniversities.php").then(function (response) {
    //   university_options.value = response.data;
    // })
    // axiosInit.get("/getdata/getCities.php").then(function (response) {
    //   univCity_options.value = response.data;
    // })

    // univCity_options.value = [
    //   {
    //     label: 'Aklan',
    //     value: 1
    //   },
    //   {
    //     label: 'Metro Manila',
    //     value: 2
    //   }
    // ]
    // pleaseWait.value = false
  },
  setup() {
    useMeta(metaData)

    const $q = useQuasar();
    const filtered_university = ref(university_options.value)
    const filtered_univCity = ref(univCity_options.value)
    const filtered_course = ref(course_options.value)
    const dataPolicyMenu = ref(false)
    const greeting = ref(true)
    const conformeCheck = ref(false)

    const OTPValid = () => {
      axiosInit
        .get("slc/auth/checkOTP.php?otp=" + otp.value + "&email=" + formInput.email)
        .then(function (response) {
          if (response.data.OTPVerified === true) {
            OTPVerified.value = true;
          } else {
            OTPNotMatch.value = true;
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

    const submitResponse = () => {
      pleaseWait.value = true
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
          !formInput.yearAward ||
          formInput.pretest.filter(v => v).length < 30 ||
          !formInput.expectation
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
          "slc/record/submitRegistrant.php", dlInsert, {
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

    const selectParticipantType = (val) => {
      formInput.participant = val;
    };

    return {
      scrollToElement,
      toFormData,
      submitResponse,
      sendOTP,
      refreshPage,
      OTPValid,
      selectParticipantType,
      testSubmit,
      formColor: 'grey-10',
      dataPolicyMenu,
      OTPVerified,
      OTPSent,
      OTPNotMatch,
      university_options,
      filtered_university,
      univCity_options,
      filtered_univCity,
      course_options,
      filtered_course,
      formInput,
      accept,
      otp,
      greeting,
      isOTPSixDigit,
      allRequired,
      alreadySubmitted,
      pleaseWait,
      congrats,
      errorWarning,
      notListed,
      pageNum,
      region_options,
      suffix_options,
      scholarProgram_options,
      yearLevel_options,
      yearAward_options,
      conformeCheck,
      radio_val: [5, 4, 3, 2, 1],
      likertScaleDesc: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      likertScaleColor: ['red-6', 'red-4', 'teal-4', 'green-4', 'green-6'],
      yesno_options: ['Yes', 'No'],
      gad_colors: ['pink-5', 'purple-7', 'deep-purple-6'],
      questions: {
        af: [
          ' 1. I am familiar with the common leadership approaches.',
          ' 2. I understand the steps involved in the communication process.',
          ' 3. I influence others how they think act and accomplish goals.',
          ' 4. Part of being a good leader is harnessing the strengths of each team member to do the best possible job.',
          ' 5. As a leader I would hesitate to ask advice from my team members.',
          ' 6. I am more productive working alone.',
          ' 7. I have a vision of myself as a leader.',
          ' 8. I am confident in my ability to manage conflict in groups which are experiencing change.',
          ' 9. I prefer to use strategic thinking rather than “day-to-day” thinking.',
          ' 10. I can work with others to improve the quality of life for the Filipino people.',
          ' 11. I am aware of change management theories.',
          ' 12. As a leader I would feel comfortable asking my team’s opinions and ideas about the projects.',
          ' 13. As a group leader I would hesitate showing others my gratitude when I know they have worked hard.',
          ' 14. I can easily adapt to change.',
          ' 15. I am good at thinking “outside the box”.',
          ' 16. I recognize my personal style of communicating.',
          ' 17. I can make smart and timely decision.',
          ' 18. I seek other perspectives when making decision.',
          ' 19. As a leader I direct and give commands on what to do.',
          ' 20. I can negotiate for win-win agreements.',
          ' 21. I can build trust within a group during times of organizational transition.',
          ' 22. I can adapt to another person’s communication style.',
          ' 23. I understand what “leadership for common” good means.',
          ' 24. I prefer working in teams.',
          ' 25. I am able to reach decisions through consensus.',
          ' 26. As a leader I am the one to decide and my decision is final.',
          ' 27. I encourage others to be part of the decision-making process.',
          ' 28. As a team leader I will explain the reasoning and get feedback before making a major decision.',
          ' 29. As a leader if one of my team members is struggling to complete a task on time I would pitch in to ensure that it gets done properly.',
          ' 30. I take one task at a time for a better output.',
        ],
        lastQuestion: 'Please identify and describe the specific skills and knowledge that you are expecting to learn from the Leadership Camp.'
      },
      dataPolicyText: `This form collects your personal information and post-evaluation of the activity for future improvements and research study.  The DOST-SEI, in compliance with R.A. 10173, implements reasonable and appropriate organizational, physical, and technical security measures for the protection of your personal information collected. Only the DOST-SEI employees are permitted to have access to the collected information. They shall be guided by the security measures provided in handling all personal information collected. Personal information collected is processed, stored, and later on disposed of via shredding and permanently deleted in our electronic files in accordance with R.A No. 9470 otherwise known as the National Archive of the Philippines Act of 2007. In case of a data breach, DOST-SEI shall notify you and inform the National Privacy Commission (NPC) in accordance with NPC Circular 16-03 on Personal Data Breach Management. Additionaly, agreeing with this policy allows DOST - SEI to take any images, videos or graphics taken during conduct for publication and reporting purposes.

RIGHTS OF THE DATA SUBJECT

As the Data Subject, you have the right to be informed of the personal information being collected, processed, and stored by DOST-SEI as well as to access, object, rectify, and block the same. 

CONTACT DETAILS OF THE DOST-SEI DATA PRIVACY OFFICER (DPO) 

For questions or concerns, you may contact our Data Protection Officer through the following details:

Direct Line: +63 2 8710 7462

E-mail: dpo@sei.dost.gov.ph`,
      filter_university(val, update) {
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
      },
      filter_univCity(val, update) {
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
      },
      filter_course(val, update) {
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
    }

  }
}

</script>

<style>
.evaluation {
  padding-block: 55px;
  padding-inline: 15px;
  box-shadow: none;
  width: 60vw;
  margin-inline: auto;
  /* min-width: 40vw; */
  height: 100vh;
  -webkit-backdrop-filter: blur(8px);
  /* Safari 9+ */
  backdrop-filter: blur(8px);
  /* Chrome and Opera */
  box-shadow: 0px 10px 15px 10px rgb(0 0 0 / 15%);
  background-color: rgba(228, 228, 228, 0.627);
  -webkit-border-top-left-radius: 25px;
  -webkit-border-bottom-left-radius: 25px;
  -moz-border-radius-topleft: 25px;
  -moz-border-radius-bottomleft: 25px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  font-family: montserrat;
  overflow: scroll;
  font-size: 1.3em;
}

.radios {
  margin-block: 15px;
  min-width: 100%;
  padding-inline: 2%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.button-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.button-container>* {
  margin: auto;
  margin-top: 2%;
  height: 100%;
}

.left-container {
  display: inline-block;
  padding-inline: 12px;
  vertical-align: top;
  min-width: 340px;
  width: 50%;
  margin: auto;
}

.right-container {
  display: inline-block;
  padding-inline: 12px;
  min-width: 340px;
  vertical-align: top;
  width: 50%;
  margin: auto;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  opacity: 0;
  margin-top: 40px;
  margin-bottom: 40px;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(228, 228, 228);
  border-radius: 10px;
  width: 30px;
  background-clip: padding-box;
}

.answer-container {
  width: 80%;
}

.q-field__control-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-evenly;
}

.q-field__label,
.q-field__native {
  padding-inline: 15px;
}

label.q-field {
  margin-block: 10px;
  padding-bottom: 20px;
}

.button-submit {
  width: 50%;
}

.text-fields-rate {
  width: 25%;
}

.text-fields-aspect {
  width: 70%;
}

.text-fields-overall {
  width: 90%;
}

.greeting-container {
  background: rgb(218, 204, 47);
  background: radial-gradient(circle, rgba(218, 204, 47, 1) 0%, rgba(14, 98, 142, 1) 24%, rgba(32, 25, 111, 1) 73%, rgba(15, 0, 83, 1) 100%);
  overflow: hidden;
}

.greeting-logo {
  height: 70vh;
  width: 60%;
  max-height: 700px;
  min-width: 340px;
  max-width: 400px;
  margin: auto;
  display: block;
  margin-top: 15vh;
  /* overflow: hidden; */
}

.remove-selection:hover {
  cursor: pointer;
}

.dataPolicy {
  box-shadow: none;
  margin-left: 22.5vw;
  margin-right: 22.5vw;
  min-width: 55vw;
  height: 85vh;
  /* border: 5px solid black; */
  -webkit-backdrop-filter: blur(18px);
  /* Safari 9+ */
  backdrop-filter: blur(8px);
  /* Chrome and Opera */
  box-shadow: 0px 10px 15px 10px rgb(0 0 0 / 15%);
  background-color: rgba(194, 24, 24, 0.54);
  -webkit-border-top-left-radius: 25px;
  -webkit-border-bottom-left-radius: 25px;
  -moz-border-radius-topleft: 25px;
  -moz-border-radius-bottomleft: 25px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  white-space: pre-wrap;
}

.fade-in {
  -webkit-animation: fade-in 3s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  animation: fade-in 3s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}

@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.pulsate-bck {
  -webkit-animation: pulsate-bck .5s ease-in-out both;
  animation: pulsate-bck .5s ease-in-out both;
}

@-webkit-keyframes pulsate-bck {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    filter: grayscale(100%);
  }

  50% {
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
    filter: grayscale(50%);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    filter: grayscale(0%);
  }
}

@keyframes pulsate-bck {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    filter: grayscale(100%);
  }

  50% {
    -webkit-transform: scale(0.9);
    transform: scale(0.7);
    filter: grayscale(50%);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    filter: grayscale(0%);
  }
}

.pulsate-logo {
  -webkit-animation: pulsate-logo 4s ease-in-out both infinite;
  animation: pulsate-logo 4s ease-in-out both infinite;
}

@-webkit-keyframes pulsate-logo {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    filter: grayscale(0%);
  }

  50% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    filter: grayscale(100%);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    filter: grayscale(0%);
  }
}

@keyframes pulsate-logo {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    filter: grayscale(0%);
  }

  50% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    filter: grayscale(100%);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    filter: grayscale(0%);
  }
}

@media screen and (max-width: 600px) {

  .evaluation,
  .dataPolicy {
    width: 100vw;
    margin: 0;
  }
}

/* Chrome, Safari, Edge, Opera */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  appearance: textfield;
}

.logo-color {
  color: #3948ab85
}
</style>
