import React, { useEffect, useState } from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';
import i18n from './langConfig';
import { Button, message } from 'antd';

import {Vdos} from "./video"
import { max } from '@xenova/transformers';

const HG_API_KEY = "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";
const YT_API_KEY = "AIzaSyDTgsIJSdBo43ydmf28S1PFTw6lhXe-_Zk";

function App() {

  type EmotionColorMap = Record<string, string[]>;
  interface ytVDO {
    id: {videoId: string};
    snippet: {title: string, thumbnails: {medium: {url: string}}};
  }

  interface EmoWithScore {
    label: string;
    score: Float32Array[];
  }
  

  const [messageApi, contextHolder] = message.useMessage();

  const [ytVDOs, setYtVDOs] = useState<ytVDO[]>();
  const [ytVDOs2, setYtVDOs2] = useState<ytVDO[]>();
  const [emoRec, setEmoRec] = useState<EmoWithScore[]>();
  const [emotion, setEmotion] = useState<string>("neutral");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [translatedText, setTranslatedText] = useState("");
  const [isThChecked, setIsThChecked] = useState(false);
  const [isKeywordChanged, setIsKeywordChanged] = useState(false);


  const { t } = useTranslation();



  const emotionColorMap: EmotionColorMap = {
    admiration: ['#ffd700', '#b4e148', '#6de181', '#19dab2', '#00ced1'], // Gold, Dark Turquoise
    amusement: ['#ff69b4', '#ff708e', '#ff8a63', '#ffb035', '#ffd700'], // Hot Pink, Gold
    anger: ['#ad0000', '#c12004', '#d6350b', '#ea4712', '#ff5919'], // Red, Dark Red
    annoyance: ['#ffff00', '#ffd000', '#ff9f00', '#ff6700', '#ff0000'], // Tomato, Orange Red
    approval: ['#008000', '#10930e', '#1da61b', '#28b927', '#32cd32'], // Green, Lime Green
    caring: ['#ffc0cb', '#ffacc1', '#ff96ba', '#ff80b6', '#ff69b4'], // Pink, Hot Pink
    confusion: ['#778899', '#6181ab', '#5478bb', '#576cc7', '#6a5acd'], // Gray, Light Steel Blue
    curiosity: ['#4169e1', '#008af1', '#00a5ef', '#00bbe1', '#00ced1'], // Royal Blue, Dark Turquoise
    desire: ['#dc143c', '#e71f34', '#f02b29', '#f8381b', '#ff4500'], // Orange Red, Tomato
    disappointment: ['#4f94cd', '#5c91c0', '#678eb3', '#708ba6', '#778899'], // Dim Gray, Gray
    disapproval: ['#8b0000', '#920e0d', '#981817', '#9f2221', '#a52a2a'], // Dark Red, Brown
    disgust: ['#228b22', '#587b00', '#736a00', '#835700', '#8b4513'], // Forest Green, Saddle Brown
    embarrassment: ['#ff6347', '#ff5c3a', '#ff542c', '#ff4d1b', '#ff4500'], // Gold, Tomato
    excitement: ['#ffd700', '#ffb700', '#ff9600', '#ff7100', '#ff4500'], // Gold, Orange Red
    fear: ['#800000', '#880021', '#860040', '#750061', '#4b0082'], // Maroon, Indigo
    gratitude: ['#778899', '#868f9d', '#9497a1', '#9fa0a5', '#a9a9a9'], // Lime Green, Spring Green
    grief: ['#778899', '#868f9d', '#9497a1', '#9fa0a5', '#a9a9a9'], // Dim Gray, Gray
    joy: ['#ffd700', '#ffba0c', '#ff9c24', '#ff7f37', '#ff6347'], // Gold, Tomato
    love: ['#ff835e', '#fe7361', '#fc6267', '#f7506e', '#f03f77'],
    nervousness: ['#ffff00', '#ffd700', '#ffae15', '#ff8733', '#ff6347'], // Yellow, Tomato
    optimism: ['#ffd700', '#ffca00', '#ffbe00', '#ffb100', '#ffa500'], // Gold, Orange
    pride: ['#800080', '#880e92', '#8f1ba4', '#9527b8', '#9932cc'], // Purple, Dark Orchid
    realization: ['#87ceeb', '#91d1ea', '#9ad3e8', '#a4d6e7', '#add8e6'], // Sky Blue, Light Blue
    relief: ['#00ff7f', '#1af26c', '#26e65a', '#2dd947', '#32cd32'], // Spring Green, Lime Green
    remorse: ['#696969', '#6f6f6f', '#747474', '#7a7a7a', '#808080'], // Dim Gray, Gray
    sadness: ['#4682b4', '#5395c2', '#63a8d0', '#74bbde', '#87ceeb'], // Steel Blue, Sky Blue
    surprise: ['#ffd70d', '#ffcb01', '#ffbe00', '#ffb200', '#ffa500'], // Gold, Orange
    neutral: ['#808080', '#949494', '#a9a9a9', '#bebebe', '#d3d3d3'],
  };
  const [bgColor, setBgColor] = useState<string[]>([]);

  async function queryKeyword(data: { inputs: string; }) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/transformer3/H2-keywordextractor",
      {
        headers: { Authorization: `Bearer ${HG_API_KEY}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  const getKeywords = async (inputs: string) => {
    if (inputs !== '') {
      let keywordRes = await queryKeyword({ "inputs": inputs });
      if (!keywordRes.error) {
        console.log(keywordRes);
        if (inputs !== 'load_modelK') setKeywords(keywordRes[0].summary_text.split(', '));
      }
      else {
        console.log(keywordRes.error);
      }
    }

  }

  useEffect(() => { console.log(keywords); setIsKeywordChanged(true)}, [keywords]);

  async function queryEmotion(data: string) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
      {
        headers: { Authorization: `Bearer ${HG_API_KEY}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;

  }

  const getEmotion = async (input: string) => {

    const huggingfaceResponse = await queryEmotion(input);
    if (!huggingfaceResponse.error) {
      console.log(huggingfaceResponse);
      setEmoRec(huggingfaceResponse[0]);
      const emo = huggingfaceResponse[0][0].label;
      if (input !== 'load_modelE') setEmotion(emo);
    }
    else {
      console.log(huggingfaceResponse.error);
      messageApi.open({
        type: 'error',
        content: 'Something went wrong',
      });
    }
  }

  const translate = (input: string) => {

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

    setIsKeywordChanged(false);

    if (userInput) {
      if (isThChecked) {
        translate(userInput);
      }
      else if (!isThChecked) {
        getEmotion(userInput);
        getKeywords(userInput);
      }
    }
  }

  useEffect(() => { getEmotion(translatedText); getKeywords(translatedText); }, [translatedText]);
  useEffect(() => { setBgColor(emotionColorMap[emotion]); }, [emotion]);


  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    
    i18n.changeLanguage("en");
    getEmotion("load_modelE");
    getKeywords("load_modelK");

    setTimeout(() => {
      setShowIntro(false);
    }, 15000)

  }, [])

  const HandleOnChange = () => {
    setIsThChecked(!isThChecked);
    if (isThChecked) i18n.changeLanguage("en");
    else i18n.changeLanguage("th");
  }

  const YtSearch = async () => {
    const keyword = keywords[0] + "," + (keywords[1] ? keywords[1] + "," : "") + (keywords[2] ? keywords[2] + "," : "") + (keywords[3] ? keywords[3] + "," : "") + (keywords[4] ? keywords[4] + "," : "") + (keywords[5] ? keywords[5] + "," : "") + "podcast";
    console.log(keyword); 

    const aipURL = `https://youtube.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&part=snippet&q=${keyword}&maxResults=5&type=video`;

    fetch(aipURL, {headers: { Accept: "application/json"}}).then((res) => res.json()).then((resJ) => {
      console.log(resJ);
      console.log(resJ.items);
      setYtVDOs(resJ.items);
      
    })
  }

  const getYtById = async (id:string[]) => {
    const aipURL = `https://youtube.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&part=snippet&id=${id}`;
    fetch(aipURL, {headers: { Accept: "application/json"}}).then((res) => res.json()).then((resJ) => {
      console.log(resJ);
      console.log(resJ.items);
      setYtVDOs2(resJ.items);
    })
  }

  return (
    <div className="App" style={{ backgroundColor: '#292929' }}>
      {showIntro && <div className=' absolute top-1/3 left-1/2 transform -translate-x-1/2  w-[500px] flex justify-center'>
        <span className=' absolute text-8xl text-[#ebebeb] animate-flip-down animate-once animate-reverse animate-delay-[2000ms]'>{t("introText1")}</span>
        <span className=' absolute text-8xl text-[#ebebeb] animate-flip-up animate-once animate-delay-[3500ms]'>{t("introText2")}</span>
      </div>}
      <div style={{ backgroundImage: `linear-gradient(to right top, ${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, ${bgColor[3]}, ${bgColor[4]}` }} className=' animate-fade animate-duration-[3000ms] animate-delay-[7000ms] gap-28  flex justify-center items-center h-screen flex-col'>
        {contextHolder}
        <div className='absolute top-10 right-14 '>
          <label className='themeSwitcherThree relative inline-flex cursor-pointer select-none items-center'>
            <input
              type='checkbox'
              checked={isThChecked}
              onChange={HandleOnChange}
              value={!isThChecked ? "en" : "th"}
              className='sr-only'
            />
            <div className='shadow-card flex h-[46px] w-[82px] items-center justify-center rounded-md bg-black bg-opacity-20'>
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

        {emoRec&&<div className=' text-center'>
          <h1 className=' font-serif text-6xl'>{emoRec[0].label} </h1>
          <h1 className= 'font-serif text-4xl'>{emoRec[1].label}</h1>
          <h1 className=' font-serif text-3xl'>{emoRec[2].label}</h1>
          <h1 className=' font-serif text-2xl'>{emoRec[3].label}</h1>
          <h1 className=' font-serif text-1xl'>{emoRec[4].label}</h1>
        </div>}
        <div className='bg-black p-10 rounded-lg bg-opacity-20'>
          <div className="relative h-full w-full min-w-[200px] ">
            <form onSubmit={HandleOnSubmit}>
              <div className='flex gap-2'>
                <div className="relative flex max-w-[24rem]">
                  <div className="relative h-full min-w-[200px]">
                    <input
                      id='TypeSomething'
                      className=" border-transparent peer rounded-[7px] border border-blue-gray-500 border-t-transparent bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      placeholder=" " />
                    <label
                      className=" before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-800 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                      {t("InoutPH")}
                    </label>
                  </div>

                </div>
                <button
                  className="h-[40px] right-1 top-1 select-none rounded bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-gray-500/20 transition-all hover:shadow-lg hover:shadow-blue-gray-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="submit">
                  {t("submitBtn")}
                </button>
              </div>
            </form>
            <label
              className=" bg-transparent before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5  hidden h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
          </div>
        </div>
        <div>
        <Button onClick={YtSearch}>Reccomment by keywords</Button>
        <Button onClick={() => getYtById((Vdos as any)[emotion])}>Reccomment by my constant</Button>
        
        </div>

      <div className='absolute left-10 bottom-10 h-[600px] overflow-y-scroll ' style={{ scrollbarWidth: 'none',}}>
        {ytVDOs?.map((vdo) => (
          <div className=' text-white flex flex-col items-center justify-center h-[250px] w-[300px] bg-black bg-opacity-50 gap-2 m-5 rounded-md shadow-xl'>
          <img src={vdo.snippet.thumbnails.medium.url} width={"250px"} className=' rounded-md'/>
          <h1 className=' text-center m-2'>{vdo.snippet.title}</h1>
        </div>
        ))}
      </div>

      <div className='absolute right-10 bottom-10 h-[600px] overflow-y-scroll' style={{ scrollbarWidth: 'none',}}>
        {ytVDOs2?.map((vdo) => (
          <div className=' text-white flex flex-col items-center justify-center h-[250px] w-[300px] bg-black bg-opacity-50 gap-2 m-5 rounded-md shadow-xl'>
          <img src={vdo.snippet.thumbnails.medium.url} width={"250px"} className=' rounded-md'/>
          <h1 className=' text-center m-2'>{vdo.snippet.title}</h1>
        </div>
        ))}
      </div>
      </div>
      

    </div>
  );
}

export default App;