<template>
  <div v-show="$q.localStorage.getItem('logIn') == false || $q.localStorage.getItem('logIn') == null">
    <q-card class="login-container">
      <q-form>
        <q-card-section>
          <div class="forms-container">
            <q-input v-model="formInput.username" label="Username" />
            <q-input v-model="formInput.password" :type="isPwd ? 'password' : 'text'" label="Password">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions vertical>
          <q-btn color="indigo-7" @click="logInUser()">Log In</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
  <div>
    <q-layout view="lHh Lpr lFf" v-show="$q.localStorage.getItem('logIn')">
      <q-header elevated>
        <q-toolbar>
          <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

          <q-toolbar-title>
            SLC 2024 Dashboard
          </q-toolbar-title>

        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-list>
          <q-item-label header>
            Navigation
          </q-item-label>
          <q-item>
            <q-btn @click="navigationToggle('home')" style="width: 100%; height: 15%;" flat rounded align="left">
              <q-icon left name="home" />
              <div>Home</div>
            </q-btn>
          </q-item>
          <q-item>
            <q-btn @click="navigationToggle('masterList')" style="width: 100%; height: 15%" flat rounded align="left">
              <q-icon left name="checklist" />
              <div>Master List</div>
            </q-btn>
          </q-item>
          <q-item>
            <q-btn @click="navigationToggle('attendance')" style="width: 100%; height: 15%" flat rounded align="left">
              <q-icon left name="groups_2" />
              <div>Attendance</div>
            </q-btn>
          </q-item>
          <q-item>
            <q-btn @click="navigationToggle('inOut')" style="width: 100%; height: 15%" flat rounded align="left">
              <q-icon left name="double_arrow" />
              <div>In and Out</div>
            </q-btn>
          </q-item>
          <q-item>
            <q-btn @click="navigationToggle('pretest')" style="width: 100%; height: 15%" flat rounded align="left">
              <q-icon left name="quiz" />
              <div>Pre-Test Responses</div>
            </q-btn>
          </q-item>
          <q-item>
            <q-btn @click="navigationToggle('eval')" style="width: 100%; height: 15%" flat rounded align="left">
              <q-icon left name="sensor_occupied" />
              <div>Eval Responses</div>
            </q-btn>
          </q-item>
          <q-item /><q-item />
          <q-item>
            <q-btn label="Log Out" @click="logOutUser()" style="width: 100%; height: 15%" />
          </q-item>

          <q-separator />
        </q-list>
      </q-drawer>

      <q-page-container v-show="$q.localStorage.getItem('logIn') && homeMenu">
        <div class="table-container">
          <q-table title="Registrants" :rows="registrant_rows" :columns="registrant_columns" :row-key="registrant_rows.id"
            :pagination="paginationConfig" :filter="filter">
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" color="primary" v-model="filter" label="Search"
                style="margin-right: 50px">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <!-- <q-btn
                color="primary"
                icon-right="verified_user"
                label="Send Cert"
                no-caps
                @click="sendCertMenu = true"
                style="margin-right: 25px"
              /> -->
              <q-btn color="primary" icon-right="boy" label="Manual Register" no-caps
                @click="showUpdateDialog('REGISTER')" style="margin-right: 25px" />
              <q-btn color="primary" icon-right="archive" label="Export to csv" no-caps
                @click="showExportDialog(registrant_columnsExport, registrant_rows.filter(obj => obj.attending == true), 'Registrants Records')" />
            </template>
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
                <q-th auto-width>
                  Eval
                </q-th>
                <q-th auto-width>
                  Send Email
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td>
                  <q-btn color="blue-8" :icon="props.expand ? 'remove' : 'preview'"
                    @click="props.expand = !props.expand" />
                </q-td>
                <q-td>
                  <q-toggle v-model="props.row.attending"
                    @click="updateAttending(props.row.email, props.row.attending, 'REGISTER')" />
                  <!-- {{props.attending}} -->
                </q-td>
                <q-td v-if="props.cols.name != 'attending'" v-for="col in props.cols.slice(1)" :key="col.name"
                  :props="props">
                  {{ col.value }}
                  <!-- {{ col }} -->
                </q-td>
                <q-td align="center">
                  <q-icon :name="props.row.doneEvaluation ? 'check' : 'close'"
                    :color="props.row.doneEvaluation ? 'green' : 'red'" class="cursor-pointer" size="xl" />
                </q-td>
                <q-td align="center">
                  <q-btn color="blue-8" icon="send"
                    @click="resendQR(props.row.email, props.row.fname, props.row.lname, props.row.region)" />
                </q-td>
              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <div class="text-left">Full Name: {{ props.row.fname + ' ' + props.row.mname + ' ' + props.row.lname +
                    ' ' + props.row.suffix }}</div>
                  <div class="text-left">Sex: {{ props.row.sex }}</div>
                  <div class="text-left">Birthdate: {{ props.row.birthdate }}</div>
                  <div class="text-left">Phone Number: {{ props.row.phoneNumber }}</div>
                  <div class="text-left" v-if="(props.row.university != 'null' && props.row.university != null)">
                    University: {{ props.row.university }}</div>
                  <div v-show="props.row.participantType == 'Scholar'">
                    <div class="text-left">Course: {{ props.row.course }}</div>
                    <div class="text-left">Year Level: {{ props.row.yearLevel }}</div>
                    <div class="text-left">Year Award: {{ props.row.yearAward }}</div>
                  </div>
                  <div v-show="props.row.participantType == 'Coordinator'">
                    <div class="text-left">Position: {{ props.row.position }}</div>
                  </div>
                  <div class="text-left"><q-btn @click="showUpdateDialog('UPDATE', props.row)" label="Update Info" />
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-page-container>
      <q-page-container v-show="$q.localStorage.getItem('logIn') && masterListMenu">
        <div class="table-container">
          <q-table flat bordered title="Master List" :rows="masterList_rows" :columns="masterList_columns"
            :row-key="masterList_rows.id" :pagination="paginationConfig" :filter="filter">
            <template v-slot:top-right>
              <q-file v-model="formInput.importMasterList" dense debounce="300" color="primary" label="Import csv"
                style="margin-right: 50px">
                <template v-slot:after>
                  <q-btn @click="submitImportMasterList()" icon="add" />
                </template>
              </q-file>
              <q-input borderless dense debounce="300" color="primary" v-model="filter" label="Search"
                style="margin-right: 50px">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn color="primary" icon-right="archive" label="Export to csv" no-caps
                @click="showExportDialog(masterList_columns, masterList_rows, 'Master List')" />
            </template>
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width>
                  Update
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
                <!-- <q-th  auto-width>
                    Delete
                  </q-th> -->
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :prop="props">
                <q-td>
                  <q-btn icon="update" color="blue-7" @click="showUpdateDialog('MASTER', props.row)" />
                </q-td>
                <q-td center auto-width>
                  <q-toggle v-model="props.row.attending"
                    @click="updateAttending(props.row.email, props.row.attending, 'MASTER')" />
                </q-td>
                <q-td v-for="col in props.cols.slice(1)" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-page-container>
      <q-page-container v-show="$q.localStorage.getItem('logIn') && inOutMenu">
        <q-card class="evaluation" style="
            -webkit-border-radius: 60px;
            -moz-border-radius: 60px;
            border-radius: 60px;
            height: 40vh;
            min-width: 300px;
            width: 20vw;
            margin-top: 1.5vh;
            overflow: hidden;
            padding: 0;
            border: 10px solid rgba(255, 255, 255, 0);
          " id="topElement">
          <div style="margin: auto; padding: 20px;">
            <q-select outlined rounded color="indigo-7" label-color="indigo-7" v-model="attendanceConduct"
              class="text-fields" label="Batch" :options="attendanceConduct_options">
              <template v-slot:before>
                <q-icon style="color: #3948ab85" name="school" size="lg" />
              </template>
            </q-select>
            <q-select outlined rounded color="indigo-7" label-color="indigo-7" v-model="attendanceDay" class="text-fields"
              label="Conduct" :options="attendanceDay_options">
              <template v-slot:before>
                <q-icon style="color: #3948ab85" name="school" size="lg" />
              </template>
            </q-select>
          </div>
          <div class="button-container">
            <q-btn label="Refresh" @click="navigationToggle('inOut')" color="primary" />
          </div>

        </q-card>
        <div class="table-container">
          <q-table flat bordered title="Who's In, Who's Out?" :rows="inOut_rows" :columns="inOut_columns"
            :row-key="inOut_rows.id" :pagination="paginationConfig" :filter="filter">
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" color="primary" v-model="filter" label="Search"
                style="margin-right: 50px">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn color="primary" icon-right="archive" label="Generate Groupings" no-caps
                @click="generateGroupings(inOut_columns, inOut_rows, 'Attendance-Groupings')"
                style="margin-right: 25px" />
              <q-btn color="primary" icon-right="directions_walk" label="Mass Out" no-caps @click="attendanceMassOut()" />
            </template>
          </q-table>
        </div>
      </q-page-container>
      <q-page-container v-show="$q.localStorage.getItem('logIn') && attendanceMenu">
        <q-card class="evaluation" style="
            -webkit-border-radius: 60px;
            -moz-border-radius: 60px;
            border-radius: 60px;
            height: 90vh;
            margin-top: 1.5vh;
            overflow: hidden;
            padding: 0;
            border: 10px solid rgba(255, 255, 255, 0)
          " id="topElement" :class="attendanceActive ? 'isAttendanceActive' : ''">
          <div>
            <q-input v-model="qrcode" label="Scan the QR" @keydown.enter="checkAttendance(sev)"
              @focus="attendanceActive = true, ranNum = Math.floor(Math.random() * 41)"
              @blur="attendanceActive = false, ranNum = Math.floor(Math.random() * 41)" style="
              opacity: 0;
              position: absolute;
              height: 80%;
              width: 100%;
            " />
          </div>
          <transition-group appear :enter-active-class="'animated ' + randomEntrance[ranNum]"
            :leave-active-class="'animated ' + randomExit[ranNum]">
            <div v-if="attendanceActive == true && attendanceChecked == false" class="attendance-container"
              style="position: absolute; z-index:-100">
              <span class="attendance-text">
                <h1>
                  Please scan the QR.
                </h1>
              </span>
            </div>
            <div v-if="attendanceActive == false && attendanceChecked == false" class="attendance-container"
              style="position: absolute; z-index:-100">
              <span class="attendance-text">
                <h1>
                  Click here
                </h1>
              </span>
            </div>
            <div v-if="attendanceChecked == 'FIRST'" class="attendance-container"
              style="position: absolute; z-index:-100">
              <span class="attendance-text">
                <h1>
                  Hello {{ attendanceName }},
                  <br><q-icon name="celebration" size="xl" color="indigo-7" /> <q-icon name="celebration" size="xl"
                    color="indigo-7" /> <q-icon name="celebration" size="xl" color="indigo-7" /><br>
                  Welcome to<br>SLC 2024!
                </h1>
              </span>
            </div>
            <div v-if="attendanceChecked == 'IN'" class="attendance-container" style="position: absolute; z-index:-100">
              <span class="attendance-text">
                <h1>
                  Welcome Back,<br>{{ attendanceName }}!
                </h1>
              </span>
            </div>
            <div v-if="attendanceChecked == 'OUT'" class="attendance-container" style="position: absolute; z-index:-100">
              <span class="attendance-text">
                <h1>
                  See You Again,<br>{{ attendanceName }}!
                </h1>
              </span>
            </div>
            <div v-if="attendanceChecked == 'FAIL'" class="attendance-container" style="position: absolute; z-index:-100">
              <span class="attendance-text">
                <h1>
                  QR Code data<br>mismatch.
                </h1>
              </span>
            </div>
            <div v-if="attendanceChecked == 'qrUnread'" class="attendance-container"
              style="position: absolute; z-index:-100">
              <span class="attendance-text">
                <h1>
                  QR Code<br>unrecognized.
                </h1>
              </span>
            </div>
            <div v-if="attendanceChecked == 'selectNull'" class="attendance-container"
              style="position: absolute; z-index:-100">
              <span class="attendance-text">
                <h1>
                  Scroll down to choose<br>conduct and date.
                </h1>
              </span>
            </div>
            <div v-if="attendanceChecked == 'regionMismatch'" class="attendance-container"
              style="position: absolute; z-index:-100">
              <span class="attendance-text">
                <h1>
                  Region and conduct<br>mismatch.
                </h1>
              </span>
            </div>
          </transition-group>
        </q-card>
        <q-card class="evaluation" style="
            -webkit-border-radius: 60px;
            -moz-border-radius: 60px;
            border-radius: 60px;
            height: 30vh;
            min-width: 300px;
            width: 20vw;
            margin-top: 5vh;
            overflow: hidden;
            padding: 0;
            border: 10px solid rgba(255, 255, 255, 0);
          " id="topElement">
          <div style="margin: auto; padding: 20px;">
            <q-select outlined rounded color="indigo-7" label-color="indigo-7" v-model="attendanceConduct"
              class="text-fields" label="Batch" :options="attendanceConduct_options">
              <template v-slot:before>
                <q-icon style="color: #3948ab85" name="school" size="lg" />
              </template>
            </q-select>
            <q-select outlined rounded color="indigo-7" label-color="indigo-7" v-model="attendanceDay" class="text-fields"
              label="Conduct" :options="attendanceDay_options">
              <template v-slot:before>
                <q-icon style="color: #3948ab85" name="school" size="lg" />
              </template>
            </q-select>
          </div>
        </q-card>
      </q-page-container>
      <q-page-container v-show="$q.localStorage.getItem('logIn') && pretestMenu">
        <div class="table-container">
          <q-table title="Pre-Test Responses" :rows="pretest_rows" :columns="pretest_columns" :row-key="pretest_rows.id"
            :pagination="paginationConfig" :filter="filter">
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" color="primary" v-model="filter" label="Search"
                style="margin-right: 50px">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn color="primary" icon-right="archive" label="Export to csv" no-caps
                @click="showExportDialog(pretest_columnsExport, pretest_rows, 'PreTest Responses')" />
            </template>
          </q-table>
        </div>
      </q-page-container>
      <q-page-container v-show="$q.localStorage.getItem('logIn') && evalMenu">
        <div class="table-container">
          <q-table title="Evaluation Responses" :rows="evaluation_rows" :columns="evaluation_columns"
            :row-key="evaluation_rows.id" :pagination="paginationConfig" :filter="filter">
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" color="primary" v-model="filter" label="Search"
                style="margin-right: 50px">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn color="primary" icon-right="archive" label="Export to csv" no-caps
                @click="showExportDialog(evaluation_columnsExport, evaluation_rows, 'Eval Responses')" />
            </template>
            <template v-slot:body-cell-evaldone="props">
              <q-td>
                <q-td align="center">
                  <!-- {{ props.row.doneeval }} -->
                  <q-icon :name="props.row.doneeval ? 'check' : 'close'" :color="props.row.doneeval ? 'green' : 'red'"
                    class="cursor-pointer" size="xl" />
                </q-td>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-page-container>
    </q-layout>
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
    <q-dialog v-model="congrats">
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
          Changes Applied
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="green" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="errorWarning">
      <q-card style="min-width: 350px" class="prompt">
        <q-card-section class="q-pb-none text-center">
          <q-icon style="color: #3948ab85" name="error" size="70px" />
        </q-card-section>
        <q-card-section class="q-pa-md text-center">
          <div style="font-family: Montserrat; font-size: 25px">
            Ooops!
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
          {{ errorMsg }}<br>
          Please try again
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="exportDialog">
      <q-card style="min-width: 650px" class="prompt">
        <q-card-section class="q-pa-md text-center uploads-container">
          <q-select v-model="exportByRegion" label="Region(s)" multiple :options="exportByRegion_column" />
          <div class="button-container">
            <q-btn label="Export" color="primary" @click="exportTable(column, row, exportByRegion, filename)" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showRegistrantUpdate">
      <q-card style="min-width: 950px" class="prompt">
        <q-card-section>
          <div class="form-container">
            <div v-show="pageNum == 1">
              <div class="left-container">
                <q-input outlined rounded v-model="formInput.email" type="email" :color="formColor"
                  :label-color="formColor" label="Email" :rules="[(val) => val.includes('@') || 'Only valid email']"
                  lazy-rules>
                  <template v-slot:before>
                    <q-icon style="color: #3948ab85" name="mail" size="lg" />
                  </template>
                </q-input>
                <q-input @input="val => { formInput.fName = val.toUpperCase() }" outlined rounded
                  v-model="formInput.fName" :color="formColor" :label-color="formColor" label="First Name"
                  hint="Name inputted will reflect on to be sent certificates"
                  :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>
                  <template v-slot:before>
                    <q-icon style="color: #3948ab85" name="person" size="lg" />
                  </template>
                </q-input>
                <q-input @input="val => { formInput.mName = val.toUpperCase() }" outlined rounded
                  v-model="formInput.mName" :color="formColor" :label-color="formColor" label="Middle Name"
                  hint="Put N/A if not applicable" :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>
                  <template v-slot:before>
                    <q-icon style="color: #3948ab85" name="people" size="lg" />
                  </template>
                </q-input>
                <q-input @input="val => { formInput.lName = val.toUpperCase() }" outlined rounded
                  v-model="formInput.lName" :color="formColor" :label-color="formColor" label="Last Name"
                  :rules="[(val) => val && val.length > 0 || 'Required']" lazy-rules>
                  <template v-slot:before>
                    <q-icon style="color: #3948ab85" name="diversity_3" size="lg" />
                  </template>
                </q-input>

              </div>
              <div class="right-container">
                <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.suffix"
                  label="Suffix" :options="suffix_options" emit-value map-options lazy-rules>
                  <template v-slot:before>
                    <q-icon style="color: #3948ab85" name="groups_3" size="lg" />
                  </template>
                  <template v-slot:append>
                    <q-icon name="close" @click="formInput.suffix = null" class="remove-selection"
                      v-show="formInput.univCity"></q-icon>
                  </template>
                </q-select>
                <q-input outlined rounded :color="formColor" :label-color="formColor" label="Bithdate"
                  v-model="formInput.birthDate" @click="$refs.birthdateProxy.show()" :rules="[
                    (val) => (val && val.length > 0) || 'Required Field',
                  ]">
                  <template v-slot:before>
                    <q-icon style="color: #3948ab85" name="cake" size="lg" />
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
                  <q-radio v-model="formInput.sex" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val=1
                    size="xl" color="indigo-7">
                    <q-icon style="color: #3948ab85" name="male" size="xl" />Male
                  </q-radio>
                  <q-radio v-model="formInput.sex" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val=2
                    size="xl" color="indigo-7">
                    <q-icon style="color: #3948ab85" name="female" size="xl" />Female
                  </q-radio>
                </div>
                <q-input rounded outlined v-model="formInput.phoneNumber" type="number" maxlength="11" :color="formColor"
                  :label-color="formColor" label="Phone Number" lazy-rules :rules="[
                    (val) =>
                      (val && val.length == 11) ||
                      '11 digit phone number only',
                  ]">
                  <template v-slot:before>
                    <q-icon style="color: #3948ab85" name="phone" size="lg" />
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
                    <q-icon style="color: #3948ab85" name="map" size="lg" />
                  </template>
                </q-select>
                <q-slide-transition :duration="700">
                  <div v-show="formInput.participant == 1 || (formInput.univRegion == 13 && formInput.participant == 2)">
                    <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.univCity"
                      use-input emit-value map-options input-debounce="0" label="City of your University"
                      :options="filtered_univCity" @filter="filter_univCity" behavior="menu" lazy-rules :rules="[
                        (val) => (val && val > 0) || 'Required Field',
                      ]"
                      v-show="formInput.participant == 1 || (formInput.participant == 2 && formInput.univRegion == 13)">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:before>
                        <q-icon style="color: #3948ab85" name="mode_of_travel" size="lg" />
                      </template>
                      <template v-slot:append>
                        <q-icon name="close" @click="formInput.univCity = null" class="remove-selection"
                          v-show="formInput.univCity"></q-icon>
                      </template>
                    </q-select>
                    <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.university"
                      use-input emit-value map-options input-debounce="0" label="University"
                      :options="filtered_university" @filter="filter_university" behavior="menu" lazy-rules :rules="[
                        (val) => (val && val > 0) || 'Required Field',
                      ]">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:before>
                        <q-icon style="color: #3948ab85" name="school" size="lg" />
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
                      @filter="filter_course" behavior="menu" lazy-rules :rules="[
                        (val) => (val && val > 0) || 'Required Field',
                      ]">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:before>
                        <q-icon style="color: #3948ab85" name="golf_course" size="lg" />
                      </template>
                      <template v-slot:append>
                        <q-icon name="close" @click="formInput.course = null" class="remove-selection"
                          v-show="formInput.course"></q-icon>
                      </template>
                    </q-select>
                    <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.yearLevel"
                      label="Year Level" :options="yearLevel_options" emit-value map-options lazy-rules :rules="[
                        (val) => (val && val > 0) || 'Required Field',
                      ]">
                      <template v-slot:before>
                        <q-icon style="color: #3948ab85" name="settings_input_composite" size="lg" />
                      </template>
                    </q-select>
                    <q-select outlined rounded :color="formColor" :label-color="formColor"
                      v-model="formInput.scholarProgram" label="Scholarship Program" :options="scholarProgram_options"
                      emit-value map-options lazy-rules :rules="[
                        (val) => (val && val > 0) || 'Required Field',
                      ]">
                      <template v-slot:before>
                        <q-icon style="color: #3948ab85" name="auto_graph" size="lg" />
                      </template>
                    </q-select>
                    <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.yearAward"
                      label="Year Award" :options="yearAward_options" emit-value map-options lazy-rules :rules="[
                        (val) => (val && val > 0) || 'Required Field',
                      ]">
                      <template v-slot:before>
                        <q-icon style="color: #3948ab85" name="verified_user" size="lg" />
                      </template>
                    </q-select>
                    <q-input outlined rounded v-model="formInput.association" :color="formColor" :label-color="formColor"
                      label="Associations" hint="e.g Member/President of Scholars Club"
                      :rules="[(val) => val.length > 0 || 'Required']" lazy-rules>
                      <template v-slot:before>
                        <q-icon style="color: #3948ab85" name="sort" size="lg" />
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
                        <q-icon style="color: #3948ab85" name="sort" size="lg" />
                      </template>
                    </q-input>
                    <q-input outlined rounded v-model="formInput.position" :color="formColor" :label-color="formColor"
                      label="Position" :rules="[(val) => val.length > 0 || 'Required']" lazy-rules
                      hint="e.g. Senior Science Research Specialist">
                      <template v-slot:before>
                        <q-icon style="color: #3948ab85" name="sort" size="lg" />
                      </template>
                    </q-input>
                  </div>
                </q-slide-transition>
              </div>
            </div>
            <div class="button-container">
              <div class="radios" style="width: 100%;">
                <div v-show="pageNum > 1" style="width: 25%;">
                  <q-btn label="Back" @click="pageNum--" color="teal" class="button-submit" style="width: 100%;"></q-btn>
                </div>
                <div v-show="pageNum < 2 && !(pageNum == 2 && formInput.participant == 2)" style="width: 25%;">
                  <q-btn label="Next" @click="pageNum++, scrollToElement('#topElement')" color="teal"
                    class="button-submit" style="width: 100%; height: 12%"></q-btn>
                </div>
              </div>
              <div class="button-container" style="width: 100%;"
                v-show="pageNum == 2 || (pageNum == 2 && formInput.participant == 2)">
                <q-btn label="submit" type="submit" color="primary" class="button-submit"
                  @click="submitResponse(action, idNum), navigationToggle('home')" v-close-popup />
              </div>
              <q-btn label="test" @click="testSubmit()" />
            </div>
            <q-separator />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showMasterListUpdate">
      <q-card style="min-width: 950px" class="prompt">
        <q-card-section>
          <div class="form-container">
            <q-input outlined rounded v-model="formInput.fullName" :color="formColor" :label-color="formColor"
              label="Full Name" :rules="[(val) => val.length > 0 || 'Required']" lazy-rules>
              <template v-slot:before>
                <q-icon style="color: #3948ab85" name="mail" size="lg" />
              </template>
            </q-input>
            <q-input outlined rounded v-model="formInput.email" type="email" :color="formColor" :label-color="formColor"
              label="Email" :rules="[(val) => val.includes('@') || 'Only valid email']" lazy-rules>
              <template v-slot:before>
                <q-icon style="color: #3948ab85" name="mail" size="lg" />
              </template>
            </q-input>
            <q-select outlined rounded :color="formColor" :label-color="formColor" v-model="formInput.univRegion"
              label="Region of your School" :options="region_options" emit-value map-options lazy-rules>
              <template v-slot:before>
                <q-icon style="color: #3948ab85" name="map" size="lg" />
              </template>
            </q-select>
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
            <q-select outlined rounded color="indigo-7" label-color="indigo-7" v-model="formInput.conduct"
              class="text-fields" label="Batch" :options="attendanceConduct_options">
              <template v-slot:before>
                <q-icon style="color: #3948ab85" name="school" size="lg" />
              </template>
            </q-select>
            <div class="button-container">
              <q-btn label="submit" type="submit" color="primary" class="button-submit"
                @click="submitResponse(action, idNum), navigationToggle('masterList')" v-close-popup />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
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
    <q-dialog v-model="notListed" persistent>
      <q-card style="min-width: 350px" class="prompt">
        <q-card-section class="q-pb-none text-center">
          <q-icon style="color: #3948ab85" name="error" size="70px" />
        </q-card-section>
        <q-card-section class="q-pa-md text-center">
          <div style="font-family: Montserrat; font-size: 25px">Ooops!</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
          Email not enlisted
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="sendCertMenu" persistent>
      <q-card style="min-width: 350px" class="prompt">
        <q-card-section class="q-pb-none text-center">
          <q-icon style="color: #3948ab85" name="error" size="70px" />
        </q-card-section>
        <q-card-section class="q-pa-md text-center">
          <div style="font-family: Montserrat; font-size: 25px">Input email of recipient</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center" style="font-family: Montserrat; font-size: 15px">
          <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields" v-model="certificateEmail"
            label="Search For Email">
            <template v-slot:before>
              <q-icon style="color: #3948ab85" name="unsubscribe" size="lg" />
            </template>
          </q-input>
          <q-input rounded outlined color="indigo-7" label-color="indigo-7" class="text-fields" v-model="certificateName"
            label="Name to appear on certificate">
            <template v-slot:before>
              <q-icon style="color: #3948ab85" name="unsubscribe" size="lg" />
            </template>
          </q-input>
          <div class="button-container">
            <q-btn unelevated rounded size="lg" label="Send" @click="sendCertificate()" color="primary"
              style="width: 50%" />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { exportFile, useQuasar, QSpinnerGrid, Notify } from 'quasar'
