import { configureStore } from '@reduxjs/toolkit'
import benefitsSlice from './benefitsSlice'

export const store = configureStore({
  reducer: {
    benefits: benefitsSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>;
