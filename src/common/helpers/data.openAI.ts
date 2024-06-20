/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */

import { InjectModel } from "@nestjs/mongoose";
import axios from "axios";



export const getMerca=async(params)=> {
    
    const name = params.mercancia;
     try {
       const url = `http://localhost:3005/api/docs/mercancia?limit=30`;
       const response = await axios.get(url);
       // console.log(response.data); if you want to inspect the output
       return JSON.stringify(response.data);
     } catch (error) {
       console.error(error);
       return null;
     }
}

export const parseFecha = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (month < 10 && day >= 10) return `${year}-0${month}-${day}`;
  if (month >= 10 && day < 10) return `${year}-${month}-0${day}`;
  if (month < 10 && day < 10) return `${year}-0${month}-0${day}`;
  return `${year}-${month}-${day}`;
};


