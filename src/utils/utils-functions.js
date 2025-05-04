import { Notify } from 'quasar'

const showNotification = (type, message) => {
  Notify.create({
    type,
    message,
    timeout: 2000,
    position: 'top',
  })
}

const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${day}/${month}/${year}`
}
export { showNotification, getCurrentDate }
