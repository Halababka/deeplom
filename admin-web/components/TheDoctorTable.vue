<script setup>

import {useToast} from "primevue/usetoast";
import {useCookie} from "#app";
import {FilterMatchMode} from "@primevue/core/api";

const loadingTable = ref(false)

const doctors = ref([]);
const selectedDoctors = ref([]);
const doctorDialog = ref(false);
const newDoctor = ref({
  id: null,
  name: '',
  experience: null,
  specialty: '',
  education: [],
  courses: [],
  avatar: null,
  photos: null,
  certificates: null
});
const toast = useToast();
const token = useCookie('auth_token'); // Токен сохраняется в cookie
const api = useRuntimeConfig().public.apiBase
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);

const fetchDoctors = async () => {
  loadingTable.value = true
  try {
    const response = await fetch(api + '/doctors', {
      headers: {
        "Authorization": token.value
      }
    });
    doctors.value = await response.json();
  } catch (error) {
    console.error('Error fetching doctors:', error);
  } finally {
    loadingTable.value = false
  }
};

const openNewDoctor = () => {
  newDoctor.value = {
    id: null,
    name: '',
    experience: null,
    specialty: '',
    education: [],
    courses: [],
    avatar: null,
    photos: null,
    certificates: null
  };
  doctorDialog.value = true;
};

const editDoctor = (doctor) => {

  // Создаем глубокую копию объекта doctor
  newDoctor.value = JSON.parse(JSON.stringify({
    id: doctor.id,
    name: doctor.name,
    experience: doctor.experience,
    education: doctor.education,
    courses: doctor.courses,
    specialty: doctor.specialty,
    avatar: doctor.avatar,
    photos: doctor.photos,
    certificates: doctor.certificates
  }));
  doctorDialog.value = true;
};

const closeDialog = () => {
  doctorDialog.value = false;
};

const saveDoctor = async () => {
  try {
    let formData = {};
    formData.name = newDoctor.value.name
    formData.specialty = newDoctor.value.specialty
    formData.education = newDoctor.value.education
    formData.courses = newDoctor.value.courses
    formData.experience = newDoctor.value.experience
    formData.avatarId = newDoctor.value.avatar?.id ?? null
    formData.photoIds = newDoctor.value.photos?.map(item => item.id) ?? null
    formData.certificateIds = newDoctor.value.certificates?.map(item => item.id) ?? null

    console.log(newDoctor.value)
    const method = newDoctor.value.id ? 'PUT' : 'POST';
    const url = newDoctor.value.id ? `${api}/doctors/${newDoctor.value.id}` : `${api}/doctors`;
    console.log("method", method, "\n", "formData", formData)
    await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token.value
      },
      body: JSON.stringify(formData)
    });

    toast.add({severity: 'success', summary: 'Успешно', detail: 'Данные сохранены', life: 3000});
    fetchDoctors();
    closeDialog();
  } catch (error) {
    console.error('Error saving doctor:', error);
    toast.add({severity: 'error', summary: 'Ошибка', detail: 'Failed to save doctor', life: 3000});
  }
};

