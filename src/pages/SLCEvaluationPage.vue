<template>
  <q-card class="evaluation" style="
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        border-radius: 50px;
      " id="topElement">
    <div v-show="!verify">
      <div v-show="!verify" class="input-forms">
        <div class="button-container">
          <h4>Evaluation</h4>
        </div>
        <br><br>
        <q-input outlined rounded v-model="formInput.email" type="email" color="indigo-7" label-color="indigo-7"
          label="Registered Email for SLC 2024" :rules="[(val) => val.includes('@') || 'Only valid email']" lazy-rules>
          <template v-slot:before>
            <q-icon style="color: #3948ab85" name="mail" />
          </template>
        </q-input>
        <div class="button-container">
          <q-toggle v-model="accept" @click="dataPolicyMenu = !dataPolicyMenu">
            I accept the <b>Data Privacy Policy Terms</b>
          </q-toggle>
          <q-btn unelevated rounded size="lg" label="Start Evaluation" color="teal" :disabled="!accept" style="width: 50%"
            @click="sendOTP()" />
        </div>
      </div>
    </div>
    <div v-show="verify" id="parentContainer">
      <q-form>
        <div v-show="pageNum == 1">
          <p style="justify-content: center;">
            <b>DIRECTIONS</b>: Using a 5-point Likert scale, please put a checkmark (✓) on the
            appropriate column that represents the extent of your agreement to the following
            statements about some quality dimensions of this activity.
            All fields required.
          </p>
          <q-separator />
          <br><br><b>{{ "Access and Facilities" }}</b>
          <div v-for="(item, index) in questions.af" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.af[index] != val" :unelevated="formInput.af[index] == val"
                      :label="likertScaleDesc[val - 1]" @click="formInput.af[index] = val"
                      :class="formInput.af[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.af[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 2">
          <br><b>{{ "Communication" }}</b>
          <div v-for="(item, index) in questions.c" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.c[index] != val" :unelevated="formInput.c[index] == val"
                      :label="likertScaleDesc[val - 1]" @click="formInput.c[index] = val"
                      :class="formInput.c[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.c[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 3">
          <br><b>{{ "Quality" }}</b>
          <div v-for="(item, index) in questions.q" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.q[index] != val" :unelevated="formInput.q[index] == val"
                      :label="likertScaleDesc[val - 1]" @click="formInput.q[index] = val"
                      :class="formInput.q[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.q[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 4">
          <br><b>{{ "Organization" }}</b>
          <div v-for="(item, index) in questions.org" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.org[index] != val" :unelevated="formInput.org[index] == val"
                      :label="likertScaleDesc[val - 1]" @click="formInput.org[index] = val"
                      :class="formInput.org[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.org[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 5">
          <br><b>{{ "Outcome" }}</b>
          <div v-for="(item, index) in questions.out" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.out[index] != val" :unelevated="formInput.out[index] == val"
                      :label="likertScaleDesc[val - 1]" @click="formInput.out[index] = val"
                      :class="formInput.out[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.out[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 6">
          <br><b>{{ "DR. SEGUNDO JOAQUIN A. ROMERO, JR. " }}</b>
          <div v-for="(item, index) in questions.speakers" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.romero[index] != val" :unelevated="formInput.romero[index] == val"
                      :label="rpRatingDesc[val - 1]" @click="formInput.romero[index] = val"
                      :class="formInput.romero[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.romero[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 7">
          <br><b>{{ "ENGR. BERNIE C. CANGREJO" }}</b>
          <div v-for="(item, index) in questions.speakers" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.cangrejo[index] != val" :unelevated="formInput.cangrejo[index] == val"
                      :label="rpRatingDesc[val - 1]" @click="formInput.cangrejo[index] = val"
                      :class="formInput.cangrejo[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.cangrejo[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 8">
          <br><b>{{ "DR. NESTOR G. ACALA " }}</b>
          <div v-for="(item, index) in questions.speakers" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.acala[index] != val" :unelevated="formInput.acala[index] == val"
                      :label="rpRatingDesc[val - 1]" @click="formInput.acala[index] = val"
                      :class="formInput.acala[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.acala[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 9">
          <br><b>{{ "PROF. MICHAEL CHARLESTON B. CHUA" }}</b>
          <div v-for="(item, index) in questions.speakers" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.chua[index] != val" :unelevated="formInput.chua[index] == val"
                      :label="rpRatingDesc[val - 1]" @click="formInput.chua[index] = val"
                      :class="formInput.chua[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.chua[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 10">
          <br><b>{{ "JAYEEL S. CORNELIO Ph. D." }}</b>
          <div v-for="(item, index) in questions.speakers" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.cornelio[index] != val" :unelevated="formInput.cornelio[index] == val"
                      :label="rpRatingDesc[val - 1]" @click="formInput.cornelio[index] = val"
                      :class="formInput.cornelio[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.cornelio[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <q-separator />
        </div>
        <div v-show="pageNum == 11">
          <br><b>{{ "MS. ROSEJELYNN C. BULANTE " }}</b>
          <div v-for="(item, index) in questions.speakers" :key="item.id">
            <br>{{ item }}
            <div class="radios">
              <ul style="list-style-type: none; padding: 0; margin: 0; ">
                <div v-for="val in radio_val" :key="val.id"
                  :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                  <li>
                    <q-btn :outline="formInput.bulante[index] != val" :unelevated="formInput.bulante[index] == val"
                      :label="rpRatingDesc[val - 1]" @click="formInput.bulante[index] = val"
                      :class="formInput.bulante[index] == val ? 'pulsate-bck' : ''"
                      :color="formInput.bulante[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                      style="margin-inline: 10px; margin-block: 5px" />
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div v-show="pageNum == 12">
          <br><b>{{ "OVERALL RATING" }}</b>
          <br>{{ questions.five1 }}
          <div class="radios">
            <ul style="list-style-type: none; padding: 0; margin: 0; ">
              <div v-for="val in radio_val" :key="val.id"
                :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                <li>
                  <q-btn :outline="formInput.five1 != val" :unelevated="formInput.five1 == val"
                    :label="overallScaleDesc[val - 1]" @click="formInput.five1 = val"
                    :class="formInput.five1 == val ? 'pulsate-bck' : ''"
                    :color="formInput.five1 == val ? likertScaleColor[val - 1] : 'indigo-7'"
                    style="margin-inline: 10px; margin-block: 5px" />
                </li>
              </div>
            </ul>
          </div>
          <br>{{ questions.five2 }}
          <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
            v-model="formInput.five2" label="Comment" lazy-rules :rules="[
              (val) => (val && val.length > 0) || 'Required Field',
            ]" />
          <br>{{ questions.five3 }}
          <q-field class="answer-container" borderless ref="fieldRef" v-model="formInput.five3[0]" stack-label lazy-rules
            :rules="[
              (val) => (val > 0) || 'Required Field',
            ]">
            <q-radio v-model="formInput.five3[0]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1"
              :size="isScreenMD" color="indigo-7">
              <q-icon style="color: rgba(133, 57, 171, 0.87)" name="check" :size="isScreenMD" />
            </q-radio>
            <q-radio v-model="formInput.five3[0]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="2"
              :size="isScreenMD" color="indigo-7">
              <q-icon style="color: rgba(133, 57, 171, 0.87)" name="close" :size="isScreenMD" />
            </q-radio>
          </q-field>
          <div v-if="formInput.five3[0]">
            {{ formInput.five3[0] == 1 ? 'Why?' : 'Why not?' }}
          </div>

          <div v-show="formInput.five3[0]">
            <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
              v-model="formInput.five3[1]" label="Comment" lazy-rules :rules="[
                (val) => (val && val.length > 0) || 'Required Field',
              ]" />
          </div>
          <br>{{ questions.five4 }}
          <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
            v-model="formInput.five4" label="Comment" lazy-rules :rules="[
              (val) => (val && val.length > 0) || 'Required Field',
            ]" />
          <br>{{ questions.five5 }}
          <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
            v-model="formInput.five5" label="Comment" lazy-rules :rules="[
              (val) => (val && val.length > 0) || 'Required Field',
            ]" />
          <br>{{ questions.five6 }}
          <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
            v-model="formInput.five6" label="Comment" lazy-rules :rules="[
              (val) => (val && val.length > 0) || 'Required Field',
            ]" />
        </div>
        <div class="button-container">
          <!-- for testing pre input data -->
          <!-- <q-btn @click="testSubmit()" label="test" /> -->
          <div class="radios" style="width: 100%;">
            <div v-show="pageNum > 1" style="width: 25%;">
              <q-btn label="Back" @click="pageNum--" color="teal" class="button-submit" style="width: 100%;"></q-btn>
            </div>
            <div v-show="pageNum < 12" style="width: 25%;  ">
              <q-btn label="Next" @click="pageNum++, scrollToElement('#topElement')" color="teal" class="button-submit"
                style="width: 100%; height: 12%" :disabled="(pageNum == 1 && formInput.af.filter(v => v).length < 6) ||
                  (pageNum == 2 && formInput.c.filter(v => v).length < 5) ||
                  (pageNum == 3 && formInput.q.filter(v => v).length < 7) ||
                  (pageNum == 4 && formInput.org.filter(v => v).length < 7) ||
                  (pageNum == 5 && formInput.out.filter(v => v).length < 7) ||
                  (pageNum == 6 && formInput.romero.filter(v => v).length < 5) ||
                  (pageNum == 7 && formInput.cangrejo.filter(v => v).length < 5) ||
                  (pageNum == 8 && formInput.acala.filter(v => v).length < 5) ||
                  (pageNum == 9 && formInput.chua.filter(v => v).length < 5) ||
                  (pageNum == 10 && formInput.cornelio.filter(v => v).length < 5) ||
                  (pageNum == 11 && formInput.bulante.filter(v => v).length < 5)"></q-btn>
            </div>
          </div>
          <div class="button-container" style="width: 100%;" v-show="pageNum">
            <q-btn @click="submitResponse()" label="submit" type="submit" color="primary" class="button-submit"></q-btn>
          </div>
          <!--  v-show="pageNum == 11" -->
        </div>
      </q-form>
    </div>
  </q-card>
  <q-dialog v-model="allRequired" persistent>
    <q-card style="width: 300px !important" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon style="color: #3948ab85" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        There are some unfulfilled details.
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
        <b>SLC 2024</b> experience have been succesfully<br />concluded.
        an email will be sent to you containing<br />
        your proof of evaluation. <br />

      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="green" @click="refreshPage()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="errorWarning" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon style="color: #3948ab85" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        Please try again
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="notListed" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon style="color: #3948ab85" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        Kindly contact your respective scholarship coordinator to enlist your
        email.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="alreadySubmitted" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon style="color: #3948ab85" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        You have already submitted your evaluation forms.
        <br>Thank you.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="attended" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon style="color: #3948ab85" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        You have not attended yet all days of your SLC.
        <br>Thank you.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="dataPolicyMenu" position="left" transition-show="slide-right" transition-hide="slide-left" maximized>
    <q-card class="dataPolicy" style="
      -webkit-border-radius: 25px;
      -moz-border-radius: 25px;
      border-radius: 25px;
    ">
      <q-btn dense size="lg" flat icon="close" v-close-popup class="close-btn">
        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
      <q-card-section>
        <div class="text-h6" style="color: #e3dfcf">Data Privacy Policy</div>
        <div class="text-subtitle2" style="color: #e3dfcf">
          Department of Science and Technology - Science Education Institute
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll" style="color: #e3dfcf">
        <p class="dataPolicyText">
          {{ dataPolicyText }}
        </p>
      </q-card-section>
      <q-card-section>
        <div class="row items-center justify-end">
          <q-btn v-close-popup label="Close" color="red-10" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, reactive } from 'vue';
