import React, { useState,useEffect} from 'react'
import Contestant from './Contestant'
import './ElectivePosition.css'

const ElectivePosition = ({userId,totalVotes,contestants,position,categoryArr})=>{

    const[totCatVotes,setTotCatVotes] = useState(totalVotes)
    const[buttonisDisabled,setButtonisDisabled] = useState(false)
    const[contestantId,setContestantId] = useState('')
    const[votePercentColor,setVotePercentColor] = useState({})
    const[theContestants,setTheContestants] = useState(contestants)
    
    const colorizeVotePercent = (contestants)=>{
        const sortedContestants = contestants.slice().sort((c1,c2)=>c1.votes.length - c2.votes.length)
        const obj = {}
        const smallest = sortedContestants[0]
        const biggest = sortedContestants[contestants.length-1]

        if(sortedContestants.length>1){
            if(smallest.votes.length === 0 && biggest.votes.length === 0){
                obj[smallest.contestant_id] = 'yellow' 
                obj[biggest.contestant_id] = 'yellow'
            }
            else if(sortedContestants.length === 2){
                 if(smallest.votes.length === 0 && biggest.votes.length !== 0){
                    obj[smallest.contestant_id] = 'red'
                    obj[biggest.contestant_id] = 'rgb(0, 255, 0)'
                }
                else if(smallest.votes.length ===  biggest.votes.length){
                    obj[smallest.contestant_id] = 'rgb(0, 255, 0)'
                    obj[biggest.contestant_id] = 'rgb(0, 255, 0)'
                }
                else{
                    obj[smallest.contestant_id] = 'red'
                    obj[biggest.contestant_id] = 'rgb(0, 255, 0)'
                }
            }

            else{
                obj[smallest.contestant_id] = 'red'
                obj[biggest.contestant_id] = 'rgb(0, 255, 0)'
            }
        }
        else{
            obj[smallest.contestant_id] = 'yellow'
        }
        if(sortedContestants.length>2){
            if(smallest.votes.length ===  biggest.votes.length){
                obj[smallest.contestant_id] = 'rgb(0, 255, 0)'
                obj[biggest.contestant_id] = 'rgb(0, 255, 0)'
            }
            const[last] = sortedContestants.slice().splice(0,1)
            const[first] = sortedContestants.slice().splice(sortedContestants.length-1,1)
                sortedContestants.forEach((contestantObj)=>{
                     if(contestantObj.votes.length === last.votes.length){
                         if(obj[smallest.contestant_id] === 'rgb(0, 255, 0)'){
                            obj[contestantObj.contestant_id] = 'rgb(0, 255, 0)'
                         }
                         else{
                             obj[contestantObj.contestant_id] = 'red'
                         }
                        
                    }
                    else if(contestantObj.votes.length === first.votes.length){
                        obj[contestantObj.contestant_id] = 'rgb(0, 255, 0)'
                    }
                    else{
                        obj[contestantObj.contestant_id] = 'yellow'
                    }
                
        })
        
        }
        if(sortedContestants.length === 1){
            console.log(sortedContestants.length)
            obj[smallest.contestant_id] = 'rgb(0, 255, 0)'
            obj[biggest.contestant_id] = 'rgb(0, 255, 0)'
        }
        setVotePercentColor(obj)
    }

    useEffect(()=>{
        colorizeVotePercent(theContestants)
        //eslint-disable-next-line
    },[])

    useEffect(()=>{
        if(categoryArr.includes(userId)){
            setButtonisDisabled(true)
        }
        
    },[userId,setButtonisDisabled,categoryArr])

    const updateContestantVotes = (votes,contestant_id)=>{
       const updatedContestants = theContestants.map((c)=>{    
                if(c.contestant_id === contestant_id){
                        c.votes = votes
                        return c
                    }
                    return c
        })
        setTheContestants(updatedContestants)
        colorizeVotePercent(theContestants)
    }

    const updateCategoryVotes = (votes)=>{
        setTotCatVotes(votes)
    }

    const disableButtons = (contestant_id)=>{
        setButtonisDisabled(true)
        setContestantId(contestant_id)
    }

    return(
        <div className = "electionDetails">
            <div className = "electionIntro">
                <div className = "electionHead">
                    <h2>Position: <span>{position}</span></h2>
                </div>
                <div className = "electionHead">
                   <h3>Number Of Contestants: <span className = "numOfContestants">{theContestants.length}</span></h3> 
                </div>
                <div className = "electionHead">
                    <h3>Total Votes Cast: <span>{totCatVotes}</span></h3>
                </div>
                                
            </div>

            <div className = "listOfContestants">
            {theContestants.map(({contestant_id,surname,firstname,manifesto,picture,votes})=>{return(
            <Contestant 
              userId = {userId}  
              contestantId = {contestant_id}
              name = {`${surname} ${firstname}`}
              manifesto = {manifesto}
              picture = {picture} 
              votes = {votes.length} 
              totalVotes = {totCatVotes} 
              setCategoryVotes = {updateCategoryVotes} 
              position = {position} 
              disableButton = {disableButtons}
              isButtonDisabled = {buttonisDisabled}
              votedForThisContestant = {contestantId === contestant_id || votes.includes(userId)}
              votePercentColor = {votePercentColor}
              addToContestantVotes = {updateContestantVotes} 
              key = {contestant_id} />
            )})}
            </div>
        </div>
    )
}
export default ElectivePosition