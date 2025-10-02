<template>
  <!-- ==================== Start Contact ==================== -->
  <section class="contact section-padding">
    <div class="container">
      <div class="sec-head mb-80">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <div class="d-inline-block">
              <div class="sub-title-icon d-flex align-items-center">
                <span class="icon fas fa-map-marker-alt"></span>
                <h6>聯絡我</h6>
              </div>
            </div>
            <h3>如有任何問題，請隨時與我聯繫。</h3>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <div class="google-map mb-80">
            <iframe
              id="gmap_canvas"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1807.7907963814307!2d121.46259308881785!3d25.01432952508229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a8196a224e67%3A0xec9f88ff96729962!2zMjIw5paw5YyX5biC5p2_5qmL5Y2A57ij5rCR5aSn6YGT5LqM5q61N-iVn-adv-api-i7iuermQ!5e0!3m2!1szh-TW!2stw!4v1722060602168!5m2!1szh-TW!2stw"
              width="100%"
              height="400"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
        </div>
        <div class="col-lg-5 valign">
          <div class="info full-width md-mb80">
            <div class="item mb-30 d-flex align-items-center">
              <div class="mr-15">
                <font-awesome-icon :icon="['far', 'envelope']" class="icon main-color" />
              </div>
              <div class="mr-10">
                <h6 class="opacity-7">Email</h6>
              </div>
              <div class="ml-auto">
                <h4>
                  <a href="mailto:homerxworkshop@gmail.com">homerxworkshop@gmail.com</a>
                </h4>
              </div>
            </div>
            <div class="item d-flex align-items-center">
              <div class="mr-15">
                <font-awesome-icon :icon="['far', 'map']" class="icon main-color" />
              </div>
              <div class="mr-10">
                <h6 class="opacity-7">Address</h6>
              </div>
              <div class="ml-auto">
                <h4>新北市板橋區，台灣</h4>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-7 valign">
          <div class="full-width">
            <form id="contact-form" @submit.prevent="submitForm">
              <div v-if="formMessage" class="messages">
                <div :class="messageClass">{{ formMessage }}</div>
              </div>

              <div class="controls row">
                <div class="col-lg-6">
                  <div class="form-group mb-30">
                    <label>你的名字 *</label>
                    <input
                      v-model="name"
                      name="name"
                      type="text"
                      required
                      :disabled="isSubmitting"
                      class="form-control"
                      :class="{
                        'is-invalid': touched.name && errors.name,
                        'is-valid': touched.name && name && !errors.name,
                      }"
                      @blur="
                        () => {
                          nameBlur()
                          touched.name = true
                        }
                      "
                    />
                    <div v-if="touched.name && errors.name" class="error-message">
                      {{ errors.name }}
                    </div>
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group mb-30">
                    <label>你的電子信箱 *</label>
                    <input
                      v-model="email"
                      name="email"
                      type="email"
                      required
                      :disabled="isSubmitting"
                      class="form-control"
                      :class="{
                        'is-invalid': touched.email && errors.email,
                        'is-valid': touched.email && email && !errors.email,
                      }"
                      @blur="
                        () => {
                          emailBlur()
                          touched.email = true
                        }
                      "
                    />
                    <div v-if="touched.email && errors.email" class="error-message">
                      {{ errors.email }}
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group mb-30">
                    <label>主旨</label>
                    <input
                      v-model="subject"
                      name="subject"
                      type="text"
                      :disabled="isSubmitting"
                      class="form-control"
                      :class="{
                        'is-invalid': touched.subject && errors.subject,
                        'is-valid': touched.subject && subject && !errors.subject,
                      }"
                      @blur="
                        () => {
                          subjectBlur()
                          touched.subject = true
                        }
                      "
                    />
                    <div v-if="touched.subject && errors.subject" class="error-message">
                      {{ errors.subject }}
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group">
                    <label>你的訊息 *</label>
                    <textarea
                      v-model="message"
                      name="message"
                      rows="6"
                      required
                      :disabled="isSubmitting"
                      placeholder="請詳細描述您的需求、預算範圍、專案時程等資訊..."
                      class="form-control"
                      :class="{
                        'is-invalid': touched.message && errors.message,
                        'is-valid': touched.message && message && !errors.message,
                      }"
                      @blur="
                        () => {
                          messageBlur()
                          touched.message = true
                        }
                      "
                    ></textarea>
                    <div v-if="touched.message && errors.message" class="error-message">
                      {{ errors.message }}
                    </div>
                  </div>

                  <!-- 蜜罐欄位 - 用於防止機器人 -->
                  <div style="display: none">
                    <input
                      v-model="honeypot"
                      type="text"
                      name="website"
                      tabindex="-1"
                      autocomplete="off"
                    />
                  </div>

                  <div class="mt-30">
                    <button type="submit" :disabled="isSubmitting" class="submit-btn">
                      <span v-if="!isSubmitting" class="text">傳送訊息</span>
                      <span v-else class="text">
                        <i class="fas fa-spinner fa-spin"></i> 傳送中...
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- ==================== End Contact ==================== -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useTimeoutFn } from '@vueuse/core'
import { useFormValidation } from '@/composables/useFormValidation.js'

