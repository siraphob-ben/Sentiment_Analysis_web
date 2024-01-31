import React, { useEffect, useState } from 'react';
import './App.css';
import { Translation, useTranslation } from 'react-i18next';
import i18n from './langConfig';


function App() {

  const [emotion, setEmotion] = useState<string>("")
  const [translatedText, setTranslatedText] = useState("");
  const [thText, setThText] = useState("");
  const [isThChecked, setIsThChecked] = useState(false);
  // const [userInput, setUserInput] = useState("");
  const { t } = useTranslation();

  

  async function query(data: string) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
        {
          headers: { Authorization: `Bearer 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` },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.log(error);
    }
  }

  const getEmotion = async (input:string) => {

    const huggingfaceResponse = await query(input);
    if (!huggingfaceResponse.error) {
      console.log(huggingfaceResponse);
      const emo = huggingfaceResponse[0][0].label;
      setEmotion(emo);
    }
  }

  const translate = (input:string) => {
    const from = 'th-TH';
    const to = 'en-GB';

    let apiURL = `https://api.mymemory.translated.net/get?q=${input}&langpair=${from}|${to}`

    fetch(apiURL).then(res => res.json()).then(data => {
      console.log(data);
      setTranslatedText(data.responseData.translatedText);
    })
    
  }

  const HandleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      TypeSomething: { value: string };
    };
    const userInput = (target.TypeSomething.value);

    if (userInput) {
      if(isThChecked) {
      translate(userInput);
    }
    else if (!isThChecked) {
      getEmotion(userInput);
    }}
  }
  
  useEffect(() => {getEmotion(translatedText);},[translatedText]);

  useEffect(() => {
    i18n.changeLanguage("en");
    getEmotion("");
  },[])

  const HandleOnChange = () => {
    setIsThChecked(!isThChecked);
    if(isThChecked) i18n.changeLanguage("en");
    else i18n.changeLanguage("th");
  }

  return (
    <div className="App">
      <div className=' gap-40 bg-gradient-to-bl from-slate-50 via-stone-200 to-gray-300 flex justify-center items-center h-screen flex-col'>

        <div className='absolute top-10 right-14 '>
          <label className='themeSwitcherThree relative inline-flex cursor-pointer select-none items-center'>
            <input
              type='checkbox'
              checked={isThChecked}
              onChange={HandleOnChange}
              value={!isThChecked ? "en":"th"}
              className='sr-only'
            />
            <div className='shadow-card flex h-[46px] w-[82px] items-center justify-center rounded-md bg-white'>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded ${!isThChecked ? 'bg-[#2d2d2d] text-white' : 'text-body-color'
                  }`}
              >
                <h1>EN</h1>
              </span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded ${isThChecked ? 'bg-[#2d2d2d] text-white' : 'text-body-color'
                  }`}
              >
                <h1>TH</h1>
              </span>
            </div>
          </label>
        </div>

        <div>
          <h1 className=' font-serif text-6xl'>{emotion}</h1>
        </div>
        <div>
          <div className="relative h-full w-full min-w-[200px] ">
            <form onSubmit={HandleOnSubmit}>
              <div className='flex gap-2'>
              <div className="relative flex max-w-[24rem]">
                <div className="relative h-full w-full min-w-[200px]">
                  <input
                    id='TypeSomething'
                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" " />
                  <label
                    className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    {t("InoutPH")}
                  </label>
                </div>
                
              </div>
              <button
                  className="h-[40px] right-1 top-1 select-none rounded bg-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-gray-500/20 transition-all hover:shadow-lg hover:shadow-blue-gray-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="submit">
                  {t("submitBtn")}
                </button>
                </div>
            </form>
            <label
              className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5  hidden h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
          </div>
        </div>
        {/* <button onClick={translate}>Test</button> */}
      </div>
      
    </div>
  );
}

export default App;