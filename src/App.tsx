import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Fuse from 'fuse.js';
import dummyData from './untils/dummyData.json'


interface MedicationProps {
  amountUnit:string,
  amountValue: number | undefined
  pzn: string | undefined
  name: string | undefined
  strengthUnit: string | null
  strengthValue: number | null
}

interface SearchResults {
  item?:MedicationProps,
  refIndex?:number,
  score?:number
}


const doctorlyLogo = 'https://assets.website-files.com/6166cdb1ddf5d92cb385f8e7/616d41271fa20926f3e03a88_Doctorly_logo_UPDATE2.svg';
function App() {
  const [searchValue, setSearchValue] = useState<string>("")
  const [medication, setMedication] = useState<MedicationProps | undefined>()
  const [activeResult, setActiveResult] = useState<string | undefined>()
  const [searchResults, setSearchResults] = useState <Array<SearchResults>| []>([]);
  const [focusedPost, setFocusedPost] = useState<number>(-1)
  const fuse = new Fuse(dummyData, {
    keys: [
      "amountUnit",
      "amountValue",
      "pzn",
      "name",
      "strengthUnit",
      "strengthValue"
    ],
    includeScore: true,
    includeMatches:true,
    findAllMatches:true
  });

  const onFilter = (value:string) => {
    setSearchValue(value);
    const results = fuse.search(value);
    setSearchResults(results)
  }

  const onClear = () => {
    setSearchValue("");
    setActiveResult("")
    setSearchResults([]);
    setFocusedPost(-1);
  }

  const onFocus = () => {
      if(!searchValue){
        return onFilter(" ");
      }
  } 

  const keyPress = useCallback((event: { key: string; keyCode: number; }) => {
    if(event?.key === 'Enter' || event?.key === 'Escape' || event?.keyCode === 38 || event?.keyCode === 40){
      document.getElementById('res-item')?.focus();
      document.getElementById('search-input')?.blur();
     
      if(event?.key === 'Enter' && focusedPost >= 0){
        setMedication(searchResults[focusedPost]?.item)
        onClear()
      }else if (event?.key === 'Escape') {
        onClear()
      } else if (event?.keyCode === 38) {
        console.log("38")
        setFocusedPost((prev) => (prev === -1 ? 0 : prev!! <= 0 ? 0 : prev! - 1))
      } else if (event?.keyCode === 40) {
        setFocusedPost((prev) => prev === -1 ? prev+1 :
          prev >= searchResults!.length - 1 ? searchResults!.length - 1 : prev + 1
        )
      }
    }
  }, [focusedPost, searchResults])

  useEffect(() => {
    document.addEventListener('keydown', keyPress, false)

    return () => {
      document.removeEventListener('keydown', keyPress, false)
    }
  }, [keyPress])

  useEffect(() => {
    if(focusedPost >=0){
      setActiveResult(searchResults[focusedPost!]?.item?.name)
    }
  },[focusedPost, searchResults])

  return (
    <div className="main-container">
      <div className="inner-container">
          <img alt="logo" src={doctorlyLogo} className="logo"/>
          <div>  
            
            <div style={{position:'relative', zIndex:1}}>
          
              <input 
                type="text" 
                className='search-input' 
                id='search-input' 
                onChange={(e) => onFilter(e.target.value)}
                value={activeResult ? activeResult : searchValue}
                placeholder="Search Medications"
                onFocus={onFocus}
              />
              <div className="clear-search-icon" onClick={onClear}/>
            </div>
            <div className='search-res-container'>
                {!!searchResults?.length && (
                  searchResults.map((med:SearchResults ,index) => (
                    <div
                      key={index}
                      id="res-item"
                      className={`search-res-item ${focusedPost === index ? "active" : ""}`}
                      onMouseEnter={() => setActiveResult(med?.item?.name)}
                      onMouseLeave={() =>  setActiveResult("")}
                      onClick={() => {
                        setMedication(med?.item);
                        onClear()
                      }}
                    >
                      <p id={`item-${index}`}>{med!.item!.name}</p>
                    </div>
                  ))
                )}
               
            </div>
            {(searchValue) && 
            <div className="search-res-counter text-center">
                <p>{`About ${searchResults?.length} results`} </p>
            </div>}
            <div style={{marginTop:20,padding:"20px 20px 0px", backgroundColor:'#fff', maxWidth:300, borderRadius:5}}>
                <h5 style={{margin:0}}>{medication?.pzn}</h5>
                <p style={{marginTop:10}}>{medication?.name}</p>
                <div style={{marginTop:30,display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:12}}>
                    <div>
                      <p style={{margin:0, fontWeight:600}}>Amount Unit</p>
                      <p style={{margin:"0px 0px 20px", fontSize:14, fontWeight:600}}>{medication?.amountUnit}</p>
                    </div>
                    <div>
                      <p style={{margin:0, fontWeight:600}}>Amount Value</p>
                      <p style={{margin:"0px 0px 20px", fontSize:14, fontWeight:600}}>{medication?.amountValue}</p>
                    </div>
                </div>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:12}}>
                    <div>
                      <p style={{margin:0, fontWeight:600}}>Strength Unit</p>
                      <p style={{margin:"0px 0px 20px", fontSize:14, fontWeight:600}}>{medication?.strengthUnit}</p>
                    </div>
                    <div>
                      <p style={{margin:0, fontWeight:600}}>Strength Value</p>
                      <p style={{margin:"0px 0px 20px", fontSize:14, fontWeight:600}}>{medication?.strengthValue}</p>
                    </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;