import axios from 'axios'
import {
  yearAward_options,
  yearLevel_options,
  scholarProgram_options,
  suffix_options,
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
  region_options,
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
  evaluation_columnsExport
} from '../components/DefineInitials.vue'

const pleaseWait = ref(null)
const congrats = ref(null)
const errorWarning = ref(null)
const filter = ref(null)
const isPwd = ref(true)
const showRegistrantUpdate = ref(false)
const homeMenu = ref(false)
const manualRegistration = ref(false)
const oldEmail = ref(null)
const updateOldEmail = ref(false)
const oldEmails = ref(null)
const renewEmailTab = ref(null)
const pretestMenu = ref(false)
const courses = ref(null)
const universities = ref(null)
const regions = ref(null)
const emailReady = ref(false)
const notListed = ref(false)
const sendCertMenu = ref(false)
const certificateEmail = ref(null)
const certificateName = ref(null)
const inOutMenu = ref(true)
const evalMenu = ref(false)
const attendanceMenu = ref(false)
const qrcode = ref(null)
const attendanceChecked = ref(false)
const ranNum = ref(null)
const attendanceName = ref(null)
const attendanceActive = ref(false)
const exportDialog = ref(null)
const exportByRegion = ref(null)
const registrant_columnsExport = ref(null)
const attendanceConduct = ref('NCR 1')
const attendanceDay = ref('Day 1')
const masterListMenu = ref(false)
const showMasterListUpdate = ref(false)
const errorMsg = ref(null)

