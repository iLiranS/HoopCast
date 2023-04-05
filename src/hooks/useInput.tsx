import  { useState } from 'react';

interface InputProps{
    validateInput: (inputText:string)=>boolean;
  }

const useInput = ({ validateInput }:InputProps) => {


      const [inputText,setInputText] = useState('');
      const [isTouched,setIsTouched] = useState(false);
    
    
    
    
      const valueIsValid = validateInput(inputText);
      const hasError = !valueIsValid && isTouched;
    
    
    
    
      const updateInput = (value:string) => {
      setInputText(value);
      }
      
      const setTouch = (val:boolean) =>{
      setIsTouched(val);
      }
    
    
    
    
      const setText = (text:string) =>{
      setInputText(text);
      }
    
    
    return { value: inputText , isTouched , isValid : valueIsValid , hasError , updateInput,setTouch,setText };
    }
    


export default useInput