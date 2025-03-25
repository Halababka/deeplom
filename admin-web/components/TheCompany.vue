<script setup>
import {ref, reactive, onMounted} from 'vue';

const token = useCookie("auth_token");
const api = useRuntimeConfig().public.apiBase;
const toast = useToast()

// Состояние для хранения данных клиники
const clinicData = ref({
  name: '',
  fullName: '',
  slogan: '',
  description: '',
  fullDescription: [],
  address: '',
  phone: '',
  email: '',
  schedule: '',
  services: [],
  socialLinks: {
    whatsapp: '',
    telegram: ''
  },
  mainPhoto: {},
  legalAddress: '',
  ogrnDetails: '',
  ogrn: '',
  inn: '',
  legalInn: '',
  licence: '',
  photos: [],
  certificates: []
});

// Функция для загрузки данных клиники с сервера
const fetchClinicData = async () => {
  try {
    const response = await fetch(api + '/companies/1', {
      headers: {
        "Authorization": token.value,
      },
    });
    const data = await response.json();
    console.log(data)
    clinicData.value = data
  } catch (error) {
    console.error('Error fetching clinic data:', error);
  }
};

// Функция для сохранения изменений
const saveClinicData = async () => {
  try {
    delete clinicData.value.id
    clinicData.value.photoIds = clinicData.value.photos?.map(i => i.id) ?? null
    delete clinicData.value.photos
    clinicData.value.certificateIds = clinicData.value.certificates?.map(i => i.id) ?? null
    delete clinicData.value.certificates
    clinicData.value.mainPhotoId = clinicData.value.mainPhoto?.id ?? null
    clinicData.value.fullDescription =
        typeof clinicData.value.fullDescription === 'string'
            ? clinicData.value.fullDescription.split('\n')
            : clinicData.value.fullDescription;

    const response = await fetch(api + '/companies/1', {
      method: 'PUT',
      headers: {
        "Authorization": token.value,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(clinicData.value),
    });
    const result = await response.json();
    console.log('Clinic data saved:', result);
    fetchClinicData()
  } catch (error) {
    console.error('Error sending clinic data:', error);
  }
};

// Функция для добавления новой услуги
const addService = () => {
  clinicData.value.services.push({name: '', description: ''});
};

// Функция для удаления услуги
const removeService = (index) => {
  clinicData.value.services.splice(index, 1);
};

const deletePhotosFromClinic = (index) => {
  clinicData.value.photos.splice(index, 1); // Удаляет элемент массива

  // Если после удаления массив пуст, устанавливаем его в null
  if (clinicData.value.photos.length === 0) {
    clinicData.value.photos = null;
  }
};

const deleteMainPhotoFromClinic = () => {
  clinicData.value.mainPhoto = null; // Удаляет элемент массива
};

const deleteCertificatesFromClinic = (index) => {
  clinicData.value.certificates.splice(index, 1); // Удаляет элемент массива

  // Если после удаления массив пуст, устанавливаем его в null
  if (clinicData.value.certificates.length === 0) {
    clinicData.value.certificates = null;
  }
};

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

const onTemplatedUpload = (event, type) => {
  const response = JSON.parse(event.xhr.response);
  switch (type) {
    case "photos":
      clinicData.value.photos = response.files
      break;
    case "certificates":
      clinicData.value.certificates = [...clinicData.value.certificates, ...response.files]
      break;
    case "mainPhoto":
      clinicData.value.mainPhoto = response.files[0]
      break;
  }
  toast.add({severity: "success", summary: "Успешно", detail: "Файл загружен", life: 3000});
}

// Загружаем данные клиники при монтировании компонента
fetchClinicData();

</script>

<template>
  <div class="flex flex-col w-[800px]">
    <div class="clinic-card">
      <h2>Редактирование данных клиники</h2>

      <div class="form-group">
        <label for="name">Название клиники</label>
        <InputText id="name" v-model="clinicData.name"/>
      </div>

      <div class="form-group">
        <label for="fullName">Полное название</label>
        <InputText id="fullName" v-model="clinicData.fullName"/>
      </div>

      <div class="form-group">
        <label for="fullName">Слоган</label>
        <InputText id="fullName" v-model="clinicData.slogan"/>
      </div>

      <div class="form-group">
        <label for="description">Описание</label>
        <Textarea id="description" v-model="clinicData.description" rows="5"/>
      </div>

      <div class="form-group">
        <label for="fullDescription">Полное описание</label>
        <Textarea id="fullDescription" v-model="clinicData.fullDescription" rows="5"/>
      </div>

      <div class="form-group">
        <label for="address">Адрес</label>
        <InputText id="address" v-model="clinicData.address"/>
      </div>

      <div class="form-group">
        <label for="phone">Телефон</label>
        <InputText id="phone" v-model="clinicData.phone"/>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <InputText id="email" v-model="clinicData.email"/>
      </div>

      <div class="form-group">
        <label for="schedule">График работы</label>
        <InputText id="schedule" v-model="clinicData.schedule"/>
      </div>

      <div class="form-group">
        <label for="legalAddress">Юридический адрес</label>
        <InputText id="legalAddress" v-model="clinicData.legalAddress"/>
      </div>

      <div class="form-group">
        <label for="ogrnDetails">Сведения о регистрации</label>
        <Textarea id="ogrnDetails" v-model="clinicData.ogrnDetails" rows="3"/>
      </div>

      <div class="form-group">
        <label for="ogrn">ОГРН</label>
        <InputText id="ogrn" v-model="clinicData.ogrn"/>
      </div>

      <div class="form-group">
        <label for="inn">ИНН</label>
        <InputText id="inn" v-model="clinicData.inn"/>
      </div>

      <div class="form-group">
        <label for="legalInn">Юридический ИНН</label>
        <InputText id="legalInn" v-model="clinicData.legalInn"/>
      </div>

      <div class="form-group">
        <label for="licence">Лицензия</label>
        <InputText id="licence" v-model="clinicData.licence"/>
      </div>

      <Divider/>

      <h3 class="mb-3">Услуги</h3>
      <div v-for="(service, index) in clinicData.services" :key="index" class="form-group space-y-1">
        <label :for="'service-name-' + index">Название услуги</label>
        <InputText :id="'service-name-' + index" v-model="service.name"/>

        <label :for="'service-description-' + index">Описание услуги</label>
        <Textarea :id="'service-description-' + index" v-model="service.description" rows="4"/>

        <Button label="Удалить услугу" icon="pi pi-times" class="p-button-danger" @click="removeService(index)"/>
      </div>

      <Button label="Добавить услугу" icon="pi pi-plus" class="p-button-success" @click="addService"/>

      <Divider/>

      <h3>Социальные сети</h3>
      <div class="form-group">
        <label for="whatsapp">WhatsApp</label>
        <InputText id="whatsapp" v-model="clinicData.socialLinks.whatsapp"/>
      </div>

      <div class="form-group">
        <label for="telegram">Telegram</label>
        <InputText id="telegram" v-model="clinicData.socialLinks.telegram"/>
      </div>

      <div class="form-group">
        <label for="file" class="block font-bold mb-3">Приветственное фото</label>
        <div v-if="clinicData.mainPhoto && clinicData.mainPhoto.length !== 0" class="flex justify-between items-center">
          <ImageViewerModal v-if="clinicData.mainPhoto.url" :src="`http://localhost:8080${clinicData.mainPhoto.url}`"/>
          <Button @click="deleteMainPhotoFromClinic()" label="Удалить" class="h-12 p-button-danger"/>
        </div>
        <FileUpload mode="basic" name="files" :url="`${api}/files/upload`" accept="image/*" :maxFileSize="10000000"
                    @before-send="onBeforeSend($event)" @upload="($event) => onTemplatedUpload($event, 'mainPhoto')"
                    :multiple="false" auto class="p-button-success"/>
      </div>

      <div class="form-group">
        <label for="file" class="block font-bold mb-3">Фото</label>
        <div v-if="clinicData.photos && clinicData.photos.length !== 0" class="flex justify-between items-center"
             v-for="(item, index) in clinicData.photos">
          <ImageViewerModal v-if="item.url" :src="useRuntimeConfig().public.imgBase + item.url"/>
          <Button @click="deletePhotosFromClinic(index)" label="Удалить" class="h-12 p-button-danger"/>
        </div>
        <FileUpload mode="basic" name="files" :url="`${api}/files/upload`" accept="image/*" :maxFileSize="10000000"
                    @before-send="onBeforeSend($event)" @upload="($event) => onTemplatedUpload($event, 'photos')"
                    :multiple="true" :fileLimit="30" auto class="p-button-success"/>
      </div>

      <div class="form-group">
        <label for="file" class="block font-bold mb-3">Сертификаты</label>
        <div v-if="clinicData.certificates && clinicData.certificates[0]" class="flex justify-between items-center"
             v-for="(item, index) in clinicData.certificates">
          <ImageViewerModal :src="useRuntimeConfig().public.imgBase + item.url"/>
          <Button @click="deleteCertificatesFromClinic(index)" label="Удалить" class="h-12 p-button-danger"/>
        </div>
        <FileUpload mode="basic" name="files" :url="`${api}/files/upload`" accept="image/*" :maxFileSize="10000000"
                    @before-send="onBeforeSend($event)"
                    @upload="($event) => onTemplatedUpload($event, 'certificates')"
                    :multiple="true" :fileLimit="30" auto class="p-button-success"/>
      </div>

      <Button label="Сохранить" icon="pi pi-save" class="p-button-success" @click="saveClinicData"/>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 20px;
}
</style>