const checkFilled = (val) => {
  if (val.length < 0) {
    return false;
  } else {
    return true;
  }
};


const inputUpdate = reactive({
  id: null,
  newEmail: null
})

const registrant_rows = ref([
  {
    fname: 'initial',
    lname: 'value',
    region: '1',
    university: 'Tralala',
    email: 'bomba',
    registerdate: 'Sep 16, 2001'
  }
])

const masterList_rows = ref([
  {
    fname: 'initial',
    lname: 'value',
    region: '1',
    university: 'Tralala',
    email: 'bomba',
    registerdate: 'Sep 16, 2001'
  }
])

const inOut_rows = ref([
  {
    fullName: 'initial',
    inout: 'IN'
  }
])

const pretest_rows = ref([
  {
    id: '1',
    fullname: 'initial',
    type: 'value',
    region: '1',
    email: 'bomba',
    emailsent: 'false'
  }
])

const evaluation_rows = ref([
  {
    fullname: 'initial',
    type: 'value',
    region: '1',
    email: 'bomba',
    emailsent: 'false'
  }
])

const sendCertificate = () => {
  pleaseWait.value = true
  axiosInit.get('/manualSendCertificate.php?email=' +
    certificateEmail.value +
    '&name=' +
    certificateName.value
  ).then(function (response) {
    if (response.data.success == true) {
      pleaseWait.value = false
      congrats.value = true
    } else {
      pleaseWait.value = false
      errorWarning.value = true
    }
  })
}


