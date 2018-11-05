let groups = [];

const API_URL = "http://rest.learncode.academy/api/bertoldo";
let currentChatUser = document.querySelector(".friend-name");

function createGroups() {
  let listGroupsDiv = document.querySelector(".friends-list");

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
    });
  }
}

function getGroups() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", API_URL + "/groups", true);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      groups = JSON.parse(this.response);
      createGroups();
    }
  };
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send();
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

getGroups();
