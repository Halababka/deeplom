<script setup>
import {ref, onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {FilterMatchMode} from "@primevue/core/api";

const loadingTable = ref(false)

const services = ref([]); // Данные для таблицы услуг
const categories = ref([]);
const selectedServices = ref([]);
const serviceDialog = ref(false); // Открытие/закрытие диалога
const newService = ref({id: null, name: "", categoryId: null, price: 0, popular: false});
const submitted = ref(false);
const toast = useToast();
const api = useRuntimeConfig().public.apiBase;
const token = useCookie("auth_token");

const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const fetchCategories = async () => {
  try {
    const response = await fetch(`${api}/categories`, {
      headers: {Authorization: token.value},
    });
    categories.value = await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};


// Загрузка услуг
const fetchServices = async () => {
  loadingTable.value = true
  try {
    const response = await fetch(`${api}/services`, {
      headers: {Authorization: token.value},
    });
    services.value = await response.json();
  } catch (error) {
    console.error("Ошибка загрузки услуг:", error);
    toast.add({severity: "error", summary: "Ошибка", detail: "Не удалось загрузить услуги", life: 3000});
  } finally {
    loadingTable.value = false
  }
};

// Открытие формы для добавления новой услуги
const openNewService = () => {
  newService.value = {id: null, name: "", categoryId: null, price: 0, popular: false};
  serviceDialog.value = true;
};

// Открытие формы редактирования услуги
const editService = (service) => {
  newService.value = {
    id: service.id,
    name: service.name,
    categoryId: service.categoryId,
    price: service.price,
    popular: service.popular
  };
  serviceDialog.value = true;
};

// Закрытие диалога
const closeDialog = () => {
  serviceDialog.value = false;
};

// Сохранение услуги
const saveService = async () => {
  try {
    const method = newService.value.id ? "PUT" : "POST";
    const url = newService.value.id
        ? `${api}/services/${newService.value.id}`
        : `${api}/services`;

    const response = await fetch(url, {
      method,
      headers: {"Content-Type": "application/json", Authorization: token.value},
      body: JSON.stringify(newService.value),
    });

    if (!response.ok) {
      throw new Error("Ошибка сохранения");
    }

    toast.add({severity: "success", summary: "Успех", detail: "Услуга сохранена", life: 3000});
    await fetchServices();
    closeDialog();
  } catch (error) {
    console.error("Ошибка сохранения услуги:", error);
    toast.add({severity: "error", summary: "Ошибка", detail: "Не удалось сохранить услугу", life: 3000});
  }
};

// Удаление услуги
const confirmDeleteService = async (service) => {
  if (confirm(`Вы уверены, что хотите удалить услугу "${service.name}"?`)) {
    try {
      await fetch(`${api}/services/${service.id}`, {
        method: "DELETE",
        headers: {Authorization: token.value},
      });

      toast.add({severity: "success", summary: "Успех", detail: "Услуга удалена", life: 3000});
      fetchServices();
    } catch (error) {
      console.error("Ошибка удаления услуги:", error);
      toast.add({severity: "error", summary: "Ошибка", detail: "Не удалось удалить услугу", life: 3000});
    }
  }
};

const confirmDeleteSelected = async () => {
  if (selectedServices.value.length > 0) {
    // Логика удаления нескольких выбранных услуг
    const ids = selectedServices.value.map(srv => srv.id);

    try {
      await fetch(`${api}/services`, {
        method: 'DELETE',
        headers: {
          "Authorization": token.value,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ids}),
      });
      toast.add({
        severity: "success",
        summary: "Успешно",
        detail: `Услуги удалены`,
      });
    } catch (error) {
      console.error("Ошибка удаления услуги:", error);
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: `Не удалось удалить услуги`,
      });
    }
    // Обновляем список услуг
    await fetchServices();
    selectedServices.value = [];
  } else {
    toast.add({
      severity: "warn",
      summary: "Внимание",
      detail: "Выберите услуги для удаления",
    });
  }
};


onBeforeMount(() => {
  fetchServices();
  fetchCategories()
});
</script>

<template>
  <div class="card w-[100%]">
    <Toolbar class="mb-6">
      <template #start>
        <Button label="Добавить" icon="pi pi-plus" class="mr-2" @click="openNewService"/>
        <Button
            label="Удалить"
            icon="pi pi-trash"
            severity="danger"
            outlined
            @click="confirmDeleteSelected"
            :disabled="!selectedServices.length"
        />
      </template>
    </Toolbar>

    <DataTable
        v-model:selection="selectedServices"
        :value="services"
        dataKey="id"
        scrollable
        paginator
        :rows="10"
        :loading="loadingTable"
        :filters="filters"
        tableClass="w-[70rem] max-w-[70rem]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Показаны {first} по {last} из {totalRecords} услуг"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <div class="flex gap-4 items-center">
            <h4 class="m-0">Список услуг</h4>
            <Button icon="pi pi-refresh" @click="fetchServices" rounded raised/>
          </div>
          <IconField>
            <InputIcon>
              <i class="pi pi-search"/>
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Поиск..."/>
          </IconField>
        </div>
      </template>

      <Column selectionMode="multiple" style="width: 3rem"></Column>
      <Column field="name" header="Название" sortable frozen></Column>
      <Column field="category.name" header="Категория" sortable></Column>
      <Column field="popular" header="Популярная услуга" sortable>
        <template #body="{data}">
          <span v-if="data.popular">Да</span>
          <span v-else>Нет</span>
        </template>
      </Column>
      <Column field="price" header="Цена" sortable>
        <template #body="slotProps">
          {{ slotProps.data.price }} ₽
        </template>
      </Column>
      <Column :exportable="false" style="width: 10rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="mr-2" outlined rounded @click="editService(slotProps.data)"/>
          <Button icon="pi pi-trash" outlined rounded severity="danger"
                  @click="confirmDeleteService(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Диалог для добавления/редактирования услуги -->
  <Dialog v-model:visible="serviceDialog" class="max-w-[95%] min-w-[95%] sm:min-w-[200px] sm:w-[700px]" header="Услуга" modal dismissable-mask closable :draggable="false">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <label for="name">Название</label>
        <InputText v-model="newService.name" id="name" required autofocus/>
      </div>
      <div class="flex flex-col gap-2">
        <label for="categoryId">Категория</label>
        <Select
            v-model="newService.categoryId"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            placeholder="Выберите категорию"
            pt:overlay:class="max-w-[50px]"
            pt:overlay:style="overflow-x: auto;"
            :filter="true"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="price">Цена</label>
        <InputNumber v-model="newService.price" id="price" mode="currency" currency="RUB" locale="ru-RU"/>
      </div>
      <div class="flex flex-row items-center gap-2">
        <Checkbox v-model="newService.popular" inputId="popular" binary variant="filled"/>
        <label for="popular">Популярная услуга</label>
      </div>
    </div>
    <template #footer>
      <Button label="Отменить" icon="pi pi-times" class="p-button-text" @click="closeDialog"/>
      <Button label="Сохранить" icon="pi pi-check" @click="saveService"/>
    </template>
  </Dialog>
</template>

<style scoped>
/* Добавьте ваши стили здесь */
</style>