const navigationToggle = (menuToToggle) => {
  pleaseWait.value = true

  homeMenu.value = false
  masterListMenu.value = false
  inOutMenu.value = false
  attendanceMenu.value = false
  pretestMenu.value = false
  evalMenu.value = false
  if (menuToToggle == 'home') {
    pleaseWait.value = false
    homeMenu.value = true
    axiosInit.get(
      '/getdata/getRegistrants.php'
    ).then(function (response) {
      if (response.data) {
        registrant_rows.value = response.data.registrant_row
      }
    })
  }
  else if (menuToToggle == 'masterList') {
    pleaseWait.value = false
    masterListMenu.value = true
    axiosInit.get(
      '/getdata/getMasterList.php'
    ).then(function (response) {
      if (response.data) {
        masterList_rows.value = response.data.masterList
      }
    })
  }
  else if (menuToToggle == 'attendance') {
    pleaseWait.value = false
    attendanceMenu.value = true
  }
  else if (menuToToggle == 'eval') {
    pleaseWait.value = false
    evalMenu.value = true
    axiosInit.get(
      '/getdata/getEvalResponses.php'
    ).then(function (response) {
      if (response.data) {
        evaluation_rows.value = response.data.evalResponse
        console.log(evaluation_rows)
      }
    })
  }
  else if (menuToToggle == 'pretest') {
    pleaseWait.value = false
    pretestMenu.value = true
    axiosInit.get(
      '/getdata/getPreTestResponses.php'
    ).then(function (response) {
      if (response.data) {
        pretest_rows.value = response.data.preTestReponse
      }
    })
  }
  else if (menuToToggle == 'inOut') {
    pleaseWait.value = false
    inOutMenu.value = true
    axiosInit.get(
      '/getdata/getInOut.php?conduct=' +
      attendanceConduct.value +
      '&day=' +
      attendanceDay.value
    ).then(function (response) {
      if (response.data) {
        inOut_rows.value = response.data.attendeesInOut
      }
    })
  }
}


