import createDatepicker, { getDayRowsInMonth } from "../../src/datepicker";
import { DateTime } from "luxon";

const datepicker = createDatepicker();

document
  .querySelector(".dp-header__previous-month")
  .addEventListener("click", () => {
    datepicker.displayPreviousMonth();
  });

document
  .querySelector(".dp-header__next-month")
  .addEventListener("click", () => {
    datepicker.displayNextMonth();
  });

function buildBody(rows, displayDate) {
  const body = document.querySelector(".datepicker__body");

  while (body.firstChild) {
    body.firstChild.remove();
  }

  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "dp-body__row";

    row.forEach(day => {
      const cellDiv = document.createElement("div");
      cellDiv.className = "dp-body__cell";

      if (day) {
        cellDiv.textContent = day;
        cellDiv.addEventListener("click", () => {
          datepicker.selectDate(displayDate.set({ day }));
        });
      } else {
        cellDiv.className += " dp-body__cell--empty";
      }

      rowDiv.appendChild(cellDiv);
    });

    body.appendChild(rowDiv);
  });
}

datepicker.subscribe(() => {
  const state = datepicker.getState();
  const display = DateTime.fromISO(state.displayDate);
  const selected = DateTime.fromISO(state.selectedDate);

  document.querySelector(
    ".current-value__value"
  ).textContent = selected.toISODate();
  document.querySelector(".dp-header__title").textContent = display.toFormat(
    "LLLL yyyy"
  );

  const dayRows = getDayRowsInMonth(display.year, display.month);

  buildBody(dayRows, display);
});
