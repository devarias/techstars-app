import { DndProvider, useDrag, useDrop } from 'react-dnd';
import CellPopUp from './CellPopOver';
import { HTML5Backend } from 'react-dnd-html5-backend';

/* This function is in charge to color format every cell on the schedule table according to the company */
const CellColor = ({ text, record, index, column, setCancelMeeting }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <CellPopUp
        text={text}
        record={record}
        index={index}
        column={column}
        setCancelMeeting={setCancelMeeting}
      />
    </DndProvider>
  );
};

export default CellColor;
