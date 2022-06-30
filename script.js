let addBtn = document.querySelector(".add-button");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let modalPriorityColor = "black";
let allPriorityColors = document.querySelectorAll(".ticket-color");
let colors = ["lightpink", "lightgreen", "lightblue", "black"];
let addflag = false;
let removeflag = false;
let removeBtn = document.querySelector(".remove-button");
let tickets = document.querySelectorAll(".ticket-cont");
let isopen = false;
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let ticketsArr = [];
let toolBoxColors = document.querySelectorAll(".color");

if (localStorage.getItem("tickets")) {
  ticketsArr = JSON.parse(localStorage.getItem("tickets"));
  ticketsArr.forEach((ticketObj) => {
    createTicket(
      ticketObj.ticketColor,
      ticketObj.ticketTask,
      ticketObj.ticketId
    );
  });
}
for (let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener("click", (e) => {
    let currentToolBoxColor = toolBoxColors[i].classList[1];

    let filteredTickets = ticketsArr.filter((ticketObj, idx) => {
      return currentToolBoxColor === ticketObj.ticketColor;
    });
    let allTicketsCont = document.querySelectorAll(".ticket-cont");
    for (let i = 0; i < allTicketsCont.length; i++) {
      allTicketsCont[i].remove();
    }

    filteredTickets.forEach((ticketObj, idx) => {
      createTicket(
        ticketObj.ticketColor,
        ticketObj.ticketTask,
        ticketObj.ticketId
      );
    });
  });

  toolBoxColors[i].addEventListener("dblclick", (e) => {
    let allTicketsCont = document.querySelectorAll(".ticket-cont");
    for (let i = 0; i < allTicketsCont.length; i++) {
      allTicketsCont[i].remove();
    }

    ticketsArr.forEach((ticketObj, idx) => {
      createTicket(
        ticketObj.ticketColor,
        ticketObj.ticketTask,
        ticketObj.ticketId
      );
    });
  });
}
tickets.forEach((tick) => {
  tick.addEventListener("click", (e) => {
    if (removeflag == true) {
      tick.remove();
    }
  });
});
removeBtn.addEventListener("click", (e) => {
  removeflag = !removeflag;
});

allPriorityColors.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    allPriorityColors.forEach((colo) => {
      colo.classList.remove("active");
    });
    modalPriorityColor = colorElem.classList[1];
    colorElem.classList.add("active");
  });
});
addBtn.addEventListener("click", (e) => {
  addflag = !addflag;
  if (addflag) {
    modalCont.style.display = "flex";
  } else {
    modalCont.style.display = "none";
  }
});
modalCont.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key == "Shift") {
    createTicket(modalPriorityColor, textareaCont.value);
    addflag = false;
    setModalToDefault();
  }
});
function createTicket(ticketColor, ticketTask, ticketId) {
  let id = ticketId || shortid();
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `
        <div class="ticket-prior-color ${ticketColor}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="task-area">
          ${ticketTask}
        </div>
        <div class = "ticket-lock">
        <i class="fas fa-lock"></i>
        </div>
        `;

  mainCont.appendChild(ticketCont);
  // create objects of ticket and add to array
  if (!ticketId) {
    ticketsArr.push({ ticketColor, ticketTask, ticketId: id });
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  }

  // console.log(ticketsArr);
  handleLock(ticketCont, id);
  handleColor(ticketCont, id);
  handleRemoval(ticketCont, id);
}

function handleLock(ticket, id) {
  let ticketLockElem = ticket.querySelector(".ticket-lock");

  let ticketLock = ticketLockElem.children[0];

  let ticketTaskArea = ticket.querySelector(".task-area");
  ticketLock.addEventListener("click", (e) => {
    let ticketIdx = getTicketIdx(id);

    if (ticketLock.classList.contains(lockClass)) {
      ticketLock.classList.remove(lockClass);
      ticketLock.classList.add(unlockClass);
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLock.classList.remove(unlockClass);
      ticketLock.classList.add(lockClass);
      ticketTaskArea.setAttribute("contenteditable", "false");
    }

    // modify data in local storage (ticket task)
    ticketsArr[ticketIdx].ticketTask = ticketTaskArea.value;
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  });
}

function handleColor(ticket, id) {
  let ticketColor = ticket.querySelector(".ticket-prior-color");
  ticketColor.addEventListener("click", (e) => {
    let ticketIdx = getTicketIdx(id);
    let currentTicketColor = ticketColor.classList[1];
    //get color index;
    let currentTicketColorIdx = colors.findIndex((color) => {
      return color === currentTicketColor;
    });
    currentTicketColorIdx++;
    let newTicketColorIdx = currentTicketColorIdx % colors.length;
    let newTicketColor = colors[newTicketColorIdx];
    ticketColor.classList.remove(currentTicketColor);
    ticketColor.classList.add(newTicketColor);

    // modify data in local storage (priority color change)

    ticketsArr[ticketIdx].ticketColor = newTicketColor;
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  });
}

function getTicketIdx(id) {
  let ticketIdx = ticketsArr.findIndex((ticketObj) => {
    return ticketObj.ticketId === id;
  });
  return ticketIdx;
}

function setModalToDefault() {
  modalCont.style.display = "none";
  textareaCont.value = "";
  modalPriorityColor = colors[colors.length - 1];
  allPriorityColors.forEach((colors) => {
    colors.classList.remove("active");
  });
  allPriorityColors[allPriorityColors.length - 1].classList.add("active");
}

function handleRemoval(ticket, id) {
  ticket.addEventListener("click", (e) => {
    if (!removeflag) return;

    let idx = getTicketIdx(id);
    ticketsArr.splice(idx, 1);
    let stringTicketsArr = JSON.stringify(ticketsArr);
    localStorage.setItem("tickets", stringTicketsArr);
    ticket.remove();
  });
}
