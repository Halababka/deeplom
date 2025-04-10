<script setup>
const isOpen = ref(false)
const currentStep = ref(1)
const selectedType = ref(null)
const selectedCategory = ref(null)
const selectedDoctor = ref(null)
const selectedTime = ref(null)
const phoneNumber = ref('+7 (')
const phoneDigits = ref('')
const smsCode = ref('')
const showSmsInput = ref(false)
const currentWeekStart = ref(new Date())
const currentWeekEnd = ref(new Date())
const stepHistory = ref([])

const imgBase = useRuntimeConfig().public.imgBase

const categories = ref([
  { id: 1, name: 'Терапия' },
  { id: 2, name: 'Хирургия' },
  { id: 3, name: 'Ортодонтия' }
])

let doctorsStore = ref({data: [], pending: true})

const doctors = ref([])

const fetchDoctors = async () => {
  try {
    const data = await $fetch(`${useRuntimeConfig().public.appointmentBase}/doctors`)
    if (data) {
      // Обновляем данные в хранилище, сохраняя существующие записи
      const updatedDoctors = doctorsStore.value.data.map(storeDoctor => {
        const serverDoctor = data.find(serverDoc => serverDoc.name === storeDoctor.name)
        if (serverDoctor) {
          return {
            ...storeDoctor,
            ...serverDoctor,
            id: serverDoctor.id // Заменяем id на серверный
          }
        }
        return storeDoctor
      })
      
      doctorsStore.value.data = updatedDoctors
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных о врачах:', error)
  }
}

onBeforeMount(async () => {
  doctorsStore = await useDoctorsStore()
})

onMounted(() => {
  // Устанавливаем начальную дату на понедельник текущей недели
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  currentWeekStart.value = new Date(today.setDate(diff))
  updateWeekDates()
  
  watchEffect(async () => {
    if (!doctorsStore.value.pending) {
      await fetchDoctors()
      doctors.value = doctorsStore.value.data
      console.log(doctors.value)
    }
  })
  
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
  bodyUnlock()
})

const timeSlots = ref([])
const doctorSchedule = ref({})

const fetchDoctorSchedule = async (doctorId) => {
  try {
    const data = await $fetch(`${useRuntimeConfig().public.appointmentBase}/booking/slots?branchId=1&doctorId=${doctorId}`)
    doctorSchedule.value = data
    // Преобразуем расписание в формат для отображения
    timeSlots.value = Object.entries(data).map(([date, slots]) => ({
      date,
      slots: slots.map(slot => ({
        startDateTime: slot.startDateTime,
        time: new Date(slot.startDateTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        lengthInMinutes: slot.lengthInMinutes
      }))
    }))
  } catch (error) {
    console.error('Ошибка при загрузке расписания врача:', error)
  }
}

const currentStepTitle = computed(() => {
  const titles = {
    1: 'Выберите тип записи',
    2: selectedType.value === 'category' ? 'Выберите категорию' : 'Выберите врача',
    3: 'Выберите врача',
    4: 'Выберите время',
    5: 'Подтверждение записи'
  }
  return titles[currentStep.value]
})

const currentWeekDates = computed(() => {
  const start = new Date(currentWeekStart.value)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
})

const formatPhoneNumber = (value) => {
  // Оставляем только цифры и убираем первую 7, если она есть
  const digits = value.replace(/\D/g, '').replace(/^7/, '')
  
  // Если цифр нет, возвращаем начальный формат
  if (digits.length === 0) {
    phoneDigits.value = ''
    return '+7 ('
  }
  
  // Проверяем первые три цифры
  if (digits.length >= 1 && digits[0] !== '9') {
    return '+7 (9'
  }
  
  if (digits.length >= 2 && !/^[0-9]$/.test(digits[1])) {
    return '+7 (9' + digits[1]
  }
  
  if (digits.length >= 3 && !/^[0-9]$/.test(digits[2])) {
    return '+7 (9' + digits[1] + digits[2]
  }
  
  // Сохраняем только первые 10 цифр
  const cleanDigits = digits.slice(0, 10)
  phoneDigits.value = cleanDigits
  
  // Форматируем номер
  let formatted = '+7 ('
  
  if (cleanDigits.length > 0) {
    formatted += cleanDigits.slice(0, 3)
  }
  
  if (cleanDigits.length > 3) {
    formatted += ') ' + cleanDigits.slice(3, 6)
  }
  
  if (cleanDigits.length > 6) {
    formatted += '-' + cleanDigits.slice(6, 8)
  }
  
  if (cleanDigits.length > 8) {
    formatted += '-' + cleanDigits.slice(8, 10)
  }
  
  return formatted
}

const handlePhoneInput = (event) => {
  const value = event.target.value
  const formatted = formatPhoneNumber(value)
  phoneNumber.value = formatted
}

const handlePhoneKeyDown = (event) => {
  // Разрешаем: цифры, Backspace, Delete, стрелки, Tab
  if (
    /[0-9]/.test(event.key) ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'Tab'
  ) {
    return true
  }
  
  // Предотвращаем ввод всех остальных символов
  event.preventDefault()
  return false
}

const isPhoneValid = computed(() => {
  return phoneDigits.value.length === 10
})

const filteredDoctors = computed(() => {
  if (!selectedCategory.value) return []
  return doctors.value
    .filter(doctor => doctor.category === selectedCategory.value.id && doctor.availableFrom !== null)
})

const bodyLock = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = '17px'
}

const bodyUnlock = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

const openModal = () => {
  isOpen.value = true
  stepHistory.value = [1]
  bodyLock()
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
  bodyUnlock()
}

// Обработчик нажатия клавиши Escape
const handleEscape = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

const resetForm = () => {
  currentStep.value = 1
  selectedType.value = null
  selectedCategory.value = null
  selectedDoctor.value = null
  selectedTime.value = null
  phoneNumber.value = '+7 ('
  smsCode.value = ''
  showSmsInput.value = false
  stepHistory.value = [1]
}

const selectAppointmentType = (type) => {
  selectedType.value = type
  currentStep.value = 2
  stepHistory.value.push(2)
}

const selectCategory = (category) => {
  selectedCategory.value = category
  currentStep.value = 3
  stepHistory.value.push(3)
}

const selectDoctor = async (doctor) => {
  selectedDoctor.value = doctor
  await fetchDoctorSchedule(doctor.id)
  currentStep.value = 4
  stepHistory.value.push(4)
}

const selectTime = (slot) => {
  selectedTime.value = slot
  currentStep.value = 5
  stepHistory.value.push(5)
}

const goBack = () => {
  if (stepHistory.value.length > 1) {
    stepHistory.value.pop()
    const prevStep = stepHistory.value[stepHistory.value.length - 1]
    
    if (prevStep === 1) {
      selectedType.value = null
    } else if (prevStep === 2) {
      if (selectedType.value === 'category') {
        selectedCategory.value = null
      }
    } else if (prevStep === 3) {
      selectedDoctor.value = null
    } else if (prevStep === 4) {
      selectedTime.value = null
    }
    
    currentStep.value = prevStep
  }
}

const updateWeekDates = () => {
  const start = new Date(currentWeekStart.value)
  // Устанавливаем начало недели на понедельник
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Корректировка для воскресенья
  start.setDate(diff)
  
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  currentWeekEnd.value = end
}

const canGoPrevWeek = computed(() => {
  if (!timeSlots.value.length) return false
  const firstDate = new Date(timeSlots.value[0].date)
  return firstDate < currentWeekStart.value
})

const canGoNextWeek = computed(() => {
  if (!timeSlots.value.length) return false
  const lastDate = new Date(timeSlots.value[timeSlots.value.length - 1].date)
  return lastDate > currentWeekEnd.value
})

const currentWeekSlots = computed(() => {
  if (!timeSlots.value.length) return []
  
  const start = new Date(currentWeekStart.value)
  const end = new Date(currentWeekEnd.value)
  
  // Получаем все даты текущей недели
  const weekDates = []
  const currentDate = new Date(start)
  while (currentDate <= end) {
    weekDates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Создаем слоты для всех дней недели, даже если они пустые
  return weekDates.map(date => {
    const dateStr = date.toISOString().split('T')[0]
    const existingDay = timeSlots.value.find(day => day.date === dateStr)
    
    return {
      date: dateStr,
      slots: existingDay ? existingDay.slots : [],
      isEmpty: !existingDay
    }
  })
})

const prevWeek = () => {
  const date = new Date(currentWeekStart.value)
  date.setDate(date.getDate() - 7)
  currentWeekStart.value = date
  updateWeekDates()
}

const nextWeek = () => {
  const date = new Date(currentWeekStart.value)
  date.setDate(date.getDate() + 7)
  currentWeekStart.value = date
  updateWeekDates()
}

const sendSmsCode = () => {
  if (isPhoneValid.value) {
    // Здесь будет логика отправки SMS
    showSmsInput.value = true
  }
}

defineExpose({
  openModal
})
</script>
<template>
  <Transition name="modal">
    <div class="appointment-modal" v-if="isOpen">
      <div class="appointment-modal__overlay" @click="closeModal"></div>
      <div class="appointment-modal__content">
        <div class="appointment-modal__header">
          <h2 class="appointment-modal__title">{{ currentStepTitle }}</h2>
          <button class="appointment-modal__close" @click="closeModal">×</button>
        </div>

        <div class="appointment-modal__body">
          <!-- Спиннер загрузки -->
          <div v-if="doctorsStore.pending" class="loading-spinner">
            <div class="spinner"></div>
            <p>Загрузка данных...</p>
          </div>

          <!-- Шаг 1: Выбор типа записи -->
          <div v-else-if="currentStep === 1" class="appointment-step">
            <div class="appointment-options">
              <button 
                class="appointment-option" 
                @click="selectAppointmentType('category')"
              >
                Запись по категории
              </button>
              <button 
                class="appointment-option" 
                @click="selectAppointmentType('doctor')"
              >
                Выбрать врача
              </button>
            </div>
          </div>

          <!-- Шаг 2: Выбор категории -->
          <div v-if="currentStep === 2 && selectedType === 'category'" class="appointment-step">
            <button class="appointment-back" @click="goBack">← Назад</button>
            <div class="categories-list">
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="category-item"
                @click="selectCategory(category)"
              >
                {{ category.name }}
              </div>
            </div>
          </div>

          <!-- Шаг 2: Выбор врача -->
          <div v-if="currentStep === 2 && selectedType === 'doctor'" class="appointment-step">
            <button class="appointment-back" @click="goBack">← Назад</button>
            <div class="doctors-list">
              <div 
                v-for="doctor in doctors.filter(d => d.availableFrom !== null)" 
                :key="doctor.id"
                class="doctor-item"
                @click="selectDoctor(doctor)"
              >
                <div class="doctor-avatar">
                  <img :src="imgBase + doctor.avatar.url" :alt="doctor.name" onerror="this.src='/images/doctors/default-avatar.jpg'">
                </div>
                <div class="doctor-info">
                  <div class="doctor-name">{{ doctor.name }}</div>
                  <div class="doctor-specialty">{{ doctor.specialty }}</div>
                  <div class="doctor-available" v-if="doctor.availableFrom">
                    Доступен с {{ doctor.availableFrom }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Шаг 3: Выбор врача по категории -->
          <div v-if="currentStep === 3" class="appointment-step">
            <button class="appointment-back" @click="goBack">← Назад</button>
            <div class="doctors-list">
              <div 
                v-for="doctor in filteredDoctors" 
                :key="doctor.id"
                class="doctor-item"
                @click="selectDoctor(doctor)"
              >
                <div class="doctor-avatar">
                  <img :src="imgBase + doctor.avatar.url" :alt="doctor.name" onerror="this.src='/images/doctors/default-avatar.jpg'">
                </div>
                <div class="doctor-info">
                  <div class="doctor-name">{{ doctor.name }}</div>
                  <div class="doctor-specialty">{{ doctor.specialty }}</div>
                  <div class="doctor-available" v-if="doctor.availableFrom">
                    Доступен с {{ new Date(doctor.availableFrom).toLocaleDateString() }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Шаг 4: Выбор времени -->
          <div v-if="currentStep === 4" class="appointment-step">
            <button class="appointment-back" @click="goBack">← Назад</button>
            <div class="selected-doctor">
              <div class="doctor-avatar">
                <img :src="imgBase + selectedDoctor.avatar.url" :alt="selectedDoctor.name" onerror="this.src='/images/doctors/default-avatar.jpg'">
              </div>
              <div class="doctor-info">
                <div class="doctor-name">{{ selectedDoctor.name }}</div>
                <div class="doctor-specialty">{{ selectedDoctor.specialty }}</div>
                <div class="doctor-category" v-if="selectedCategory">
                  {{ selectedCategory.name }}
                </div>
              </div>
            </div>
            <div class="schedule">
              <div class="schedule-header">
                <button 
                  v-if="canGoPrevWeek" 
                  @click="prevWeek"
                  class="schedule-nav-btn"
                >←</button>
                <span class="schedule-month">{{ new Date(timeSlots[0]?.date).toLocaleDateString('ru-RU', { month: 'long' }) }} {{ new Date(timeSlots[0]?.date).getFullYear() }}</span>
                <button 
                  v-if="canGoNextWeek" 
                  @click="nextWeek"
                  class="schedule-nav-btn"
                >→</button>
              </div>
              <div class="schedule-days">
                <div v-for="day in currentWeekSlots" :key="day.date" class="schedule-day" :class="{ 'schedule-day--empty': day.isEmpty }">
                  <div class="schedule-date">
                    <div class="day-name">{{ new Date(day.date).toLocaleDateString('ru-RU', { weekday: 'short' }) }}</div>
                    <div class="day-number">{{ new Date(day.date).getDate() }}</div>
                  </div>
                  <div class="schedule-slots">
                    <div 
                      v-for="slot in day.slots" 
                      :key="slot.startDateTime"
                      class="time-slot"
                      @click="selectTime(slot)"
                    >
                      {{ slot.time }}
                    </div>
                    <div v-if="day.isEmpty || day.slots.length === 0" class="no-slots"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Шаг 5: Подтверждение записи -->
          <div v-if="currentStep === 5" class="appointment-step">
            <button class="appointment-back" @click="goBack">← Назад</button>
            <div class="confirmation-info">
              <div class="selected-doctor">
                <div class="doctor-avatar">
                  <img :src="imgBase + selectedDoctor.avatar.url" :alt="selectedDoctor.name" onerror="this.src='/images/doctors/default-avatar.jpg'">
                </div>
                <div class="doctor-info">
                  <div class="doctor-name">{{ selectedDoctor.name }}</div>
                  <div class="doctor-specialty">{{ selectedDoctor.specialty }}</div>
                </div>
              </div>
              <div class="selected-time">
                <div class="time-label">Выбранное время:</div>
                <div class="time-value">{{ new Date(selectedTime.startDateTime).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }) }}</div>
                <div class="time-value">{{ new Date(selectedTime.startDateTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }}</div>
              </div>
            </div>
            <div class="confirmation-text">
              Заполните форму для подтверждения Вашего номера. На ваш номер будет выслан код подтверждения.
            </div>
            <div class="confirmation-form">
              <div class="form-group">
                <label for="phone">Номер телефона</label>
                <input 
                  type="tel" 
                  id="phone" 
                  :value="phoneNumber"
                  @input="handlePhoneInput"
                  @keydown="handlePhoneKeyDown"
                  placeholder="+7 (___) ___-__-__"
                  maxlength="18"
                  pattern="[0-9]*"
                  inputmode="numeric"
                  autofocus
                >
              </div>
              <button 
                class="send-sms-btn" 
                @click="sendSmsCode"
                :disabled="!isPhoneValid"
              >
                Получить SMS-код
              </button>
              <div v-if="showSmsInput" class="form-group">
                <label for="sms-code">SMS-код</label>
                <input 
                  type="text" 
                  id="sms-code" 
                  v-model="smsCode"
                  placeholder="Введите код из SMS"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Анимации для модального окна */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .appointment-modal__content,
.modal-leave-active .appointment-modal__content {
  transition: transform 0.2s ease;
}

.modal-enter-from .appointment-modal__content,
.modal-leave-to .appointment-modal__content {
  transform: scale(0.95);
}

.appointment-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.appointment-modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.appointment-modal__content {
  position: relative;
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
}

.appointment-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.appointment-modal__title {
  margin: 0;
  font-size: 1.5rem;
}

.appointment-modal__close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.appointment-modal__body {
  padding: 20px;
}

.appointment-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.appointment-option {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.appointment-option:hover {
  background: #f5f5f5;
}

.appointment-back {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-bottom: 20px;
}

.schedule {
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.schedule-month {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  text-transform: capitalize;
}

.schedule-month::after {
  content: " г.";
  text-transform: lowercase;
}

.schedule-days {
  display: flex;
  width: 100%;
}

.schedule-day {
  flex: 1;
  min-width: 0;
  border-right: 1px solid #f0f0f0;
  padding: 0;
  background: white;
  border-radius: 0;
  border: none;
}

.schedule-day:last-child {
  border-right: none;
}

.schedule-date {
  padding: 10px;
  text-align: center;
  font-weight: 500;
  margin-bottom: 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-name {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
  text-transform: capitalize;
}

.day-number {
  font-size: 1.1rem;
  color: #333;
}

.schedule-slots {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
}

.time-slot {
  padding: 8px;
  border: none;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  background: white;
  transition: all 0.2s ease;
  color: #007bff;
  font-weight: 500;
}

.time-slot:hover {
  background: #f8f9fa;
}

.time-slot.selected {
  background: #007bff;
  color: white;
}

.no-slots {
  text-align: center;
  color: #999;
  font-size: 0.85rem;
  padding: 15px 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.send-sms-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-sms-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.doctors-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.doctor-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.doctor-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #007bff, #00bfff);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.doctor-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
}

.doctor-item:hover::before {
  opacity: 0.1;
}

.doctor-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
  background-color: #f0f0f0;
  position: relative;
  z-index: 1;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.doctor-item:hover .doctor-avatar {
  border-color: #007bff;
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doctor-name {
  font-weight: 500;
  font-size: 1.1rem;
  color: #333;
  position: relative;
  z-index: 1;
}

.selected-doctor {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.selected-doctor .doctor-avatar {
  width: 80px;
  height: 80px;
  margin-right: 20px;
}

.selected-doctor .doctor-info {
  margin-left: 15px;
}

.selected-doctor .doctor-name {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.selected-doctor .doctor-specialty {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.selected-doctor .doctor-category {
  color: #666;
  font-size: 0.9rem;
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.category-item {
  padding: 20px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  position: relative;
  overflow: hidden;
}

.category-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #007bff, #00bfff);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.category-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
}

.category-item:hover::before {
  opacity: 0.1;
}

.category-item span {
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .categories-list {
    grid-template-columns: 1fr;
  }
  
  .category-item {
    padding: 15px;
    font-size: 1rem;
  }
  
  .doctors-list {
    grid-template-columns: 1fr;
  }
  
  .doctor-item {
    padding: 15px;
  }
  
  .doctor-avatar {
    width: 60px;
    height: 60px;
    margin-right: 15px;
  }
  
  .selected-doctor {
    padding: 15px;
  }
  
  .selected-doctor .doctor-avatar {
    width: 60px;
    height: 60px;
  }
  
  .schedule-days {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .schedule-day {
    min-width: 100%;
    background: #f8f9fa;
    padding: 0;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    margin-bottom: 10px;
  }
  
  .schedule-date {
    border-bottom: 1px solid #e0e0e0;
    flex-direction: row;
    justify-content: center;
    gap: 5px;
  }
  
  .day-name {
    margin-bottom: 0;
  }
  
  .schedule-slots {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 10px;
  }
  
  .time-slot {
    border: 1px solid #ddd;
  }
  
  .time-slot:hover {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 200px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #666;
  font-size: 1.1rem;
}

.doctor-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.doctor-specialty {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.doctor-available {
  font-size: 0.9rem;
  color: #666;
}

.confirmation-info {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.selected-time {
  margin-top: 20px;
  text-align: center;
}

.time-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.time-value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.confirmation-text {
  text-align: center;
  margin-bottom: 20px;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

.schedule-nav-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #007bff;
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.2s ease;
}

.schedule-nav-btn:hover {
  color: #0056b3;
}

.schedule-nav-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.schedule-day--empty {
  opacity: 0.6;
}
</style> 