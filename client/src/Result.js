import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Result.css'
 
function Result() {
    const [result, setResult] = useState([])
    const [index, setIndex] = useState(0)
    const [openModal,setOpenModal] = useState(false)
    const navigate = useNavigate()
    const message = 'Election Result And Timer Will Be Deleted. You Can Start A New Election After This. Admin Access Is Also Needed. Are You Sure You Want To Proceed?'

    let highestVote = 0

    useEffect(() => {  
        const resultStatus = async () => {
            const res = await axios.get('/election/details',{headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'X-Auth-Token':localStorage.getItem('token')
              }})
            setResult(res.data.electObj)
        }
        resultStatus()
    }, [])

    const handleElectionEnd = ()=>{
        setOpenModal(true)
    }

    const positiveHandler = ()=>{
        navigate('/reset-election')
    }

    const negativeHandler = ()=>{
        setOpenModal(false)
    }

    if (result.length) {
        let sortedResults
        if (result[index].contestants.length > 1) {
            sortedResults = result[index].contestants.sort(
                (a, b) => b.votes.length - a.votes.length
            )
        } else {
            sortedResults = result[index].contestants
        }

        return (
            <div>
                {openModal && <Modal message = {message} positiveBtnTxt = 'Yes'  negativeBtnTxt = 'No' positiveHandler = {positiveHandler} negativeHandler = {negativeHandler} />}
                <h2 className="resHeader">Election Results</h2>
                <div className='endElection'><button onClick={handleElectionEnd}>End This Election</button></div>
                <div className="resWrap">
                    {result.map((res, i) => {
                        return (
                            <span
                                className="result"
                                key={i}
                                onClick={() => {
                                    setIndex(i)
                                }}
                                style={{
                                    backgroundColor: i === index ? 'red' : '',
                                }}
                            >
                                {res.position}
                            </span>
                        )
                    })}
                </div>
                <div>
                    <div className="allResultsWrap">
                        {sortedResults.map(
                            ({ picture, surname, firstname, votes }, i) => {
                                let isTie = false
                                if (i === 0) {
                                    highestVote = votes.length
                                    if (sortedResults.length > 1) {
                                        if (
                                            sortedResults[i].votes.length ===
                                            sortedResults[1].votes.length
                                        ) {
                                            isTie = true
                                        }
                                    }
                                } else if (votes.length === highestVote) {
                                    isTie = true
                                }
                                return (
                                    <div
                                        className="contestant resultContainer"
                                        key={i}
                                    >
                                        <div className="contestant_picture">
                                            <img 
                                                className = "resImg"
                                                src={picture}
                                                alt="contestant"
                                            />
                                        </div>
                                        <div className="resDetails">
                                            <div className="aboutVotes">
                                                Name:
                                                <span className="name">{`${surname} ${firstname}`}</span>
                                            </div>
                                            <div className="aboutVotes">
                                                Votes:
                                                <span className="votes">
                                                    {votes.length}
                                                </span>
                                                <span className="winner">
                                                    {i === 0 ? (
                                                        isTie === false ? (
                                                            (votes.length > 0) &&<i className="far fa-check-circle fa-lg"></i>
                                                        ) : (
                                                            <span className="resTie">
                                                                Tie
                                                            </span>
                                                        )
                                                    ) : isTie ? (
                                                        <span className="resTie">
                                                            Tie
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default Result
