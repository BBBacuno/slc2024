<template>
  <q-card class="evaluation" style="
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        border-radius: 50px;
        background-color: #ffffffc2;
      " id="topElement">
    <div v-show="!verify">
      <div v-show="!verify" class="input-forms">
        <div class="button-container">
          <h4>Evaluation</h4>
        </div>
        <br><br>
        <q-input outlined rounded label="SPAS ID" v-model="formInput.spas_id" color="blue-10" bg-color="blue-grey-3"
          label-color="blue-10" mask="A-####-##-#####" fill-mask :rules="[(val) => val && val.length > 0 || 'Required']"
          lazy-rules dense>
          <template v-slot:before>
            <q-icon color="blue-10" name="badge" size="md" />
          </template>
        </q-input>
        <div class="button-container">
          <q-toggle v-model="accept" @click="dataPolicyMenu = accept">
            I accept the <b>Data Privacy Notice Terms</b>
          </q-toggle>
          <q-btn unelevated rounded size="lg" label="Start Evaluation" color="teal" :disabled="!accept"
            style="width: 50%" @click="sendOTP()" />
          <!-- <q-btn @click="testSubmit()" label="test" /> -->
        </div>
      </div>
    </div>
    <div v-show="verify" id="parentContainer">
      <div v-show="listPages.find(obj => obj.label == 'af').value == pageNum">
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
      <div v-show="listPages.find(obj => obj.label == 'c').value == pageNum">
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
      <div v-show="listPages.find(obj => obj.label == 'q').value == pageNum">
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
      <div v-show="listPages.find(obj => obj.label == 'org').value == pageNum">
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
      <div v-show="listPages.find(obj => obj.label == 'out').value == pageNum">
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
      <div v-show="listPages.find(obj => obj.label == 'romero').value == pageNum">
        <br><b>{{ "DR. SEGUNDO JOAQUIN E. ROMERO, JR. " }}</b>
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
      <div v-show="listPages.find(obj => obj.label == 'cangrejo').value == pageNum">
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
      <!-- <div v-show="listPages.find(obj => obj.label == 'biyo').value == pageNum">
        <br><b>{{ "DR. JOSETTE T. BIYO" }}</b>
        <div v-for="(item, index) in questions.speakers" :key="item.id">
          <br>{{ item }}
          <div class="radios">
            <ul style="list-style-type: none; padding: 0; margin: 0; ">
              <div v-for="val in radio_val" :key="val.id"
                :style="$q.screen.lt.lg ? 'display: block' : 'display: inline-block'">
                <li>
                  <q-btn :outline="formInput.biyo[index] != val" :unelevated="formInput.biyo[index] == val"
                    :label="rpRatingDesc[val - 1]" @click="formInput.biyo[index] = val"
                    :class="formInput.biyo[index] == val ? 'pulsate-bck' : ''"
                    :color="formInput.biyo[index] == val ? likertScaleColor[val - 1] : 'indigo-7'"
                    style="margin-inline: 10px; margin-block: 5px" />
                </li>
              </div>
            </ul>
          </div>
        </div>
        <q-separator />
      </div> -->
      <div v-show="listPages.find(obj => obj.label == 'cornelio').value == pageNum">
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
      <div v-show="listPages.find(obj => obj.label == 'chua').value == pageNum">
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
      <div v-show="listPages.find(obj => obj.label == 'bulante').value == pageNum">
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
      <div v-show="listPages.find(obj => obj.label == 'gad').value == pageNum">
        <br><b>{{ "Gender" }}</b>
        <br>{{ questions.gad[0] }}
        <div class="radios">
          <ul style="list-style-type: none; padding: 0; margin: 0; ">
            <div style="display: inline-block" v-for="val in radio_val.slice(2).reverse()">
              <li>
                <q-btn :outline="formInput.gad[0] != gad_options[val - 1]"
                  :unelevated="formInput.gad[0] == gad_options[val - 1]" :label="gad_options[val - 1]"
                  @click="formInput.gad[0] = gad_options[val - 1]"
                  :class="formInput.gad[0] == gad_options[val - 1] ? 'pulsate-bck' : ''"
                  :color="formInput.gad[0] == gad_options[val - 1] ? gad_colors[val - 1] : 'purple-5'"
                  style="margin-inline: 10px; margin-block: 5px" />
              </li>
            </div>
          </ul>
          <p style="font-size: 0.8em;">Note:<br>
            1. Gender-Blind - failure to recognize different situations, roles, needs, and interests of women, men,
            and other genders, as well as the existing gender inequality<br>
            2. Gender-Sensitive - aware of how gender influences the opportunities of individuals in society and
            recognizes different needs of women, men, and other genders<br>
            3. Gender-Responsive - actively addresses the different situations, roles, needs, and interests of women,
            men, and other genders, as well as the causes of gender inequality<br>
          </p>
        </div>

        <br>{{ questions.gad[1] }}
        <div class="radios">
          <ul style="list-style-type: none; padding: 0; margin: 0; ">
            <div style="display: inline-block" v-for="val in radio_val.slice(3).reverse()">
              <li>
                <q-btn :outline="formInput.gad[1] != yesno_options[val - 1]"
                  :unelevated="formInput.gad[1] == yesno_options[val - 1]" :label="yesno_options[val - 1]" @click="() => {
                    formInput.gad[1] = yesno_options[val - 1]
                    if (formInput.gad[1] == 'No') {
                      formInput.gad[2] = 'N/A'
                    }
                    else {
                      formInput.gad[2] = ''
                    }
                  }" :class="formInput.gad[1] == yesno_options[val - 1] ? 'pulsate-bck' : ''"
                  :color="formInput.gad[1] == yesno_options[val - 1] ? gad_colors[val - 1] : 'purple-5'"
                  style="margin-inline: 10px; margin-block: 5px" />
              </li>
            </div>
          </ul>
        </div>
        <q-slide-transition>
          <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
            v-model="formInput.gad[2]" :label="formInput.gad[1] == 'Yes' ? 'Please Specify' : 'If no, Why not'"
            lazy-rules :rules="[(val) => (val && val.length > maxChar) || maxChar + ' Characters Required']" counter
            v-if="formInput.gad[1] == 'Yes'" />
        </q-slide-transition>

        <br>{{ questions.gad[2] }}
        <div class="radios">
          <ul style="list-style-type: none; padding: 0; margin: 0; ">
            <div style="display: inline-block" v-for="val in radio_val.slice(3).reverse()">
              <li>
                <q-btn :outline="formInput.gad[3] != yesno_options[val - 1]"
                  :unelevated="formInput.gad[3] == yesno_options[val - 1]" :label="yesno_options[val - 1]" @click="() => {
                    formInput.gad[3] = yesno_options[val - 1]
                    if (formInput.gad[3] == 'No') {
                      formInput.gad[4] = 'N/A'
                    }
                    else {
                      formInput.gad[4] = ''
                    }
                  }" :class="formInput.gad[3] == yesno_options[val - 1] ? 'pulsate-bck' : ''"
                  :color="formInput.gad[3] == yesno_options[val - 1] ? gad_colors[val - 1] : 'purple-5'"
                  style="margin-inline: 10px; margin-block: 5px" />
              </li>
            </div>
          </ul>
        </div>
        <q-slide-transition>
          <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
            v-model="formInput.gad[4]" :label="formInput.gad[3] == 'Yes' ? 'Please Specify' : 'Why not'" lazy-rules
            :rules="[(val) => (val && val.length > maxChar) || maxChar + ' Characters Required']" counter
            v-if="formInput.gad[3] == 'Yes'" />
        </q-slide-transition>

        <br>{{ questions.gad[3] }}
        <div class="radios">
          <ul style="list-style-type: none; padding: 0; margin: 0; ">
            <div style="display: inline-block" v-for="val in radio_val.slice(3).reverse()">
              <li>
                <q-btn :outline="formInput.gad[5] != yesno_options[val - 1]"
                  :unelevated="formInput.gad[5] == yesno_options[val - 1]" :label="yesno_options[val - 1]" @click="() => {
                    formInput.gad[5] = yesno_options[val - 1]
                    if (formInput.gad[5] == 'Yes') {
                      formInput.gad[6] = 'N/A'
                    }
                    else {
                      formInput.gad[6] = ''
                    }
                  }" :class="formInput.gad[5] == yesno_options[val - 1] ? 'pulsate-bck' : ''"
                  :color="formInput.gad[5] == yesno_options[val - 1] ? gad_colors[val - 1] : 'purple-5'"
                  style="margin-inline: 10px; margin-block: 5px" />
              </li>
            </div>
          </ul>
        </div>
        <q-slide-transition>
          <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
            v-model="formInput.gad[6]"
            :label="formInput.gad[5] == 'Yes' ? 'If yes, Please Specify' : 'In your opinion, what comprises  a safe space and gender-fair language?'"
            lazy-rules :rules="[(val) => (val && val.length > maxChar) || maxChar + ' Characters Required']" counter
            v-if="formInput.gad[5] == 'No'" />
        </q-slide-transition>
      </div>
      <div v-show="listPages.find(obj => obj.label == 'overall').value == pageNum">
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
          v-model="formInput.five2" label="Comment" lazy-rules
          :rules="[(val) => (val && val.length > maxChar) || maxChar + ' Characters Required']" counter />
        <br>{{ questions.five3 }}
        <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
          v-model="formInput.five3" label="Comment" lazy-rules
          :rules="[(val) => (val && val.length > maxChar) || maxChar + ' Characters Field']" counter />
        <br>{{ questions.five4 }}
        <div class="radios">
          <ul style="list-style-type: none; padding: 0; margin: 0; ">
            <div style="display: inline-block">
              <li>
                <q-btn :outline="formInput.five4[0] != yesno_options[0]"
                  :unelevated="formInput.five4[0] == yesno_options[0]" :label="yesno_options[0]"
                  @click="formInput.five4[0] = yesno_options[0]"
                  :class="formInput.five4[0] == yesno_options[0] ? 'pulsate-bck' : ''"
                  :color="formInput.five4[0] == yesno_options[0] ? likertScaleColor[4] : 'indigo-7'"
                  style="margin-inline: 10px; margin-block: 5px" />
              </li>
            </div>
            <div style="display: inline-block">
              <li>
                <q-btn :outline="formInput.five4[0] != yesno_options[1]"
                  :unelevated="formInput.five4[0] == yesno_options[1]" :label="yesno_options[1]"
                  @click="formInput.five4[0] = yesno_options[1]"
                  :class="formInput.five4[0] == yesno_options[1] ? 'pulsate-bck' : ''"
                  :color="formInput.five4[0] == yesno_options[1] ? likertScaleColor[1] : 'indigo-7'"
                  style="margin-inline: 10px; margin-block: 5px" />
              </li>
            </div>
          </ul>
        </div>
        <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
          v-model="formInput.five4[1]" label="Comment" lazy-rules
          :rules="[(val) => (val && val.length > maxChar) || maxChar + ' Characters Required']" counter />
        <br>{{ questions.five5 }}
        <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
          v-model="formInput.five5" label="Comment" lazy-rules
          :rules="[(val) => (val && val.length > maxChar) || maxChar + ' Characters Required']" counter />
        <br>{{ questions.five6 }}
        <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields-overall"
          v-model="formInput.five6" label="Comment" lazy-rules
          :rules="[(val) => (val && val.length > maxChar) || maxChar + ' Characters Required']" counter />
      </div>
      <div class="button-container">
        <!-- for testing pre input data -->
        <!-- <q-btn @click="testSubmit()" label="test" /> -->
        <div class="radios" style="width: 100%;">
          <div v-show="pageNum > 1" style="width: 25%;">
            <q-btn label="Back" @click="pageNum--" color="teal" class="button-submit" style="width: 100%;"></q-btn>
          </div>
          <div v-show="listPages.find(obj => obj.label == 'overall').value > pageNum" style="width: 25%;  ">
            <q-btn label="Next" @click="pageNum++, scrollToElement('#topElement')" color="teal" class="button-submit"
              style="width: 100%; height: 12%"
              :disabled="(listPages.find(obj => obj.label == 'af').value == pageNum && formInput.af.filter(v => v).length < 6) ||
                (listPages.find(obj => obj.label == 'c').value == pageNum && formInput.c.filter(v => v).length < 5) ||
                (listPages.find(obj => obj.label == 'q').value == pageNum && formInput.q.filter(v => v).length < 7) ||
                (listPages.find(obj => obj.label == 'org').value == pageNum && formInput.org.filter(v => v).length < 7) ||
                (listPages.find(obj => obj.label == 'out').value == pageNum && formInput.out.filter(v => v).length < 7) ||
                (listPages.find(obj => obj.label == 'romero').value == pageNum && formInput.romero.filter(v => v).length < 5) ||
                (listPages.find(obj => obj.label == 'cangrejo').value == pageNum && formInput.cangrejo.filter(v => v).length < 5) ||
                // (listPages.find(obj => obj.label == 'biyo').value == pageNum && formInput.biyo.filter(v => v).length < 5) ||
                // (listPages.find(obj => obj.label == 'acala').value == pageNum && formInput.acala.filter(v => v).length < 5) ||
                (listPages.find(obj => obj.label == 'cornelio').value == pageNum && formInput.cornelio.filter(v => v).length < 5) ||
                (listPages.find(obj => obj.label == 'chua').value == pageNum && formInput.chua.filter(v => v).length < 5) ||
                (listPages.find(obj => obj.label == 'bulante').value == pageNum && formInput.bulante.filter(v => v).length < 5) ||
                (listPages.find(obj => obj.label == 'gad').value == pageNum && formInput.gad.filter(v => v).length < 7)">
            </q-btn>
          </div>
        </div>
        <div class="button-container" style="width: 100%;"
          v-show="listPages.find(obj => obj.label == 'overall').value == pageNum">
          <q-btn @click="submitResponse()" label="submit" color="primary" class="button-submit"></q-btn>
        </div>
      </div>
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
        <b>SLC 2025</b> experience has been successfully <br />concluded.
        An email will be sent to you containing<br />
        your proof of evaluation within a few minutes. <br /> <br />
        Please present the received email to your coordinator.

      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="green" @click="verify = false, refreshPage()" v-close-popup />
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

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px; white-space: pre;">
        {{ errMessage }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" v-close-popup @click="verify = false, refreshPage()" />
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

          <q-btn v-close-popup label="I Agree" color="green-6" class="q-mb-xl" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="registrationClosed" persistent>
    <q-card style="min-width: 350px" class="prompt">
      <q-card-section class="q-pb-none text-center">
        <q-icon style="color: #3948ab85" name="error" size="70px" />
      </q-card-section>
      <q-card-section class="q-pa-md text-center">
        <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
        Submissions are currently closed!
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="grey" @click="refreshPage()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { LocalStorage, useQuasar, useMeta } from "quasar";
import { ref, reactive } from 'vue';
import {
  axiosInit
} from '../components/DefineInitials.vue';

const metaData = {
  title: 'SLC Evaluation',
}

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
  // biyo: [null],
  gad: [null],
  five1: null,
  five2: null,
  five3: null,
  five4: [null],
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
const pageNum = ref(1)
const alreadySubmitted = ref(null)
const attended = ref(null)
const index = ref(null)
const dataPolicyMenu = ref(null)
const errMessage = ref(null)

const registrationClosed = ref(null)

const refreshPage = () => {
  location.reload()
};

const scrollToElement = (el) => {
  const myDiv = document.querySelector(el);
  myDiv.scrollTo({ top: 0, behavior: 'smooth' })
}


const sendOTP = () => {
  pleaseWait.value = true;
  axiosInit
    .get('slc/record/checkEmailforEval.php?spas_id=' + formInput.spas_id)
    .then(function (response) {
      pleaseWait.value = false;
      if (response.data.restrictEval === true)
        registrationClosed.value = response.data.restrictEval
      else if (response.data.dupe === true) {
        alreadySubmitted.value = true
      } else if (response.data.attended === false) {
        attended.value = true;
      } else if (response.data.success === true) {
        verify.value = response.data.success;
      } else {

        errorWarning.value = true;
      }
    });
};

export default {
  beforeMount() {
    if (LocalStorage.getItem('formInput') != null) {
      let obj = LocalStorage.getItem('formInput')
      Object.keys(obj).forEach(function (item) {
        formInput[item] = obj[item]
      })
    }
  },
  setup() {
    useMeta(metaData)
    const $q = useQuasar();
    const conformeCheck = ref(false)
    const maxChar = ref(40)

    const toFormData = (obj) => {
      const formData = new FormData();
      for (const key in obj) {
        formData.append(key, obj[key]);
      }
      return formData;
    };

    return {
      scrollToElement,
      toFormData,
      sendOTP,
      refreshPage,
      errMessage,
      registrationClosed,
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
      conformeCheck,
      errMessage,
      testSubmit() {
        verify.value = true
        pageNum.value = 12
        formInput.spas_id = 'U-2022-16-06704'
        formInput.af = [1, 2, 3, 4, 5, 1]
        formInput.c = [1, 2, 3, 4, 5]
        formInput.q = [1, 2, 3, 4, 5, 1, 2]
        formInput.org = [1, 2, 3, 4, 5, 1, 2]
        formInput.out = [1, 2, 3, 4, 5, 1, 2]
        formInput.romero = [1, 2, 3, 4, 5]
        formInput.cornelio = [1, 2, 3, 4, 5]
        formInput.cangrejo = [1, 2, 3, 4, 5]
        formInput.chua = [1, 2, 3, 4, 5]
        formInput.bulante = [1, 2, 3, 4, 5]
        formInput.gad = ['Gender-Sensitive', 'Yes', 'N/A', 'Yes', 'N/A', 'Yes', 'N/A']
        formInput.five1 = 5
        formInput.five2 = "yayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasd"
        formInput.five3 = "yayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasd"
        formInput.five4[0] = "Yes"
        formInput.five4[1] = "yayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasd"
        formInput.five5 = "yayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasd"
        formInput.five6 = "yayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasdyayasd"
      },
      changePage(page) {
        pageNum = listPages.filter(obj => obj.label == page).value
      },
      listPages: [
        { label: 'af', value: 1 },
        { label: 'c', value: 2 },
        { label: 'q', value: 3 },
        { label: 'org', value: 4 },
        { label: 'out', value: 5 },
        { label: 'romero', value: 6 },
        { label: 'cornelio', value: 7 },
        { label: 'cangrejo', value: 8 },
        // { label: 'biyo', value: 9 },
        { label: 'chua', value: 9 },
        { label: 'bulante', value: 10 },
        { label: 'gad', value: 11 },
        { label: 'overall', value: 12 },
        // { label: 'acala', value: 10 },
      ],
      maxChar,
      radio_val: [5, 4, 3, 2, 1],
      gad_options: ['Gender-Blind', 'Gender-Sensitive', 'Gender-Responsive'],
      yesno_options: ['Yes', 'No'],
      gad_colors: ['pink-5', 'purple-7', 'deep-purple-6'],
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
          "6. Organizers were polite and sincere in dealing with the concernse of the participants. ",
          "7. The security and welfare of the participants were considered in the conduct of the activities.",

        ],
        out: [
          "1. The objectives of the leadership camp were achieved. ",
          "2. I gained new and important skills and knowledge from the activities. ",
          "3. The topics were interesting, useful, and transformative. ",
          "4. The training was a great avenue for fostering camaraderie and solidarity among science scholars.",
          "5. The activity taught me to fully understand and act on my responsibilities as a government scholar.  ",
          "6. The activity was effective at encouraging scholars to embody the core values of professional excellence, social responsibility, and servant leadership.  ",
          "7. The training has enriched my leadership and organizational skills.  ",

        ],
        speakers: [
          "1. Displayed thorough knowledge of, and provided relevant insights on, the topic discussed.",
          "2. Thoroughly explained and processed the learning activities throughout the training. ",
          "3. Created a good learning environment, sustained the attention of the participants, and encouraged their participation in the duration of the activity.",
          "4. Managed their time well.",
          "5. Demonstrated keenness to the participants’ needs and other requirements related to the activity. ",

        ],
        gad: [
          '1.	Rate how gender was recognized in the camp with regard to the topics discussed, access to opportunities given to the participants, as well as the goals and objectives the activity aims to achieve.',
          '2.	Have you had any experience during the camp that hindered effective facilitation of learning and comfortable stay in the venue due to your sex assigned at birth, sexual orientation, gender identity, or gender expression?',
          '3.	Have you had any experience of feeling  being unsafe in the presence of any hotel staff, coordinators, facilitators, and co-scholars?',
          '4.	Did the camp foster a safe space for your expressions and identities, as well as the observance of gender-fair language?'
        ],
        five1: "1.	How would you rate the overall conduct of the leadership camp?",
        five2: "2. What important insight/s did you get from the training?  ",
        five3: "3. Please indicate your comments/suggestions for improvement, if there is any. ",
        five4: "4. Will you recommend this leadership camp in the future? Why?",
        five5: "5.	Please identify and describe specific skills and knowledge that you learned from the leadership camp. ",
        five6: "6.	Please indicate any possible training to be organized under the Patriot Program that you wish to attend in the future."
      },
      dataPolicyText: `This form collects your personal information and post-evaluation of the activity for future improvements and research study.  The DOST-SEI, in compliance with R.A. 10173, implements reasonable and appropriate organizational, physical, and technical security measures for the protection of your personal information collected. Only the DOST-SEI employees are permitted to have access to the collected information. They shall be guided by the security measures provided in handling all personal information collected. Personal information collected is processed, stored, and later on disposed of via shredding and permanently deleted in our electronic files in accordance with R.A No. 9470 otherwise known as the National Archive of the Philippines Act of 2007. In case of a data breach, DOST-SEI shall notify you and inform the National Privacy Commission (NPC) in accordance with NPC Circular 16-03 on Personal Data Breach Management. Additionaly, agreeing with this policy allows DOST - SEI to take any images, videos or graphics taken during conduct for publication and reporting purposes. 

        RIGHTS OF THE DATA SUBJECT

        As the Data Subject, you have the right to be informed of the personal information being collected, processed, and stored by DOST-SEI as well as to access, object, rectify, and block the same. 

        CONTACT DETAILS OF THE DOST-SEI DATA PRIVACY OFFICER (DPO) 

        For questions or concerns, you may contact our Data Protection Officer through the following details:

        Direct Line: +63 2 8710 7462

        E-mail: dpo@sei.dost.gov.ph`,
      submitResponse() {
        $q.localStorage.set('formInput', formInput)
        pleaseWait.value = true
        if (
          formInput.af.filter(v => v).length < 6 ||
          formInput.c.filter(v => v).length < 5 ||
          formInput.q.filter(v => v).length < 7 ||
          formInput.org.filter(v => v).length < 7 ||
          formInput.out.filter(v => v).length < 7 ||
          !formInput.five1 ||
          formInput.five2.length < maxChar.value ||
          formInput.five3.length < maxChar.value ||
          formInput.five4.filter(v => v).length.value < 2 ||
          formInput.five4[1].length < maxChar.value ||
          formInput.five5.length < maxChar.value ||
          formInput.five6.length < 10
        ) {
          pleaseWait.value = false
          allRequired.value = true
        } else {
          const dlInsert = toFormData(formInput);
          axiosInit.post(
            "slc/record/submitEval.php", dlInsert, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          }
          ).then(function (response) {
            pleaseWait.value = false
            if (response.data.success) {
              congrats.value = true
              $q.localStorage.clear()
            }
            else {
              errorWarning.value = true
              errMessage.value = 'Please try again'
            }
          }).catch(function (error) {
            pleaseWait.value = false
            errorWarning.value = true
            errMessage.value = 'Your session has expired. Please reload this page. \n Your answers to the questionnaire has been saved'
          })
        }
      }
    }
  }
}

</script>
