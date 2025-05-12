/**
 * Компонент записи на прием
 * Предоставляет пошаговый интерфейс для записи к врачу:
 * 1. Выбор типа записи (по категории или врачу)
 * 2. Выбор категории/врача
 * 3. Выбор времени приема
 * 4. Подтверждение записи
 */
<script setup>
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// Состояние модального окна и шага записи
const isOpen = ref(false)
const currentStep = ref(1)
const selectedType = ref(null)        // Тип записи (категория/врач)
const selectedCategory = ref(null)    // Выбранная категория
const selectedDoctor = ref(null)      // Выбранный врач
const selectedTime = ref(null)        // Выбранное время

// Состояние формы контактных данных
const phoneNumber = ref('+7 (')       // Номер телефона в формате
const phoneDigits = ref('')           // Только цифры номера
const smsCode = ref('')               // Код подтверждения
const showSmsInput = ref(false)       // Видимость поля ввода кода
const currentWeekStart = ref(new Date())
const currentWeekEnd = ref(new Date())
const stepHistory = ref([])
const requestId = ref(null)           // ID заявки на запись
const smsMessage = ref('')            // Сообщение с кодом
const canRequestSms = ref(true)       // Возможность запросить код
const timeLeft = ref(300)             // Время до истечения кода (5 минут)
const confirmationMessage = ref('')   // Сообщение подтверждения
const hasError = ref(false)           // Наличие ошибки
const isBookingSuccess = ref(false)   // Успешность записи
const isSendingSms = ref(false)       // Процесс отправки SMS
const clientFullName = ref('')        // ФИО клиента
const timerId = ref(null)             // Добавляем переменную для хранения ID таймера

const imgBase = useRuntimeConfig().public.imgBase

const categories = ref(new Set())

let doctorsStore = ref({data: [], pending: true})

const doctors = ref([])

/**
 * Загружает список врачей с сервера
 * Обновляет данные в хранилище и категории
 */
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
      doctors.value = updatedDoctors
      
      // Обновляем Set категорий из данных врачей
      const categoriesSet = new Set()
      updatedDoctors.forEach(doctor => {
        if (doctor.categories) {
          doctor.categories.forEach(category => {
            categoriesSet.add(category)
          })
        }
      })
      categories.value = categoriesSet
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных о врачах:', error)
    // Повторный запрос через 2,5 минуты
    setTimeout(() => {
      console.debug('Повторная попытка загрузки данных о врачах...')
      fetchDoctors()
    }, 150000)
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
    }
  })
  
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
  window.removeEventListener('keydown', handleEscape)
  bodyUnlock()
})

const timeSlots = ref([])
const doctorSchedule = ref({})
const schedulePending = ref(false)

/**
 * Загружает расписание врача
 * @param doctorId - ID врача
 */
