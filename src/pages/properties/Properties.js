import React, { useState, useEffect } from "react";
import "./properties.css";
//Carousel
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
//componets
import Card from "../../components/card/Card";
//api
import { fetchProperties } from "../../apiServices";

const Properties = () => {
  const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  //fetching Data
  useEffect(() => {
    setLoading(true);
    fetchProperties(page)
      .then((response) => {
        setTotalCount(response.count);
        setData((prevData) => [...prevData, ...response.results]);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  }, [page]);
//handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const totalPages = Math.ceil(totalCount / 10);
      if (scrollY + windowHeight >= documentHeight && page < totalPages) {
        setPage((page) => page + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalCount, page]);
  //convert guntas to acres and guntas
  function convertGuntasToAcresAndGuntas(guntas) {
    const acres = Math.floor(guntas / 40);

    const remainingGuntas = guntas % 40;
    const result =
      acres && remainingGuntas > 0
        ? `${acres} Acres  ${remainingGuntas} Guntas`
        : acres > 0
        ? `${acres} Acres`
        : `${remainingGuntas} Guntas`;
    return result;
  }
  return (
    <div className="container">
      <div className="properties-container">
        {data.length > 0 &&
          data.map((val) => (
            <Card key={val.id}>
              <CarouselComponent data={val.land_media} />
              <div className="content">
                <h3>
                  {val.village_name},{val.mandal_name}
                </h3>
                <h3>{val.district_name}(dt)</h3>
                <div className="card-footer">
                  {val.total_land_size && (
                    <p className="textStyles">
                      {convertGuntasToAcresAndGuntas(val.total_land_size)}
                    </p>
                  )}
                  <p className="textStyles">
                    .
                  </p>
                  {val.price_per_acre_crore && (
                    <Cost
                      data={val.price_per_acre_crore}
                      acre={
                        val.total_land_size_in_acres &&
                        val.total_land_size_in_acres.acres !== 0
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
      </div>

      {loading && (
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Properties;

const CarouselComponent = ({ data }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const carouselItems = data?.map((val) => {
    return {
      id: val.id,
      content: val.image,
    };
  });
  return (
    <Carousel responsive={responsive} infinite={true}>
      {carouselItems.length ? (
        carouselItems.map((item) => (
          <div key={item.id} className="carousel-item">
            {/* Load image */}
            <img
              src={item.content}
              alt={`${item.id}`}
              className="carousel-image"
            />
          </div>
        ))
      ) : (
        <div className="carousel-image"></div>
      )}
    </Carousel>
  );
};

const Cost = ({ data, acre }) => {
  const rupeeSymbol = "\u20B9";
  return (
    <p>
      {data.crore && data.lakh
        ? `${rupeeSymbol} ${parseInt(data.crore)}.${parseFloat(data.lakh)} ${
            acre ? "crores per acre" : "crores for full property"
          }`
        : data.crore
        ? `${rupeeSymbol} ${parseInt(data.crore)} ${
            acre ? "crores per acre" : "crores for full property"
          }`
        : `${rupeeSymbol} ${parseFloat(data.lakh)} ${
            acre ? "lakh per acre" : "lakh for full property"
          }`}
    </p>
  );
};