import axios from 'axios';

const baseURL = import.meta.env.DEV ? "http://localhost/SLC_api" : "/SLC_api";
const axiosInit = axios.create({
  baseURL,
  withCredentials: true,
});

const formInput = reactive({
  af: [null],
  c: [null],
  q: [null],
  org: [null],
  out: [null],
  romero: [null],
  cornelio: [null],
  cangrejo: [null],
  chua: [null],
  bulante: [null],
  acala: [null],
  five1: null,
  five2: null,
  five3: [null],
  five4: null,
  five5: null,
  five6: null,
  email: null
});

const accept = ref(false)
// test verify
const verify = ref(false)
const otpSuccess = ref(null)
const otp = ref(null)
const isOTPSixDigit = ref(null)
const allRequired = ref(null)
const pleaseWait = ref(null)
const congrats = ref(null)
const errorWarning = ref(null)
const notListed = ref(null)
const isScreenMD = ref(null)
const pageNum = ref(1)
const alreadySubmitted = ref(null)
const attended = ref(null)
const index = ref(null)
const dataPolicyMenu = ref(null)

const refreshPage = () => {
  // location.href = "/";
};

const scrollToElement = (el) => {
  const myDiv = document.querySelector(el);
  myDiv.scrollTo({ top: 0, behavior: 'smooth' })
}