const fetchDoctorSchedule = async (doctorId) => {
  try {
    schedulePending.value = true
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

    // Находим первую дату с доступными слотами
    if (timeSlots.value.length > 0) {
      const firstAvailableDate = new Date(timeSlots.value[0].date)
      // Устанавливаем начало недели на понедельник
      const day = firstAvailableDate.getDay()
      const diff = firstAvailableDate.getDate() - day + (day === 0 ? -6 : 1)
      firstAvailableDate.setDate(diff)
      currentWeekStart.value = firstAvailableDate
      updateWeekDates()
    }
  } catch (error) {
    console.error('Ошибка при загрузке расписания врача:', error)
  } finally {
    schedulePending.value = false
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

/**
 * Форматирует номер телефона
 * @param value - Введенное значение
 * @returns Отформатированный номер телефона
 */
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

/**
 * Обработчик ввода номера телефона
 * @param event - Событие ввода
 */
const handlePhoneInput = (event) => {
  const value = event.target.value
  const formatted = formatPhoneNumber(value)
  phoneNumber.value = formatted
}

/**
 * Обработчик нажатия клавиш при вводе телефона
 * @param event - Событие нажатия клавиши
 * @returns {boolean} - Разрешить ввод или нет
 */
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

// Проверка валидности номера телефона
const isPhoneValid = computed(() => {
  return phoneDigits.value.length === 10
})

// Фильтрация врачей по выбранной категории
const filteredDoctors = computed(() => {
  if (!selectedCategory.value) return []
  return doctors.value
    .filter(doctor => {
      return doctor.categories && 
             doctor.categories.some(category => category.id === selectedCategory.value.id) && 
             doctor.availableFrom !== null
    })
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
  // Очищаем таймер при сбросе формы
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
  
  currentStep.value = 1
  selectedType.value = null
  selectedCategory.value = null
  selectedDoctor.value = null
  selectedTime.value = null
  phoneNumber.value = '+7 ('
  phoneDigits.value = ''
  smsCode.value = ''
  showSmsInput.value = false
  stepHistory.value = [1]
  requestId.value = null
  smsMessage.value = ''
  canRequestSms.value = true
  timeLeft.value = 300
  confirmationMessage.value = ''
  hasError.value = false
  isBookingSuccess.value = false
  isSendingSms.value = false
  clientFullName.value = ''
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
  currentStep.value = 4
  await fetchDoctorSchedule(doctor.id)
  stepHistory.value.push(4)
}

const selectTime = (slot) => {
  selectedTime.value = slot
  currentStep.value = 5
  stepHistory.value.push(5)
}

const goBack = () => {
  if (stepHistory.value.length > 1) {
    const step = stepHistory.value[stepHistory.value.length - 1]
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

    if (step === 5) {
      // Очищаем форму подтверждения
      clientFullName.value = ''
      phoneNumber.value = '+7 ('
      phoneDigits.value = ''
      smsCode.value = ''
      showSmsInput.value = false
      requestId.value = null
      smsMessage.value = ''
      canRequestSms.value = true
      timeLeft.value = 300
      confirmationMessage.value = ''
      hasError.value = false
      isBookingSuccess.value = false
      isSendingSms.value = false
      
      // Очищаем таймер при возврате с шага подтверждения
      if (timerId.value) {
        clearInterval(timerId.value)
        timerId.value = null
      }

      fetchDoctorSchedule(selectedDoctor.value.id)
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
  const weekSlots = weekDates.map(date => {
    const dateStr = date.toISOString().split('T')[0]
    const existingDay = timeSlots.value.find(day => day.date === dateStr)
    
    return {
      date: dateStr,
      slots: existingDay ? existingDay.slots : [],
      isEmpty: !existingDay
    }
  })

  // Проверяем, есть ли хотя бы один день с доступными слотами
  const hasAvailableSlots = weekSlots.some(day => day.slots.length > 0)
  
  // Если нет доступных слотов, возвращаем пустой массив
  if (!hasAvailableSlots) {
    return []
  }

  return weekSlots
})

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

const prevWeek = () => {
  const date = new Date(currentWeekStart.value)
  date.setDate(date.getDate() - 7)
  currentWeekStart.value = date
  updateWeekDates()
  
  // Если после переключения на предыдущую неделю нет доступных слотов,
  // продолжаем переключаться, пока не найдем неделю со слотами
  if (currentWeekSlots.value.length === 0 && canGoPrevWeek.value) {
    prevWeek()
  }
}

const nextWeek = () => {
  const date = new Date(currentWeekStart.value)
  date.setDate(date.getDate() + 7)
  currentWeekStart.value = date
  updateWeekDates()
  
  // Если после переключения на следующую неделю нет доступных слотов,
  // продолжаем переключаться, пока не найдем неделю со слотами
  if (currentWeekSlots.value.length === 0 && canGoNextWeek.value) {
    nextWeek()
  }
}

const startTimer = () => {
  // Очищаем предыдущий таймер, если он существует
  if (timerId.value) {
    clearInterval(timerId.value)
  }
  
  canRequestSms.value = false
  timeLeft.value = 300
  
  timerId.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerId.value)
      timerId.value = null
      canRequestSms.value = true
    }
  }, 1000)
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const isFullNameValid = computed(() => {
  const words = clientFullName.value.split(/\s+/).filter(word => word.length > 0)
  return words.length >= 2 && words.length <= 5 && words.every(word => word.length > 1)
})

const validateFullName = () => {
  const words = clientFullName.value.split(/\s+/).filter(word => word.length > 0)
  
  if (words.length < 2 || words.length > 5 || words.some(word => word.length <= 1)) {
    return 'Некорректное ФИО'
  }

  return null
}

const sendSmsCode = async () => {
  if (!isPhoneValid.value || !canRequestSms.value) return
  
  const validationError = validateFullName()
  if (validationError) {
    smsMessage.value = validationError
    return
  }
  
  try {
    isSendingSms.value = true
    const response = await $fetch(`${useRuntimeConfig().public.appointmentBase}/booking/request-confirmation`, {
      method: 'POST',
      body: {
        clientPhone: phoneDigits.value
      }
    })
    
    if (response) {
      requestId.value = response.requestId
      smsMessage.value = response.message
      showSmsInput.value = true
      startTimer()
    }
  } catch (error) {
    console.error('Ошибка при отправке SMS:', error)
    smsMessage.value = 'Произошла ошибка при отправке SMS. Попробуйте позже.'
  } finally {
    isSendingSms.value = false
  }
}

const handleFullNameInput = (event) => {
  // Удаляем только цифры и числа
  clientFullName.value = event.target.value.replace(/[0-9]/g, '')
}

const confirmBooking = async () => {
  if (!smsCode.value || !requestId.value || !isFullNameValid.value) return
  
  try {
    const response = await $fetch(`${useRuntimeConfig().public.appointmentBase}/booking/confirm`, {
      method: 'POST',
      body: {
        requestId: requestId.value,
        verificationCode: smsCode.value,
        branchId: 1,
        doctorId: selectedDoctor.value.id,
        doctorName: selectedDoctor.value.name,
        startDateTime: selectedTime.value.startDateTime,
        clientFullName: clientFullName.value.trim(),
        clientPhone: phoneDigits.value,
        planStart: selectedTime.value.startDateTime,
        comment: ''
      }
    })
    
    if (response) {
      confirmationMessage.value = response.message
      hasError.value = false
      isBookingSuccess.value = true
      smsCode.value = ''
    }
  } catch (error) {
    console.error('Ошибка при подтверждении записи:', error)
    confirmationMessage.value = error.data?.error || 'Произошла ошибка при подтверждении записи. Попробуйте позже.'
    hasError.value = true
  }
}

const downloadAppointmentPDF = async () => {
  const appointmentInfo = document.querySelector('.confirmation-info')
  if (!appointmentInfo) return

  try {
    const canvas = await html2canvas(appointmentInfo, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    const date = new Date(selectedTime.value.startDateTime)
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getFullYear()).slice(-2)}`
    pdf.save(`Запись на ${formattedDate} в Дентал.pdf`)
  } catch (error) {
    console.error('Ошибка при создании PDF:', error)
  }
}

defineExpose({
  openModal
})
</script>

/**
 * Шаблон компонента записи на прием
 * Содержит модальное окно с пошаговым интерфейсом записи
 */
<template>
  <!-- Кнопка открытия модального окна -->
  <button 
    class="appointment-button" 
    @click="isOpen = true"
  >
    Записаться на прием
  </button>

  <!-- Модальное окно записи -->
  <div 
    v-if="isOpen" 
    class="appointment-modal"
    @click.self="closeModal"
  >
    <div class="appointment-content">
      <!-- Заголовок и кнопка закрытия -->
      <div class="appointment-header">
        <h2>{{ currentStepTitle }}</h2>
        <button 
          class="close-button"
          @click="closeModal"
        >
          ×
        </button>
      </div>

      <!-- Шаги записи -->
      <div class="appointment-steps">
        <!-- Шаг 1: Выбор типа записи -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="type-selection">
            <button 
              class="type-button"
              @click="selectType('category')"
            >
              <span class="icon">📋</span>
              <span>По категории</span>
            </button>
            <button 
              class="type-button"
              @click="selectType('doctor')"
            >
              <span class="icon">👨‍⚕️</span>
              <span>По врачу</span>
            </button>
          </div>
        </div>

        <!-- Шаг 2: Выбор категории или врача -->
        <div v-if="currentStep === 2" class="step-content">
          <!-- Выбор категории -->
          <div v-if="selectedType === 'category'" class="categories-list">
            <button 
              v-for="category in categories"
              :key="category.id"
              class="category-button"
              @click="selectCategory(category)"
            >
              {{ category.name }}
            </button>
          </div>

          <!-- Выбор врача -->
          <div v-else class="doctors-list">
            <div 
              v-for="doctor in doctors"
              :key="doctor.id"
              class="doctor-card"
              @click="selectDoctor(doctor)"
            >
              <img 
                :src="`${imgBase}${doctor.photo}`"
                :alt="doctor.name"
                class="doctor-photo"
              >
              <div class="doctor-info">
                <h3>{{ doctor.name }}</h3>
                <p>{{ doctor.speciality }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 3: Выбор врача (если выбрана категория) -->
        <div v-if="currentStep === 3" class="step-content">
          <div class="doctors-list">
            <div 
              v-for="doctor in filteredDoctors"
              :key="doctor.id"
              class="doctor-card"
              @click="selectDoctor(doctor)"
            >
              <img 
                :src="`${imgBase}${doctor.photo}`"
                :alt="doctor.name"
                class="doctor-photo"
              >
              <div class="doctor-info">
                <h3>{{ doctor.name }}</h3>
                <p>{{ doctor.speciality }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 4: Выбор времени -->
        <div v-if="currentStep === 4" class="step-content">
          <div class="schedule-container">
            <!-- Навигация по неделям -->
            <div class="week-navigation">
              <button 
                @click="previousWeek"
                :disabled="!canGoPrevious"
              >
                ←
              </button>
              <span>{{ currentWeekDates }}</span>
              <button 
                @click="nextWeek"
                :disabled="!canGoNext"
              >
                →
              </button>
            </div>

            <!-- Сетка расписания -->
            <div class="schedule-grid">
              <div 
                v-for="slot in timeSlots"
                :key="slot.date"
                class="time-slot"
                :class="{ 'available': slot.slots.length > 0 }"
                @click="selectTime(slot)"
              >
                <span class="date">{{ formatDate(slot.date) }}</span>
                <span class="time">{{ slot.slots[0]?.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 5: Подтверждение записи -->
        <div v-if="currentStep === 5" class="step-content">
          <div class="confirmation-form">
            <!-- Поле ввода ФИО -->
            <div class="form-group">
              <label>ФИО</label>
              <input 
                v-model="clientFullName"
                type="text"
                placeholder="Введите ваше полное имя"
              >
            </div>

            <!-- Поле ввода телефона -->
            <div class="form-group">
              <label>Телефон</label>
              <input 
                v-model="phoneNumber"
                type="tel"
                @input="handlePhoneInput"
                @keydown="handlePhoneKeyDown"
                placeholder="+7 (___) ___-__-__"
              >
            </div>

            <!-- Поле ввода кода подтверждения -->
            <div v-if="showSmsInput" class="form-group">
              <label>Код подтверждения</label>
              <input 
                v-model="smsCode"
                type="text"
                placeholder="Введите код из SMS"
              >
              <div class="sms-timer" v-if="timeLeft > 0">
                Повторная отправка через {{ formatTimeLeft }}
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="form-actions">
              <button 
                v-if="!showSmsInput"
                @click="requestSmsCode"
                :disabled="!isPhoneValid || isSendingSms"
              >
                Получить код
              </button>
              <button 
                v-else
                @click="confirmBooking"
                :disabled="!isFormValid"
              >
                Подтвердить запись
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Навигация между шагами -->
      <div class="step-navigation">
        <button 
          v-if="currentStep > 1"
          @click="previousStep"
          class="back-button"
        >
          Назад
        </button>
      </div>
    </div>
  </div>
</template>

/**
 * Стили компонента записи на прием
 * Определяют внешний вид модального окна и его элементов
 */
<style lang="scss" scoped>
// Кнопка открытия модального окна
.appointment-button {
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--primary-color-dark);
  }
}

// Модальное окно
.appointment-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

// Контент модального окна
.appointment-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
}

// Заголовок модального окна
.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 24px;
    color: var(--text-color);
  }
}

// Кнопка закрытия
.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color-light);
  padding: 4px;
  line-height: 1;

  &:hover {
    color: var(--text-color);
  }
}

// Шаги записи
.appointment-steps {
  margin-bottom: 24px;
}

// Контент шага
.step-content {
  padding: 16px 0;
}

// Выбор типа записи
.type-selection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.type-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary-color);
    background-color: var(--background-color-light);
  }

  .icon {
    font-size: 32px;
    margin-bottom: 12px;
  }
}

// Список категорий
.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.category-button {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary-color);
    background-color: var(--background-color-light);
  }
}

// Список врачей
.doctors-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.doctor-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary-color);
    background-color: var(--background-color-light);
  }
}

.doctor-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
}

.doctor-info {
  h3 {
    margin: 0 0 4px;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: var(--text-color-light);
  }
}

// Расписание
.schedule-container {
  margin-top: 16px;
}

.week-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-color);

    &:disabled {
      color: var(--text-color-light);
      cursor: not-allowed;
    }
  }
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.time-slot {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;

  &.available {
    &:hover {
      border-color: var(--primary-color);
      background-color: var(--background-color-light);
    }
  }

  .date {
    display: block;
    font-size: 14px;
    color: var(--text-color-light);
    margin-bottom: 4px;
  }

  .time {
    display: block;
    font-size: 16px;
    font-weight: 500;
  }
}

// Форма подтверждения
.confirmation-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-color);
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
}

.sms-timer {
  margin-top: 8px;
  font-size: 14px;
  color: var(--text-color-light);
}

.form-actions {
  margin-top: 24px;
  text-align: center;

  button {
    padding: 12px 24px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:disabled {
      background-color: var(--text-color-light);
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background-color: var(--primary-color-dark);
    }
  }
}

// Навигация между шагами
.step-navigation {
  margin-top: 24px;
  text-align: left;

  .back-button {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: 16px;
    padding: 8px 0;

    &:hover {
      color: var(--primary-color);
    }
  }
}
</style> 