const confirmDeleteDoctor = async (doctor) => {
  if (confirm(`Are you sure you want to delete ${doctor.name}?`)) {
    try {
      await fetch(`${api}/doctors/${doctor.id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": token.value
        },
      });
      toast.add({severity: 'success', summary: 'Успешно', detail: 'Данные удалены', life: 3000});
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.add({severity: 'error', summary: 'Ошибка', detail: 'Failed to delete doctor', life: 3000});
    }
  }
};

const confirmDeleteSelected = async () => {
  if (selectedDoctors.value.length === 0) return;

  if (confirm('Are you sure you want to delete selected doctors?')) {
    try {
      const ids = selectedDoctors.value.map(doc => doc.id);
      await fetch(`${api}/doctors`, {
        method: 'DELETE',
        headers: {
          "Authorization": token.value,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ids}),
      });
      toast.add({severity: 'success', summary: 'Успешно', detail: 'Данные удалены', life: 3000});
      fetchDoctors();
      selectedDoctors.value = [];
    } catch (error) {
      console.error('Error deleting selected doctors:', error);
      toast.add({severity: 'error', summary: 'Error', detail: 'Failed to delete selected doctors', life: 3000});
    }
  }
};

const deleteCertificatesFromDoctor = (index) => {
  delete newDoctor.value.certificates[index]
  if (!newDoctor.value.certificates[0]) {
    newDoctor.value.certificates = null
  }
}

const deletePhotosFromDoctor = (index) => {
  delete newDoctor.value.photos[index]
  if (!newDoctor.value.photos[0]) {
    newDoctor.value.photos = null
  }
}

const deleteAvatarFromDoctor = () => {
  newDoctor.value.avatar = null
}

const onTemplatedUpload = (event, type) => {
  const response = JSON.parse(event.xhr.response);
  console.log(response);
  switch (type) {
    case "avatar":
      newDoctor.value.avatar = response.files[0]
      break;
    case "photos":
      newDoctor.value.photos = response.files
      break;
    case "certificates":
      newDoctor.value.certificates = response.files
      break;
  }
  // newDoctor.value.file[0].id = response.files[0].id;
  toast.add({severity: "success", summary: "Успешно", detail: "Файл загружен", life: 3000});
}

const onBeforeSend = async (event) => {
  const xhr = event.xhr;
  xhr.setRequestHeader("Authorization", token.value);

  const formData = event.formData;
  const files = formData.getAll('files');
  formData.delete('files');

  files.forEach((file) => {
    const encodedName = encodeURIComponent(file.name);
    const newFile = new File([file], encodedName, {type: file.type});
    formData.append('files', newFile);
  });
};

onBeforeMount(() => {
  fetchDoctors();
});
</script>

<template>
  <div class="card w-[100%]">
    <Toolbar class="mb-6">
      <template #start>
        <Button label="Добавить" icon="pi pi-plus" class="mr-2" @click="openNewDoctor"/>
        <Button label="Удалить" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected"
                :disabled="!selectedDoctors || !selectedDoctors.length"/>
      </template>
    </Toolbar>

    <DataTable
        ref="dt"
        v-model:selection="selectedDoctors"
        :value="doctors"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :loading="loadingTable"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Показаны {first} по {last} из {totalRecords} докторов"
        tableClass="w-[70rem] max-w-[70rem]"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <div class="flex gap-4 items-center">
            <h4 class="m-0">Доктора</h4>
            <Button icon="pi pi-refresh" @click="fetchDoctors" rounded raised/>
          </div>
          <IconField>
            <InputIcon>
              <i class="pi pi-search"/>
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Поиск..."/>
          </IconField>
        </div>
      </template>
      <template #empty>
        Данные не найдены
      </template>


      <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
      <Column field="name" header="Имя" sortable style="min-width: 16rem" frozen></Column>
      <Column field="specialty" header="Специальность" sortable style="min-width: 16rem"></Column>
      <Column header="Фото">
        <template #body="slotProps">
          <ImageViewerModal v-if="slotProps.data.avatar" :src="'http://localhost:8080'+ slotProps.data.avatar.url"
                            :alt="slotProps.data.name"/>
        </template>
      </Column>
      <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editDoctor(slotProps.data)"/>
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteDoctor(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>
  </div>

  <Dialog v-model:visible="doctorDialog" class="max-w-[95%] min-w-[95%] sm:min-w-[200px] sm:w-[700px]" header="Доктор" modal dismissable-mask closable :draggable="false">
    <div class="flex flex-col gap-6">
      <div>
        <label for="name" class="block font-bold mb-3">ФИО</label>
        <InputText id="name" v-model.trim="newDoctor.name" required autofocus
                   :invalid="submitted && !newDoctor.name" fluid/>
        <small v-if="submitted && !newDoctor.name" class="text-red-500">Имя обязательно</small>
      </div>
      <div>
        <label for="experience" class="block font-bold mb-3">Стаж</label>
        <InputNumber id="experience" v-model="newDoctor.experience" required fluid/>
      </div>
      <div>
        <label for="specialty" class="block font-bold mb-3">Специальность</label>
        <InputText id="specialty" v-model="newDoctor.specialty" required fluid/>
      </div>
      <div>
        <label for="education" class="block font-bold mb-3">Образование</label>
        <!--          <InputText id="specialty" v-model="newDoctor.education" required fluid/>-->
        <Textarea id="education" v-model="newDoctor.education" rows="5" fluid/>
      </div>
      <div>
        <label for="courses" class="block font-bold mb-3">Курсы повышения квалификации</label>
        <!--          <InputText id="specialty" v-model="newDoctor.courses" required fluid/>-->
        <Textarea id="courses" v-model="newDoctor.courses" rows="5" fluid/>
      </div>
      <div class="space-y-2">
        <label for="file" class="block font-bold mb-3">Аватар</label>
        <div v-if="newDoctor.avatar" class="flex justify-between items-center">
          <ImageViewerModal :src="`http://localhost:8080${newDoctor.avatar.url}`"/>
          <Button @click="deleteAvatarFromDoctor" label="Удалить" class="h-12"/>
        </div>
        <FileUpload mode="basic" name="files" :url="`${api}/files/upload`" accept="image/*" :maxFileSize="10000000"
                    @before-send="onBeforeSend($event)" @upload="($event) => onTemplatedUpload($event, 'avatar')"
                    :multiple="false" :fileLimit="1" auto/>
      </div>
      <div class="space-y-2">
        <label for="file" class="block font-bold mb-3">Фото</label>
        <div v-if="newDoctor.photos && newDoctor.photos[0]" class="flex justify-between items-center"
             v-for="(item, index) in newDoctor.photos">
          <ImageViewerModal :src="`http://localhost:8080${item.url}`"/>
          <Button @click="deletePhotosFromDoctor(index)" label="Удалить" class="h-12"/>
        </div>
        <FileUpload mode="basic" name="files" :url="`${api}/files/upload`" accept="image/*" :maxFileSize="10000000"
                    @before-send="onBeforeSend($event)" @upload="($event) => onTemplatedUpload($event, 'photos')"
                    :multiple="true" :fileLimit="10" auto/>
      </div>
      <div class="space-y-2">
        <label for="file" class="block font-bold mb-3">Сертификаты</label>
        <div v-if="newDoctor.certificates && newDoctor.certificates[0]" class="flex justify-between items-center"
             v-for="(item, index) in newDoctor.certificates">
          <ImageViewerModal :src="`http://localhost:8080${item.url}`"/>
          <Button @click="deleteCertificatesFromDoctor(index)" label="Удалить" class="h-12"/>
        </div>
        <FileUpload mode="basic" name="files" :url="`${api}/files/upload`" accept="image/*" :maxFileSize="10000000"
                    @before-send="onBeforeSend($event)"
                    @upload="($event) => onTemplatedUpload($event, 'certificates')"
                    :multiple="true" :fileLimit="10" auto/>
      </div>
    </div>

    <template #footer>
      <Button label="Выйти" icon="pi pi-times" text @click="closeDialog"/>
      <Button label="Сохранить" icon="pi pi-check" @click="saveDoctor"/>
    </template>
  </Dialog>
</template>

<style scoped>

</style>