const masterList = ref(null)
const baseURL = import.meta.env.DEV ? "http://localhost/SLC_api" : "/SLC_api"

const axiosInit = axios.create({
  baseURL,
  withCredentials: true
})

const renewEmail = (email) => {
  updateOldEmail.value = false
  renewEmailTab.value = true
}

const toFormData = (obj) => {
  const formData = new FormData()
  for (const key in obj) {
    formData.append(key, obj[key])
  }
  return formData
}

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

export default defineComponent({
  name: 'MainLayout',

  beforeMount() {
    pleaseWait.value = true
    axiosInit.get(
      '/getdata/getRegistrants.php'
    ).then(function (response) {
      if (response.data) {
        pleaseWait.value = false
        registrant_rows.value = response.data.registrant_row
        registrant_columnsExport.value = response.data.registrant_columnsExport
      }
    })
  },

  mounted() {

  },

  setup() {
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()

    const checkAttendance = (ev) => {
      $q.loading.show({
        spinner: QSpinnerGrid,
        spinnerColor: 'indigo-4',
        spinnerSize: 300,
        backgroundColor: 'blue-4',
        // message: 'LET IT COOK!!!',
      })
      ranNum.value = Math.floor(Math.random() * 41)
      axiosInit.get(
        '/record/checkAttendance.php?qrcode=' +
        qrcode.value +
        '&conduct=' +
        attendanceConduct.value +
        '&day=' +
        attendanceDay.value
      ).then(function (response) {
        qrcode.value = null
        setTimeout(() => { $q.loading.hide() }, 1000)
        setTimeout(() => { attendanceChecked.value = response.data.inout }, 1000)
        attendanceName.value = response.data.fName
        setTimeout(() => { attendanceChecked.value = false }, 3500)
      })
    }

    return {
      yearAward_options, yearLevel_options, scholarProgram_options, suffix_options, filter_course, filter_univCity, filter_university, filtered_course, filtered_univCity, filtered_university, pageNum, region_options, scrollToElement, submitResponse, testSubmit, formInput,
      homeMenu,
      oldEmail,
      registrant_columns,
      leftDrawerOpen,
      allRequired,
      pleaseWait,
      congrats,
      errorWarning,
      filter,
      manualRegistration,
      isPwd,
      univCity_options,
      course_options,
      university_options,
      formInput,
      inOutMenu,
      inOut_columns,
      showRegistrantUpdate,
      registrant_columnsExport,
      updateOldEmail,
      oldEmails,
      courses,
      regions,
      certificateEmail,
      masterList_columns,
      evaluation_rows,
      inputUpdate,
      checkFilled,
      evaluation_columns,
      universities,
      emailReady,
      sendCertMenu,
      masterListMenu,
      certificateName,
      notListed,
      pretest_rows,
      attendanceMenu,
      masterList_rows,
      qrcode,
      attendanceChecked,
      errorMsg,
      exportByRegion,
      formColor: 'indigo-7',
      exportByRegion_column: ['Export All', 'Region 1', 'Region 2', 'Region 3', 'Region 4-A', 'Region 4-B', 'Region 5', 'Region 6', 'Region 7', 'Region 8', 'Region 9', 'Region 10', 'Region 11', 'Region 12', 'NCR', 'CAR', 'CARAGA', 'BARMM'],
      attendanceConduct_options: ['NCR 1', 'NCR 2', 'Region 1 and CAR', 'Region 2 and 3', 'Region 4-A and 5', 'Region 4-B and 6', 'Region 7 and 8', 'Region 9 and BARMM', 'Region 11 and 12', 'Region 10 and 13', 'CBPSME VisMin', 'CBPSME Luzon'],
      attendanceConduct,
      attendanceDay,
      attendanceDay_options: ['Day 0', 'Day 1', 'Day 2', 'Day 3'],
      checkAttendance,
      attendanceActive,
      pretest_columns,
      attendanceName,
      sendCertificate,
      toFormData,
      inOut_rows,
      renewEmail,
      navigationToggle,
      evaluation_columnsExport,
      evalMenu,
      pretestMenu,
      showMasterListUpdate,
      renewEmailTab,
      pretest_columnsExport,
      ranNum,
      exportDialog,
      randomEntrance: ['backInDown', 'backInLeft', 'backInRight', 'backInUp', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'fadeInTopLeft', 'fadeInTopRight', 'fadeInBottomLeft', 'fadeInBottomRight', 'flipInX', 'flipInY', 'lightSpeedInRight', 'lightSpeedInLeft', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'jackInTheBox', 'rollIn', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideInUp'],
      randomExit: ['fadeOutTopLeft', 'fadeOutRight', 'fadeOutLeft', 'backOutRight', 'zoomOutUp', 'bounceOutDown', 'rollOut', 'slideOutUp', 'flipOutX', 'zoomOut', 'backOutLeft', 'backOutDown', 'fadeOutTopRight', 'slideOutDown', 'hinge', 'fadeOutBottomLeft', 'fadeOutUp', 'fadeOutBottomRight', 'fadeOutUpBig', 'fadeOutRightBig', 'rotateOut', 'bounceOutUp', 'slideOutLeft', 'rotateOutDownLeft', 'zoomOutLeft', 'zoomOutDown', 'lightSpeedOutRight', 'bounceOutLeft', 'fadeOutDownBig', 'zoomOutRight', 'flipOutY', 'rotateOutDownRight', 'rotateOutUpLeft', 'fadeOut', 'bounceOut', 'rotateOutUpRight', 'lightSpeedOutLeft', 'fadeOutLeftBig', 'bounceOutRight', 'backOutUp', 'slideOutRight', 'fadeOutDown'],
      paginationConfig: {
        rowsPerPage: 10,
        sortBy: 'registerdate',
        descending: true
      },
      registrant_rows,
      yearlevel_options: [
        {
          label: "1st Year",
          value: 1,
        },
        {
          label: "2nd Year",
          value: 2,
        },
        {
          label: "3rd Year",
          value: 3,
        },
        {
          label: "4th Year",
          value: 4,
        },
        {
          label: "5th Year",
          value: 5,
        },
      ],
      yearAward_options: [
        {
          label: "2019",
          value: 1,
        },
        {
          label: "2020",
          value: 2,
        },
        {
          label: "2021",
          value: 3,
        },
        {
          label: "2022",
          value: 4,
        },
      ],
      updateAttending(email, attending, table) {
        axiosInit.get('/operations/updateAttending.php?email=' +
          email +
          '&attending=' +
          attending +
          '&table=' +
          table
        ).then(function (response) {
          if (response.data.success == true) {
            $q.notify('Operation Success')
          }
          else {
            $q.notify('Operation Failed')
          }
        })
      },
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      resendQR(email, fname, lname, region) {
        pleaseWait.value = true
        axiosInit.get('/operations/resendQR.php?email=' +
          email +
          '&fname=' +
          fname +
          '&lname=' +
          lname +
          '&region=' +
          region
        ).then(function (response) {
          if (response.data.emailSent) {
            pleaseWait.value = false
            congrats.value = true
          } else {
            pleaseWait.value = false
            errorWarning.value = true
          }
        })
      },
      submitImportMasterList() {
        pleaseWait.value = true
        const dlInsert = toFormData(formInput)
        axiosInit.post(
          '/operations/importMasterList.php',
          dlInsert,
          {
            headers: {
              'Content-Type': 'mulltipart/form-data'
            }
          }
        ).then(function (response) {
          pleaseWait.value = false
          if (response.data.success == false) {
            errorWarning.value = true
            errorMsg.value = ('Possible data format inconsistency: ' + response.data.dataError)
          }
          else if (response.data.dupe == true) {
            errorWarning.value = true
            errorMsg.value = ('Duplicate email detected. Process terminated.\nEmail: ' + response.data.dupeEmail)
          }
          else {
            congrats.value = true
          }
          navigationToggle('masterList')
        })
      },
      checkEmailManualRegister() {
        pleaseWait.value = true
        axiosInit.get(
          "/checkEmailManualRegister.php?email=" +
          formInput.OTPEmail
        ).then(function (response) {
          if (response.data.success) {
            pleaseWait.value = false
            emailReady.value = true
          } else {
            pleaseWait.value = false
            notListed.value = true
            formInput.OTPEmail = ''
          }
        })
      },
      logInUser() {
        pleaseWait.value = true
        const dlInsert = toFormData(formInput)
        axiosInit.post(
          '/auth/logInAdmin.php',
          dlInsert,
          {
            headers: {
              'Content-Type': 'mulltipart/form-data'
            }
          }
        ).then(function (response) {
          if (response.data.logInAuth === true) {
            pleaseWait.value = false
            $q.localStorage.set('logIn', true)
            homeMenu.value = true
          } else {
            pleaseWait.value = false
            errorWarning.value = true
          }
        })
      },
      logOutUser() {
        pleaseWait.value = true
        $q.localStorage.set('logIn', false)
        pleaseWait.value = false
      },
      selectParticipantType(val) {
        formInput.participant = val;
      },

      getOldEmail() {
        pleaseWait.value = true
        axiosInit.get(
          '/getOldEmail.php?email=' +
          oldEmail.value
        ).then(function (response) {
          if (response.data) {
            pleaseWait.value = false
            oldEmails.value = response.data
            updateOldEmail.value = true
          }
        })
      },
      showUpdateDialog(action, row) {
        pageNum.value = 1
        if (action == 'UPDATE' || action == 'REGISTER') {
          if (action == 'UPDATE') {
            formInput.email = row.email
            formInput.fName = row.fname
            formInput.mName = row.mname
            formInput.lName = row.lname
            formInput.suffix = row.suffix == '' ? null : row.suffix
            formInput.sex = row.sex == 'Male' ? 1 : 2
            formInput.birthDate = row.birthdate
            formInput.phoneNumber = row.phoneNumber
            formInput.participant = row.participant == 'Scholar' ? 1 : 2
            formInput.university = row.university
            formInput.univRegion = row.univRegion
            formInput.univCity = row.univCity
            formInput.course = row.course
            formInput.scholarProgram = row.scholarProgram
            formInput.yearLevel = row.yearLevel
            formInput.yearAward = row.yearAward
            formInput.association = row.association
            formInput.designation = row.designation
            formInput.position = row.position
            this.idNum = row.id
          }
          else {
            formInput.email = null
            formInput.fName = null
            formInput.mName = null
            formInput.lName = null
            formInput.suffix = null
            formInput.sex = null
            formInput.birthDate = null
            formInput.phoneNumber = null
            formInput.participant = null
            formInput.university = null
            formInput.univRegion = null
            formInput.univCity = null
            formInput.course = null
            formInput.scholarProgram = null
            formInput.yearLevel = null
            formInput.yearAward = null
            formInput.association = null
            formInput.designation = null
            formInput.position = null
          }

          this.action = action
          this.showRegistrantUpdate = true
        }
        else if (action == 'MASTER') {
          formInput.email = row.email
          formInput.fullName = row.fullname
          formInput.univRegion = row.univRegion
          formInput.participant = row.participant
          formInput.conduct = row.conduct
          // console.log(row.participant)
          formInput.id = row.id
          this.action = action
          this.showMasterListUpdate = true
        }
      },
      showExportDialog(column, row, filename) {
        this.column = column
        this.row = row
        this.filename = filename
        this.exportDialog = true
      },
      generateGroupings(column, row, filename) {
        const univsInGroup = []
        univsInGroup.value = (row.map(obj => obj.university)).forEach(arr => univsInGroup[arr] = (row.filter(obj => obj.university == arr).map(obj => obj.registrantID)))

        this.column = column
        this.column.push(
          {
            name: 'group',
            label: 'Group',
            field: 'group',
          }
        )
        let index = 0
        univsInGroup.forEach(arr => {
          let colors = ["red", "purple", "blue", "gray", "green", "yellow", "white", "black", "pink", "orange"]

          arr.forEach(item => row.find(obj => obj.registrantID === item).group = colors[index++ % 10])

        })
        this.exportTable(this.column, row, attendanceConduct.value, filename)
        this.column.pop()
      },

      exportTable(tableColumns, tableRows, region, filename) {
        // naive encoding to csv format
        let columnsToExport = tableColumns
        let rowsToExport = tableRows
        if (filename != 'Attendance-Groupings' && !region.includes('Export All')) {
          rowsToExport = tableRows.filter(obj => region.includes(obj.univRegion))
        }

        const content = "\ufeff" + [columnsToExport.map(col => wrapCsvValue(col.label))].concat(
          rowsToExport.map(row => columnsToExport.map(col => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[col.field === void 0 ? col.name : col.field],
            col.format,
            row
          )).join(','))
        ).join('\r\n')

        const status = exportFile(
          filename + ' - ' + region + '.csv',
          content,
          {
            encoding: 'utf-8',
            mimeType: 'text/csv;charset=utf-8;'
          }
        )

        if (status !== true) {
          $q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          })
        }
      },
      attendanceMassOut() {
        pleaseWait.value = true
        axiosInit.get('/operations/attendanceMassOut.php?day=' +
          attendanceDay.value +
          '&conduct=' +
          attendanceConduct.value
        ).then(function (response) {
          pleaseWait.value = false
          if (response.data.success == true) {
            congrats.value = true
          }
          else {
            errorWarning.value = true
          }
          navigationToggle('inOut')
        })
      }
    }
  }
})
</script>

