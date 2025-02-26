<template>
  <q-card class="evaluation" style="  
  -webkit-box-shadow: 0px 0px 37px 64px rgba(204,206,219,0.61);
-moz-box-shadow: 0px 0px 37px 64px rgba(204,206,219,0.61);
box-shadow: 0px 0px 37px 64px rgba(204,206,219,0.61);
background-color: #ffffffc2;
" id="topElement">
    <div id="parentContainer">
      <div>
        <q-img src="/slc/pubmat-big.png" v-show="!OTPVerified" :ratio="2" style="border-radius: 15px" />
        <q-img src="/slc/pubmat-small.png" v-show="OTPVerified" style="border-radius: 25px;" />
      </div>
      <q-form>
        <div v-show="!OTPVerified && !OTPSent" style="margin-top: 15px;">
          <div style="text-align: center; font-size: 24px; font-weight: 600;">
            This batch of SLC will be conducted on {{ conduct }}
          </div>
          <q-input outlined rounded label="SPAS ID" v-model="formInput.spas_id" :color="borderColor" :bg-color="bgColor"
            :label-color="labelColor" mask="X-XXXX-XX-XXXXX" fill-mask
            :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>
            <template v-slot:before>
              <q-icon :color="logoColor" name="badge" size="lg" />
            </template>
          </q-input>
          <q-input outlined rounded v-model="formInput.fName" :color="borderColor" :bg-color="bgColor"
            :label-color="labelColor" label="First Name" hint="Name inputted will reflect on certificates"
            :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>

            <template v-slot:before>
              <q-icon :color="logoColor" name="person" size="lg" />
            </template>
          </q-input>
          <q-input outlined rounded v-model="formInput.mName" :color="borderColor" :bg-color="bgColor"
            :label-color="labelColor" label="Middle Name" hint="Put N/A if not applicable"
            :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>

            <template v-slot:before>
              <q-icon :color="logoColor" name="people" size="lg" />
            </template>
          </q-input>
          <q-input outlined rounded v-model="formInput.lName" :color="borderColor" :bg-color="bgColor"
            :label-color="labelColor" label="Last Name" :rules="[(val) => val && val.length > 0 || 'Required']"
            lazy-rules>

            <template v-slot:before>
              <q-icon :color="logoColor" name="diversity_3" size="lg" />
            </template>
          </q-input>
          <q-select outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
            v-model="formInput.suffix" label="Suffix" :options="suffix_options" emit-value map-options lazy-rules>

            <template v-slot:before>
              <q-icon :color="logoColor" name="groups_3" size="lg" />
            </template>

            <template v-slot:append>
              <q-icon name="close" @click="formInput.suffix = null" class="remove-selection"
                v-show="formInput.suffix"></q-icon>
            </template>
          </q-select>
          <q-input outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor" label="Birthdate"
            v-model="formInput.birthdate" @click="$refs.birthdateProxy.show()"
            :rules="[(val) => (val && val.length > 0) || 'Required Field']">
            <template v-slot:before>
              <q-icon :color="logoColor" name="cake" size="lg" />
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
          Please input the email where you received your VFO Certificate.<br>
          Furthermore, this email will be used to further contact you with DOST-SEI and Patriot Programs.
          <q-input outlined rounded v-model="formInput.email" type="email" :color="borderColor" :bg-color="bgColor"
            :label-color="labelColor" label="Email Address" :rules="[(val) => val.includes('@') || 'Only valid email']"
            lazy-rules>
            <template v-slot:before>
              <q-icon :color="logoColor" name="mail" size="lg" />
            </template>
          </q-input>
          <div class="button-container" v-show="!OTPVerified">
            <q-toggle v-model="accept" @click="accept ? (dataPolicyMenu = !dataPolicyMenu) : ''">
              I accept the <b>Data Privacy Policy Terms</b>
            </q-toggle>
            <q-btn label="Send OTP" color="primary" class="button-submit" @click="disclaimer = true"
              :disabled="!accept || formInput.email == null"></q-btn>
          </div>
        </div>
        <div v-show="OTPSent && !OTPVerified">
          <br><br>
          We have sent an OTP to your
          <b>
            {{ formInput.email?.split('@')[0]?.substring(0, 2) + '******' +
              formInput.email?.split('@')[0]?.slice(-2) + '@' +
              formInput.email?.split('@')[1]?.substring(0, 2) + '***...' }}
          </b>
          Please input the received OTP below.
          <q-input outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor" v-model="otp"
            class="text-fields" type="number" label="OTP from your Email" hint="6-digit OTP" lazy-rules>

            <template v-slot:before>
              <q-icon :color="logoColor" name="key" size="lg" />
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
              <!-- <q-input outlined rounded label="SPAS ID" v-model="formInput.spas_id" :color="borderColor"
                :bg-color="bgColor" :label-color="labelColor" mask="A-####-##-#####" fill-mask
                :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>
                <template v-slot:before>
                  <q-icon :color="logoColor" name="badge" size="lg" />
                </template>
              </q-input> -->
              <q-input outlined rounded v-model="formInput.email" readonly type="email" :color="borderColor"
                :bg-color="bgColor" :label-color="labelColor" label="Email to Register"
                :rules="[(val) => val.includes('@') || 'Only valid email']" lazy-rules>

                <template v-slot:before>
                  <q-icon :color="logoColor" name="mail" size="lg" />
                </template>
              </q-input>
              <q-input readonly outlined rounded v-model="formInput.fName" :color="borderColor" :bg-color="bgColor"
                :label-color="labelColor" label="First Name" hint="Name inputted will reflect on certificates"
                :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>

                <template v-slot:before>
                  <q-icon :color="logoColor" name="person" size="lg" />
                </template>
              </q-input>
              <q-input readonly outlined rounded v-model="formInput.mName" :color="borderColor" :bg-color="bgColor"
                :label-color="labelColor" label="Middle Name" hint="Put N/A if not applicable"
                :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>

                <template v-slot:before>
                  <q-icon :color="logoColor" name="people" size="lg" />
                </template>
              </q-input>
              <q-input readonly outlined rounded v-model="formInput.lName" :color="borderColor" :bg-color="bgColor"
                :label-color="labelColor" label="Last Name" :rules="[(val) => val && val.length > 0 || 'Required']"
                lazy-rules>

                <template v-slot:before>
                  <q-icon :color="logoColor" name="diversity_3" size="lg" />
                </template>
              </q-input>
              <q-select readonly outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
                v-model="formInput.suffix" label="Suffix" :options="suffix_options" emit-value map-options lazy-rules>

                <template v-slot:before>
                  <q-icon :color="logoColor" name="groups_3" size="lg" />
                </template>

                <template v-slot:append>
                  <q-icon name="close" @click="formInput.suffix = null" class="remove-selection"
                    v-show="formInput.suffix"></q-icon>
                </template>
              </q-select>

              <q-input readonly outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
                label="Birthdate" v-model="formInput.birthdate"
                :rules="[(val) => (val && val.length > 0) || 'Required Field']">
                <template v-slot:before>
                  <q-icon :color="logoColor" name="cake" size="lg" />
                </template>
              </q-input>
            </div>
            <div v-show="OTPVerified" class="right-container">
              <div class="radios">
                <q-radio v-model="formInput.sex" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1"
                  size="xl" color="indigo-7">
                  <q-icon :color="logoColor" name="male" size="xl" />Male
                </q-radio>
                <q-radio v-model="formInput.sex" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="2"
                  size="xl" color="indigo-7">
                  <q-icon :color="logoColor" name="female" size="xl" />Female
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
                  <span v-if="formInput.lgbt[0] == 'Yes'" class="text-caption">*gender identity corresponds with the sex
                    registered for them at birth</span>
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
              <q-input rounded outlined v-model="formInput.phoneNumber" type="number" maxlength="11"
                :color="borderColor" :bg-color="bgColor" :label-color="labelColor" label="Phone Number" lazy-rules
                :rules="[(val) => (val && val.length == 11) || '11 digit phone number only']">

                <template v-slot:before>
                  <q-icon :color="logoColor" name="phone" size="lg" />
                </template>
              </q-input>
            </div>

          </div>
          <div v-show="pageNum == 2">
            <p class="text-h3 text-center q-my-md">Type of Participant</p>
            <div class="radios">
              <div label="Scholar" style="
                  background-size: contain;
                  background-repeat: no-repeat;
                  background-position: center;
                  cursor: pointer;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                ">
                <q-img src="/slc/radio-option1.png" alt="" srcset="" @click="selectParticipantType(1)"
                  :class="{ 'pulsate-bck': formInput.participant == 1 }"
                  style="height: 20vh; width: 20vh; filter: grayscale(100%)" />
                <b>Scholar</b>
              </div>
              <div style="
                  background-size: contain;
                  background-repeat: no-repeat;
                  background-position: center;
                  cursor: pointer;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                ">
                <q-img src="/slc/radio-option2.png" alt="" srcset="" @click="selectParticipantType(2)"
                  :class="{ 'pulsate-bck': formInput.participant == 2 }"
                  style="height: 20vh; width: 20vh; filter: grayscale(100%)" />
                <b>Coordinator</b>
              </div>
            </div>
            <div class="left-container">
              <q-slide-transition :duration="700">
                <q-select outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
                  v-model="formInput.univRegion" label="Region of your School" :options="region_options" emit-value
                  map-options lazy-rules v-show="formInput.participant">
                  <template v-slot:before>
                    <q-icon :color="logoColor" name="map" size="lg" />
                  </template>
                </q-select>
              </q-slide-transition>
              <q-slide-transition :duration="700">
                <div v-show="formInput.participant == 1 || (formInput.univRegion == 13 && formInput.participant == 2)">
                  <q-select outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
                    v-model="formInput.university" use-input emit-value map-options input-debounce="0"
                    label="University" :options="filtered_university" @filter="filter_university" behavior="menu"
                    lazy-rules :rules="[(val) => (val && val > 0) || 'Required Field',]">

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:before>
                      <q-icon :color="logoColor" name="school" size="lg" />
                    </template>

                    <template v-slot:append>
                      <q-icon name="close" @click="formInput.university = null" class="remove-selection"
                        v-show="formInput.university"></q-icon>
                    </template>
                  </q-select>
                  <q-select outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
                    v-model="formInput.course" use-input emit-value map-options input-debounce="0"
                    label="Course / Program" :options="filtered_course" @filter="filter_course" behavior="menu"
                    lazy-rules :rules="[(val) => (val && val > 0) || 'Required Field']">

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:before>
                      <q-icon :color="logoColor" name="golf_course" size="lg" />
                    </template>

                    <template v-slot:append>
                      <q-icon name="close" @click="formInput.course = null" class="remove-selection"
                        v-show="formInput.course"></q-icon>
                    </template>
                  </q-select>
                  <q-select outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
                    v-model="formInput.scholarProgram" label="Scholarship Program" :options="scholarProgram_options"
                    emit-value map-options lazy-rules :rules="[(val) => (val && val > 0) || 'Required Field']">

                    <template v-slot:before>
                      <q-icon :color="logoColor" name="auto_graph" size="lg" />
                    </template>
                  </q-select>
                  <q-select outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
                    v-model="formInput.yearAward" label="Year Award" :options="yearAward_options" emit-value map-options
                    lazy-rules :rules="[(val) => (val && val > 0) || 'Required Field']">

                    <template v-slot:before>
                      <q-icon :color="logoColor" name="verified_user" size="lg" />
                    </template>
                  </q-select>
                </div>
              </q-slide-transition>
            </div>
            <div class="right-container">
              <q-slide-transition :duration="700">
                <div v-show="formInput.participant == 1">

                  <q-select outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
                    v-model="formInput.univCity" use-input emit-value map-options input-debounce="0"
                    label="City of your University" :options="filtered_univCity" @filter="filter_univCity"
                    behavior="menu" lazy-rules :rules="[(val) => (val && val > 0) || 'Required Field',]"
                    v-show="formInput.participant == 1 || (formInput.participant == 2 && formInput.univRegion == 13)">

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:before>
                      <q-icon :color="logoColor" name="mode_of_travel" size="lg" />
                    </template>

                    <template v-slot:append>
                      <q-icon name="close" @click="formInput.univCity = null" class="remove-selection"
                        v-show="formInput.univCity"></q-icon>
                    </template>
                  </q-select>
                  <q-select outlined rounded :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
                    v-model="formInput.yearLevel" label="Year Level" :options="yearLevel_options" emit-value map-options
                    lazy-rules :rules="[(val) => (val && val > 0) || 'Required Field']">

                    <template v-slot:before>
                      <q-icon :color="logoColor" name="settings_input_composite" size="lg" />
                    </template>
                  </q-select>


                  <q-input outlined rounded v-model="formInput.association" :color="borderColor" :bg-color="bgColor"
                    :label-color="labelColor" label="Associations" hint="e.g Member/President of Scholars Club"
                    :rules="[(val) => val.length > 0 || 'Required']" lazy-rules>

                    <template v-slot:before>
                      <q-icon :color="logoColor" name="sort" size="lg" />
                    </template>
                  </q-input>
                </div>
              </q-slide-transition>
              <q-slide-transition :duration="700">
                <div v-show="formInput.participant == 2">
                  <q-input outlined rounded v-model="formInput.designation" :color="borderColor" :bg-color="bgColor"
                    :label-color="labelColor" label="Designation" :rules="[(val) => val.length > 0 || 'Required']"
                    lazy-rules hint="e.g. Project Director, University Coordinator">

                    <template v-slot:before>
                      <q-icon :color="logoColor" name="sort" size="lg" />
                    </template>
                  </q-input>
                  <q-input outlined rounded v-model="formInput.position" :color="borderColor" :bg-color="bgColor"
                    :label-color="labelColor" label="Position" :rules="[(val) => val.length > 0 || 'Required']"
                    lazy-rules hint="e.g. Senior Science Research Specialist">

                    <template v-slot:before>
                      <q-icon :color="logoColor" name="sort" size="lg" />
                    </template>
                  </q-input>
                </div>
              </q-slide-transition>
            </div>
          </div>
          <!-- && formInput.participant == 1 -->
          <div v-show="pageNum == 3">
            <div v-for="val in Array.from(Array(questions.validation.length).keys())">
              <br><b style="font-size: 24px">{{ questions.validation[val].split(':')[0] }}</b><br>
              {{ questions.validation[val].split(':')[1] }}
              <q-input outlined rounded v-model="formInput.validation[val]" :color="borderColor" :bg-color="bgColor"
                :label-color="labelColor" :rules="[(val) => val.length > 0 || 'Required']">
                <template v-slot:before>
                  <q-icon :color="logoColor" name="question_answer" size="lg" />
                </template>
              </q-input>
            </div>
          </div>
          <div v-show="pageNum == 4">
            <q-separator />
            <p style="justify-content: center;">
              <b>DIRECTIONS</b>: Using a 5-point Likert scale, please put a checkmark (✓) on the
              appropriate column that represents the extent of your agreement to the following
              statements about some quality dimensions of this activity.
              All fields required.
            </p>
            <div v-for="(item, index) in questions.pretest" :key="item.id">
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
            <!-- {{ "31. " + questions.recom }}
            <q-input v-model="formInput.expectation" :color="borderColor" :bg-color="bgColor" :label-color="labelColor"
              outlined rounded :rules="[(val) => val.length > 0 || 'Required Field']" lazy-rules>

              <template v-slot:before>
                <q-icon :color="logoColor" name="psychology_alt" size="lg" />
              </template>
            </q-input> -->
          </div>
          <q-separator />
        </div>


        <div class="button-container" v-show="OTPVerified">
          <div class="radios" style="width: 100%;">
            <div v-show="pageNum > 1" style="width: 25%;">
              <q-btn label="Back" @click="pageNum--" color="teal" class="button-submit" style="width: 100%;"></q-btn>
            </div>
            <div v-show="pageNum < 4 && !(pageNum == 2 && formInput.participant == 2)" style="width: 25%;">
              <q-btn label="Next" @click="pageNum++, scrollToElement('#topElement')" color="teal" class="button-submit"
                style="width: 100%; height: 12%" :disabled="((
                  (pageNum == 1) && (
                    !formInput.fName ||
                    !formInput.mName ||
                    !formInput.lName ||
                    !formInput.sex ||
                    formInput.lgbt.length != 2 ||
                    !formInput.birthdate ||
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
                  )) || ((pageNum == 3) && (
                    formInput.validation.filter(obj => obj != null).length != 4
                  )))"></q-btn>
            </div>
          </div>
          <div class="button-container" style="width: 100%;"
            v-show="pageNum == 4 || (pageNum == 2 && formInput.participant == 2)">
            <q-btn label="submit" type="submit" color="primary" class="button-submit" @click="submitResponse()" />
          </div>
        </div>
        <!-- remove comment to enable testing with pre-input data -->
        <!-- <q-btn label="test" @click="testSubmit(), OTPVerified = true" /> -->
      </q-form>
    </div>
  </q-card>
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
        Your <b>SLC 2025</b> journey is about to start right here.<br />
        An email will be sent to you containing<br />
        your status of registration.<br />

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

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px; white-space: pre;">
        {{ errMessage }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup @click="OTPVerified ? refreshPage() : ''" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="disclaimer" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon :color="logoColor" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Disclaimer</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        If you have already attended previous batch of SLC<br />You may not proceed.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red-5" v-close-popup />
        <q-btn label="OK" @click="sendOTP" color="green-5" v-close-popup />
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
        <div class="text-h3 text-white">Data Privacy Notice</div>
        <div class="text-subtitle text-white">
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
          <p class="dataPolicyText">
            CONFORME:

            I hereby authorize the DOST-SEI to collect and process the data indicated herein for future improvements
            and
            research study. I understand that my personal information is protected by R.A. 10173, Data Privacy Act of
            2012.
          </p>
          <q-btn v-close-popup label="I Agree" color="green-6" class="q-mb-xl" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script>
import { LocalStorage, useMeta, useQuasar } from "quasar"
import { ref } from 'vue'
import {
  axiosInit,
  yearAward_options,
  yearLevel_options,
  scholarProgram_options,
  suffix_options,
  university_options,
  univCity_options,
  course_options,
  region_options,

  filtered_course,
  filtered_university,
  filtered_univCity,

  filter_course,
  filter_univCity,
  filter_university,
  pageNum,

  scrollToElement,
  testSubmit,
  formInput
} from '../components/DefineInitials.vue';

const metaData = {
  title: 'SLC Registration',
}

const accept = ref(false)
// bypass otp
const OTPVerified = ref(false)
const otp = ref(null)
const allRequired = ref(null)
const pleaseWait = ref(null)
const congrats = ref(false)
const errorWarning = ref(null)
const OTPSent = ref(false)
const conduct = ref(null)

const registrationClosed = ref(null)

const refreshPage = () => {
  location.reload()
};

export default {
  beforeMount() {
    // const getNumericalOption = (options, select) => {
    //   return !Number.isInteger(select) && select != null ? options.value.find(obj => select == obj.label).value : select
    // }

    // const getLabelOption = (options, select) => {
    //   return options?.value?.find(obj => select == obj.value).label
    // }
    // LocalStorage.clear()
    let obj = LocalStorage.getItem('formInput')
    if (obj != null) {
      Object.keys(obj).forEach(function (item) {
        // if (['university', 'course', 'univCity'].includes(item)) {
        //   if (item == 'university')
        //     formInput[item] = getLabelOption(university_options, obj[item])
        //   else if (item == 'course')
        //     formInput[item] = getLabelOption(course_options, obj[item])
        //   else
        //     formInput[item] = getLabelOption(univCity_options, obj[item])
        // }
        // else {
        formInput[item] = obj[item]
        // }
      })
    }
  },
  setup() {
    axiosInit.get('/general/getConfig.php?' +
      '&getConduct=' +
      true
    ).then(function (response) {
      if (response.data) {
        conduct.value = response.data.conduct
      }
    })
    useMeta(metaData)

    const $q = useQuasar()
    const dataPolicyMenu = ref(false)
    const conformeCheck = ref(false)
    const errMessage = ref(null)
    const disclaimer = ref(false)

    const OTPValid = () => {
      pleaseWait.value = true;
      axiosInit
        .get("slc/auth/checkOTP.php?otp=" + otp.value + "&email=" + formInput.email)
        .then(function (response) {
          pleaseWait.value = false;
          if (response.data.OTPVerified === true) {
            OTPVerified.value = true;

          } else {
            errorWarning.value = true;
            errMessage.value = response.data.errMessage
            // OTPNotMatch.value = true;
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

    const sendOTP = () => {
      pleaseWait.value = true;
      const dlInsert = toFormData(formInput);
      axiosInit
        .post('slc/auth/sendOTP.php?', dlInsert)
        .then(function (response) {
          pleaseWait.value = false;
          if (response.data.emailSent === true) {
            OTPSent.value = response.data.emailSent;
            formInput.email = response.data.email
            // formInput.spas_id = response.data.spas_id
          }
          else {
            errorWarning.value = true;
            errMessage.value = response.data.errMessage
          }
        });
    };

    const submitResponse = () => {
      // lets set the localstorage first
      $q.localStorage.set('formInput', formInput)

      pleaseWait.value = true
      if ((!formInput.participant ||
        ((formInput.participant == 1) && (
          !formInput.fName ||
          !formInput.mName ||
          !formInput.lName ||
          !formInput.sex ||
          !formInput.birthdate ||
          !formInput.phoneNumber ||
          !formInput.univRegion ||
          !formInput.univCity ||
          !formInput.university ||
          !formInput.yearLevel ||
          !formInput.course ||
          !formInput.yearAward ||
          formInput.pretest.filter(v => v).length < 30
        )) || ((formInput.participant == 2) && (
          !formInput.fName ||
          !formInput.mName ||
          !formInput.lName ||
          !formInput.sex ||
          !formInput.birthdate ||
          !formInput.phoneNumber ||
          !formInput.univRegion ||
          !formInput.designation ||
          !formInput.position
        ))
      )) {
        pleaseWait.value = false
        allRequired.value = true
      } else {
        formInput.collatedValidation = formInput.validation.join('|')
        const dlInsert = toFormData(formInput);
        axiosInit.post(
          "slc/record/submitRegistrant.php", dlInsert, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
        ).then(function (response) {
          $q.localStorage.clear()
          if (response.data.success) {
            pleaseWait.value = false
            congrats.value = true
          }
          else {
            pleaseWait.value = false
            errorWarning.value = true
            errMessage.value = response.data.errMessage
          }
        }).catch(function (error) {
          errorWarning.value = true
          errMessage.value = 'Your session has expired. Please reload this page. \n Your answers to the questionnaire has been saved'
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
      registrationClosed,

      borderColor: 'blue-10',
      labelColor: 'blue-10',
      bgColor: 'blue-grey-2',
      logoColor: 'blue-10',
      conduct,

      disclaimer,

      errMessage,
      dataPolicyMenu,
      OTPVerified,
      OTPSent,
      yearAward_options,
      yearLevel_options,
      scholarProgram_options,
      suffix_options,
      university_options,
      univCity_options,
      course_options,
      region_options,

      filter_university,
      filter_univCity,
      filter_course,

      filtered_course,
      filtered_university,
      filtered_univCity,

      formInput,
      accept,
      otp,
      greeting: ref(false),
      allRequired,

      pleaseWait,
      congrats,
      errorWarning,

      pageNum,
      conformeCheck,
      radio_val: [5, 4, 3, 2, 1],
      likertScaleDesc: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      likertScaleColor: ['red-6', 'red-4', 'teal-4', 'green-4', 'green-6'],
      yesno_options: ['Yes', 'No'],
      gad_colors: ['pink-5', 'purple-7', 'deep-purple-6'],
      questions: {
        validation: [
          '1. Core Values: How do you demonstrate professional excellence in your academic or personal endeavors, and how do you plan to continue striving for excellence as a DOST-SEI scholar?',
          '2. Leadership: As a potential leader, how do you ensure that you lead by example and put the needs of others before your own? Can you provide an example where you exhibited servant leadership in your role as an officer or a volunteer? ',
          '3. Volunteering Plans: Describe a situation where you took initiative in your community or school to address a social issue or support a cause. What motivated you to take action, and what impact did your efforts have? ',
          '4. Expectation: What specific skills or experiences do you expect to gain from this leadership camp? Additionally, in what ways do you believe attending this camp will contribute to your personal growth and development? ',
        ],
        pretest: [
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
        // recom: 'Please identify and describe the specific skills and knowledge that you are expecting to learn from the Leadership Camp.'
      },
      dataPolicyText: `This form collects your personal information and post-evaluation of the activity for future improvements and research study.  The DOST-SEI, in compliance with R.A. 10173, implements reasonable and appropriate organizational, physical, and technical security measures for the protection of your personal information collected. Only the DOST-SEI employees are permitted to have access to the collected information. They shall be guided by the security measures provided in handling all personal information collected. Personal information collected is processed, stored, and later on disposed of via shredding and permanently deleted in our electronic files in accordance with R.A No. 9470 otherwise known as the National Archive of the Philippines Act of 2007. In case of a data breach, DOST-SEI shall notify you and inform the National Privacy Commission (NPC) in accordance with NPC Circular 16-03 on Personal Data Breach Management. Additionaly, agreeing with this policy allows DOST - SEI to take any images, videos or graphics taken during conduct for publication and reporting purposes.

RIGHTS OF THE DATA SUBJECT

As the Data Subject, you have the right to be informed of the personal information being collected, processed, and stored by DOST-SEI as well as to access, object, rectify, and block the same. 

CONTACT DETAILS OF THE DOST-SEI DATA PRIVACY OFFICER (DPO) 

For questions or concerns, you may contact our Data Protection Officer through the following details:

Direct Line: +63 2 8710 7462

E-mail: dpo@sei.dost.gov.ph`,

    }

  }
}

</script>
