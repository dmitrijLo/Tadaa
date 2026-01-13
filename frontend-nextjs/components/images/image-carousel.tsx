"use client";
import { Carousel, CarouselProps } from "antd";
import Image, { StaticImageData } from "next/image";

export interface CarouselItem {
  idx: number;
  src: StaticImageData;
  info: string;
}

interface ImageCarouselProps extends CarouselProps {
  items: CarouselItem[];
}

const slideStyle: React.CSSProperties = {
  background: "#364d79",
  color: "#fff",
  textAlign: "center",
  paddingBottom: "20px",
  borderRadius: "8px",
  overflow: "hidden",
};

const imageWrapperStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "300px",
};
export default function ImageCarousel({
  items,
  ...restProps
}: ImageCarouselProps) {
  return (
    <Carousel {...restProps}>
      {items.map(({ idx, src, info }) => (
        <div key={idx}>
          <div style={slideStyle}>
            <div style={imageWrapperStyle}>
              <Image
                src={src}
                alt=""
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <h3 style={{ margin: "16px 0 0 0", fontSize: "1.2rem" }}>
                {info}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
