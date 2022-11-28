import * as React from 'react';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Button from './components/Button';
import {Col, Row, Input, Affix, Carousel} from 'antd';

// ==== COMPONENTS ====
import Cards from './components/Cards';
import Navigation from './components/Partials/Navigation';
import SliderComponent from './components/SliderComponent';
import Footer from './components/Partials/Footer';
// ==== OTHER ====
import LoadEventCollections from './services/collections/LoadEventCollections';
import LoadPropertyCollection from './services/collections/LoadPropertyCollections'
import Paginate from './components/Pagination';
import Category from './components/Category';


export default function App() {
  const [initialData, setInitialData] = useState([]);
  const [sliderImages, setSliderImages] = useState([])
  const [current, setCurrent] = useState(1);
  const [top, setTop] = useState(2);
  const {Search} = Input;
  useEffect(() => {

    async function loadData() {
      setInitialData(await LoadEventCollections.getAllEvents());
      setSliderImages(await LoadPropertyCollection.getSliderImages());

      await LoadEventCollections.getEventsByCategory("KZFzniwnSyZfZ7v7na")

      // initialData.result?.data._embedded.events.map(async (elm) => {
      //   await LoadEventCollections.getEventsByCategory(elm.classifications[0].segment.id)
      // })

    }

    loadData()
  }, [])

  const nextPage = async (value) => {
    setInitialData(await LoadEventCollections.getNextEventPage(value));
    setCurrent(value)
  }

  const onSearch = async (value) => {
    if (value.length > 4) {
      alert("Postnummer skal være mindre end 4")
    } else if (value.match(/^[0-9]+$/) == null) {
      alert("Skal indeholde tal")
    } else {
      setInitialData(await LoadEventCollections.searchEvent(value));
    }
  }

  return (
    <Col>
      <Affix>
        <Navigation />
      </Affix>
      <Col type="flex" align="middle" style={{marginTop: "2%", marginBottom: "2%"}}>
        <h1>Event Planner</h1>
      </Col>
      {/* === SLIDER CAROUSEL === */}
      <SliderComponent dataResult={sliderImages} />

      <Row justify="center">
        <Col span={16} style={{marginTop: "5%"}}>
          {/* === SEARCH === */}
          <Search placeholder="input search text" onSearch={onSearch} enterButton />
          {/* === CARDS === */}
          {/* {initialData.data?._embedded.events.map((elm, index) => (
            <Category data={elm.classifications[0].segment.id} />
            // <Cards data={elm} key={index} debug={false} />
            ))
            } */}
          <Category category />
          <Row>
            {initialData.data?._embedded.events.map((elm, index) => (
              <Cards data={elm} key={index} debug={false} />
            ))
            }
          </Row>
          <Paginate current={current} total={initialData.data?.page.totalPages} onChange={onChange => nextPage(onChange)} />
        </Col>
      </Row>
      <Footer />
    </Col>
  );
}
