let groups = [
  {
    grupo: "Grupo da Família",
    mensagens: [
      {
        usuario: "joao03",
        texto: "Tudo bem?"
      },
      {
        usuario: "victor23",
        texto: "Tudo tranqs"
      },
      {
        usuario: "joao03",
        texto: "Q bom"
      }
    ]
  },
  {
    grupo: "Churrascao no domingao",
    mensagens: [
      {
        usuario: "maria2000",
        texto: "Na paz?"
      },
      {
        usuario: "victor23",
        texto: "Show"
      },
      {
        usuario: "maria2000",
        texto: "Q bom"
      }
    ]
  },
  {
    grupo: "Só topzera",
    mensagens: [
      {
        usuario: "victor23",
        texto: "bom?"
      },
      {
        usuario: "robson_alves",
        texto: "Tudo bom"
      },
      {
        usuario: "victor23",
        texto: "Q bom"
      }
    ]
  }
];

let currentChatUser = document.querySelector(".friend-name");
createGroups();

function createGroups() {
  let listGroupsDiv = document.querySelector(".friends-list");
  groups.forEach(group => {
    let groupDiv = document.createElement("div");
    groupDiv.classList.add("group");

    let pic = document.createElement("img");
    pic.classList.add("group-pic");
    pic.src = "img/group-icon.png";

    let groupName = document.createElement("h5");
    let name = document.createTextNode(group.grupo);
    groupName.appendChild(name);

    groupDiv.appendChild(pic);
    groupDiv.appendChild(groupName);

    setClickListener(groupDiv, group);

    listGroupsDiv.appendChild(groupDiv);
  });
}

function setClickListener(groupDiv, group) {
  groupDiv.addEventListener("click", function() {
    toggleGroupActive(groupDiv);
    setGroupName(groupDiv);
    clearMessagesSection();
    group.mensagens.forEach(message => createPanelMessage(message));
  });
}

function createPanelMessage(user) {
  let messagesSection = document.querySelector(".messages");

  let panel = document.createElement("div");
  panel.classList.add("panel");

  let panelTitle = document.createElement("div");
  let title = document.createElement("h5");
  title.innerHTML = user.usuario;
  panelTitle.classList.add("panel-heading");
  panelTitle.appendChild(title);

  let panelBody = document.createElement("div");
  panelBody.innerHTML = user.texto;
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
