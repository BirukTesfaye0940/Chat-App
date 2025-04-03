const socket = io()

const clientsTotal = document.getElementById('client-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  sendMessage()
})

socket.on('clients-total', (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`
})

function sendMessage() {
  if(messageInput.value === '') return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date()
  }
  socket.emit('message', data)
  addMessageToUi(true, data)
  messageInput.value = ''
}

socket.on('chat-message', (data) => {
  addMessageToUi(false, data)
})

function addMessageToUi(isOwnMessage, data) {
  clearFeedback()
  const element = `
  <li class="${isOwnMessage ? "message-right" : "message-left"}">
    <p class="message">
      ${data.message}
      <span>
        ${data.name} ● ${moment(data.dateTime).fromNow()}
      </span>
    </p>
  </li>`
  
  messageContainer.innerHTML += element
  scrollToBottom() // Fixed: Added parentheses to call the function
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `${nameInput.value} is typing a message...`
  })
})

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `${nameInput.value} is typing a message...`
  })
})

messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: ''
  })
})

socket.on('feedback', (data) => { // Fixed: corrected 'om' to 'on'
  clearFeedback()
  if (data.feedback) { // Only add feedback if there's content
    const element = `
    <li class="message-feedback">
      <p class="feedback" id="feedback">✍️ ${data.feedback}</p>
    </li>`
    messageContainer.innerHTML += element // Fixed: corrected =+ to +=
    scrollToBottom()
  }
})

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach(element => {
    element.parentNode.removeChild(element)
  })
}