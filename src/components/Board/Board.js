import React, { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  dragColumns,
  dragTasksDifferentColumn,
  dragTasksSameColumn,
} from "../taskSlice/taskSlice";
import { db } from "../../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import Column from "../Column/Column";

// Import the dataset
import dataset from "../dataset/dataset";

// Import redux functions and reducers
import { useDispatch, useSelector } from "react-redux";
import {
  setAllTasks,
  setAllColumns,
  setColumnOrder,
} from "../taskSlice/taskSlice";
import EditTaskDialog from "../EditTaskDialog/EditTaskDialog";

function Board() {
  //  get data from the redux stpre
  const data = useSelector((state) => state.task);
  const dispatch = useDispatch();

  //onDragEnd function

  function onDragEnd(result) {
    const { destination, source, draggableId, type } = result;

    //if there is no destination present
    if (!destination) {
      return;
    }

    //if the source and destination is the same

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //if columns are being dragged

    if (type === "column") {
      const colOrderNew = Array.from(data.columnOrder);
      colOrderNew.splice(source.index, 1);
      colOrderNew.splice(destination.index, 0, draggableId);

      dispatch(dragColumns(colOrderNew));
      return;
    }

    const src = data.columns[source.droppableId];
    const dst = data.columns[destination.droppableId];

    //if a task is dropped insisde the same column

    if (src === dst) {
      const newTaskIds = Array.from(src.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const updatedColumn = {
        ...src,
        taskIds: newTaskIds,
      };

      dispatch(dragTasksSameColumn(updatedColumn));
      return;
    }

    //if task is dropped in different column

    const srcColId = src["id"];
    const srcTaskIds = Array.from(src.taskIds);
    srcTaskIds.splice(source.index, 1);

    const dstColId = dst["id"];
    const dstTaskIds = Array.from(dst.taskIds);
    dstTaskIds.splice(destination.index, 0, draggableId);

    dispatch(
      dragTasksDifferentColumn({
        srcColId: srcColId,
        srcTaskIds: srcTaskIds,
        dstColId: dstColId,
        dstTaskIds: dstTaskIds,
      })
    );
  }

  // useEffect(() => {
  //   dispatch(setAllTasks({ tasks: dataset["tasks"] })); // Initialize the tasks object in redux initial state
  //   dispatch(setAllColumns({ columns: dataset["columns"] })); // Initialize the columns object in redux initial state
  //   dispatch(setColumnOrder({ columnOrder: dataset["columnOrder"] })); // Initialize the columns order in redux initial state
  // }, [dispatch]);

  useEffect(() => {
    // Query Tasks from the databse
    const queryTasks = query(collection(db, "tasks"));
    let tasks = [];
    onSnapshot(queryTasks, (querySnapshot) => {
      querySnapshot.docs.map((doc) => tasks.push(doc.data()));
      dispatch(setAllTasks(tasks));
    });

    // Query Columns from the databse
    const queryColumns = query(collection(db, "columns"));
    let columns = [];
    onSnapshot(queryColumns, (querySnapshot) => {
      querySnapshot.docs.map((doc) => columns.push(doc.data()));
      dispatch(setAllColumns(columns));
    });

    // Query COlumn Order from the databse
    const queryColumnOrder = query(collection(db, "columnOrder"));
    let columnOrder = [];
    onSnapshot(queryColumnOrder, (querySnapshot) => {
      querySnapshot.docs.map((doc) => (columnOrder = doc.data()));
      dispatch(setColumnOrder(columnOrder));
    });
  }, [dispatch]);

  return (
    <>
      <div style={{ textAlign: "center", color: "white" }}>
        <h1>Tasks Management Board</h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ display: "flex" }}
            >
              {data.columnOrder.map((colId, index) => {
                // Replace this with the Column component later
                return <Column key={colId} colId={colId} index={index} />;
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {data.isDialogOpen ? (
        <EditTaskDialog
          taskId={data.currTaskIdToEdit}
          open={data.isDialogOpen}
        />
      ) : null}
    </>
  );
}

export default Board;
