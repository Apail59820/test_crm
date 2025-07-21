'use client'

import { Empty } from "antd";
import Image from 'next/image';

const CustomEmpty = () => (
  <Empty
    image={
      <Image
        src={'/empty_image.png'}
        alt="No Data"
        width={90}
        height={90}
        style={{ opacity: 1 }}
      />
    }
    description={'Pas de résultat'}
  />
);

export default CustomEmpty;