const sendOTP = () => {
  pleaseWait.value = true;
  axiosInit
    .get('/record/checkEmailforEval.php?email=' + formInput.email)
    .then(function (response) {
      if (response.data.dupe === true) {
        pleaseWait.value = false;
        alreadySubmitted.value = true
      } else if (response.data.attended === false) {
        pleaseWait.value = false;
        attended.value = true;
      } else if (response.data.success === true) {
        pleaseWait.value = false;
        verify.value = response.data.success;
      } else {
        pleaseWait.value = false;
        errorWarning.value = true;
      }
    });
};

export default {
  setup() {
    const $q = useQuasar();

    const toFormData = (obj) => {
      const formData = new FormData();
      for (const key in obj) {
        formData.append(key, obj[key]);
      }
      return formData;
    };

    const submitResponse = () => {
      pleaseWait.value = true
      if (
        !formInput.email ||
        formInput.af.filter(v => v).length < 6 ||
        formInput.c.filter(v => v).length < 5 ||
        formInput.q.filter(v => v).length < 7 ||
        formInput.org.filter(v => v).length < 7 ||
        formInput.out.filter(v => v).length < 7 ||
        formInput.romero.filter(v => v).length < 5 ||
        formInput.cornelio.filter(v => v).length < 5 ||
        formInput.acala.filter(v => v).length < 5 ||
        formInput.cangrejo.filter(v => v).length < 5 ||
        formInput.chua.filter(v => v).length < 5 ||
        formInput.bulante.filter(v => v).length < 5 ||
        !formInput.five1 ||
        !formInput.five2 ||
        formInput.five3.filter(v => v).length < 2 ||
        !formInput.five4 ||
        !formInput.five5 ||
        !formInput.five6

      ) {
        pleaseWait.value = false
        allRequired.value = true
      } else {

        const dlInsert = toFormData(formInput);
        axiosInit.post(
          "record/submitEval.php", dlInsert, {
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

    return {
      scrollToElement,
      toFormData,
      submitResponse,
      sendOTP,
      refreshPage,
      dataPolicyMenu,
      formInput,
      accept,
      verify,
      otpSuccess,
      otp,
      isOTPSixDigit,
      allRequired,
      alreadySubmitted,
      pleaseWait,
      congrats,
      errorWarning,
      notListed,
      attended,
      pageNum,
      index,
      isScreenMD: ref($q.screen.lt.md ? 'md' : 'xl'),
      testSubmit() {
        formInput.email = 'bonbacuno@gmail.com'
        formInput.af = [1, 2, 3, 4, 5, 1]
        formInput.c = [1, 2, 3, 4, 5]
        formInput.q = [1, 2, 3, 4, 5, 1, 2]
        formInput.org = [1, 2, 3, 4, 5, 1, 2]
        formInput.out = [1, 2, 3, 4, 5, 1, 2]
        formInput.romero = [1, 2, 3, 4, 5]
        formInput.cornelio = [1, 2, 3, 4, 5]
        formInput.acala = [1, 2, 3, 4, 5]
        formInput.cangrejo = [1, 2, 3, 4, 5]
        formInput.chua = [1, 2, 3, 4, 5]
        formInput.bulante = [1, 2, 3, 4, 5]
        formInput.five1 = 5
        formInput.five2 = "yay"
        formInput.five3 = [1, "yay"]
        formInput.five4 = "yay"
        formInput.five5 = "yay"
        formInput.five6 = "yay"
      },
      radio_val: [1, 2, 3, 4, 5],
      rpRatingDesc: ['Needs Improvement', 'Fair', 'Satisfactory', 'Very Satisfactory', 'Excellent'],
      overallScaleDesc: ['Very Poor', 'Poor', 'Satisfactory', 'Very Satisfactory', 'Excellent'],
      likertScaleDesc: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      likertScaleColor: ['red-6', 'red-4', 'teal-4', 'green-4', 'green-6'],
      questions: {
        af: [
          "1. The venue was appropriate for the leadership camp.",
          "2. The sound system, audio-visual presentation, internet connection, and other technical tools used were working well. ",
          "3. Activity kits and other materials needed for the event were all provided.",
          "4. Medical/hygiene kits were available and accessible throughout the conduct of the activity.",
          "5. The registration system was systematic, useful, easy to navigate, and accessible. ",
          "6. Health protocol reminders were announced from time to time. ",

        ],
        c: [
          "1. The training was well-communicated to the participants (dissemination of information).",
          "2. Queries about the activity were answered promptly. ",
          "3. Instructions were clear and understandable.  ",
          "4. Theme and components of the activity were well-explained. ",
          "5. Participation and interaction were encouraged. ",

        ],
        q: [
          "1. The leadership camp was systematic and well-organized.",
          "2. Every detail of the event was handled and managed well.",
          "3. Topics covered were relevant and useful.",
          "4. The activities started on time.",
          "5. Appropriate time was provided for a question and answer (Q&A) portion. ",
          "6. There was enough time to finish the activities.",
          "7. The content was organized and easy to follow.  ",

        ],
        org: [
          "1. Organizers were well-prepared and knowledgeable in the conduct of the event. ",
          "2. Organizers have precisely conceptualized and coordinated every detail of the event. ",
          "3. Organizers were able to build rapport and good working relationship with the participants.",
          "4. We felt safe and secured in providing information with the organizers.",
          "5. Assistance during the registration of the training was provided. ",
          "6. Organizers were polite and sincere in dealing with the participants’ concerns. ",
          "7. The security and welfare of the participants were considered in the conduct of the activities.",

        ],
        out: [
          "1. The objectives of the leadership camp were clearly defined. ",
          "2. I gained new and important skills and knowledge from the activities. ",
          "3. The topics were interesting, useful, and transformative. ",
          "4. The training was a great avenue for fostering camaraderie and solidarity among science scholars.",
          "5. The activity taught me to fully understand and act on my responsibilities as a government scholar.  ",
          "6. The activity was effective at encouraging scholars to embody the core values of professional excellence, social responsibility, and servant leadership.  ",
          "7. The training enriched my leadership and organizational skills.  ",

        ],
        speakers: [
          "1. Displayed thorough knowledge of, and provided relevant insights on, the topic discussed.",
          "2. Thoroughly explained and processed the learning activities throughout the training. ",
          "3. Created a good learning environment, sustained the attention of the participants, and encouraged their participation in the duration of the activity.",
          "4. Managed his time well.",
          "5. Demonstrated keenness to the participants’ needs and other requirements related to the activity. ",

        ],
        five1: "1.	How would you rate the overall conduct of the leadership camp?",
        five2: "2. What important insight/s did you get from the training?  ",
        five3: "3. Please indicate your comments/suggestions for improvement, if there is any. ",
        five4: "4. Will you recommend this leadership camp in the future? Why?",
        five5: "5.	Please identify and describe specific skills and knowledge that you learned from the leadership camp. ",
        five6: "6.	Please indicate any possible training to be organized under the Patriot Program that you wish to attend in the future."
      },
      dataPolicyText: `We, at the Department of Science and Technology-Science Education Institute, are committed to provide you with prompt and reliable services for the development of the country’s science and technology (S&T) human resources, the implementation of STEM education and innovation programs, and the promotion of S&T among the youth, pursuant to Executive Order No. 128 while implementing safeguards to protect your privacy and keep your personal data safe and secure in accordance with RA 10173 or the Data Privacy Act (DPA) of 2012.

        Processing of Personal Data

        The personal information being collected by DOST-SEI are used for the purpose as specified in the various transaction systems and functional units of the organization.

        Data Protection

        The DOST-SEI, in compliance with RA 10173, shall implement reasonable and appropriate organizational, physical, and technical security measures for the protection of personal information collected.

        Only authorized personnel are permitted to have access to the collected information. They shall be guided by the security measures provided in handling all personal information collected.

        Personal information collected are processed, stored, and later on disposed of via shredding and permanently deleted in our electronic files in accordance to R.A No. 9470 otherwise known as the National Archive of the Philippines Act of 2007.

        In case of data breach, DOST-SEI shall notify you and inform the National Privacy Commission (NPC) in accordance with NPC Circular 16-03 on Personal Data Breach Management.

        Rights of the Data Subject
        As the Data Subject, you have the right to be informed of the personal information being collected, processed, and stored by DOST-SEI as well as to access, object, rectify, and block the same.



        Contact Details of the DOST-SEI Data Privacy Officer (DPO)
        For questions or concerns, you may contact:
        
        Mr. Philip Bue
        Data Protection Officer
        Direct Line: +63 2 8775 9043`

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
  /* border: 5px solid black; */
  font-family: montserrat;
  overflow: scroll;
  font-size: 1.3em;
}

@media screen and (max-width: 850px) {
  .evaluation {
    width: 100vw;
  }
}

body {
  background-image: url('/background.jpg');
  background-size: 100%;
  background-repeat: repeat;
}

.radios {
  /* border: 2px solid black; */
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
</style>
