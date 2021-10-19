import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Reducer,
} from "@reduxjs/toolkit";
import * as turf from "@turf/turf";
import { getFieldDataFromMockedApi } from "../api";
import { Field } from "../types";
import type { RootState } from "./store";

/**
 * Gets field data from mocked api
 */
export const fetchFields = createAsyncThunk<Field[]>(
  "fetchFields",
  async () => {
    try {
      return getFieldDataFromMockedApi();
    } catch (e) {
      return Promise.reject(e);
    }
  }
);
export type FieldsState = {
  ids: number[];
  entities: { [id: number]: Field };
  selectedId?: number;
  fetchStatus?: "pending" | "fulfilled" | "rejected";
};

const initialState: FieldsState = {
  entities: {},
  ids: [],
};
const fields = createSlice({
  name: "fields",
  initialState,
  reducers: {
    clickField(state, action: PayloadAction<number>) {
      state.selectedId = action.payload;
    },
    closeFieldInfoWindow(state) {
      state.selectedId = undefined;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchFields.pending, (state) => {
        state.fetchStatus = "pending";
      })
      .addCase(fetchFields.fulfilled, (state, action) => {
        state.fetchStatus = "fulfilled";
        state.ids = action.payload.map((field) => field.id);
        state.entities = action.payload.reduce((acc, field) => {
          return { ...acc, [field.id]: { ...field } };
        }, {});
      })
      .addCase(fetchFields.rejected, (state) => {
        state.fetchStatus = "rejected";
      }),
});
export const { clickField, closeFieldInfoWindow } = fields.actions;

/**
 * Get fields from state as a list
 */
export const getAllFields = (state: RootState): Field[] => {
  return state.fields.ids.map((id) => {
    const entity = state.fields.entities[id];
    if (typeof entity === "undefined") {
      throw new Error(`No field found with id ${id}`);
    }
    return entity;
  });
};

/**
 * Get currently selected field id
 */
export function getClickedFieldId(state: RootState): number | undefined {
  return state.fields.selectedId;
}

/**
 * Get field with given id from state
 *
 * @param state Root State
 * @param fieldId id for field
 * @returns a field if one with given id exists in state, otherwise undefined
 */
export function getFieldById(
  state: RootState,
  fieldId: number
): Field | undefined {
  return state.fields.entities[fieldId];
}

/**
 * Calculates field center and converts it to google maps LatLng format
 */
export function getFieldCenterById(
  state: RootState,
  id: number
): google.maps.LatLngLiteral | undefined {
  const fieldData = getFieldById(state, id);
  if (fieldData) {
    const [lng, lat] = turf.center(fieldData.polygon).geometry.coordinates;
    return { lng, lat };
  }
  return undefined;
}
const fieldsReducer: Reducer<FieldsState> = fields.reducer;
export default fieldsReducer;
