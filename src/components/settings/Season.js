import { Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSnowflake, faSun } from '@fortawesome/free-regular-svg-icons';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faCanadianMapleLeaf } from '@fortawesome/free-brands-svg-icons';
import { CustomToggle } from "../CustomToggle";
import _drawChart from "../../d3/seasonprice";
import { getAveragePrices, getAveragePricePerDay } from "../../azure";

export default ({ eventKey, data, setData }) => {
    const drawChart = async _ => {
        const pricePerDay = await getAveragePricePerDay(data.map(c => c["id"]))
        //console.log("input season chart: ", pricePerDay)
        _drawChart(pricePerDay)
    }

    const updateAvgPrices = async newVal => {
        var range = []

        if (newVal === 0) range = [["2023-01-01", "2023-03-19"], ["2023-12-22", "2023-12-31"]]
        if (newVal === 1) range = [["2023-03-20", "2023-06-20"]]
        if (newVal === 2) range = [["2023-06-21", "2023-09-21"]]
        if (newVal === 3) range = [["2023-09-21", "2023-31-21"]]


        const results = await getAveragePrices(
            data.map(v => v.id),
            range
        )

        //console.log("before setting season:", results)

        const copy = Object.entries(data).map(([k, v]) => {
            var match = results.find(e => e["listing_id"] === v["id"])

            var listing_copy = { ...v }
            listing_copy["avg_price"] = match["avg_price"]
            listing_copy["season"] = labels.find(e => e.value === newVal)["label"]

            return (k, listing_copy)
        })


        setData([...copy])
    }

    useEffect(() => drawChart(0), [])

    return (
        <Card>
            <Card.Header>
                <Row style={{ "width": "100%", marginLeft: "10px", paddingRight: "10px" }}>
                    <Col className='p-0' xs={12}>
                        <Row>
                            <Col className='pr-0' xs={4}>
                                <FontAwesomeIcon size='2x' icon={faSnowflake} color='#57A5DD' />
                            </Col>
                            <Col className='p-0' xs={4}>
                                <FontAwesomeIcon size='2x' icon={faLeaf} color='#9EC044' />
                            </Col>
                            <Col className='p-0' xs={4}>
                                <Row>
                                    <Col className='p-0' style={{ marginLeft: "-10px" }}>
                                        <FontAwesomeIcon size='2x' icon={faSun} color='#F7DB4E' />
                                    </Col>
                                    <Col className='pl-0 text-end' style={{ marginRight: '10px' }}>
                                        <FontAwesomeIcon size='2x' icon={faCanadianMapleLeaf} color="#D85B32" />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <Slider
                            onChange={(_, newVal) => updateAvgPrices(newVal)}
                            style={{ color: '#4E5154' }}
                            track={false}
                            aria-label="Seasons"
                            defaultValue={0}
                            getAriaValueText={v => `${v}`}
                            valueLabelDisplay="off"
                            //step={10} //  (waarvan middelste 4 de values)
                            marks={labels}
                            min={0}
                            max={3}
                        />
                    </Col>
                </Row>
                <CustomToggle eventKey={eventKey} />
            </Card.Header>
            <Accordion.Collapse eventKey={eventKey}>
                <Card.Body>
                    <div id="season-chart"></div>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

const labels = [
    {
        value: 0,
        label: "Winter"
    },
    {
        value: 1,
        label: "Spring"
    },
    {
        value: 2,
        label: "Summer",
    },
    {
        value: 3,
        label: "Autumn",
    }
]
