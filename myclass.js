var mySidebar = document.getElementById("mySidebar");
var overlayBg = document.getElementById("myOverlay");

const dateToIndexMap = new Map();
const indexToDateMap = new Map();
const api_url_users = "https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users";
const api_url_tasks = "https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks";
var userMap = new Map();
var backlogMap = new Map();
var currentDay = 0;

class User {
    constructor(id, firstName, surname) {
        this.id = id;
        this.firstName = firstName;
        this.surname = surname;
        this.taskList = []
    }
    addTask(task, startIndex) {
        if (startIndex != null) {
            task.changeDates(startIndex);
        }
        this.taskList.push(task);
    }
}

class Task {
    constructor(id, subject, creationAuthor, executor, creationDate, planStartDate, planEndDate) {
        this.id = id;
        this.subject = subject;
        this.creationAuthor = creationAuthor;
        this.executor = executor;
        this.creationDate = creationDate;
        this.planStartDate = planStartDate;
        this.planEndDate = planEndDate;
    }

    getDateLength() {
        return dateToIndexMap.get(this.planEndDate) - dateToIndexMap.get(this.planStartDate);
    }

    changeDates(startIndex) {
        var length = this.getDateLength();
        this.planStartDate = indexToDateMap.get(startIndex);
        this.planEndDate = indexToDateMap.get(startIndex + length);
    }
}


var Scheduler = (function () {
    var schedule = document.getElementsByClassName('shedule')[0];
    var backlog = document.getElementsByClassName('w3-bar-block')[0];
    var leftButton = document.getElementById('left');
    var rightButton = document.getElementById('right');

    return {
        init: init
    };

    function init() {
        _getSchedule(0);
        _initBacklog();
        _initButtons();
    }

    function _getSchedule(startDay) {
        _initTable(startDay);
        _initUserTasks();
        _initDragDropFunctions();
    }

    function _initTable(startDay) {
        var html = _getDateRow(startDay, startDay + 6);
        userMap.forEach(user => {
            html += _initUserRow(user, startDay);
        });
        schedule.innerHTML = html;
    }

    function _initUserTasks() {
        userMap.forEach(user => {
            user.taskList.forEach(task => {
                _setUserTask(user.id, task);
            });
        });
    }

    function _initBacklog() {
        var html = "";
        backlogMap.forEach(element => {
            html += `<div id="${element.id}" class="backlog-element w3-button w3-padding w3-red w3-card-2" draggable="true">${element.subject}</div>`;
        });
        backlog.innerHTML = html + "<br/><br/><br/>";

        var backlogList = document.getElementsByClassName('backlog-element');
        Array.from(backlogList).forEach((element) => {
            element.ondragstart = function (event) {
                event.dataTransfer.setData("taskId", event.target.id);
                overlayBg.style.display = "none";
            };
        });
    }

    function _initButtons() {
        leftButton.onclick = function () {
            currentDay -= 7;
            _getSchedule(currentDay);
        };

        rightButton.onclick = function () {
            currentDay += 7;
            _getSchedule(currentDay);
        };
    }

    function _getDateRow(beforeDays, afterDays) {
        var array = Util.getArrayDates(beforeDays, afterDays);
        var htmlList = "<li style='min-width: 160px !important'></li>";
        array.forEach(element => {
            htmlList += `<li class="date-style">${element}</li>`
        });
        return `<ul class='person-schedule'>${htmlList}</ul>`;
    }

    function _initUserRow(user, startDay) {
        var htmlList = `<li id="${user.id}_" class='name-style'>${user.firstName} ${user.surname}</li>`;
        for (let i = startDay; i < startDay + 7; i++) {
            htmlList += `<li id="${user.id}_${i}" class="user-style"></li>`
        }
        return `<ul id="user_${user.id}" class='person-schedule'>${htmlList}</ul>`;
    }

    function _setUserTask(userId, task, startIndex) {
        var userRow = document.getElementById(`user_${userId}`);
        var liArray = userRow.getElementsByTagName('li');
        var interval = _getInterval(task, startIndex);
        interval.forEach(index => {
            var userTask = _createTaskElement(task)
            liArray[index + 1].appendChild(userTask);
        });
    }

    function _getInterval(task, start) {
        var startIndex = dateToIndexMap.get(task.planStartDate);
        var endIndex = dateToIndexMap.get(task.planEndDate);
        if (start != null) {
            length = endIndex - startIndex;
            startIndex = start - currentDay;
            endIndex = startIndex + length;
            return _getIntervalList(startIndex, endIndex, 0);
        }
        return _getIntervalList(startIndex, endIndex, currentDay);
    }

    function _getIntervalList(startIndex, endIndex, shift) {
        var result = []
        for (let index = startIndex; index <= endIndex; index++) {
            if (index >= shift && index <= (shift + 6)) {
                result.push(index - shift);
            }
        }
        return result;
    }

    function _createTaskElement(task) {
        var taskElement = document.createElement('div');
        taskElement.innerHTML = task.subject.trim();
        taskElement.classList.add("task-style");

        var tooltip = document.createElement('div');
        tooltip.innerHTML = `Creation date: ${task.creationDate}`.trim();
        tooltip.classList.add("task-tooltip");

        taskElement.appendChild(tooltip);
        return taskElement;
    }

    function _initDragDropFunctions() {
        var userList = document.getElementsByClassName('user-style');
        Array.from(userList).forEach((element) => {
            element.ondragover = function (event) {
                event.preventDefault();
            };
            element.ondrop = function (event) {
                event.preventDefault();
                var taskId = event.dataTransfer.getData("taskId");
                var task = backlogMap.get(taskId);
                var element = event.target;
                if (!element.id.includes("_")) {
                    element = element.parentElement;
                }
                var parameters = element.id.split("_");
                var startIndex = parseInt(parameters[1]);

                var user = userMap.get(parseInt(parameters[0]));
                user.addTask(task, startIndex);
                _setUserTask(parameters[0], task, startIndex);
                document.getElementById(taskId).remove();
            };
        });

        userList = document.getElementsByClassName('name-style');
        Array.from(userList).forEach((element) => {
            element.ondragover = function (event) {
                event.preventDefault();
            };
            element.ondrop = function (event) {
                event.preventDefault();
                var taskId = event.dataTransfer.getData("taskId");
                var task = backlogMap.get(taskId);
                var parameters = event.target.id.split("_");
                var user = userMap.get(parseInt(parameters[0]));
                user.addTask(task);
                _setUserTask(parameters[0], task);
                document.getElementById(taskId).remove();
            };
        });
    }
})();