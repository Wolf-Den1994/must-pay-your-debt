import { createSlice } from '@reduxjs/toolkit'
import { Benefit } from '@/types';

type State = {
  sumBenefits: Benefit
}

const sumBenefit = 651.35 // 724.85

const initialState: State = {
  sumBenefits: {
    '2023-08-01': sumBenefit
  }
}

const benefitsSlice = createSlice({
  name: 'benefits',
  initialState,
  reducers: {
    addBenefit(state, action) {
      console.log('action', action);
      
      state.sumBenefits = {
        ...state.sumBenefits,
        [action.payload.startDate]: action.payload.sum
      }
    },
  }
})

export const { addBenefit } = benefitsSlice.actions
export default benefitsSlice.reducer
