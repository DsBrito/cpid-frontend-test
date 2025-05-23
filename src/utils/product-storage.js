// Código retirado de: https://github.com/EstudosCpid/mini-curso-frontend-2025/blob/main/docs-mini-curso/util.js

// Salva um value no localStorage com a chave key

const saveLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

// Retorna o value salvo no localStorage com a chave key ou um array vazio caso não exista
const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key)) || []
}

const addNewData = (key, data) => {
  // Busca os dados salvos no localStorage com a chave key
  const dataStorage = getLocalStorage(key)
  // Gera um id para o novo dado
  const id = dataStorage.length ? dataStorage[dataStorage.length - 1].id + 1 : 1
  // Cria um novo dado com o id gerado e os dados passados
  const newData = { id, ...data }
  // Adiciona o novo dado ao array de dados
  dataStorage.push(newData)
  // Salva o array de dados atualizado no localStorage
  saveLocalStorage(key, dataStorage)
}

const editData = (key, id, data) => {
  // Busca os dados salvos no localStorage com a chave key
  const dataStorage = getLocalStorage(key)
  // Busca o índice do dado que será editado
  const index = dataStorage.findIndex((item) => item.id === id)
  // Substitui o dado antigo pelo novo dado
  dataStorage[index] = { id, ...data }
  // Salva o array de dados atualizado no localStorage
  saveLocalStorage(key, dataStorage)
}

const deleteData = (key, id) => {
  // Busca os dados salvos no localStorage com a chave key
  const dataStorage = getLocalStorage(key)
  // Busca o índice do dado que será deletado
  const index = dataStorage.findIndex((item) => item.id === id)
  // Remove o dado do array
  dataStorage.splice(index, 1)
  // Salva o array de dados atualizado no localStorage
  saveLocalStorage(key, dataStorage)
}

const clearData = (key) => {
  saveLocalStorage(key, [])
}

export { saveLocalStorage, getLocalStorage, addNewData, editData, deleteData, clearData }
