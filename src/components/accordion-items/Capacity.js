import Accordion from "react-bootstrap/Accordion";
import { useEffect, useState } from 'react'
import { Slider } from "@mui/material";
import { Card, Col, Row } from "react-bootstrap";
import { CustomToggle } from "../CustomToggle";
import { getAveragePriceByListingIds } from "../../azure";
import people, { updateChart } from "../../d3/capacity"
import "../../style/d3.css"

export default function ({ eventKey, filters, setFilters, staticData, setStaticData, filteredData, setFilteredData }) {
    const min = 1;
    const max = 8;
    const [value, setValue] = useState([min, max]);
    const minDistance = 0;
    const [priceBins, setPriceBins] = useState(null);

    // First, remove every filter that has been previously set by this component
    // Second, add new filters to the global filters object
    // Whenever the data changes -> re-render the chart
    useEffect(() => {
        if (priceBins !== null) {
            people(priceBins, value)
        }
    }, [priceBins])

    // Whenever the range in the slider changes -> update the opacity
    useEffect(() => {
        if (priceBins !== null)
            updateChart(priceBins, value)
    }, [...value])

    useEffect(() => {
        getGroupedData(staticData, setPriceBins)
    }, [])

    const handleChange = (_, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
        }

        filters = filters.filter(f => f.id !== `${eventKey}_1`)
        filters = filters.filter(f => f.id !== `${eventKey}_2`)

        filters.push({
        id: `${eventKey}_1`,
        func: bnb => bnb.accommodates >= newValue[0]
    })
        filters.push({
        id: `${eventKey}_2`,
        func: bnb => {
                return newValue[1] < 8 ? bnb.accommodates <= newValue[1] : bnb;
            }
        // Finally, set the filters for the accordion
    })

        setFilters([...filters])
    };


    return <Card>
        <Card.Header className='py-0 text-center'>
            <Row style={{ "width": "100%", marginLeft: "10px", paddingRight: "10px" }}>
                <Col xs={11} style={{padding:"0px", paddingRight:"30px", margin:"0px"}}>
                    <Slider
                        style={{ color: '#4E5154', width: '100%' }}
                        className='mt-5'
                        getAriaLabel={() => 'Person capacity'}
                        value={value}
                        onChange={handleChange}
                        valueLabelFormat={valuetext}
                        valueLabelDisplay="on"
                        getAriaValueText={valuetext}
                        disableSwap
                        min={min}
                        max={max}
                    />
                </Col>
                <Col xs={1}>
                    <CustomToggle eventKey={eventKey} />
                </Col>
            </Row>
        </Card.Header>
        <Accordion.Collapse eventKey={eventKey}>
            <Card.Body style={{ padding: '0px', overflow: 'hidden'}}>
                <div id={"capacity"} />
            </Card.Body>
        </Accordion.Collapse>
    </Card>
}

function groupByAccomodates(data) {
    return data.reduce((groups, item) => {
        const group = (groups[item.accommodates] || [])
        group.push(item)
        groups[item.accommodates] = group
        return groups;
    }, {});
}

function valuetext(value) {
    if (value === 8)
        return '8+ persons'
    if (value === 1)
        return `${value} person`
    return `${value} persons`
}

function getPriceByCapacity(data, capacity) {
    const candidates = data.filter(item => Number(item.accommodates) === Number(capacity)).map(i => i.id)
    return getAveragePriceByListingIds(candidates);
}

function getGroupedData(data, setPriceBins) {
    const accommodationsGroup = groupByAccomodates(data)
    const promises = Object.keys(accommodationsGroup).map(async k => {
        const result = await getPriceByCapacity(data, k)
        return {
            persons: k,
            value: result[0].$1,
        };
    });
    Promise.all(promises).then(data => setPriceBins(data));
}
