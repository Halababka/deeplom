<script setup>
import {ref, onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {useCookie} from "#app";
import {FilterMatchMode} from "@primevue/core/api";

const loadingTable = ref(false)

const allServices = ref([]); // Все доступные услуги (для выпадающего меню)

const categories = ref([]);
const selectedCategories = ref([]);
const categoryDialog = ref(false);
const newCategory = ref({id: null, name: "", parentId: null, only: false, services: []});
const toast = useToast();
const token = useCookie("auth_token");
const api = useRuntimeConfig().public.apiBase;
const submitted = ref(false);
const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});

// Загрузка категорий
const fetchCategories = async () => {
  loadingTable.value = true
  try {
    const response = await fetch(`${api}/categories`, {
      headers: {Authorization: token.value},
    });
    categories.value = await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    loadingTable.value = false
  }
};

const fetchServices = async () => {
  try {
    const response = await fetch(`${api}/services`, {
      headers: { Authorization: token.value },
    });
    const data = await response.json();
    allServices.value = data;
  } catch (error) {
    console.error("Ошибка загрузки услуг:", error);
    toast.add({ severity: "error", summary: "Ошибка", detail: "Не удалось загрузить услуги", life: 3000 });
  }
};

// Открытие формы для добавления новой категории
const openNewCategory = () => {
  newCategory.value = {id: null, name: "", parentId: null, only: false};
  categoryDialog.value = true;
};

// Открытие формы редактирования
const editCategory = (category) => {
  console.log(category)
  newCategory.value = {id: category.id, name: category.name, only: category.only, parentId: category.parentId, services: category.services};
  console.log(newCategory.value)
  categoryDialog.value = true;
};

// Закрытие диалога
const closeDialog = () => {
  categoryDialog.value = false;
};

// Сохранение категории
const saveCategory = async () => {
  try {
    const method = newCategory.value.id ? "PUT" : "POST";
    const url = newCategory.value.id
        ? `${api}/categories/${newCategory.value.id}`
        : `${api}/categories`;

    newCategory.value.services = newCategory.value.services.length > 0 ? newCategory.value.services : null

    const response = await fetch(url, {
      method,
      headers: {"Content-Type": "application/json", Authorization: token.value},
      body: JSON.stringify(newCategory.value),
    });

    if (!response.ok) {
      throw new Error("Ошибка")
    }

    toast.add({severity: "success", summary: "Успех", detail: "Категория сохранена", life: 3000});
    await fetchCategories();
    closeDialog();
  } catch (error) {
    console.error("Error saving category:", error);
    toast.add({severity: "error", summary: "Ошибка", detail: "Не удалось сохранить категорию", life: 3000});
  }
};

// Удаление категории
const confirmDeleteCategory = async (category) => {
  if (confirm(`Вы уверены, что хотите удалить категорию "${category.name}"?`)) {
    try {
      await fetch(`${api}/categories/${category.id}`, {
        method: "DELETE",
        headers: {Authorization: token.value},
      });

      toast.add({severity: "success", summary: "Успех", detail: "Категория удалена", life: 3000});
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.add({severity: "error", summary: "Ошибка", detail: "Не удалось удалить категорию", life: 3000});
    }
  }
};

const confirmDeleteSelected = async () => {
  if (selectedCategories.value.length === 0) return;

  if (confirm('Are you sure you want to delete selected doctors?')) {
    try {
      const ids = selectedCategories.value.map(ctg => ctg.id);
      await fetch(`${api}/categories`, {
        method: 'DELETE',
        headers: {
          "Authorization": token.value,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ids}),
      });
      toast.add({severity: 'success', summary: 'Успешно', detail: 'Данные удалены', life: 3000});
      fetchCategories();
      selectedCategories.value = [];
    } catch (error) {
      console.error('Error deleting selected categories:', error);
      toast.add({severity: 'error', summary: 'Error', detail: 'Failed to delete selected categories', life: 3000});
    }
  }
};

function getParentCategoryName(categoryId, categories) {
  // Найдем категорию по ID
  const category = categories.find(cat => cat.id === categoryId);

  // Если категория найдена и у нее есть родитель
  if (category && category.parentId !== null) {
    // Найдем родительскую категорию по parentId
    const parentCategory = categories.find(cat => cat.id === category.parentId);

    // Если родительская категория найдена, вернем ее имя
    return parentCategory ? parentCategory.name : null;
  }

  // Если нет родителя или категория не найдена
  return null;
}

const test = ref(false)

onBeforeMount(() => {
  fetchCategories();
  fetchServices()
});
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="Добавить" icon="pi pi-plus" class="mr-2" @click="openNewCategory"/>
          <Button label="Удалить" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected"
                  :disabled="!selectedCategories || !selectedCategories.length"/>
        </template>
      </Toolbar>

      <DataTable
          v-model:selection="selectedCategories"
          :value="categories"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :loading="loadingTable"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Показаны {first} по {last} из {totalRecords} категорий"
          tableClass="min-w-[70rem] max-w-[70rem]"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <div class="flex gap-4 items-center">
              <h4 class="m-0">Список категорий</h4>
              <Button icon="pi pi-refresh" @click="fetchCategories" rounded raised/>
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
        <Column field="name" header="Название" sortable></Column>
        <Column field="parentId" header="Родительская категория">
          <template #body="slotProps">
            <!--            {{ slotProps.data.parent ? slotProps.data.parent.name : "—" }}-->
            {{ getParentCategoryName(slotProps.data.id, categories) }}
          </template>
        </Column>
        <Column field="only" header="Только для второго уровня">
          <template #body="slotProps">
            <i :class="slotProps.data.only ? 'pi pi-check' : 'pi pi-times'"></i>
          </template>
        </Column>
        <Column :exportable="false" style="width: 10rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategory(slotProps.data)"/>
            <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="confirmDeleteCategory(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="categoryDialog" :style="{ width: '450px' }" header="Категория" modal dismissable-mask>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label for="name">Название</label>
          <InputText v-model="newCategory.name" id="name" required autofocus/>
        </div>
        <div class="flex flex-col gap-2">
          <label for="parentId">Родительская категория</label>
          <Select
              v-model="newCategory.parentId"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              placeholder="Выберите родительскую категорию"
              :filter="true"
          />
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="newCategory.only" :binary="true" inputId="only"/>
          <label for="only"> Только для второго уровня </label>
        </div>
        <!-- Выпадающее меню для выбора услуг -->
        <div class="flex flex-col gap-2">
          <label for="services" class="block text-sm font-medium mb-1">Услуги</label>
          <MultiSelect
              v-model="newCategory.services"
              :options="allServices"
              optionLabel="name"
              filter
              pt:overlay:style="max-width: 700px; overflow-x: auto; white-space: nowrap;"
              placeholder="Выберите услуги"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Отменить" icon="pi pi-times" class="p-button-text" @click="closeDialog"/>
        <Button label="Сохранить" icon="pi pi-check" @click="saveCategory"/>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>

</style>
