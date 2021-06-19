import React, { useState, useMemo } from "react";
import "./index.css";

const STAGES_NAMES = ['Backlog', 'To Do', 'Ongoing', 'Done'];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([
    { name: '1', stage: 0 },
    { name: '2', stage: 0 },
  ]);
  const [inputForm, setInputForm] = useState('');

  const getTaskIndex = (name) => tasks.findIndex(task => task.name === name);

  const addTaskHandler = () => {
    const shouldPass = getTaskIndex(inputForm);
    if (inputForm !== '' && shouldPass < 0)
      setTasks([...tasks, { name: inputForm, stage: 0}]);
    setInputForm('');
  };

  const setValue = (e) => {
    e.persist();
    setInputForm(e.target.value);
  };

  const positionHandler = (name, ahead) => {
    const index = getTaskIndex(name);
    const newStage = ahead ? tasks[index].stage + 1 : tasks[index].stage - 1;
    const shouldPass = ahead ? newStage < 4 : newStage >= 0;
    if (shouldPass) {
      const tempTask = {
        ...tasks[index],
        stage: newStage,
      };
      const tempTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1), tempTask];
      setTasks(tempTasks);
    }
  };

  const deleteHandler = (name) => {
    const index = getTaskIndex(name);
    const tempTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
    setTasks(tempTasks);
  };

  const stagesTasks = useMemo(() => {
    const stagesTasks = Array.from(Array(STAGES_NAMES.length)).map(() => []);
    tasks.forEach(task => {
      stagesTasks[task.stage].push(task)
    });
    return stagesTasks;
  }, [tasks]);

  return (
    <div className="mt-20 layout-column justify-content-center align-items-center">
        <section className="mt-50 layout-row align-items-center justify-content-center">
          <input
            id="create-task-input"
            type="text"
            className="large"
            placeholder="New task name"
            data-testid="create-task-input"
            value={inputForm}
            onChange={setValue}
          />
          <button
            onClick={addTaskHandler}
            type="submit"
            className="ml-30"
            data-testid="create-task-button"
          >
            Create task
          </button>
        </section>

        <div className="mt-50 layout-row">
            {stagesTasks.map((tasks, i) => {
                return (
                    <div className="card outlined ml-20 mt-0" key={`${i}`}>
                        <div className="card-text">
                            <h4>{STAGES_NAMES[i]}</h4>
                            <ul className="styled mt-50" id={`stage-${i}`} data-testid={`stage-${i}`}>
                                {tasks.map(({name, stage}, index) => {
                                  const formattedName = name.split(' ').join('-');
                                    return <li className="slide-up-fade-in" key={`${i}${index}`}>
                                      <div className="li-content layout-row justify-content-between align-items-center">
                                        <span data-testid={`${formattedName}-name`}>{name}</span>
                                        <div className="icons">
                                          <button
                                            className="icon-only x-small mx-2"
                                            data-testid={`${formattedName}-back`}
                                            onClick={() => positionHandler(name, false)}
                                            disabled={stage === 0}
                                          >
                                            <i className="material-icons">arrow_back</i>
                                          </button>
                                          <button
                                            className="icon-only x-small mx-2"
                                            data-testid={`${formattedName}-forward`}
                                            onClick={() => positionHandler(name, true)}
                                            disabled={stage === 3}
                                          >
                                            <i className="material-icons">arrow_forward</i>
                                          </button>
                                          <button
                                            className="icon-only danger x-small mx-2"
                                            data-testid={`${formattedName}-delete`}
                                            onClick={() => deleteHandler(name)}
                                          >
                                            <i className="material-icons">delete</i>
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
  );
}

export default KanbanBoard;
