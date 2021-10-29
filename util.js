// Utility function
function Util() {};

Util.getArrayDates = function (beforeDays, afterDays) {
    // Get array of dates for scheduler 
    var startDate = new Date;
    var endDate = new Date;
    startDate.setDate(startDate.getDate() + beforeDays);
    endDate.setDate(endDate.getDate() + afterDays);

    var result = [];
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
        result.push(day.toString().slice(4, 10));
    }
    return result;
};

Util.getFetch = async function (url) {
    // Fetch data from api
    const response = await fetch(url);
    try {
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

Util.initDateMap = function () {
    // Initialize "dateToIndexMap" and "indexToDateMap" for faster addition and subtraction of dates
    var date = new Date;
    date.setDate(date.getDate() - 30);
    for (let index = -30; index < 90; index++) {
        dateToIndexMap.set(date.toISOString().slice(0, 10), index);
        indexToDateMap.set(index, date.toISOString().slice(0, 10));
        date.setDate(date.getDate() + 1);
    }
}

Util.initUserMap = async function () {
    // Initialize global variable "userArray"
    const users = await Util.getFetch(api_url_users);
    users.forEach(element => {
        userMap.set(element["id"], new User(element["id"], element["firstName"], element["surname"]));
    });
}

Util.initBacklogMap = async function () {
    // Initialize global variable "backlogArray" 
    const tasks = await Util.getFetch(api_url_tasks);
    tasks.forEach(element => {
        var newTask = new Task(element["id"], element["subject"], element["creationAuthor"], element["executor"], element["creationDate"], element["planStartDate"], element["planEndDate"])
        if (newTask.executor == null) {
            backlogMap.set(element["id"], newTask);
        } else {
            var user = userMap.get(newTask.executor);
            if (user != null) {
                user.taskList.push(newTask);
            }
        }
    });
}

Util.initSidebar = function () {
    // Initialize sidebar animation
    document.getElementById("openSidebar").onclick = function () {
        if (mySidebar.style.display === 'block') {
            mySidebar.style.display = 'none';
            overlayBg.style.display = "none";
        } else {
            mySidebar.style.display = 'block';
            overlayBg.style.display = "block";
        }
    };

    Array.from(document.getElementsByClassName("closeSidebar")).forEach(element => {
        element.onclick = function () {
            mySidebar.style.display = "none";
            overlayBg.style.display = "none";
        };
    });
}