const isSubmitting = ref(false)
const formMessage = ref('')
const messageClass = ref('')
const recaptchaToken = ref('')
const honeypot = ref('') // 蜜罐欄位

// 追蹤欄位是否已被觸碰
const touched = ref({
  name: false,
  email: false,
  subject: false,
  message: false,
})

// 引入表單驗證
const { formSchema, isBot, checkSpam, updateSubmitStats, initFormStartTime } = useFormValidation()

// 使用 VeeValidate
const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: formSchema,
  validateOnMount: false, // 禁止在掛載時驗證
  validateOnBlur: true, // 在失去焦點時驗證
  validateOnChange: true, // 在值改變時驗證
  validateOnInput: false, // 禁止在輸入時驗證
})

// 使用 useField 處理各個欄位
const { value: name, handleBlur: nameBlur } = useField('name')
const { value: email, handleBlur: emailBlur } = useField('email')
const { value: subject, handleBlur: subjectBlur } = useField('subject')
const { value: message, handleBlur: messageBlur } = useField('message')

// 使用 reCAPTCHA
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

// 初始化
onMounted(() => {
  initFormStartTime()
})

// 提交表單
const submitForm = handleSubmit(async formValues => {
  // 在提交時將所有欄位標記為已觸碰
  Object.keys(touched.value).forEach(key => {
    touched.value[key] = true
  })

  if (isSubmitting.value) return

  // 檢查是否為機器人
  if (isBot() || honeypot.value) {
    // 若為機器人，假裝成功但不實際發送
    formMessage.value = '訊息已成功發送！'
    messageClass.value = 'alert alert-success'
    resetForm()
    return
  }

  // 防垃圾訊息檢查
  if (!checkSpam()) {
    formMessage.value = '提交過於頻繁，請稍後再試'
    messageClass.value = 'alert alert-danger'
    return
  }

  isSubmitting.value = true
  formMessage.value = ''

  try {
    // 獲取 reCAPTCHA token
    await recaptchaLoaded()
    recaptchaToken.value = await executeRecaptcha('contact')

    // 提交表單
    const res = await fetch('https://portfolio-backend-pky9.onrender.com/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formValues,
        recaptchaToken: recaptchaToken.value,
      }),
    })

    if (!res.ok) throw new Error()

    // 更新提交統計
    updateSubmitStats()

    formMessage.value = '訊息已成功發送！'
    messageClass.value = 'alert alert-success'
    resetForm()
    // 重置觸碰狀態
    Object.keys(touched.value).forEach(key => {
      touched.value[key] = false
    })
  } catch {
    formMessage.value = '發送失敗，請稍後再試。'
    messageClass.value = 'alert alert-danger'
  } finally {
    isSubmitting.value = false
    // 使用 VueUse 的 useTimeoutFn 替代 setTimeout
    useTimeoutFn(() => (formMessage.value = ''), 5000)
  }
})
</script>

<style scoped>
.google-map iframe {
  width: 100%;
  height: 400px;
  border: 0;
  border-radius: 10px;
}

.info .item {
  padding: 30px 25px;
  border-radius: 10px;
  position: relative;
  background: #0c0c0c;
}

.info .item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.04));
  opacity: 0.3;
  pointer-events: none;
  border-radius: 10px;
}

.info .item::after {
  content: '';
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -1px;
  left: -1px;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.01));
  pointer-events: none;
  border-radius: 10px;
}

.info .item .icon {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: var(--maincolor);
  font-size: 20px;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--maincolor);
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #333;
  transform: translateY(-2px);
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #fff;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: transparent;
  color: #fff;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #fff;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.submit-btn {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px 35px;
  width: 100%;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.4s;
  min-width: 150px;
}

.submit-btn:hover:not(:disabled) {
  background: var(--maincolor);
  color: #1d1d1d;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.messages .alert {
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.alert-success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.contact-alternatives {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 40px;
  color: #fff;
}

.contact-card {
  background: #0c0c0c;
  border-radius: 10px;
  transition: all 0.3s ease;
  height: 100%;
  color: #fff;
  position: relative;
}

.contact-card:before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.04));
  opacity: 0.3;
  border-radius: 10px;
  pointer-events: none;
}

.contact-card:hover {
  background: #1a1a1a;
  transform: translateY(-5px);
}

.contact-link {
  color: var(--maincolor);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #333;
  text-decoration: underline;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.form-control.is-valid {
  border-color: #198754 !important;
}

@media (max-width: 768px) {
  .info .item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .info .item .ml-auto {
    margin-left: 0 !important;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