<style>
.login-container {
  width: 40vw;
  justify-content: center;
  margin: auto;
  margin-block: 10%;
}

.forms-container {
  width: 50%;
  margin: auto;
}

.uploads-container>* {
  margin-block: 15px;
}

.attendance-container {
  display: table;
  /* padding-inline: 100px; */
  /* text-align: center; */
  width: 100%;
  height: 100%;
  /* padding-top: 140px; */
}

.attendance-text {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

.table-container {
  margin: 2% 5% 2% 5%;
}

table {
  font-family: 'Noto Sans JP', 'sans-serif';
}

.q-table__container {
  padding-inline: 15px;
}

.q-table tbody td {
  font-size: 1.8vh;
}

.q-table thead th {
  font-size: 2.1vh;
}

.radios {
  min-width: 100%;
  padding-inline: 2%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.isAttendanceActive {
  -webkit-animation: isAttendanceActive 8s ease-in-out infinite;
  animation: isAttendanceActive 8s ease-in-out infinite;
}

@-webkit-keyframes isAttendanceActive {
  0% {
    border: 10px solid rgba(47, 142, 239);
  }

  33% {
    border: 10px solid rgb(206, 192, 88);
  }

  66% {
    border: 10px solid rgba(65, 50, 130);
  }

  100% {
    border: 10px solid rgba(47, 142, 239);
  }
}

@keyframes isAttendanceActive {
  0% {
    border: 10px solid rgba(47, 142, 239);
  }

  33% {
    border: 10px solid rgb(206, 192, 88);
  }

  66% {
    border: 10px solid rgba(65, 50, 130);
  }

  100% {
    border: 10px solid rgba(47, 142, 239);
  }
}

.radios>* {
  margin-block: 5px;
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
  -webkit-animation: pulsate-bck 0.5s ease-in-out both;
  animation: pulsate-bck 0.5s ease-in-out both;
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

.button-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.button-container>button {
  margin: auto;
  margin-top: 2%;
  height: 100%;
}

.q-field--outlined .q-field__control:before {
  border: 3px solid #3948ab85 !important;
}

.q-field--outlined.q-field--highlighted .q-field__control:after {
  border: 3px solid;
}

.q-field__label,
.q-field__native {
  padding-inline: 15px;
}

.q-field--outlined .q-field__control:before {
  border: 3px solid #3948ab85 !important;
}

.q-field--outlined.q-field--highlighted .q-field__control:after {
  border: 3px solid;
}

.q-field__label,
.q-field__native {
  padding-inline: 15px;
}
</style>
