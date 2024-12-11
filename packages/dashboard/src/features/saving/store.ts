import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { DashboardConfiguration } from '#types';
import type { DashboardSave } from './types';

export const save = createAsyncThunk(
  'saving/save',
  async ({
    dashboardConfiguration,
    onSave,
  }: {
    dashboardConfiguration: DashboardConfiguration;
    onSave: DashboardSave;
  }) => {
    await onSave(dashboardConfiguration);
  }
);

export interface SavingState {
  status: 'idle' | 'saving' | 'error';
}

export const initialState: SavingState = {
  status: 'idle',
};

export const { reducer } = createSlice({
  name: 'saving',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(save.pending, (state) => {
        state.status = 'saving';
      })
      .addCase(save.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(save.rejected, (state) => {
        // TODO: provide complete error experience
        state.status = 'error';
      });
  },
});
