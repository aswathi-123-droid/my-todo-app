import { useEffect, useState,useRef } from "react";
import { toast } from 'react-toastify';

function ToDoList() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [ind, setInd] = useState(null);
  const [uptTask, setUptTask] = useState(null);
  const [uptDesc, setUptDesc] = useState(null);
  const [uptDate, setUptDate] = useState(null);

 function handleInputTaskChange(event) {

    setNewTask(event.target.value);
  }

  function handleInputDescChange(event) {
    setNewDesc(event.target.value);
  }

  function handleInputDateChange(event) {
    setNewDate(event.target.value);
  }

 
  function addNewTask() {
  if (newTask.trim() !== "" && newDesc.trim() !=="" && newDate.trim() !== "") {
      const newObj = {
        task: newTask,
        desc: newDesc,
        date: newDate,
        completeTask: false,
        isOverdue: false,
      };

      setTask([...task, newObj]);
      setNewTask("");
      setNewDesc("");
      setNewDate("");
    }
  }

  function editTask(index) {
     setInd(index);
  }

  function deleteTask(ind) {
    if(!confirm("Confirm Delete!"))return
    toast.success("Deleted Successfully")
    let detT = task.filter((_, i) => i !== ind)
    setTask(detT);
  }

  function handleUpdateTaskChange(event) {
    setUptTask(event.target.value);
  }

  function handleUpdateDescChange(event) {
    setUptDesc(event.target.value);
  }

  function handleUpdateDateChange(event) {
    setUptDate(event.target.value);
  }

  function saveUptTask(index, t) {
    const saveObj = {
      task: uptTask || t.task,
      desc: uptDesc || t.desc,
      date: uptDate || t.date,
      completeTask: false,
      isOverdue:false,
    };

    const updatedObj = task.map((item, i) => (i === index ? saveObj : item));
    setTask(updatedObj);
    setInd(null);

    setUptTask(null);
    setUptDesc(null);
    setUptDate(null);
  }

  function cancelTask() {
    setInd(null);

    setUptTask(null);
    setUptDesc(null);
    setUptDate(null);
  }

 
  function handlePending(index){
    setTask((prevTasks) =>
                      prevTasks.map((item, i) =>{
                        console.log(prevTasks)
                        return   i === index ? { ...item, completeTask: !item.completeTask }: item
                      } 
                      )
                    );

  }

  useEffect(() => {
    
    const interval = setInterval(() => {
      const now = new Date();
      setTask((t) =>
          t.map((item) => {
            if(!item.completeTask){
            if (now > new Date(item.date) && !item.isOverdue) {
            toast.warn(` Task "${item.task}" is overdue!`);
            return { ...item, isOverdue: true };
          }
            }
          return item;
        
        })
      );
    },1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="todo-container">
      <h1 className="todo-title"> To-Do List App</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter the task"
          value={newTask}
          onChange={handleInputTaskChange}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Description"
          value={newDesc}
          onChange={handleInputDescChange}
          className="input-field"
        />
        <input
          type="datetime-local"
          value={newDate}
          onChange={handleInputDateChange}
          className="input-field date-field"
        />
        <button onClick={addNewTask} className="btn add-btn">
          Add Task
        </button>
      </div>
      

      <ol className="task-list">
        {task.map((t, index) => {
          if (index === ind) {
            return (
              <li key={`edit-${index}`} className="task-item edit-mode">
                <input
                  type="text"
                  value={uptTask === null ? t.task : uptTask}
                  onChange={handleUpdateTaskChange}
                  className="input-field"
                />
                <input
                  type="text"
                  value={uptDesc === null ? t.desc : uptDesc}
                  onChange={handleUpdateDescChange}
                  className="input-field"
                />
                <input
                  type="datetime-local"
                  value={uptDate === null ? t.date : uptDate}
                  onChange={handleUpdateDateChange}
                  className="input-field date-field"
                />
                <div className="btn-col">
                  <button
                    onClick={() => saveUptTask(index, t)}
                    className="btn save-btn"
                  >
                    Save
                  </button>
                  <button onClick={cancelTask} className="btn cancel-btn">
                    Cancel
                  </button>
                </div>
              </li>
            );
          }

          return (
            <li
              key={index}
              className={`task-item ${t.completeTask ? "completed" : ""} ${
                t.isOverdue ? "overdue" : ""
              }`}
            >
              <div className="task-info">
                <strong>{t.task}</strong>
                <p>{t.desc}</p>
                <span className="task-date">{t.date}</span>
              </div>
              <div className="task-actions">
                <button
                  onClick={() =>{editTask(index)}}
                  className="btn edit-btn"
                  disabled={t.completeTask}
                >
                  Edit
                </button>
                <button
                  onClick={() => {deleteTask(index)}}
                  className="btn delete-btn"
                  disabled={t.completeTask}
                >
                  Delete
                </button>
                <button
                  onClick={()=>handlePending(index)}
                  className="btn complete-btn"
                >
                  {t.completeTask ? "Undo" : "Complete"}
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}


export default ToDoList;
