import {useEffect, useState} from "react"
import people from "../d3/people"
import "../style/d3.css"

export default ({ data }) => {
    const id = 'people-prices'

    useEffect(() => {
        people(data)
    }, [])

    return <div id={id}/>
}
