import { acData } from "./ac";
import { booksData } from "./books";
import { computerData } from "./computers";
import { fridgeData } from "./fridge";
import { furnitureData } from "./furniture";
import { kitchenData } from "./kitchen";
import { menData } from "./men";
import { mobileData } from "./mobiles";
import { speakerData } from "./speaker";
import { tvData } from "./tv";
import { womanData } from "./woman";

const allProducts = [
    ...acData,
    ...computerData,
    ...furnitureData,
    ...menData,
    ...speakerData,
    ...booksData,
    ...womanData,
    ...mobileData,
    ...tvData,
    ...fridgeData,
    ...furnitureData,
    ...kitchenData,
  ];
  
  export default allProducts;
  