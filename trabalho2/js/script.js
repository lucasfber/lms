// let groups = [];

const API_URL = "http://rest.learncode.academy/api/bertoldo";
let currentChatUser = document.querySelector(".friend-name");
let modalLogin = document.querySelector(".modal");
let btnFormLogin = document.querySelector(".btnFormLogin");
let modalFormLogin = document.querySelector("#form-login");
let btnLogin = document.querySelector(".btn-login");
let btnLogout = document.querySelector(".btn-logout");
let formNewGroup = document.querySelector(".form-create-group");

/* let btnSendMessage = document.querySelector(".btnSend"); */

let currentUser = null;

/* btnSendMessage.addEventListener("click", function() {
  sendMessage("groupfamilia");
}); */

btnLogout.addEventListener("click", function() {
  logout();
});

function checkUserLogin() {
  hasUserLoged() === null
    ? btnLogout.classList.toggle("hide-button")
    : btnLogin.classList.toggle("hide-button");
}

function logout() {
  localStorage.removeItem("user");
}

formNewGroup.addEventListener("submit", function(e) {
  e.preventDefault();
  const groupName = e.target.groupName.value;
  const groupID = e.target.groupID.value;

  const group = {
    groupName: groupName,
    groupID: groupID
  };

  console.log(groupName, groupID);
  e.target.groupName.value = "";
  e.target.groupID.value = "";

  createNewGroup(group);
});

function createNewGroup(group) {
  let xhr = new XMLHttpRequest();

  xhr.open("POST", `${API_URL}/groups`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      getGroups();
    }
  };
  xhr.send(JSON.stringify(group));
}

function getGroups() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", API_URL + "/groups", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let groups = [];
      groups = JSON.parse(this.response);
      createGroups(groups);
    }
  };

  xhr.send();
}

modalFormLogin.addEventListener("submit", function(e) {
  e.preventDefault();
  currentUser = document.querySelector(".userId").value;

  addUserToLocalStorage(currentUser);
  console.log("entrou aqui");
  modalLogin.style.display = "none";
});

function addUserToLocalStorage(userID) {
  localStorage.setItem("user", userID);
}

function createGroups(groups) {
  console.log(groups);
  let listGroupsDiv = document.querySelector(".friends-list");
  listGroupsDiv.innerHTML = "";

  if (groups.length > 0) {
    groups.forEach(group => {
      let groupDiv = document.createElement("div");
      groupDiv.classList.add("group");

      let pic = document.createElement("img");
      pic.classList.add("group-pic");
      pic.src = "img/group-icon.png";

      let groupName = document.createElement("h5");
      let name = document.createTextNode(group.groupName);
      groupName.appendChild(name);

      groupDiv.appendChild(pic);
      groupDiv.appendChild(groupName);

      setClickListener(groupDiv, group);

      listGroupsDiv.appendChild(groupDiv);

      createChatForm(group.groupID);
    });
  }
}

function getMessages(groupID) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `${API_URL}/${groupID}`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      let messages = JSON.parse(this.response);
      messages.forEach(message => createPanelMessage(message));
    }
  };
  xhr.send();
}

function setClickListener(groupDiv, group) {
  groupDiv.addEventListener("click", function() {
    toggleGroupActive(groupDiv);
    setGroupName(groupDiv);
    clearMessagesSection();
    setGroupName(groupDiv);
    getMessages(group.groupID);
  });
}

function createPanelMessage(user) {
  console.log("Quando isso é chamdo?");
  let messagesSection = document.querySelector(".messages");

  let panel = document.createElement("div");
  panel.classList.add("panel");

  let panelTitle = document.createElement("div");
  let title = document.createElement("h5");
  title.innerHTML = user.userName;
  panelTitle.classList.add("panel-heading");
  panelTitle.appendChild(title);

  let panelBody = document.createElement("div");
  panelBody.innerHTML = user.message;
  panelBody.classList.add("panel-body");

  panel.appendChild(panelTitle);
  panel.appendChild(panelBody);

  messagesSection.appendChild(panel);
}

function sendMessage(groupID, message) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${API_URL}/${groupID}`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      console.log("Deu certo", this.response);
    }
  };
  xhr.send(
    JSON.stringify({ userName: localStorage.getItem("user"), message: message })
  );
}

function createChatForm(groupID) {
  let messageWrapper = document.querySelector(".message-wrapper");

  let formMessage = document.createElement("form");
  formMessage.classList.add("chat-form");
  formMessage.id = "chat-form";

  let inputMessage = document.createElement("input");
  inputMessage.type = "text";
  inputMessage.id = "messageUser";
  inputMessage.placeholder = "Digite sua mensagem";
  inputMessage.classList.add("messageUser");

  formMessage.addEventListener("submit", function(e) {
    e.preventDefault();
    message = inputMessage.value;
    inputMessage.value = "";

    sendMessage(groupID, message);
    let messagesSection = document.querySelector(".messages");
    messagesSection.innerHTML = "";
    getMessages(groupID);
  });

  let buttonSend = document.createElement("button");
  buttonSend.type = "submit";
  buttonSend.innerHTML = "Enviar";
  buttonSend.classList.add("btnSend");

  formMessage.appendChild(inputMessage);
  formMessage.appendChild(buttonSend);

  messageWrapper.appendChild(formMessage);
  /* let messagesSection = document.querySelector(".messages");

  let chatWrapper = document.createElement("div");
  chatWrapper.classList.add("chat-wrapper");

  let formMessage = document.createElement("form");
  formMessage.id = "chat-form";

  let inputMessage = document.createElement("input");
  inputMessage.type = "text";
  inputMessage.id = "messageUser";
  inputMessage.placeholder = "Digite sua mensagem";
  inputMessage.classList.add("messageUser");

  formMessage.addEventListener("submit", function(e) {
    e.preventDefault();
    message = inputMessage.value;
    sendMessage(groupID, message);
  });

  let buttonSend = document.createElement("button");
  buttonSend.type = "submit";
  buttonSend.innerHTML = "Enviar";
  buttonSend.classList.add("btnSend");

  formMessage.appendChild(inputMessage);
  formMessage.appendChild(buttonSend);

  chatWrapper.appendChild(formMessage);

  messagesSection.appendChild(chatWrapper); */
}

function setGroupName(group) {
  let name = group.childNodes[1].innerHTML;
  currentChatUser.innerHTML = name;
}

function clearMessagesSection() {
  let messages = document.querySelector(".messages");
  messages.innerHTML = " ";
}

function toggleGroupActive(group) {
  currentGroupActive = document.querySelector(".active");
  if (currentGroupActive !== null) {
    currentGroupActive.classList.toggle("active");
  }

  group.classList.toggle("active");
}

function setButtonLogin() {
  console.log("Ta chamando?");
  btnLogin.addEventListener("click", function() {
    openModal();
  });
}

function closeModal(e) {
  if (e.target.id === "modal") {
    modalLogin.style.display = "none";
  }
}

function hasUserLoged() {
  return localStorage.getItem("user");
}

function openModal() {
  modalLogin.style.display = "block";
  modalLogin.addEventListener("click", closeModal);
}

getGroups();

hasUserLoged();

checkUserLogin();
setButtonLogin();
