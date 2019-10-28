"use strict";
exports.__esModule = true;
var luxon_1 = require("luxon");
var immer_1 = require("immer");
var redux_1 = require("redux");
var redux_devtools_extension_1 = require("redux-devtools-extension");
var SET_TODAY = "SET_TODAY";
var DISPLAY_PREV_MONTH = "DISPLAY_PREV_MONTH";
var DISPLAY_NEXT_MONTH = "DISPLAY_NEXT_MONTH";
var GO_TODAY = "GO_TODAY";
var SELECT_DATE = "SELECT_DATE";
var initialState = {
    selectedDate: "",
    displayDate: "",
    today: ""
};
function reducer(state, action) {
    if (state === void 0) { state = initialState; }
    return immer_1["default"](state, function (draft) {
        switch (action.type) {
            case SELECT_DATE:
                draft.selectedDate = action.payload;
                break;
            case DISPLAY_PREV_MONTH:
                draft.displayDate = luxon_1.DateTime.fromISO(draft.displayDate)
                    .minus({
                    month: 1
                })
                    .toISODate();
                break;
            case DISPLAY_NEXT_MONTH:
                draft.displayDate = luxon_1.DateTime.fromISO(draft.displayDate)
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
function getDayRowsInMonth(year, month) {
    var result = [new Array(7).fill(undefined)];
    var date = luxon_1.DateTime.fromObject({
        day: 1,
        month: month,
        year: year
    });
    while (date.month === month) {
        var row = result[result.length - 1];
        if (row[6] !== undefined) {
            row = new Array(7).fill(undefined);
            result.push(row);
        }
        row[date.weekday - 1] = date.day;
        date = date.plus({ days: 1 });
    }
    return result;
}
exports.getDayRowsInMonth = getDayRowsInMonth;
function createDatepicker() {
    var store = redux_1.createStore(reducer, redux_devtools_extension_1.devToolsEnhancer({
        name: "ui-core-datepicker"
    }));
    store.dispatch({
        type: "SET_TODAY",
        payload: luxon_1.DateTime.local().toISODate()
    });
    store.dispatch({ type: "GO_TODAY" });
    return {
        getState: function () { return store.getState(); },
        subscribe: function (listener) {
            // Trigger the first time it is subscribed for initialisation
            listener();
            // Subscribe for subsequent changes
            store.subscribe(function () {
                listener();
            });
        },
        displayPreviousMonth: function () {
            store.dispatch({ type: DISPLAY_PREV_MONTH });
        },
        displayNextMonth: function () {
            store.dispatch({ type: DISPLAY_NEXT_MONTH });
        },
        selectDate: function (date) {
            store.dispatch({ type: SELECT_DATE, payload: date });
        }
    };
}
exports["default"] = createDatepicker;
