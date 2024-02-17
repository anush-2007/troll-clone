// import React from "react";
// import { useSelector } from "react-redux";
// import { Droppable, Draggable } from "react-beautiful-dnd";
// import "./Column.css";
// import TaskCard from "../TaskCard/TaskCard";
// import TaskAddButton from "../TaskAddButton/TaskAddButton";

// function Column({ colId, index }) {
//     const data = useSelector((state) => state.task);

//     function RenderColumnTasks() {
//         const currColTasks = data.columns[colId].taskIds.map(
//             (taskId) => data.tasks[taskId]
//         );

//         return (
//             <>
//                 {currColTasks.map((task, index) => {
//                     return (
//                         <TaskCard
//                             key={task.id}
//                             currTaskColId={colId}
//                             task={task}
//                             index={index}
//                         />
//                     );
//                 })}
//             </>
//         );
//     }

//     return (
//         <>
//             <Draggable draggableId={colId} index={index}>
//                 {(provided) => (
//                     <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         className="column-container"
//                     >
//                         <div className="task-title-edit-container">
//                             <span {...provided.dragHandleProps} className="column-title">
//                                 {data.columns[colId].title}
//                             </span>
//                         </div>
//                         <Droppable droppableId={colId} type="task">
//                             {(provided) => (
//                                 <div
//                                     ref={provided.innerRef}
//                                     {...provided.droppableProps}
//                                     className="task-list"
//                                 >
//                                     <RenderColumnTasks />
//                                     {provided.placeholder}

//                                     <TaskAddButton colId={colId}/>
//                                 </div>
//                             )}
//                         </Droppable>
//                     </div>
//                 )}
//             </Draggable>
//         </>
//     );
// }

// export default Column;

import React from "react";
import { useSelector } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";
import "./Column.css";
import TaskCard from "../TaskCard/TaskCard";
import TaskAddButton from "../TaskAddButton/TaskAddButton";

function Column({colId, index }) {
    const data = useSelector((state) => state.task);

    function RenderColumnTasks() {
        const currColTasks = data.columns[colId].taskIds.map(taskId => data.tasks[taskId]);

        return (
            <>
                {
                    currColTasks.map((task, index) => {
                        if (task) { // Add this conditional check
                            return (
                                <TaskCard
                                    key={task.id}
                                    currTaskColId={colId}
                                    task={task}
                                    index={index}
                                />
                            );
                        }
                        return null;
                    })
                }
            </>
        )
    }

    return (
        <>
            <Draggable draggableId={colId} index={index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="column-container">
                        <div className='task-title-edit-container'>
                            <span {...provided.dragHandleProps} className="column-title">{data.columns[colId].title}</span>
                        </div>
                        <Droppable droppableId={colId} type='task'>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="task-list">
                                    <RenderColumnTasks />
                                    {provided.placeholder}

                                    <TaskAddButton colId={colId}/>
                                </div>
                            )}
                        </Droppable>
                    </div>
                )}
            </Draggable>
        </>
    )
}

export default Column
