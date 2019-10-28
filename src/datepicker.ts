import { DateTime } from "luxon";
import produce from "immer";
import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

const SET_TODAY = "SET_TODAY";
const DISPLAY_PREV_MONTH = "DISPLAY_PREV_MONTH";
const DISPLAY_NEXT_MONTH = "DISPLAY_NEXT_MONTH";
const GO_TODAY = "GO_TODAY";
const SELECT_DATE = "SELECT_DATE";

const initialState = {
  selectedDate: "",
  displayDate: "",
  today: ""
};

function reducer(state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case SELECT_DATE:
        draft.selectedDate = action.payload;
        break;
      case DISPLAY_PREV_MONTH:
        draft.displayDate = DateTime.fromISO(draft.displayDate)
          .minus({
            month: 1
          })
          .toISODate();
        break;
      case DISPLAY_NEXT_MONTH:
        draft.displayDate = DateTime.fromISO(draft.displayDate)
          .plus({
            month: 1
          })
          .toISODate();
        break;
      case SET_TODAY:
        draft.today = action.payload;
        break;
      case GO_TODAY:
        draft.displayDate = draft.today;
        break;
    }
  });
}

export function getDayRowsInMonth(year, month) {
  const result = [new Array(7).fill(undefined)];
  let date = DateTime.fromObject({
    day: 1,
    month,
    year
  });

  while (date.month === month) {
    let row = result[result.length - 1];
    if (row[6] !== undefined) {
      row = new Array(7).fill(undefined);
      result.push(row);
    }
    row[date.weekday - 1] = date.day;
    date = date.plus({ days: 1 });
  }
  return result;
}

function createDatepicker() {
  const store = createStore(
    reducer,
    devToolsEnhancer({
      name: "ui-core-datepicker"
    })
  );

  store.dispatch({
    type: "SET_TODAY",
    payload: DateTime.local().toISODate()
  });
  store.dispatch({ type: "GO_TODAY" });

  return {
    getState: () => store.getState(),
    subscribe: (listener: Function) => {
      // Trigger the first time it is subscribed for initialisation
      listener();

      // Subscribe for subsequent changes
      store.subscribe(() => {
        listener();
      });
    },
    displayPreviousMonth: () => {
      store.dispatch({ type: DISPLAY_PREV_MONTH });
    },
    displayNextMonth: () => {
      store.dispatch({ type: DISPLAY_NEXT_MONTH });
    },
    selectDate: date => {
      store.dispatch({ type: SELECT_DATE, payload: date });
    }
  };
}

export default createDatepicker;
